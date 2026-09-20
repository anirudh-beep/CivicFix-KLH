import { apiClient } from './client';
import type {
  WorkerTask,
  UpdateTaskPayload,
  EvidenceUploadPayload,
} from '../types/Repair';
import type { PaginatedResponse } from '../types/Complaint';

export const repairsApi = {
  async getWorkerTasks(): Promise<WorkerTask[]> {
    const res = await apiClient<WorkerTask[] | PaginatedResponse<WorkerTask>>('/api/repairs/worker/tasks/', {
      method: 'GET',
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as PaginatedResponse<WorkerTask>).results)) {
      return (res as PaginatedResponse<WorkerTask>).results;
    }
    return [];
  },

  async getTaskById(taskId: number | string): Promise<WorkerTask> {
    return apiClient<WorkerTask>(`/api/repairs/worker/tasks/${taskId}/`, {
      method: 'GET',
    });
  },

  async updateTask(taskId: number | string, payload: UpdateTaskPayload): Promise<WorkerTask> {
    return apiClient<WorkerTask>(`/api/repairs/worker/tasks/${taskId}/`, {
      method: 'PATCH',
      body: payload,
    });
  },

  async uploadEvidence(
    taskId: number | string,
    payload: EvidenceUploadPayload
  ): Promise<{ success: boolean }> {
    const formData = new FormData();
    formData.append('photo', payload.photo);
    formData.append('latitude', String(payload.latitude));
    formData.append('longitude', String(payload.longitude));
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }

    return apiClient<{ success: boolean }>(`/api/repairs/worker/tasks/${taskId}/evidence/`, {
      method: 'POST',
      body: formData,
    });
  },
};
