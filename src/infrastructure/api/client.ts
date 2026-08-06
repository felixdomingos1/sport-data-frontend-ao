import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse } from '@core/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

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

function getStoredToken(): string | null {
  const token = localStorage.getItem('access_token');
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }
  return token;
}

function setAuthHeader(config: InternalAxiosRequestConfig, token: string): void {
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;
}

function emitSessionCleared(): void {
  window.dispatchEvent(new Event('auth:session-cleared'));
}

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;
  private isRedirectingToLogin = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
    this.syncTokenFromStorage();
  }

  syncTokenFromStorage(): void {
    const token = getStoredToken();
    if (token) {
      this.setAccessToken(token);
    } else {
      this.clearAccessToken();
    }
  }

  setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearAccessToken(): void {
    localStorage.removeItem('access_token');
    delete this.client.defaults.headers.common.Authorization;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (isPublicAuthRequest(config.url)) {
          return config;
        }

        const token = getStoredToken();
        if (token) {
          setAuthHeader(config, token);
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        response.data = unwrapResponseData(response.data);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Normaliza a mensagem de erro para acesso consistente: error.message
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
            setAuthHeader(originalRequest, newToken);
            return this.client.request(originalRequest);
          } catch (refreshError) {
            this.handleSessionExpired();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleSessionExpired(): void {
    console.log('[ApiClient] Sessão expirada — a limpar tokens');
    const pathname = window.location.pathname;
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
      return;
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.clearAccessToken();
    emitSessionCleared();

    const isPrivatePage = pathname.startsWith('/dashboard') ||
      pathname.startsWith('/perfil') ||
      pathname.startsWith('/meus-campeonatos') ||
      pathname.startsWith('/inscricoes') ||
      pathname.startsWith('/notificacoes') ||
      pathname.startsWith('/documentos') ||
      pathname.startsWith('/pagamentos') ||
      pathname.startsWith('/minha-assinatura') ||
      pathname.startsWith('/ranking-atleta');

    if (isPrivatePage && !this.isRedirectingToLogin) {
      this.isRedirectingToLogin = true;
      console.log('[ApiClient] Página privada — a redirecionar para /login');
      window.location.href = '/login';
    } else {
      console.log('[ApiClient] Página pública — sessão limpa sem redirect');
    }
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/pub/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const payload = unwrapResponseData<RefreshTokenResponse>(response.data);
      const newToken = payload?.token;

      if (!newToken) {
        throw new Error('No token in refresh response');
      }

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
