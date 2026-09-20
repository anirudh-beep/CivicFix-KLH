import { apiClient } from './client';
import type { DistrictDashboardStats } from '../types/Dashboard';

/**
 * District Dashboard API
 * Note (Section 26): Marked as a future backend dependency.
 * If endpoint returns 404 or fails, caller should show a proper "data unavailable" state.
 */
export const districtApi = {
  async getDashboard(): Promise<DistrictDashboardStats> {
    return apiClient<DistrictDashboardStats>('/api/district/dashboard/', {
      method: 'GET',
    });
  },
};
