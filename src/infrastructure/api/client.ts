import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse } from '@core/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export function getSocketBaseUrl(): string {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (API_BASE_URL.startsWith('http')) {
    return API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  }

  return 'http://localhost:3001';
}

const TOKEN_COOKIE = 'sport_token';
const REFRESH_TOKEN_COOKIE = 'sport_refresh';

const PUBLIC_AUTH_PATHS = [
  '/auth/pub/login',
  '/auth/pub/register',
  '/auth/pub/refresh-token',
  '/auth/pub/forgot-password',
  '/auth/pub/reset-password',
];

interface RefreshTokenResponse {
  token: string;
}

function unwrapResponseData<T>(data: unknown): T {
  if (
    data &&
    typeof data === 'object' &&
    'success' in data &&
    'data' in data &&
    (data as ApiResponse<T>).data !== undefined
  ) {
    return (data as ApiResponse<T>).data as T;
  }
  return data as T;
}

function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? match[1] : null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  const isProduction = window.location.protocol === 'https:';
  const secureFlag = isProduction ? '; Secure' : '';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

function getStoredToken(): string | null {
  return getCookie(TOKEN_COOKIE);
}

function getStoredRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

function setStoredTokens(token: string, refreshToken: string): void {
  setCookie(TOKEN_COOKIE, token, 900);
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, 2592000);
}

function clearStoredTokens(): void {
  removeCookie(TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function emitSessionCleared(): void {
  window.dispatchEvent(new Event('auth:session-cleared'));
}

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
    this.syncTokenFromCookies();
  }

  syncTokenFromCookies(): void {
    const token = getStoredToken();
    if (token) {
      this.setAccessToken(token);
    } else {
      this.clearAccessToken();
    }
  }

  setAccessToken(token: string): void {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearAccessToken(): void {
    delete this.client.defaults.headers.common.Authorization;
  }

  setTokens(token: string, refreshToken: string): void {
    setStoredTokens(token, refreshToken);
    this.setAccessToken(token);
  }

  clearTokens(): void {
    clearStoredTokens();
    this.clearAccessToken();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (isPublicAuthRequest(config.url)) {
          return config;
        }

        const token = getStoredToken();
        if (token) {
          const headers = AxiosHeaders.from(config.headers ?? {});
          headers.set('Authorization', `Bearer ${token}`);
          config.headers = headers;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => {
        response.data = unwrapResponseData(response.data);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const data = (error.response?.data ?? {}) as Record<string, unknown>;
        if (data && typeof data === 'object') {
          if (data.error && typeof data.error === 'object' && (data.error as Record<string, unknown>).message) {
            (error as any).message = (data.error as Record<string, unknown>).message;
          } else if (data.message && typeof data.message === 'string') {
            (error as any).message = data.message;
          }
        }

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isPublicAuthRequest(originalRequest.url)
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            this.setAccessToken(newToken);
            const headers = AxiosHeaders.from(originalRequest.headers ?? {});
            headers.set('Authorization', `Bearer ${newToken}`);
            originalRequest.headers = headers;
            return this.client.request(originalRequest);
          } catch {
            this.handleSessionExpired();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private handleSessionExpired(): void {
    clearStoredTokens();
    this.clearAccessToken();
    emitSessionCleared();
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
        throw new Error('No refresh token available');
      }

      try {
        const payload = JSON.parse(atob(refreshToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) {
          clearStoredTokens();
          throw new Error('Refresh token expired');
        }
      } catch (e: any) {
        if (e.message.includes('expired')) throw e;
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/pub/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const payload = unwrapResponseData<RefreshTokenResponse>(response.data);
      const newToken = payload?.token;

      if (!newToken) {
        throw new Error('No token in refresh response');
      }

      const newRefreshToken = (response.data as any)?.refreshToken ?? refreshToken;
      setStoredTokens(newToken, newRefreshToken);
      return newToken;
    })();

    try {
      return await this.refreshTokenPromise;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
