
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Severity } from '../../types';

interface LiveAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  source: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['SQLi Attempt', 'Brute Force', 'Unauthorized Access', 'C2 Callback', 'File Integrity Mismatch'];
      const severities: ('CRITICAL' | 'HIGH' | 'MEDIUM')[] = ['CRITICAL', 'HIGH', 'MEDIUM'];
      const newAlert: LiveAlert = {
        id: `AL-${Math.random().toString(36).substring(7).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: `192.168.1.${Math.floor(Math.random() * 255)}`
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 6)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const severityData = [
    { name: Severity.CRITICAL, value: 12, color: '#f43f5e', desc: 'Critical infrastructure risk' },
    { name: Severity.HIGH, value: 28, color: '#fb923c', desc: 'Active security breach' },
    { name: Severity.MEDIUM, value: 45, color: '#facc15', desc: 'Suspicious anomaly' },
    { name: Severity.LOW, value: 92, color: '#38bdf8', desc: 'Minor policy deviation' },
  ];

  const dailyVolume = [
    { day: 'Mon', count: 420 }, { day: 'Tue', count: 512 }, { day: 'Wed', count: 380 },
    { day: 'Thu', count: 654 }, { day: 'Fri', count: 812 }, { day: 'Sat', count: 214 }, { day: 'Sun', count: 180 },
  ];

  const totalLoad = useMemo(() => severityData.reduce((acc, curr) => acc + curr.value, 0), []);

  const renderRoleMetrics = () => {
    const rolesMap: Record<string, any[]> = {
      [UserRole.SOC]: [
        { label: 'Alert Queue', value: '42', id: 'AQ', color: 'text-rose-500' },
        { label: 'Packet Rate', value: '2.4 GB/s', id: 'PR', color: 'text-indigo-400' },
        { label: 'Mitigated', value: '812', id: 'MT', color: 'text-emerald-400' },
        { label: 'Active Threats', value: '03', id: 'AT', color: 'text-amber-500' },
      ],
      [UserRole.DFIR]: [
        { label: 'Active Cases', value: '08', id: 'AC', color: 'text-emerald-400' },
        { label: 'Evidence Vault', value: '1.2 TB', id: 'EV', color: 'text-indigo-400' },
        { label: 'Pending Timeline', value: '14', id: 'PT', color: 'text-amber-400' },
        { label: 'Hashing Speed', value: '980 MB/s', id: 'HS', color: 'text-sky-400' },
      ],
      [UserRole.SYS]: [
        { label: 'Total Personnel', value: '24', id: 'TO', color: 'text-indigo-400' },
        { label: 'Policy Status', value: 'Active', id: 'PS', color: 'text-emerald-400' },
        { label: 'Audit Failures', value: '00', id: 'AF', color: 'text-rose-400' },
        { label: 'System Uptime', value: '99.9%', id: 'UT', color: 'text-sky-400' },
      ],
      [UserRole.INT]: [
        { label: 'Known Indicators', value: '14K', id: 'KI', color: 'text-rose-400' },
        { label: 'Actor Links', value: '24', id: 'AL', color: 'text-indigo-400' },
        { label: 'Global Volatility', value: 'High', id: 'GV', color: 'text-amber-400' },
        { label: 'Threat Score', value: '7.2', id: 'TS', color: 'text-emerald-400' },
      ]
    };

    const stats = (user && rolesMap[user.role]) || [];

    return stats.map((stat, i) => (
      <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[1.5rem] shadow-xl hover:border-indigo-500/30 transition-all">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded tracking-widest">{stat.id}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
        </div>
        <div className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">{stat.value}</div>
        <div className={`text-[9px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.label}</div>
      </div>
    ));
  };

  const renderRoleModule = () => {
    const accentColor = user?.role === UserRole.SOC ? 'border-rose-600' : 
                       user?.role === UserRole.DFIR ? 'border-emerald-600' :
                       user?.role === UserRole.INT ? 'border-amber-600' : 'border-indigo-600';
    
    const title = user?.role === UserRole.SOC ? 'Active Operational Queue' :
                  user?.role === UserRole.DFIR ? 'Digital Forensic Artifacts' :
                  user?.role === UserRole.INT ? 'Intelligence Correlation Hub' : 'Administrative Activity Master';

    return (
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <h3 className={`text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] border-l-2 ${accentColor} pl-4`}>{title}</h3>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sector Status: Nominal</span>
        </div>
        
        <div className="flex-1 space-y-4 max-h-[450px] overflow-y-auto no-scrollbar">
          {user?.role === UserRole.SOC ? (
             alerts.map(alert => (
              <div key={alert.id} className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-2 h-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className="text-[11px] font-black text-white uppercase tracking-tight">{alert.type}</div>
                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">{alert.source}</div>
                  </div>
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase">{alert.timestamp}</div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4 py-20">
              <span className="text-4xl">📡</span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sector-Specific Telemetry Active</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{user?.role.split(' ')[0]} Command</h2>
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-widest rounded">Sector Node Active</span>
          </div>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase">Cloud-Basin Infrastructure Platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderRoleMetrics()}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] border-l-2 border-indigo-600 pl-4">Sector Activity Index</h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {renderRoleModule()}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl h-fit">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10 border-l-2 border-orange-500 pl-4">Security Distribution</h3>
          <div className="flex flex-col items-center">
            <div className="h-[220px] w-full relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">{totalLoad}</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Total Events</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                    {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '9px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-10 w-full space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Notation Legend</p>
              {severityData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">{item.name}</span>
                      <span className="text-[8px] text-slate-600 font-medium italic">{item.desc}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-500 block">{item.value}</span>
                    <span className="text-[8px] font-bold text-indigo-500/50 block">{((item.value / totalLoad) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
