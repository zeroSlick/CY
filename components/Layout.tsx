
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const SidebarItem: React.FC<{ to: string; label: string; active: boolean; danger?: boolean }> = ({ to, label, active, danger }) => (
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

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { to: '/app/dashboard', label: 'Dashboard', roles: [UserRole.SOC, UserRole.SYS, UserRole.DFIR, UserRole.INT] },
    { to: '/app/threats', label: 'Threat Detection', roles: [UserRole.SOC, UserRole.INT, UserRole.SYS] },
    { to: '/app/incidents', label: 'Incident Management', roles: [UserRole.SOC, UserRole.DFIR, UserRole.SYS] },
    { to: '/app/forensics', label: 'Digital Forensics', roles: [UserRole.DFIR, UserRole.SYS] },
    { to: '/app/intelligence', label: 'Threat Intelligence', roles: [UserRole.INT, UserRole.SYS] },
  ];

  const adminItems = [
    { to: '/app/users', label: 'Identity Hub' },
    { to: '/app/rbac', label: 'Access Control' },
    { to: '/app/audit-logs', label: 'Audit Logs' },
    { to: '/app/oversight', label: 'System Oversight' },
    { to: '/app/settings', label: 'Security Policy' },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  const roleColors = {
    [UserRole.SOC]: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    [UserRole.DFIR]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [UserRole.SYS]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [UserRole.INT]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <aside className="w-64 border-r border-slate-800 flex flex-col p-6 bg-slate-950/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CS</div>
          <div className="flex flex-col">
            <h1 className="text-md font-bold tracking-tight text-white leading-none">CyberShield</h1>
            <span className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">Enterprise Defense</span>
          </div>
        </Link>

        <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            <p className="px-4 mb-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">Main Operations</p>
            {filteredMenu.map(item => (
              <SidebarItem key={item.to} to={item.to} label={item.label} active={location.pathname === item.to} />
            ))}
          </div>

          {user?.role === UserRole.SYS && (
            <div className="space-y-1">
              <p className="px-4 mb-4 text-[9px] font-bold text-amber-600 uppercase tracking-widest">Administration</p>
              {adminItems.map(item => (
                <SidebarItem key={item.to} to={item.to} label={item.label} active={location.pathname === item.to} />
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs uppercase font-bold text-indigo-300">
              {user?.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate text-white">{user?.username}</span>
              <span className={`text-[8px] uppercase tracking-[0.1em] px-2 py-0.5 rounded border ${user ? roleColors[user.role] : ''} font-bold mt-1 w-fit`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-[10px] uppercase tracking-widest border border-rose-500/20">
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded text-[9px] font-bold tracking-widest">
              CLUSTER NODE: {user?.role.split(' ')[0].toUpperCase()}
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
