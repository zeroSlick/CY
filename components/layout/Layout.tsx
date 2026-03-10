
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 rounded text-[8px] font-black tracking-widest uppercase">
              Operational Cluster: {user?.role.split(' ')[0]}
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString()} // {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
