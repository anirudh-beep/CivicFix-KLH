import React from 'react';
import type { ComplaintStatus } from '../types/Complaint';
import type { TaskStatus } from '../types/Repair';

interface StatusBadgeProps {
  status: ComplaintStatus | TaskStatus | string;
  size?: 'sm' | 'md';
}

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
}

const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  submitted: {
    label: 'Submitted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  classified: {
    label: 'Classified',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  pending_assignment: {
    label: 'Pending Assignment',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
  },
  work_completed: {
    label: 'Work Completed',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
  },
  awaiting_citizen_verification: {
    label: 'Awaiting Citizen Verification',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  citizen_verified: {
    label: 'Citizen Verified',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  rework_required: {
    label: 'Rework Required',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  hod_approved: {
    label: 'HOD Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, '_');
  const config = STATUS_CONFIG_MAP[normalizedKey] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses} ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
};
