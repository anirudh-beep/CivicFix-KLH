import { apiClient } from './client';
import type { CivicNotification } from '../types/Notification';

export const notificationsApi = {
  async list(): Promise<CivicNotification[]> {
    try {
      const res = await apiClient<CivicNotification[] | { results: CivicNotification[] }>(
        '/api/notifications/',
        { method: 'GET' }
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { results: CivicNotification[] }).results)) {
        return (res as { results: CivicNotification[] }).results;
      }
      return [];
    } catch {
      return [];
    }
  },

  async markAsRead(id: number | string): Promise<void> {
    try {
      await apiClient<void>(`/api/notifications/${id}/read/`, {
        method: 'PATCH',
      });
    } catch {
      // ignore
    }
  },
};
