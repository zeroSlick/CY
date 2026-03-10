
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { api } from '../services/api';

interface LogEntry {
  id: string;
  msg: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'AI';
  time: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<'OPERATIONS' | 'AUDIT'>('OPERATIONS');
  const [isIntelligenceLogOpen, setIsIntelligenceLogOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [userCount, setUserCount] = useState(0);
  const [failedLogins, setFailedLogins] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.role === UserRole.SYS) {
        const users = await api.getUsers();
        const audit = await api.getAuditLogs();
        setUserCount(users.length);
        setFailedLogins(audit.filter(l => l.action === 'LOGIN_FAILED').length);
        setActiveSessions(users.filter(u => u.isActive).length);
      }
    };
    fetchAdminData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isAI = Math.random() > 0.7;
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        msg: isAI 
          ? `Intelligence Engine: Analyzing cross-sector correlations for node ${Math.floor(Math.random() * 99)}.`
          : `System Event: Routine packet inspection completed on ingress port ${Math.floor(Math.random() * 60000)}.`,
        type: isAI ? 'AI' : (Math.random() > 0.9 ? 'CRITICAL' : 'INFO'),
        time: new Date().toLocaleTimeString()
      };
      setLogs(prev => [newLog, ...prev.slice(0, 15)]);
    }, 2500);
    return () => clearInterval(interval);
  }, [user]);

  const severityData = [
    { name: 'P1 - Critical', value: 8, color: '#f43f5e', description: 'Immediate remediation required' },
    { name: 'P2 - High', value: 24, color: '#f97316', description: 'Priority investigation' },
    { name: 'P3 - Medium', value: 45, color: '#eab308', description: 'Standard response protocol' },
    { name: 'P4 - Low', value: 89, color: '#38bdf8', description: 'Monitoring required' },
    { name: 'P5 - Informational', value: 176, color: '#64748b', description: 'Routine telemetry' },
  ];

  const totalIncidents = severityData.reduce((acc, curr) => acc + curr.value, 0);

  const dailyThreats = [
    { day: 'Mon', count: 45 }, { day: 'Tue', count: 52 }, { day: 'Wed', count: 38 },
    { day: 'Thu', count: 65 }, { day: 'Fri', count: 82 }, { day: 'Sat', count: 24 }, { day: 'Sun', count: 18 },
  ];

  const metrics = useMemo(() => {
    if (user?.role === UserRole.SYS) {
      return [
        { label: 'Total Personnel', value: userCount, id: 'ID', color: 'text-indigo-400' },
        { label: 'Access Security', value: failedLogins, id: 'SH', color: 'text-rose-400' },
        { label: 'Active Sessions', value: activeSessions, id: 'ST', color: 'text-emerald-400' },
        { label: 'Policy Compliance', value: '100%', id: 'SY', color: 'text-sky-400' },
      ];
    }
    return [
      { label: 'Sector Load', value: 'Nominal', id: 'LD', color: 'text-slate-400' },
      { label: 'Operator Role', value: user?.role.split(' ')[0], id: 'ID', color: 'text-indigo-400' },
      { label: 'Access Status', value: 'Verified', id: 'AC', color: 'text-emerald-400' },
      { label: 'System Clearance', value: 'Authorized', id: 'CL', color: 'text-sky-400' },
    ];
  }, [user, userCount, failedLogins, activeSessions]);

  const dashboardTitle = useMemo(() => {
    if (!user) return 'Control Center';
    if (user.role === UserRole.INT) return 'Threat Intelligence';
    return `${user.role.split(' ')[0]} Center`;
  }, [user]);

  return (
    <div className="relative min-h-[80vh] space-y-10 animate-in fade-in duration-700">
      {!isIntelligenceLogOpen && (
        <div className="space-y-10 animate-in slide-in-from-left duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{dashboardTitle}</h2>
                 <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-md text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Neural Sync Active</div>
              </div>
              <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase">Security Operations Intelligence Hub</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button onClick={() => setActiveMainTab('OPERATIONS')} className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMainTab === 'OPERATIONS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Real-time Operations</button>
                <button onClick={() => setActiveMainTab('AUDIT')} className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMainTab === 'AUDIT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Historical Audit</button>
              </div>
              <button onClick={() => setIsIntelligenceLogOpen(true)} className="group w-14 h-14 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-xs text-indigo-400 shadow-xl hover:border-indigo-500 transition-all active:scale-95">
                AI
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((stat, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 p-8 rounded-[1.5rem] shadow-xl hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded tracking-widest">{stat.id}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className={`text-[9px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2rem] shadow-2xl relative">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] border-l-2 border-indigo-600 pl-4">Sector Volatility Index</h3>
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Metric: Incidents per Diurnal Cycle</span>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyThreats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} 
                        itemStyle={{ color: '#6366f1' }}
                        labelStyle={{ color: '#f8fafc', marginBottom: '4px' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2rem] shadow-2xl">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10 border-l-2 border-orange-500 pl-4">Incident Distribution</h3>
                <div className="flex flex-col items-center">
                  <div className="h-[200px] w-full relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-2xl font-black text-white">{totalIncidents}</span>
                       <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Total Events</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={severityData} 
                          innerRadius={65} 
                          outerRadius={85} 
                          paddingAngle={5} 
                          dataKey="value" 
                          stroke="none"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#f8fafc' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-8 w-full space-y-3">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Severity Matrix Legend</p>
                    {severityData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">{item.name}</span>
                            <span className="text-[8px] text-slate-600 font-medium italic">{item.description}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isIntelligenceLogOpen && (
        <div className="min-h-[85vh] flex flex-col animate-in slide-in-from-right duration-500 space-y-10 pb-10">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsIntelligenceLogOpen(false)} className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-md hover:bg-rose-600 transition-all text-white shadow-xl active:scale-90">✕</button>
              <div>
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Intelligence Engine</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.4em] mt-2">Neural Analysis Stream Protocol</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative flex flex-col">
             <div className="flex-1 space-y-4 overflow-y-auto pr-6 custom-scrollbar max-h-[55vh]">
                {logs.map((log) => (
                  <div key={log.id} className={`p-6 rounded-2xl border transition-all animate-in slide-up duration-300 flex gap-6 ${log.type === 'AI' ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-slate-950/50 border-slate-800/50'}`}>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0 font-bold">[{log.time}]</span>
                    <div className="flex-1">
                      <p className={`text-xs font-mono leading-relaxed ${log.type === 'AI' ? 'text-indigo-200 italic' : 'text-slate-400'}`}>{log.msg}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; border: 1px solid #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
      `}</style>
    </div>
  );
};

export default DashboardPage;
