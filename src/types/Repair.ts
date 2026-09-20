/**
 * CivicFix Repair & Worker Task Types
 * Aligned with /api/repairs/worker/tasks/ contract.
 */

export type TaskStatus = 'assigned' | 'in_progress' | 'work_completed';

export interface TaskLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface WorkerTask {
  task_id: number;
  complaint_id: number;
  title: string;
  category: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: TaskLocation;
  sla_deadline?: string | null;
  description?: string;
  photo_url?: string | null;
  assigned_at?: string;
  completion_evidence?: {
    photo: string;
    latitude: number;
    longitude: number;
    timestamp?: string;
  } | null;
}

export interface UpdateTaskPayload {
  status: TaskStatus;
}

export interface EvidenceUploadPayload {
  photo: File;
  latitude: number;
  longitude: number;
  notes?: string;
}
