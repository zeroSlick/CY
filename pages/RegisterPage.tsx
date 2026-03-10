
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    department: '' as UserRole | '',
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (code: string, number: string) => {
    const fullPhone = `${code}${number}`;
    const regex = /^\+[1-9]\d{1,14}$/;
    return regex.test(fullPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passphrases do not match.');
      return;
    }

    if (!validatePhone(formData.countryCode, formData.phoneNumber)) {
      setError('Invalid phone number. Ensure format +CountryCode followed by digits.');
      return;
    }

    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      setError('Captcha verification failed.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    const fullPhone = `${formData.countryCode}${formData.phoneNumber}`;

    try {
      await register({
        ...formData,
        phone: fullPhone,
        role: formData.department
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setError(err.message || 'Registration request failed.');
      setCaptcha(generateCaptcha());
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 border border-emerald-500/20 animate-bounce">✓</div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Clearance Requested</h1>
        <div className="text-slate-500 max-w-sm mx-auto mb-8 space-y-4">
          <p className="text-sm font-bold">Your operator application for the <span className="text-white">{formData.department}</span> sector has been submitted.</p>
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] text-indigo-300 font-black uppercase tracking-widest">
            Confirm your identity via the secure link sent to your device.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-2xl shadow-indigo-600/40">🛰️</div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">New Operator Registry</h1>
          <p className="text-slate-500 mt-1 text-[10px] font-black uppercase tracking-[0.2em]">Deploying to CyberShield Alpha Cluster</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] rounded-xl text-center font-black uppercase tracking-widest">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User Handle</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="operator_01" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="ops@shield.ai" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile Number</label>
            <div className="flex gap-2">
              <select 
                name="countryCode" 
                value={formData.countryCode} 
                onChange={handleChange}
                className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
              >
                <option value="+91">IN (+91)</option>
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+61">AU (+61)</option>
                <option value="+81">JP (+81)</option>
              </select>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                placeholder="9876543210" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Role</label>
            <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold" required>
              <option value="">Select Role...</option>
              <option value={UserRole.SOC}>SOC Analyst</option>
              <option value={UserRole.DFIR}>DFIR Analyst</option>
              <option value={UserRole.SYS}>Security Admin</option>
              <option value={UserRole.INT}>Threat Intelligence Analyst</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Passphrase</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="********" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm Passphrase</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="********" required />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-14 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-mono text-xl tracking-widest text-indigo-400 select-none uppercase">
                {captcha}
              </div>
              <button type="button" onClick={() => setCaptcha(generateCaptcha())} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">🔄</button>
            </div>
            <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-center font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VERIFY CODE" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-indigo-600/40 uppercase text-xs tracking-[0.2em] mt-6">
            {isLoading ? 'Establishing Uplink...' : 'Submit Application'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
