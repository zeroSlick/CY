
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemSettings } from '../types';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    id: 'global_config',
    minPassLength: 12,
    sessionTimeout: 30,
    maxAttempts: 5,
    triageThreshold: 8.5,
    updatedAt: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await api.getSystemSettings();
      if (data) setSettings(data);
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await api.updateSystemSettings(settings);
    if (success) {
      alert("Neural sync complete. System security policies broadcasted across all cluster nodes.");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-widest animate-pulse">Decrypting system configuration...</div>;

  return (
    <div className="space-y-10 animate-in slide-up duration-500 max-w-4xl">
      <div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Fortress Config</h2>
        <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Global System & Security Policy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-8">
           <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-600 pl-4">Access Protocols</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Min Passphrase Complexity (Len)</label>
                 <input type="number" value={settings.minPassLength} onChange={e => setSettings({...settings, minPassLength: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sentinel Max Fail Attempts</label>
                 <input type="number" value={settings.maxAttempts} onChange={e => setSettings({...settings, maxAttempts: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
              </div>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-8">
           <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border-l-2 border-emerald-600 pl-4">Operational Limits</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Link TTL (Session Mins)</label>
                 <input type="number" value={settings.sessionTimeout} onChange={e => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural P1 Alert Threshold</label>
                 <input type="number" step="0.1" value={settings.triageThreshold} onChange={e => setSettings({...settings, triageThreshold: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">⚙️</div>
         <div className="flex items-center gap-6">
            <div className={`w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-600/30 transition-all ${isSaving ? 'animate-spin' : ''}`}>💾</div>
            <div>
               <h4 className="text-sm font-black text-white uppercase tracking-tight">Synchronize Security Mesh</h4>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Updates propagate to all active cluster nodes immediately.</p>
            </div>
         </div>
         <button 
           onClick={handleSave} 
           disabled={isSaving}
           className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
         >
            {isSaving ? 'Broadcasting...' : 'Commit Settings'}
         </button>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
