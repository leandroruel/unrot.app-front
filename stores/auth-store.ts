import { create } from 'zustand';

import { api, setUnauthorizedHandler } from '@/lib/api';
import { getToken, removeToken, setToken } from '@/lib/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

function parseUserId(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Register 401 handler without circular dep (auth-store → api, not api → auth-store)
  setUnauthorizedHandler(() => {
    removeToken();
    set({ token: null, userId: null, isAuthenticated: false });
  });

  return {
    token: null,
    userId: null,
    isLoading: true,
    isAuthenticated: false,

    initialize: async () => {
      try {
        const token = await getToken();
        set({
          token,
          userId: token ? parseUserId(token) : null,
          isAuthenticated: !!token,
          isLoading: false,
        });
      } catch {
        set({ token: null, userId: null, isAuthenticated: false, isLoading: false });
      }
    },

    login: async (credentials) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      await setToken(data.accessToken);
      set({ token: data.accessToken, userId: parseUserId(data.accessToken), isAuthenticated: true });
    },

    register: async (registerData) => {
      const { data } = await api.post<AuthResponse>('/auth/register', registerData);
      await setToken(data.accessToken);
      set({ token: data.accessToken, userId: parseUserId(data.accessToken), isAuthenticated: true });
    },

    logout: async () => {
      await removeToken();
      set({ token: null, userId: null, isAuthenticated: false });
    },
  };
});
