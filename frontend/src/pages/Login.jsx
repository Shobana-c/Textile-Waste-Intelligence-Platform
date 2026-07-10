import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Loader2, ArrowRight, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex overflow-hidden font-sans relative">
      
      {/* ================= LEFT BRANDING PANEL (Desktop only) ================= */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-900">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-emerald-500/[0.04] blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-teal-500/[0.05] blur-[120px]"></div>
        </div>

        {/* Top Branding Section */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">TexCycle</h1>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block mt-1">Enterprise Platform</span>
          </div>
        </div>

        {/* Core Value Pitch & Features list */}
        <div className="space-y-8 max-w-md my-auto z-10">
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Version 2.0 Live</span>
            </span>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Diverting materials, closing circles.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering global supply chains to classify fabrics, score recyclability potential, and automate environmental audits.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-900">
            {[
              "AI-powered textile weave & composition classification",
              "Dynamic weighted circularity and sustainability indices",
              "One-click Excel CSV exports & printable PDF print sheets",
              "Production container ready via Docker-compose gateway"
            ].map((text, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs text-slate-350">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-[10px] text-slate-500 z-10 font-medium">
          &copy; 2026 TexCycle Inc. All rights reserved. Infosys Springboard Capstone.
        </div>
      </section>

      {/* ================= RIGHT WORKSPACE PANEL (Login Card) ================= */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative z-10 bg-gradient-to-b from-dark-bg to-slate-950/60 lg:bg-none">
        
        {/* Floating elements for background in mobile view */}
        <div className="lg:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-emerald-500/[0.03] blur-[80px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-teal-500/[0.04] blur-[100px]"></div>
        </div>

        <div className="w-full max-w-sm space-y-8 z-10">
          
          {/* Logo on top for Mobile View */}
          <div className="lg:hidden flex flex-col items-center space-y-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">TexCycle</h1>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-black text-white tracking-tight">Welcome Back</h3>
            <p className="text-xs text-slate-500 font-semibold">Enter your credentials to access the circularity workspace.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed animate-in fade-in duration-250">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-900 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all text-xs"
                  placeholder="••••••••"
                  required
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
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center lg:text-left text-xs text-slate-500">
            New to TexCycle?{' '}
            <Link to="/register" className="text-emerald-450 hover:text-emerald-400 font-bold transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Login;
