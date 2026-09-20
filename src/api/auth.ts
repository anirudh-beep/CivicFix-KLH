import { apiClient } from './client';
import type { CurrentUser, LoginCredentials, RegisterPayload } from '../types/User';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: CurrentUser }> {
    return apiClient<{ user: CurrentUser }>('/api/auth/login/', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(payload: RegisterPayload): Promise<{ user: CurrentUser }> {
    return apiClient<{ user: CurrentUser }>('/api/auth/register/', {
      method: 'POST',
      body: payload,
    });
  },

  async logout(): Promise<void> {
    await apiClient<void>('/api/auth/logout/', {
      method: 'POST',
    });
  },

  async getMe(): Promise<CurrentUser> {
    return apiClient<CurrentUser>('/api/auth/me/', {
      method: 'GET',
    });
  },
};
