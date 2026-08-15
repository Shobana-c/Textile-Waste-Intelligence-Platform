import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, X } from 'lucide-react';

export default function Login({ onNavigateToRegister }) {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // OAuth Account Selector Modal State
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [selectedOAuthEmail, setSelectedOAuthEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSelect = async (selectedEmail) => {
    setLocalError(null);
    setOauthLoading(true);
    setSelectedOAuthEmail(selectedEmail);
    try {
      // Simulate Google OAuth2 authentication redirect, code check & session generation
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await login(selectedEmail, 'password123');
      setShowOAuthModal(false);
    } catch (err) {
      setLocalError('OAuth2 authentication failed.');
      setShowOAuthModal(false);
    } finally {
      setOauthLoading(false);
    }
  };

  const googleAccounts = [
    { name: 'Jane Operator', email: 'operator@factory.com', role: 'Operator', color: 'bg-emerald-600' },
    { name: 'David Manager', email: 'manager@sustainability.org', role: 'Manager', color: 'bg-indigo-600' },
    { name: 'Sarah Manufacturer', email: 'brand@fashion.com', role: 'Manufacturer', color: 'bg-orange-600' },
    { name: 'Alex Administrator', email: 'admin@texcycle.com', role: 'Admin', color: 'bg-pink-600' }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-4 overflow-hidden">
      {/* Dynamic ambient radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl glow-bg-primary pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl glow-bg-secondary pointer-events-none"></div>

      <div className="w-full max-w-md glass-card p-8 rounded-3xl z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-500/10 border border-secondary-500/20 text-3xl mb-4">
            ♻️
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-2">
            Sign in to access your Textile Waste Intelligence dashboard
          </p>
        </div>

        {(localError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="operator@factory.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11 pr-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11 pr-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-secondary-500 to-accent-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={16} />
              </>
            )}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or continue with</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Standard Icon Size Google Button */}
          <button
            type="button"
            disabled={loading || oauthLoading}
            onClick={() => setShowOAuthModal(true)}
            className="w-full py-3 px-4 bg-slate-900/60 border border-slate-800 hover:bg-slate-900/90 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.282.614 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.58-.063-1.127-.174-1.636H12.24z"/>
            </svg>
            <span>Google SSO (OAuth2)</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
          <span className="text-slate-400">Don't have an account? </span>
          <button
            onClick={onNavigateToRegister}
            className="text-secondary-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Create one</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Google Account Selector Modal (OAuth2) */}
      {showOAuthModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative">
            
            {/* Close modal button */}
            {!oauthLoading && (
              <button 
                onClick={() => setShowOAuthModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}

            {oauthLoading ? (
              <div className="py-12 space-y-6 flex flex-col items-center justify-center">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">Signing in with Google...</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedOAuthEmail}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-center mb-3">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.282.614 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.58-.063-1.127-.174-1.636H12.24z" fill="#E2E8F0"/>
                    </svg>
                  </div>
                  <h3 className="text-md font-bold text-white">Choose an account</h3>
                  <p className="text-[10px] text-slate-400 mt-1">to continue to <strong className="text-secondary-400">TexCycle Platform</strong></p>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {googleAccounts.map((acc, index) => (
                    <button
                      key={index}
                      onClick={() => handleOAuthSelect(acc.email)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/80 rounded-2xl transition-all border border-transparent hover:border-slate-800 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${acc.color} text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm`}>
                          {acc.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{acc.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{acc.email}</div>
                        </div>
                      </div>
                      
                      <span className={`text-[8px] px-2 py-0.5 rounded-md font-extrabold border ${
                        acc.role === 'Operator' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        acc.role === 'Manager' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        acc.role === 'Manufacturer' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-pink-500/10 text-pink-400 border-pink-500/20'
                      }`}>
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-[9px] text-slate-450 leading-relaxed text-left border-t border-slate-850 pt-4">
                  To continue, Google will share your name, email address, language preference, and profile picture with TexCycle.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
