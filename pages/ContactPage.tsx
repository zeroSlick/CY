
import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="h-20 flex items-center px-10 border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CS</div>
          <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">Return to Home</span>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <header className="mb-16">
              <div className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Corporate Communications</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Support & Development</h1>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">
                For inquiries regarding platform architecture, institutional research, or technical specifications, please contact the lead development office.
              </p>
            </header>

            <div className="space-y-10">
              <div className="flex gap-6 items-start p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="w-10 h-10 bg-slate-800 text-indigo-400 rounded flex items-center justify-center shrink-0 font-bold text-xs">ID</div>
                <div>
                  <h4 className="text-slate-600 font-bold uppercase text-[9px] tracking-widest mb-2">Project Reference</h4>
                  <p className="text-white font-bold leading-tight text-sm">CyberShield Enterprise Intelligence Platform</p>
                </div>
              </div>

              <div className="flex gap-6 items-start p-8 bg-slate-900/50 border border-slate-800 rounded-2xl border-l-4 border-l-indigo-600">
                <div className="w-10 h-10 bg-slate-800 text-indigo-400 rounded flex items-center justify-center shrink-0 font-bold text-xs">DV</div>
                <div>
                  <h4 className="text-slate-600 font-bold uppercase text-[9px] tracking-widest mb-2">Lead Developer</h4>
                  <p className="text-white font-bold text-lg">Shubham Waghmare</p>
                  <div className="flex gap-6 mt-6">
                    <a href="https://www.linkedin.com/in/shubham-w-4665b1205/" target="_blank" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">LinkedIn</a>
                    <a href="https://github.com/zeroSlick" target="_blank" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">GitHub</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 items-start p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="w-10 h-10 bg-slate-800 text-indigo-400 rounded flex items-center justify-center shrink-0 font-bold text-xs">IN</div>
                <div>
                  <h4 className="text-slate-600 font-bold uppercase text-[9px] tracking-widest mb-2">Institution</h4>
                  <p className="text-white font-bold text-sm leading-relaxed uppercase tracking-tight">Bharati Vidyapeeth Deemed to be University, College of Engineering Pune</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Department of Computer Science and Engineering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 p-12 rounded-[2.5rem] shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-10 uppercase tracking-widest border-b border-slate-800 pb-6">Secure Communication Portal</h3>
            <form className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all" placeholder="Enter Analyst Name" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Corporate Email Address</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all" placeholder="name@domain.com" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Inquiry Details</label>
                <textarea rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all resize-none" placeholder="Provide technical context..."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-lg transition-all shadow-xl shadow-indigo-600/10 uppercase text-xs tracking-[0.2em]">
                Transmit Encrypted Message
              </button>
            </form>
            <div className="mt-10 text-center text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em]">
              Authorized Transmission Lane: SEC-ALPHA-01
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
