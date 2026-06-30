import type { AuthUser, LoginCredentials, RegisterData } from '../../core/entities/auth.entity';
import type { LoginResponse, RefreshTokenResponse } from '../../core/types/api.types';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface LoginPayload {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginPayload>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (!response?.token || !response?.user) {
      throw new Error('Resposta de login inválida');
    }

    return {
      user: response.user,
      tokens: {
        token: response.token,
        refreshToken: response.refreshToken,
      },
    };
  }

  async register(data: RegisterData): Promise<AuthUser> {
    return apiClient.post<AuthUser>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  }

  async logout(): Promise<void> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.ME);
  }
}

export const authService = new AuthService();
