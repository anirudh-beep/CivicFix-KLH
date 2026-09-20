/**
 * CivicFix User & Authentication Types
 * Strictly aligned with Django REST backend /api/auth/me/ contract.
 */

export type UserRole = 'citizen' | 'repairman' | 'hod' | 'district_admin';

export interface District {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: Department | null;
  district?: District | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}
