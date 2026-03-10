
import React, { useState, useEffect } from 'react';

interface NetworkPacket {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  size: string;
  status: 'ALLOWED' | 'SUSPICIOUS' | 'BLOCKED';
}

const NetworkLogPage: React.FC = () => {
  const [logs, setLogs] = useState<NetworkPacket[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Fix: Explicitly typed return value as NetworkPacket[] and cast status to the appropriate union type
    const generateLogs = (): NetworkPacket[] => {
      const protocols: ('TCP' | 'UDP' | 'ICMP')[] = ['TCP', 'UDP', 'ICMP'];
      return Array.from({ length: 25 }, (_, i) => ({
        id: `PKT-${Math.random().toString(36).substring(7).toUpperCase()}`,
        timestamp: new Date(Date.now() - i * 1000).toLocaleTimeString(),
        srcIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
        dstIp: `45.1.2.${Math.floor(Math.random() * 255)}`,
        srcPort: Math.floor(Math.random() * 65535),
        dstPort: [80, 443, 22, 3389, 445][Math.floor(Math.random() * 5)],
        protocol: protocols[Math.floor(Math.random() * 3)],
        size: `${Math.floor(Math.random() * 1500)}B`,
        status: (Math.random() > 0.9 ? 'SUSPICIOUS' : (Math.random() > 0.95 ? 'BLOCKED' : 'ALLOWED')) as 'ALLOWED' | 'SUSPICIOUS' | 'BLOCKED'
      }));
    };
    setLogs(generateLogs());

    const interval = setInterval(() => {
      setLogs(prev => [generateLogs()[0], ...prev.slice(0, 24)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(l => l.srcIp.includes(filter) || l.dstIp.includes(filter) || l.protocol.includes(filter.toUpperCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Network Telemetry Viewer</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Packet-Level Inspection • Operational Ingress Stream</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Filter by IP, Protocol..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 w-64"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/40 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
              <th className="px-8 py-6">Timestamp & ID</th>
              <th className="px-8 py-6">Source (Port)</th>
              <th className="px-8 py-6">Destination (Port)</th>
              <th className="px-8 py-6">Prot/Size</th>
              <th className="px-8 py-6 text-right">Operational Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-indigo-600/5 transition-all group">
                <td className="px-8 py-6">
                  <div className="text-[10px] font-mono text-indigo-400 font-bold">{log.timestamp}</div>
                  <div className="text-[9px] text-slate-700 font-black mt-1 uppercase">{log.id}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-white uppercase tracking-tight">{log.srcIp}</div>
                  <div className="text-[9px] text-slate-500 font-bold">PORT: {log.srcPort}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-slate-400 uppercase tracking-tight">{log.dstIp}</div>
                  <div className="text-[9px] text-slate-600 font-bold">PORT: {log.dstPort}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{log.protocol}</span>
                    <span className="text-[9px] font-mono text-slate-600">{log.size}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                    log.status === 'BLOCKED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    log.status === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-slate-800 text-slate-600 border-slate-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkLogPage;
