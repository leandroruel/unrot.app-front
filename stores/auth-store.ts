import { create } from 'zustand';

import { api } from '@/lib/api';
import { getToken, removeToken, setToken } from '@/lib/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const token = await getToken();
      set({
        token,
        isAuthenticated: !!token,
        isLoading: false,
      });
    } catch {
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    await setToken(data.accessToken);
    set({ token: data.accessToken, isAuthenticated: true });
  },

  register: async (registerData) => {
    const { data } = await api.post<AuthResponse>('/auth/register', registerData);
    await setToken(data.accessToken);
    set({ token: data.accessToken, isAuthenticated: true });
  },

  logout: async () => {
    await removeToken();
    set({ token: null, isAuthenticated: false });
  },
}));
