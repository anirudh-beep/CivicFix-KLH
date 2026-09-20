import { apiClient } from './client';
import type {
  Complaint,
  CreateComplaintPayload,
  VerifyComplaintPayload,
  PaginatedResponse,
  Category,
} from '../types/Complaint';

export const complaintsApi = {
  async list(params?: {
    status?: string;
    page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Complaint>> {
    return apiClient<PaginatedResponse<Complaint>>('/api/complaints/', {
      method: 'GET',
      params,
    });
  },

  async getById(id: number | string): Promise<Complaint> {
    return apiClient<Complaint>(`/api/complaints/${id}/`, {
      method: 'GET',
    });
  },

  async create(payload: CreateComplaintPayload): Promise<Complaint> {
    return apiClient<Complaint>('/api/complaints/', {
      method: 'POST',
      body: payload,
    });
  },

  async uploadPhotos(id: number | string, file: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('image', file); // support both naming conventions

    return apiClient<{ photo_url: string }>(`/api/complaints/${id}/photos/`, {
      method: 'POST',
      body: formData,
    });
  },

  async verify(id: number | string, payload: VerifyComplaintPayload): Promise<Complaint> {
    return apiClient<Complaint>(`/api/complaints/${id}/verify/`, {
      method: 'POST',
      body: payload,
    });
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient<Category[] | { results: Category[] }>('/api/categories/', {
        method: 'GET',
      });
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { results: Category[] }).results)) {
        return (res as { results: Category[] }).results;
      }
      return [];
    } catch {
      return [];
    }
  },
};
