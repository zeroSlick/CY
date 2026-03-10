
import React, { useState } from 'react';
import { Incident, IncidentStatus, Severity } from '../types';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const IncidentManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'INC-7742', title: 'Critical Exfiltration Attempt - Sector Delta', severity: Severity.CRITICAL, status: IncidentStatus.INVESTIGATING, assignedAnalyst: 'Agent Smith', createdAt: '2023-11-20T10:00:00Z', updatedAt: '2023-11-20T12:00:00Z', relatedThreatIds: ['T-101'] },
    { id: 'INC-7741', title: 'Unauthorized Lateral Movement - App Tier', severity: Severity.HIGH, status: IncidentStatus.OPEN, assignedAnalyst: null, createdAt: '2023-11-20T11:30:00Z', updatedAt: '2023-11-20T11:30:00Z', relatedThreatIds: ['T-103'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ title: '', severity: Severity.MEDIUM });
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedIncidentInsights, setSelectedIncidentInsights] = useState<any>(null);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      title: newIncident.title,
      severity: newIncident.severity,
      status: IncidentStatus.OPEN,
      assignedAnalyst: user?.username || 'UNASSIGNED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedThreatIds: []
    };
    setIncidents([incident, ...incidents]);
    setIsModalOpen(false);
    setNewIncident({ title: '', severity: Severity.MEDIUM });
  };

  const handleAnalyzeInsights = async (incident: Incident) => {
    setAnalyzingId(incident.id);
    const insights = await geminiService.getIncidentInsights(incident);
    if (insights) {
      setSelectedIncidentInsights({
        ...incident,
        aiInsights: insights
      });
    }
    setAnalyzingId(null);
  };

  const getBadgeStyles = (severity: Severity) => {
    const base = "inline-flex items-center justify-center px-3 py-1.5 rounded border text-[9px] font-black uppercase whitespace-nowrap min-w-[110px] text-center tracking-wider";
    if (severity === Severity.CRITICAL) return `${base} bg-rose-500/10 text-rose-500 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]`;
    if (severity === Severity.HIGH) return `${base} bg-orange-500/10 text-orange-500 border-orange-500/40`;
    return `${base} bg-slate-800 text-slate-400 border-slate-700`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-full overflow-hidden pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Incident Response Hub</h2>
          <p className="text-slate-500 font-bold text-xs tracking-[0.3em] uppercase mt-1">Real-time triage and responder management.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all">
          + Deploy Incident Record
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800">
              <th className="px-8 py-5">Reference</th>
              <th className="px-8 py-5">Incident Context</th>
              <th className="px-8 py-5 text-center">Impact Level</th>
              <th className="px-8 py-5 text-right">Operational Logic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5 font-mono text-xs font-black text-slate-500">{incident.id}</td>
                <td className="px-8 py-5">
                  <div className="text-sm font-black text-white tracking-tight">{incident.title}</div>
                  <div className="text-[9px] text-slate-500 mt-1 uppercase font-black">
                    Assigned: <span className="text-indigo-400">{incident.assignedAnalyst || 'Awaiting Triage'}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={getBadgeStyles(incident.severity)}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => handleAnalyzeInsights(incident)}
                    disabled={analyzingId === incident.id}
                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border text-indigo-400 border-indigo-400/20 hover:bg-indigo-600 hover:text-white"
                  >
                    {analyzingId === incident.id ? 'Analyzing...' : 'Triage AI'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIncidentInsights && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in slide-up duration-500">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-600/40">🧠</div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Intelligence Report: {selectedIncidentInsights.id}</h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">Analysis Generated by Investigator AI</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-3">Findings Narrative</h4>
               <p className="text-xs text-slate-400 leading-relaxed italic">{selectedIncidentInsights.aiInsights?.summary}</p>
            </div>
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-slate-800 pb-3">Recommended Countermeasures</h4>
               <div className="space-y-3">
                 {selectedIncidentInsights.aiInsights?.solutions?.map((sol: any, i: number) => (
                   <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="text-[10px] font-black text-white uppercase">{sol.action}</div>
                      <p className="text-[11px] text-slate-500 mt-1">{sol.details}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Manual Dispatch</h3>
            <form onSubmit={handleCreateIncident} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Label</label>
                <input type="text" required value={newIncident.title} onChange={e => setNewIncident({...newIncident, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Severity Tier</label>
                <select value={newIncident.severity} onChange={e => setNewIncident({...newIncident, severity: e.target.value as Severity})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold">
                  <option value={Severity.LOW}>P4 - LOW</option>
                  <option value={Severity.MEDIUM}>P3 - MEDIUM</option>
                  <option value={Severity.HIGH}>P2 - HIGH</option>
                  <option value={Severity.CRITICAL}>P1 - CRITICAL</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase">Abort</button>
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Establish Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagementPage;
