/**
 * CivicFix Complaint Types
 * Strictly aligned with Django REST backend /api/complaints/ contract.
 */

export type ComplaintStatus =
  | 'submitted'
  | 'classified'
  | 'pending_assignment'
  | 'assigned'
  | 'in_progress'
  | 'work_completed'
  | 'awaiting_citizen_verification'
  | 'citizen_verified'
  | 'rework_required'
  | 'hod_approved'
  | 'resolved'
  | 'overdue'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ComplaintCategory {
  id: number;
  name: string;
}

export interface ComplaintDepartment {
  id: number;
  name: string;
}

export interface AssignedWorker {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export interface RepairEvidence {
  id?: number;
  photo_url: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  notes?: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category?: ComplaintCategory | null;
  department?: ComplaintDepartment | null;
  status: ComplaintStatus;
  priority: Priority;
  latitude: number;
  longitude: number;
  address: string;
  photo_url?: string | null;
  photos?: { id: number; image: string; uploaded_at: string }[];
  completion_evidence?: RepairEvidence | null;
  repair_evidence_url?: string | null;
  assigned_worker?: AssignedWorker | null;
  verification_notes?: string | null;
  rework_reason?: string | null;
  citizen_verification?: 'pending' | 'verified' | 'rework' | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category_id?: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface VerifyComplaintPayload {
  decision: 'verified' | 'rework';
  comment?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
