
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const IntelligenceFeedPage: React.FC = () => {
  const [indicatorSearch, setIndicatorSearch] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const feeds = [
    { ip: '192.168.4.12', score: 98, country: 'CN', status: 'MALICIOUS', tags: ['C2', 'RAT'] },
    { ip: '45.1.22.8', score: 85, country: 'RU', status: 'MALICIOUS', tags: ['SPAM'] },
    { ip: '103.2.4.99', score: 92, country: 'UA', status: 'MALICIOUS', tags: ['BRUTEFORCE'] },
  ];

  const handleLookup = async () => {
    if (!indicatorSearch.trim()) return;
    setLookingUp(true);
    const result = await geminiService.lookupIndicator(indicatorSearch);
    setLookupResult(result);
    setLookingUp(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Threat Intelligence</h2>
          <p className="text-slate-400 font-medium text-xs tracking-wide mt-4 leading-relaxed italic border-l-2 border-rose-500 pl-6 bg-rose-500/5 py-3 rounded-r-lg">
            Analyze the provided IP, URL, domain, or hash to identify malicious activity. Correlate it with known threat patterns, assign a risk score and severity level, determine the threat type, and provide a concise recommendation for SOC action.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-center">Global Intelligence Correlation (Grounded Search)</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={indicatorSearch}
                onChange={(e) => setIndicatorSearch(e.target.value)}
                placeholder="Ingest IP, Domain, or SHA-256 Fingerprint..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-sm text-indigo-400 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              />
              <button 
                onClick={handleLookup}
                disabled={lookingUp || !indicatorSearch.trim()}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20"
              >
                {lookingUp ? 'Correlating...' : 'Identify'}
              </button>
            </div>
            
            {lookupResult && (
              <div className="mt-10 p-8 bg-slate-950 rounded-3xl border border-slate-800 animate-in slide-in-from-top duration-500 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Results for "{indicatorSearch}"</h4>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-slate-900/50 p-6 rounded-2xl border border-slate-800 prose prose-invert max-w-none">
                  {lookupResult}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Malicious Indicator Registry</h3>
               <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Network Synchronized</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/20 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                  <th className="px-10 py-6">IOC Indicator</th>
                  <th className="px-10 py-6">Risk Index</th>
                  <th className="px-10 py-6">Operational Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {feeds.map((feed, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-rose-500 transition-colors">{feed.ip}</span>
                        <div className="flex gap-2 mt-2">
                          {feed.tags.map(t => <span key={t} className="text-[8px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-black tracking-widest uppercase">{t}</span>)}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`text-sm font-black ${feed.score > 80 ? 'text-rose-500' : 'text-amber-500'}`}>{feed.score}/100</span>
                    </td>
                    <td className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">{feed.country} NODE</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem]">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Threat Vectors</h3>
             <div className="space-y-4">
                {[
                  { label: 'Ransomware Variant A', val: 'Active', color: 'text-rose-500' },
                  { label: 'C2 Command Sector', val: 'Monitoring', color: 'text-amber-500' },
                  { label: 'Vulnerability CVE-2025', val: 'Neutralized', color: 'text-emerald-500' }
                ].map(v => (
                  <div key={v.label} className="flex justify-between items-center p-4 bg-slate-950 rounded-xl border border-slate-800 group hover:border-indigo-500/20 transition-all">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{v.label}</span>
                    <span className={`text-[10px] font-black uppercase ${v.color}`}>{v.val}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceFeedPage;
