
import React, { useState } from 'react';
import { UserRole } from '../types';

const RBACPage: React.FC = () => {
  const permissions = [
    { id: 'p1', label: 'Ingest Threat Data', roles: [UserRole.SOC, UserRole.INT, UserRole.SYS] },
    { id: 'p2', label: 'Close Incidents', roles: [UserRole.SOC, UserRole.SYS] },
    { id: 'p3', label: 'Forensic Lab Access', roles: [UserRole.DFIR, UserRole.SYS] },
    { id: 'p4', label: 'Intel Feed Management', roles: [UserRole.INT, UserRole.SYS] },
    { id: 'p5', label: 'User Lifecycle Management', roles: [UserRole.SYS] },
    { id: 'p6', label: 'System Security Tuning', roles: [UserRole.SYS] },
    { id: 'p7', label: 'Audit Trail Access', roles: [UserRole.SYS] },
  ];

  return (
    <div className="space-y-8 animate-in slide-up duration-500">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Access Control Matrix</h2>
        <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Least-Privilege Enforcement Hub</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
            <span className="text-9xl font-black text-slate-500 uppercase">RBAC</span>
          </div>
          <div className="relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                  <th className="pb-8">Permission Capability</th>
                  {Object.values(UserRole).map(role => (
                    <th key={role} className="pb-8 text-center">{role.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {permissions.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/10 transition-all">
                    <td className="py-6">
                       <span className="text-sm font-black text-white uppercase tracking-tight">{p.label}</span>
                    </td>
                    {Object.values(UserRole).map(role => (
                      <td key={role} className="py-6 text-center">
                        <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center border transition-all ${p.roles.includes(role) ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-800'}`}>
                           {p.roles.includes(role) ? '✓' : '✕'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-600/5 border border-amber-600/20 p-8 rounded-3xl flex items-center gap-6">
           <div className="text-3xl">⚠️</div>
           <div>
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Administrative Note</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed italic">
                Permissions are hardware-coded into the neural link backend. Modification requests must be synchronized via a secure PGP-signed ticket to Sector Alpha.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RBACPage;
