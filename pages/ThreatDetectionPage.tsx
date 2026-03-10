
import React, { useState, useMemo } from 'react';
import { Threat, Severity, UserRole, Incident, IncidentStatus } from '../types';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getSeverityColor = (score: number) => {
  if (score >= 9.0) return 'text-rose-500 border-rose-500/20 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
  if (score >= 7.0) return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
  if (score >= 4.0) return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
  if (score > 0.0) return 'text-sky-400 border-sky-400/20 bg-sky-400/10';
  return 'text-slate-500 border-slate-700/50 bg-slate-800/50';
};

const getPLevelBadge = (score: number) => {
  if (score >= 9.0) return 'P1';
  if (score >= 7.0) return 'P2';
  if (score >= 4.0) return 'P3';
  if (score > 0.0) return 'P4';
  return 'P5';
};

const ThreatDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);
  
  const [threats, setThreats] = useState<Threat[]>([
    // Fixed: Updated status values to uppercase 'DETECTED' to match types.ts definition
    { id: 'T-101', type: 'ML: SQL Injection Pattern', severity: Severity.CRITICAL, riskScore: 9.4, confidence: 0.98, timestamp: '2023-11-20T11:15:00Z', sourceIp: '92.118.3.45', targetUser: 'db_admin', status: 'DETECTED' },
    { id: 'T-100', type: 'Heuristic: Phishing Attempt', severity: Severity.HIGH, riskScore: 7.2, confidence: 0.92, timestamp: '2023-11-20T10:30:00Z', sourceIp: '185.23.4.12', targetUser: 'j.smith', status: 'DETECTED' },
    { id: 'T-099', type: 'ML: Anomaly Callback', severity: Severity.MEDIUM, riskScore: 5.4, confidence: 0.85, timestamp: '2023-11-20T09:15:00Z', sourceIp: '45.1.2.33', targetUser: 'system', status: 'DETECTED' },
  ]);

  const filteredThreats = useMemo(() => {
    return threats.filter(t => t.type.toLowerCase().includes(searchTerm.toLowerCase()) || t.sourceIp.includes(searchTerm));
  }, [searchTerm, threats]);

  const handleRowAnalyze = async (threat: Threat) => {
    setAnalyzing(true);
    setIsAIOpen(true);
    setActiveThreat(threat);
    setAiAnalysis(null);
    const result = await geminiService.analyzeThreat(threat);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const handleAction = (action: string) => {
    alert(`OPERATIONAL COMMAND: ${action} initiated for ${activeThreat?.sourceIp || 'Target'}`);
  };

  const handleConvertToIncident = () => {
    if (!activeThreat) return;
    alert(`CONVERTING THREAT ${activeThreat.id} TO INCIDENT RECORD...`);
    navigate('/app/incidents');
  };

  return (
    <div className="relative min-h-[80vh] space-y-8 animate-in fade-in duration-700">
      {!isAIOpen ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Alert Review Panel</h2>
            <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">ML-Detected Threats • High Confidence Ingestion</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <input 
                type="text" 
                placeholder="Search IOC, IP, or Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-80" 
              />
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/20 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                  <th className="px-10 py-6">Identity & Type</th>
                  <th className="px-10 py-6">Telemetry Source</th>
                  <th className="px-10 py-6">ML Confidence</th>
                  <th className="px-10 py-6 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-indigo-600/5 transition-all group cursor-pointer" onClick={() => handleRowAnalyze(threat)}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-xs ${getSeverityColor(threat.riskScore)}`}>
                          {getPLevelBadge(threat.riskScore)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{threat.type}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-1">{threat.id} • {new Date(threat.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-[10px] font-mono text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                        {threat.sourceIp}
                      </code>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                         <div className="flex-1 h-1 bg-slate-800 rounded-full max-w-[60px] overflow-hidden">
                            <div className="h-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" style={{ width: `${threat.confidence * 100}%` }}></div>
                         </div>
                         <span className="text-[10px] font-black text-indigo-400">{(threat.confidence * 100).toFixed(0)}%</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="px-4 py-2 bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-slate-700">
                        Triage AI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsAIOpen(false)} className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-xl hover:bg-rose-600 transition-all text-white shadow-xl">✕</button>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Investigator AI</h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1">Reviewing: {activeThreat?.id}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleConvertToIncident} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20">Convert to Incident</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col space-y-10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                <span className="text-9xl font-black text-slate-500 tracking-tighter">SEC-OPS</span>
              </div>
              
              {analyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">Running Neural Correlation...</p>
                </div>
              ) : aiAnalysis && (
                <div className="relative z-10 flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Impact Level</div>
                        <div className="text-2xl font-black text-white">{aiAnalysis.priorityLevel}</div>
                     </div>
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">ML Risk Index</div>
                        <div className="text-2xl font-black text-rose-500">{aiAnalysis.riskScore.toFixed(1)}</div>
                     </div>
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Status</div>
                        <div className="text-2xl font-black text-emerald-500 uppercase tracking-tighter">Verified</div>
                     </div>
                  </div>
                  <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 h-full overflow-y-auto">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Technical Summary</h4>
                    <p className="text-sm text-slate-400 leading-relaxed italic">{aiAnalysis.summary}</p>
                    <div className="mt-8 space-y-3">
                      {aiAnalysis.mitigationSteps.map((step: string, i: number) => (
                        <div key={i} className="flex gap-4 items-center text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                          <span className="text-indigo-500 font-black">#0{i+1}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl flex flex-col space-y-8">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] border-l-4 border-rose-600 pl-4">SOC Action Panel</h4>
              <div className="space-y-4">
                <button onClick={() => handleAction('IP_BLOCK')} className="w-full py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl border border-rose-600/20 font-black text-[10px] uppercase tracking-widest transition-all">Block Ingress IP</button>
                <button onClick={() => handleAction('USER_LOCK')} className="w-full py-4 bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white rounded-xl border border-amber-600/20 font-black text-[10px] uppercase tracking-widest transition-all">Lock Target Account</button>
                <button onClick={() => handleAction('FORCE_LOGOUT')} className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 font-black text-[10px] uppercase tracking-widest transition-all">Force Session Termination</button>
              </div>
              <div className="mt-auto pt-8 border-t border-slate-800">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Escalation Protocol</h4>
                <button onClick={() => handleAction('DFIR_ESCALATE')} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all">Escalate to DFIR Team</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatDetectionPage;
