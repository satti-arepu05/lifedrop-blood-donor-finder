import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, User, Lock, Mail, Phone, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('hospital');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'donor') {
      navigate('/register-donor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name,
        email: email.toLowerCase().trim(),
        password,
        phone,
        role: 'hospital'
      });

      addToast('Hospital/Requester account created!', 'success');
      navigate('/hospital');
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <Hospital className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose whether you are enrolling as a Hospital/Requester or Donor.
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'hospital'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🏥 Hospital / Requester
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('donor');
              navigate('/register-donor');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'donor'
                ? 'bg-brand-red text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🩸 Blood Donor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Organization / Hospital / Caregiver Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Care Hospital - Banjara Hills"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="care.icu@hospital.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98480 99887"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blueDark text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span>Creating Hospital Portal...</span> : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Register Hospital Account</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-brand-blue font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
