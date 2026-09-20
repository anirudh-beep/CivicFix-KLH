import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/User';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ROLE_HOME_MAP: Record<UserRole, string> = {
  citizen: '/citizen/dashboard',
  repairman: '/repairman/dashboard',
  hod: '/hod/dashboard',
  district_admin: '/district/dashboard',
};

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Validating permissions..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to user's assigned dashboard
    const destination = ROLE_HOME_MAP[user.role] || '/login';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
