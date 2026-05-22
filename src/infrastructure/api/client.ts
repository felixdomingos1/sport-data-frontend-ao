import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse } from '@core/types/api.types';

interface RefreshTokenResponse { token: string }
interface RefreshTokenRequest { refreshToken: string }

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
    this.client.interceptors.response.use(
      (response) => {
        if (response.data && (response.data.data !== undefined || response.data.pagination)) {
          return response.data;
        }
        if (response.data && response.data.success !== undefined) {
          return response.data.data;
        }
        return response.data;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshToken();
            localStorage.setItem('access_token', newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const requestData: RefreshTokenRequest = { refreshToken };
      const response = await this.client.post<ApiResponse<RefreshTokenResponse>>(
        '/auth/pub/refresh-token',
        requestData
      );

      const newToken = response.data.data?.token;
      if (!newToken) {
        throw new Error('No token in response');
      }

      this.refreshTokenPromise = null;
      return newToken;
    })();
    return this.refreshTokenPromise;
  }
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T> | T>(url, config);
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return (response.data as ApiResponse<T>).data as T;
    }
    return response.data as T;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T> | T>(url, data, config);
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return (response.data as ApiResponse<T>).data as T;
    }
    return response.data as T;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T> | T>(url, data, config);
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return (response.data as ApiResponse<T>).data as T;
    }
    return response.data as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T> | T>(url, config);
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return (response.data as ApiResponse<T>).data as T;
    }
    return response.data as T;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T> | T>(url, data, config);
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return (response.data as ApiResponse<T>).data as T;
    }
    return response.data as T;
  }
}

export const apiClient = new ApiClient();
