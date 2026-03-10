
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const NavItem: React.FC<{ to: string; label: string; active: boolean; danger?: boolean }> = ({ to, label, active, danger }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : danger 
          ? 'text-rose-400 hover:bg-rose-500/10' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className="font-bold text-[10px] uppercase tracking-widest">{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { to: '/app/dashboard', label: 'Dashboard', roles: [UserRole.SOC, UserRole.SYS, UserRole.DFIR, UserRole.INT] },
    { to: '/app/threats', label: 'Threat Review', roles: [UserRole.SOC, UserRole.INT, UserRole.SYS] },
    { to: '/app/incidents', label: 'Incident Desk', roles: [UserRole.SOC, UserRole.DFIR, UserRole.SYS] },
    { to: '/app/logs', label: 'Network Telemetry', roles: [UserRole.SOC, UserRole.SYS] },
    { to: '/app/forensics', label: 'Forensic Lab', roles: [UserRole.DFIR, UserRole.SYS] },
    { to: '/app/intelligence', label: 'Threat Intel', roles: [UserRole.INT, UserRole.SYS] },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col p-6 bg-slate-950/80 backdrop-blur-xl shrink-0">
      <Link to="/" className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CB</div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-tight text-white leading-none">Cloud-Basin</h1>
          <span className="text-[7px] text-slate-500 font-bold tracking-[0.2em] uppercase">Enterprise Intel</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-4 mb-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">Navigation</p>
        {menuItems.filter(item => user && item.roles.includes(user.role)).map(item => (
          <NavItem key={item.to} to={item.to} label={item.label} active={location.pathname === item.to} />
        ))}
        
        {user?.role === UserRole.SYS && (
          <div className="mt-10">
            <p className="px-4 mb-4 text-[9px] font-bold text-amber-600 uppercase tracking-widest">Administration</p>
            <NavItem to="/app/users" label="Identity Management" active={location.pathname === '/app/users'} />
            <NavItem to="/app/settings" label="Security Policy" active={location.pathname === '/app/settings'} />
          </div>
        )}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] uppercase font-bold text-indigo-300">
            {user?.username.slice(0, 2)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate text-white uppercase tracking-tight">{user?.username}</span>
            <span className="text-[8px] uppercase text-indigo-500 font-bold tracking-widest mt-0.5">Verified Analyst</span>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-[10px] uppercase tracking-widest border border-rose-500/20">
          Terminate Link
        </button>
      </div>
    </aside>
  );
};
