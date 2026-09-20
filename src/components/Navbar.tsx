import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

interface NavbarProps {
  portalTitle: string;
  portalBadge: string;
}

export const Navbar: React.FC<NavbarProps> = ({ portalTitle, portalBadge }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-black text-lg shadow-sm">
            CF
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            CivicFix
          </span>
        </div>
        <span className="hidden sm:inline-block h-4 w-px bg-slate-300 mx-1" />
        <span className="hidden sm:inline-block text-sm font-semibold text-slate-700">
          {portalTitle}
        </span>
        <span className="rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-xs font-semibold text-brand-700 uppercase tracking-wider">
          {portalBadge}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
              {user.department ? user.department.name : user.email}
            </span>
          </div>
        )}

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-red-600 transition"
          title="Sign out of current session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
