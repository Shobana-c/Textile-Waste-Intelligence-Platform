import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Shield, Loader2, ArrowRight, Leaf, Info } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Recycling Facility Operator');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!fullName || !email || !password || !confirmPassword || !role) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    const result = await register(fullName, email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed. Try using a different email.');
    }
    setIsSubmitting(false);
  };

  const roles = [
    'Recycling Facility Operator',
    'Sustainability Manager',
    'Textile Manufacturer',
    'Administrator'
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#040809] px-4 py-12 overflow-hidden font-sans">
      
      {/* 🧵 Subtle Woven Textile Grid Overlay (Mimics fabric threads) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* 🌌 Large, Slow Pulsing Environmental Radial Glows */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.04] blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-teal-500/[0.05] blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Core Branding Header */}
        <div className="flex flex-col items-center space-y-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/15">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">TexCycle Portal</h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mt-1.5">Textile Waste Classification & Audit Log</span>
          </div>
        </div>

        {/* Centered Register Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl relative border border-slate-900 bg-slate-950/70 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-6 text-center">Create Operator Account</h2>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="operator@texcycle.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Assign System Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 select-none pointer-events-none">
                  <Shield className="w-4 h-4" />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs appearance-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ♻️ Textile Waste Management Fact Tip Box */}
          <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start space-x-3 text-[10px] text-slate-450 leading-relaxed font-semibold">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Proper pre-sorting of fabric structures (like separating poly-cotton blends from single-fiber wool) increases mechanical recycling efficiency by over 85%.</span>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-450 hover:text-emerald-400 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
