import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Droplet, Lock, Mail, LogIn, ShieldAlert, Sparkles, User, Hospital, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      // Navigate based on role if default
      if (from === '/' || from === '/login') {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'hospital') navigate('/hospital');
        else navigate('/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-redDark to-brand-red text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
            <Droplet className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome to LifeDrop
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your donor profile, hospital desk, or admin terminal.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Login Shortcuts */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@lifedrop.com', 'Admin@123')}
              className="px-2 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 transition-colors"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('apollo.hyd@lifedrop.com', 'Hospital@123')}
              className="px-2 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-blue dark:bg-blue-950/50 dark:text-blue-300 transition-colors"
            >
              🏥 Hospital
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('donor1@lifedrop.com', 'Donor@123')}
              className="px-2 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-brand-red dark:bg-red-950/50 dark:text-red-300 transition-colors"
            >
              🩸 Donor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-sm shadow-xl shadow-red-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <span>Logging In...</span> : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register-donor" className="text-brand-red font-bold hover:underline">
              Register as Donor
            </Link>
          </p>
          <p>
            Representing a Hospital / Patient?{' '}
            <Link to="/register" className="text-brand-blue font-bold hover:underline">
              Create Hospital Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
