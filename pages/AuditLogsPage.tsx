
import React, { useEffect, useState } from 'react';
import { AuditLog } from '../types';
import { api } from '../services/api';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
      setIsLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 animate-in slide-up duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Audit Trail</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Immutable Operational History (Read-Only)</p>
        </div>
        <button className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-700">
          📥 Export Data Dump
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-widest animate-pulse">Syncing log shards...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/30 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                <th className="px-10 py-6">Timestamp & Reference</th>
                <th className="px-10 py-6">Operator Node</th>
                <th className="px-10 py-6">Action & Payload</th>
                <th className="px-10 py-6 text-right">Contextual IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-all">
                  <td className="px-10 py-6">
                    <div className="text-[10px] font-mono text-indigo-400 font-bold">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="text-[9px] text-slate-700 font-black mt-1 uppercase">ID: {log.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="text-sm font-black text-white uppercase tracking-tight">@{log.username}</div>
                    <div className="text-[9px] text-amber-500 font-black uppercase mt-1 tracking-widest">{log.category}</div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="text-[11px] font-black text-slate-300 uppercase tracking-wide">{log.action.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 italic truncate max-w-xs">{log.details}</div>
                  </td>
                  <td className="px-10 py-6 text-right font-mono text-xs text-slate-600 font-bold">
                    {log.ip}
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

export default AuditLogsPage;
