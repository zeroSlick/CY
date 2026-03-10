
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="h-20 flex items-center px-10 border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs">CB</div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">Return to Base</span>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-10 py-24">
        <header className="mb-20">
          <div className="text-indigo-500 font-bold uppercase tracking-[0.4em] text-[9px] mb-6">Enterprise Architecture</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-10 leading-tight tracking-tight uppercase">Platform Technicalities</h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium italic">
            "Automated intelligence for contemporary defense."
          </p>
        </header>

        <div className="space-y-16 text-md text-slate-400 leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-[0.2em] border-b border-slate-800 pb-4">Mission Parameters</h2>
            <p>
              The <strong>Cloud-Basin Enterprise Platform</strong> delivers advanced telemetry analysis and automated triage. By leveraging institutional-grade neural engines, the platform identifies high-entropy patterns and malicious data flows in real-time.
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6">
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-6">Analytic Integrity</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Utilizes cryptographic hashing and immutable audit trails to ensure forensic validity. This provides a tamper-proof chain of custody for all investigative data.
              </p>
            </div>
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-6">Heuristic Engine</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Autonomous detection models identify zero-day vectors by cross-correlating system behavior with established malicious benchmarks.
              </p>
            </div>
          </div>

          <section className="p-10 bg-indigo-950/10 border border-indigo-900/30 rounded-[2.5rem]">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Research and Development</h4>
            <p className="text-xs text-slate-500 italic leading-relaxed uppercase tracking-tight">
              Developed for institutional research purposes at Bharati Vidyapeeth Deemed to be University, Pune. 
              Engineering Office: Department of Computer Science and Engineering.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
