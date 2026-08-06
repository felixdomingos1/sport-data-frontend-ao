import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../core/entities/auth.entity';
import { apiClient } from '../infrastructure/api/client';
import { authService } from '../infrastructure/services/auth.service';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        apiClient.clearAccessToken();

        try {
          const { user, tokens } = await authService.login({ email, password });

          apiClient.setAccessToken(tokens.token);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch {
          // Silently handle logout error
        } finally {
          apiClient.clearAccessToken();
          localStorage.removeItem('refresh_token');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      loadUser: async () => {
        const token = localStorage.getItem('access_token');
        console.log('[AuthStore] loadUser — token presente:', !!token);
        if (!token || token === 'undefined' || token === 'null') {
          apiClient.clearAccessToken();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          console.log('[AuthStore] Sem token — utilizador não autenticado');
          return;
        }

        apiClient.setAccessToken(token);
        set({ isLoading: true });
        try {
          const user = await authService.getMe();
          console.log('[AuthStore] Token válido — utilizador autenticado:', user.email);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          console.log('[AuthStore] Token inválido/expirado — a limpar sessão');
          apiClient.clearAccessToken();
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearSession: () => {
        apiClient.clearAccessToken();
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isAuthenticated = false;
      },
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('auth:session-cleared', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  });
}
