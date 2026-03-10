
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      setError('Captcha verification failed. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    try {
      // Automatic formatting for phone numbers if they start with a digit
      let processedIdentifier = identifier.trim();
      if (!processedIdentifier.includes('@') && /^\d/.test(processedIdentifier) && !processedIdentifier.startsWith('+')) {
        processedIdentifier = '+' + processedIdentifier;
      }

      await login(processedIdentifier, password);
      // AuthContext listener will handle the navigate via the useEffect above
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.message === 'Invalid login credentials') {
        setError('Invalid credentials. Check your email/phone and passphrase.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Email activation pending. Try logging in with your Phone Number (+91...) instead.');
      } else {
        setError(err.message || 'Access Denied: Neural pattern mismatch.');
      }
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <Link to="/" className="mb-8 flex items-center gap-3 group transition-all hover:scale-105 z-20">
         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">CS</div>
         <span className="text-lg font-bold text-white tracking-tight">Return to Base</span>
      </Link>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-xl shadow-indigo-600/20">🛡️</div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-center uppercase">Operator Login</h1>
          <p className="text-slate-400 mt-1 text-[10px] font-black uppercase tracking-widest text-center">Secure Entry Protocol Alpha-9</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] rounded-lg text-center font-black uppercase tracking-widest leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Identifier (Email or Phone)</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="ops@shield.ai or 919876543210"
              required
            />
            <p className="text-[8px] text-slate-600 mt-1 font-black uppercase tracking-widest">Tip: Use phone number if email confirmation is delayed.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Secure Passphrase</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="********"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Security Verification</label>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-mono text-lg tracking-[0.3em] text-indigo-400 select-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] uppercase">
                {captcha}
              </div>
              <button 
                type="button" 
                onClick={() => setCaptcha(generateCaptcha())}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs"
                title="Refresh Captcha"
              >
                🔄
              </button>
            </div>
            <input 
              type="text" 
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono uppercase text-center"
              placeholder="ENTER CODE"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] uppercase text-xs tracking-widest"
          >
            {isLoading ? 'Processing Uplink...' : 'Establish Connection'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            New Operator? <Link to="/register" className="text-indigo-400 hover:underline">Apply for Clearance</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
