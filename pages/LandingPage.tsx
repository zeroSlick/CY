
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500 selection:text-white overflow-x-hidden flex flex-col font-sans">
      {/* Background Grids */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900 rounded-full blur-[180px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CS</div>
            <span className="text-lg font-bold text-white tracking-tight">CyberShield Enterprise</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <Link to="/" className="text-white">Home</Link>
            <Link to="/heuristics" className="hover:text-white transition-colors">Heuristics</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <Link to="/app" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] uppercase tracking-widest transition-all">
                Control Center
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] uppercase tracking-widest transition-all">
                  Request Access
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 pt-48 pb-32 px-10 relative flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold mb-10 uppercase tracking-[0.2em]">
            Threat Detection Intelligence 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-10 tracking-tight">
            AI-Driven Cyber Threat Detection <br/>
            <span className="text-slate-500">
              & Advanced Digital Forensics
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Proactive defense infrastructure powered by institutional-grade intelligence engines, secure Supabase data management, and immutable forensic logging.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="w-full sm:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/10">
              Initialize Deployment
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-12 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-lg font-bold text-sm uppercase tracking-widest transition-all">
              Technical Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-10 border-t border-slate-900 bg-slate-950 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs">CS</div>
            <span className="text-md font-bold text-white">CyberShield Enterprise</span>
          </div>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} CyberShield Enterprise Platform. Developed by Shubham Waghmare - Bharati Vidyapeeth Pune.
          </div>
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/shubham-w-4665b1205/" target="_blank" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">LinkedIn</a>
            <a href="https://github.com/zeroSlick" target="_blank" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
