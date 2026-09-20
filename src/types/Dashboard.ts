/**
 * CivicFix Dashboard & Analytics Types
 * Aligned with Section 26: GET /api/district/dashboard/
 */

export interface DistrictDashboardStats {
  total: number;
  pending: number;
  in_progress: number;
  overdue: number;
  resolved: number;
  resolution_rate_percent?: number;
  department_breakdown?: {
    department_id: number;
    department_name: string;
    total: number;
    resolved: number;
    pending: number;
  }[];
}

export interface HodDashboardStats {
  department_name: string;
  total_complaints: number;
  pending_assignment: number;
  active_repairs: number;
  completed_awaiting_review: number;
  resolved: number;
  active_workers: number;
}
