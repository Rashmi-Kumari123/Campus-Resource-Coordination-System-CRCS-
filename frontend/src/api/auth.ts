import { apiClient, getApiErrorMessage } from './client';
import type { AuthResponse, LoginRequest, SignupRequest } from '../types';

export const authApi = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', body);
    return data;
  },

  signup: async (body: SignupRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', body);
    return data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
};

export { getApiErrorMessage };
