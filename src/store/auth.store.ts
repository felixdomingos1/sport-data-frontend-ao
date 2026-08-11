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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? match[1] : null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        apiClient.clearTokens();

        try {
          const { user, tokens } = await authService.login({ email, password });

          apiClient.setTokens(tokens.token, tokens.refreshToken);

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
          apiClient.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      loadUser: async () => {
        const token = getCookie('sport_token');
        if (!token || token === 'undefined' || token === 'null') {
          apiClient.clearTokens();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return;
        }

        apiClient.setAccessToken(token);
        set({ isLoading: true });
        try {
          const user = await authService.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          apiClient.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearSession: () => {
        apiClient.clearTokens();
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
    },
  ),
);

if (typeof window !== 'undefined') {
  window.addEventListener('auth:session-cleared', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  });
}
