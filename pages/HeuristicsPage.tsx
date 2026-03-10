
import React from 'react';
import { Link } from 'react-router-dom';

const HeuristicCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500/50 transition-all group">
    <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform inline-block">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const HeuristicsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="h-20 flex items-center px-6 border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CS</div>
          <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">Back to Home</span>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">Core Technology</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8">Neural Heuristic Analysis</h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            Our platform analyzes system logs, user activity, authentication records, file operations, process behavior, and network traffic using heuristic and behavior-based analysis. 
            Identify and list all suspicious activities by detecting abnormal file access, unusual process execution, irregular user behavior, repeated failed login attempts, unusual login times or locations, unknown IP communications, abnormal traffic spikes, and port scanning behavior.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <HeuristicCard 
            icon="📁" 
            title="File Operations" 
            desc="Detects abnormal file access patterns, unauthorized directory traversal, and rapid file modifications indicating ransomware or data theft." 
          />
          <HeuristicCard 
            icon="⚙️" 
            title="Process Behavior" 
            desc="Identifies unusual process execution paths, DLL injections, and privilege escalation attempts within the operating system." 
          />
          <HeuristicCard 
            icon="🔐" 
            title="Auth Records" 
            desc="Monitors for irregular user behavior, repeated failed login attempts, and unusual login times or geolocations." 
          />
          <HeuristicCard 
            icon="📡" 
            title="Network Traffic" 
            desc="Detects unknown IP communications, abnormal traffic spikes, port scanning behavior, and potential data exfiltration tunnels." 
          />
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Threat Classification Framework</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center text-center">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">High Severity</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Activities showing definitive behavioral deviations with calculated anomaly risk scores over 85%. Automated evidence capture initiated.
              </p>
            </div>
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col items-center text-center">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Medium Severity</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Suspicious patterns with risk scores between 40-85%. Requires immediate analyst triage and manual investigation.
              </p>
            </div>
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center text-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Low Severity</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Minor deviations or unusual events with low risk scores. Logged for longitudinal behavior correlation.
              </p>
            </div>
          </div>
          <div className="mt-12 p-8 bg-slate-950 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold mb-4">Behavioral Reason Generation</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              For each flagged activity, our engine generates a clear reason explaining why the activity was marked suspicious, 
              highlighting the specific behavioral deviations or rule violations detected in the telemetry stream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeuristicsPage;
