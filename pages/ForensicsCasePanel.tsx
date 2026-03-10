
import React, { useState, useRef, useEffect } from 'react';
import { ForensicCase, Evidence, TimelineEvent, ChainOfCustodyEntry } from '../types';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const ForensicsCasePanel: React.FC = () => {
  const { user } = useAuth();
  
  // State for multiple cases including historical ones
  const [cases, setCases] = useState<ForensicCase[]>([
    {
      id: 'FC-901',
      caseNumber: 'CASE-2023-11-X55',
      title: 'Advanced Threat Investigation - Cluster Delta',
      incidentIds: ['INC-7742'],
      evidence: [],
      status: 'ACTIVE',
      createdAt: '2023-11-21T09:00:00Z',
      investigatorId: user?.username || 'OP-01',
      chainOfCustody: [],
      timeline: []
    },
    {
      id: 'FC-882',
      caseNumber: 'CASE-2023-09-A12',
      title: 'Legacy Breach Analysis - Sector G7',
      incidentIds: ['INC-4412'],
      evidence: [
        {
          id: 'E-OLD-1',
          name: 'suspicious_log_sept.txt',
          type: 'LOG',
          sha256: '8f434234b34234234b34234234b34234234b34234234b34234234b34234234',
          verificationStatus: 'VERIFIED',
          timestamp: '2023-09-15T14:20:00Z',
          isSealed: true,
          content: 'Historical log content found: [ERROR] Unauthorized access attempt at 09:44:12...'
        }
      ],
      status: 'ARCHIVED',
      createdAt: '2023-09-14T10:00:00Z',
      investigatorId: 'Agent_Carter',
      chainOfCustody: [],
      timeline: []
    }
  ]);

  const [activeCaseId, setActiveCaseId] = useState<string>('FC-901');
  const [activeTab, setActiveTab] = useState<'INGEST' | 'LAB' | 'TIMELINE' | 'VAULT' | 'REPORT' | 'ARCHIVE'>('INGEST');
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCaseData, setNewCaseData] = useState({ title: '', caseNumber: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived active case
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  const generateCaseNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hash = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CASE-${year}-${month}-${hash}`;
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: ForensicCase = {
      id: `FC-${Date.now()}`,
      caseNumber: newCaseData.caseNumber || generateCaseNumber(),
      title: newCaseData.title,
      incidentIds: [],
      evidence: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      investigatorId: user?.username || 'OPERATOR',
      chainOfCustody: [],
      timeline: []
    };
    setCases([newCase, ...cases]);
    setActiveCaseId(newCase.id);
    setIsCreateModalOpen(false);
    setNewCaseData({ title: '', caseNumber: '' });
  };

  const handleDownloadEvidence = (e: Evidence) => {
    const contentToDownload = `
FORENSIC EXPORT - CYBERSHIELD AI
================================
ARTIFACT: ${e.name}
TYPE: ${e.type}
INGEST_TIME: ${e.timestamp}
SHA-256: ${e.sha256}
VERIFICATION: ${e.verificationStatus}
================================

${e.content || "No textual content available for this artifact."}
    `;
    
    const blob = new Blob([contentToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${e.name.split('.')[0]}_FORENSIC.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SHA-256 Hash Function
  const calculateHash = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const [selectedFileAnalysis, setSelectedFileAnalysis] = useState<any>(null);

  const handleFileDrop = async (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = null;
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    setProcessing(true);
    setUploadProgress(10);
    
    const hash = await calculateHash(file);
    setUploadProgress(40);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setUploadProgress(60);

      const analysis = await geminiService.analyzeFileArtifact(file!.name, content, file!.type);
      setUploadProgress(100);

      const newEvidence: Evidence = {
        id: `E-${Date.now()}`,
        name: file!.name,
        type: file!.type.includes('pdf') ? 'FILE' : 'LOG',
        sha256: hash,
        verificationStatus: 'VERIFIED',
        timestamp: new Date().toISOString(),
        forensicArtifacts: analysis?.findings || [],
        isSealed: true,
        content: content // Store content for history/download
      };

      const cocEntry: ChainOfCustodyEntry = {
        id: `COC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'INGESTED',
        operator: user?.username || 'OPERATOR',
        preHash: 'NONE',
        postHash: hash,
        details: `Artifact "${file!.name}" ingested into case ${activeCase.caseNumber}. Verdict: ${analysis?.threatVerdict}`
      };

      // Update the specific case in the cases list
      setCases(prev => prev.map(c => 
        c.id === activeCaseId 
        ? { ...c, evidence: [newEvidence, ...c.evidence], chainOfCustody: [cocEntry, ...c.chainOfCustody] }
        : c
      ));

      setSelectedFileAnalysis({ ...newEvidence, aiDetail: analysis });

      setTimeout(() => {
        setProcessing(false);
        setUploadProgress(0);
        setActiveTab('LAB');
      }, 500);
    };

    reader.readAsText(file.slice(0, 100000));
  };

  const handleGenerateTimeline = async () => {
    setProcessing(true);
    const events = await geminiService.reconstructTimeline(activeCase.evidence);
    setCases(prev => prev.map(c => 
      c.id === activeCaseId ? { ...c, timeline: events } : c
    ));
    setProcessing(false);
    setActiveTab('TIMELINE');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-full">
      {/* Dynamic Case Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl">
               <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Sector Case</label>
               <select 
                 value={activeCaseId}
                 onChange={(e) => {
                   setActiveCaseId(e.target.value);
                   setSelectedFileAnalysis(null);
                   setActiveTab('INGEST');
                 }}
                 className="bg-transparent text-white font-black text-sm uppercase tracking-tight focus:outline-none appearance-none pr-8 cursor-pointer"
               >
                 {cases.map(c => (
                   <option key={c.id} value={c.id}>{c.caseNumber}</option>
                 ))}
               </select>
             </div>
             <button 
               onClick={() => {
                 setNewCaseData(prev => ({ ...prev, caseNumber: generateCaseNumber() }));
                 setIsCreateModalOpen(true);
               }}
               className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
               title="Initialize New Investigation"
             >
               +
             </button>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{activeCase.title}</h2>
            <div className="flex gap-4 mt-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lead Investigator: <span className="text-indigo-400">{activeCase.investigatorId}</span></span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeCase.status === 'ARCHIVED' ? 'text-amber-500' : 'text-emerald-500'}`}>Status: {activeCase.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => setActiveTab('ARCHIVE')}
             className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-700"
           >
             📜 Case History
           </button>
           <button 
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all"
           >
             ⚖️ Seal Legal Record
           </button>
        </div>
      </div>

      {/* Forensic Navigation Tabs */}
      <div className="flex gap-10 border-b border-slate-800 overflow-x-auto pb-1 no-scrollbar">
        {['INGEST', 'LAB', 'TIMELINE', 'VAULT', 'REPORT', 'ARCHIVE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-1 text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap relative ${
              activeTab === tab ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_#6366f1]"></div>}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ARCHIVE: Case History View */}
        {activeTab === 'ARCHIVE' && (
          <div className="space-y-8 animate-in slide-up duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Global Case Registry</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">Historical investigative log for sector {user?.role}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800/50">
                      <th className="px-12 py-6">Reference ID</th>
                      <th className="px-12 py-6">Mission Title</th>
                      <th className="px-12 py-6">Investigator</th>
                      <th className="px-12 py-6">Created</th>
                      <th className="px-12 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {cases.map(c => (
                      <tr key={c.id} className={`hover:bg-slate-800/30 transition-all group ${activeCaseId === c.id ? 'bg-indigo-600/5' : ''}`}>
                        <td className="px-12 py-8 font-mono text-xs text-indigo-400 font-bold">{c.caseNumber}</td>
                        <td className="px-12 py-8">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white tracking-tight">{c.title}</span>
                            <span className={`text-[9px] font-black uppercase mt-1 ${c.status === 'ARCHIVED' ? 'text-amber-500' : 'text-emerald-500'}`}>{c.status}</span>
                          </div>
                        </td>
                        <td className="px-12 py-8 text-xs text-slate-400 font-bold uppercase">{c.investigatorId}</td>
                        <td className="px-12 py-8 text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="px-12 py-8 text-right">
                          <button 
                            onClick={() => { setActiveCaseId(c.id); setActiveTab('VAULT'); }}
                            className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Inspect Assets
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INGEST: Artifact Collection */}
        {activeTab === 'INGEST' && (
          <div className="space-y-8">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`border-4 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center transition-all group ${
                processing ? 'border-indigo-600 bg-indigo-600/5' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {processing ? (
                <div className="text-center space-y-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-[6px] border-indigo-600/10 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Parsing Artifact Streams</p>
                    <div className="w-80 h-1.5 bg-slate-950 rounded-full overflow-hidden mx-auto shadow-inner">
                      <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-black uppercase">Decrypting bytes... {uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8">
                   <div className="text-7xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">📁</div>
                   <div className="space-y-3">
                     <h3 className="text-3xl font-black text-white uppercase tracking-tight">Ingest Case Artifact</h3>
                     <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                       Drag malicious data streams, suspicious PDFs, or binary dumps into the {activeCase.caseNumber} context.
                     </p>
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleFileDrop} className="hidden" />
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-95"
                   >
                     Browse Sector Storage
                   </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LAB: Deep Static Analysis */}
        {activeTab === 'LAB' && (
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 min-h-[600px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
               <span className="text-[12rem] font-black text-slate-500">LAB-OPS</span>
            </div>

            {selectedFileAnalysis ? (
              <div className="relative z-10 flex-1 flex flex-col animate-in slide-up duration-500">
                <div className="flex items-center justify-between mb-12 border-b border-slate-800/50 pb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-rose-600/40">🕵️</div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{selectedFileAnalysis.name}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-xl uppercase tracking-widest border border-rose-500/20">Verdict: {selectedFileAnalysis.aiDetail?.threatVerdict}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">SHA-256: {selectedFileAnalysis.sha256}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] border-l-2 border-indigo-600 pl-4">Technical Forensics</h4>
                      <div className="bg-slate-950/80 p-8 rounded-[2rem] border border-slate-800 shadow-inner h-[300px] overflow-y-auto custom-scrollbar">
                         <p className="text-xs text-slate-300 leading-relaxed italic font-medium">{selectedFileAnalysis.aiDetail?.technicalDetails}</p>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 opacity-20 py-20">
                <div className="text-9xl grayscale">🔬</div>
                <p className="text-2xl font-black text-white uppercase tracking-[0.4em]">Neural Scrutiny Idle</p>
              </div>
            )}
          </div>
        )}

        {/* VAULT: Immutable Chain of Custody & Download */}
        {activeTab === 'VAULT' && (
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
             <div className="p-10 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Evidence Vault</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">Immutable forensic container for case {activeCase.caseNumber}</p>
                </div>
                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Vault Sealed</span>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800/50">
                      <th className="px-12 py-6">Forensic Item</th>
                      <th className="px-12 py-6">SHA-256 Fingerprint</th>
                      <th className="px-12 py-6 text-right">Integrity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {activeCase.evidence.length > 0 ? (
                      activeCase.evidence.map(e => (
                        <tr key={e.id} className="hover:bg-slate-800/30 transition-all group">
                          <td className="px-12 py-8">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-xl group-hover:bg-indigo-600/10 transition-all">📄</div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-white tracking-tight">{e.name}</span>
                                <button 
                                  onClick={() => handleDownloadEvidence(e)}
                                  className="text-[9px] text-indigo-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                                >
                                  📥 Download Artifact
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-12 py-8">
                            <code className="text-[11px] font-mono text-slate-500 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 block max-w-sm truncate">
                              {e.sha256}
                            </code>
                          </td>
                          <td className="px-12 py-8 text-right">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest inline-flex items-center gap-2 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-[0.4em] opacity-30">Vault is Empty</td>
                      </tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {/* TIMELINE & REPORT tabs would follow same pattern using activeCase context */}
      </div>

      {/* Initialize New Case Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative">
             <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors font-black text-xl">✕</button>
             <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Initialize Sector Investigation</h3>
             <form onSubmit={handleCreateCase} className="space-y-8 mt-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investigation Mission Title</label>
                  <input 
                    type="text" 
                    required 
                    value={newCaseData.title}
                    onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  />
                </div>
                <button type="submit" className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-95">
                  Deploy Case Terminal
                </button>
             </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.4); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; border: 1px solid #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; border-color: #6366f1; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ForensicsCasePanel;
