import { apiClient } from './client';
import type { Complaint, PaginatedResponse, AssignedWorker } from '../types/Complaint';

export const hodApi = {
  async getComplaints(params?: {
    status?: string;
    page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Complaint>> {
    return apiClient<PaginatedResponse<Complaint>>('/api/repairs/hod/complaints/', {
      method: 'GET',
      params,
    });
  },

  async assignRepairman(
    complaintId: number | string,
    repairmanId: number
  ): Promise<{ status: string; assigned_to?: number }> {
    return apiClient<{ status: string; assigned_to?: number }>(
      `/api/repairs/assign/${complaintId}/`,
      {
        method: 'POST',
        body: { repairman_id: repairmanId },
      }
    );
  },

  async getWorkers(): Promise<AssignedWorker[]> {
    try {
      const res = await apiClient<AssignedWorker[] | { results: AssignedWorker[] }>(
        '/api/repairs/hod/workers/',
        { method: 'GET' }
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { results: AssignedWorker[] }).results)) {
        return (res as { results: AssignedWorker[] }).results;
      }
      return [];
    } catch {
      // Backend may not have implemented worker listing yet (Section 25)
      return [];
    }
  },

  async approveComplaint(complaintId: number | string): Promise<Complaint> {
    return apiClient<Complaint>(`/api/complaints/${complaintId}/approve/`, {
      method: 'POST',
    });
  },
};
