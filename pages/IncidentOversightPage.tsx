
import React, { useState, useEffect } from 'react';
import { Incident, UserRole } from '../types';
import { api } from '../services/api';

const IncidentOversightPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = async () => {
    setIsLoading(true);
    const data = await api.getIncidents();
    setIncidents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleApproveClosure = async (id: string) => {
    const success = await api.approveIncidentClosure(id);
    if (success) fetchIncidents();
  };

  const handleReassign = async (id: string) => {
    const analystName = prompt("Enter new Analyst Handle for reassignment:");
    if (analystName) {
      const success = await api.reassignIncident(id, analystName);
      if (success) fetchIncidents();
    }
  };

  const getSeverityLabel = (severity: string) => severity.split(' - ')[0];

  return (
    <div className="space-y-8 animate-in slide-up duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">HQ Oversight</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Executive Incident Review & High-Authority Dispatch</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Operational Queue</h3>
          <span className="text-[9px] text-slate-500 uppercase font-black">Cluster Health: Nominal</span>
        </div>
        
        {isLoading ? (
          <div className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-widest animate-pulse">Polling sector incident mesh...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/20 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                <th className="px-10 py-6">Incident Reference</th>
                <th className="px-10 py-6">Operational Status</th>
                <th className="px-10 py-6 text-right">Administrative Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {incidents.map(inc => (
                <tr key={inc.id} className="hover:bg-slate-800/20 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-xs shadow-lg ${inc.severity.includes('CRITICAL') ? 'text-rose-500' : 'text-amber-500'}`}>
                        {getSeverityLabel(inc.severity)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{inc.title}</div>
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">ID: {inc.id} • Sector: <span className="text-indigo-400">{inc.assignedAnalyst || 'UNASSIGNED'}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${inc.status === 'PENDING_CLOSURE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {inc.status.replace(/_/g, ' ')}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <button 
                      onClick={() => handleReassign(inc.id)}
                      className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Reassign
                    </button>
                    {inc.status === 'PENDING_CLOSURE' && (
                      <button 
                        onClick={() => handleApproveClosure(inc.id)}
                        className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Approve Closure
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncidentOversightPage;
