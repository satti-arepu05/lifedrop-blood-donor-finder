import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, UserPlus, ShieldCheck, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const INDIAN_STATES = [
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Maharashtra',
  'Delhi NCR',
  'Andhra Pradesh',
  'Kerala',
  'Gujarat',
  'West Bengal',
  'Uttar Pradesh'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterDonor() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: 25,
    gender: 'Male',
    bloodGroup: 'O+',
    state: 'Telangana',
    city: 'Hyderabad',
    area: '',
    lastDonatedAt: '',
    available: true,
    consent: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Compute eligibility dynamically
  const calculateEligibility = (dateStr) => {
    if (!dateStr) return { isEligible: true, daysRemaining: 0 };
    const lastDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 90) {
      return { isEligible: true, daysRemaining: 0 };
    }
    return { isEligible: false, daysRemaining: 90 - diffDays };
  };

  const eligibility = calculateEligibility(formData.lastDonatedAt);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!formData.phone || formData.phone.length < 10) {
      errs.phone = 'Valid 10+ digit mobile number is required';
    }
    if (formData.age < 18 || formData.age > 65) {
      errs.age = 'Donor age must be strictly between 18 and 65 years';
    }
    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }
    if (!formData.consent) {
      errs.consent = 'You must accept the voluntary blood donor terms & consent';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please correct the highlighted errors in the form', 'error');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: 'donor',
        donorDetails: {
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          state: formData.state,
          city: formData.city.trim(),
          area: formData.area.trim(),
          lastDonatedAt: formData.lastDonatedAt || null,
          available: formData.available,
          consent: formData.consent
        }
      };

      await register(payload);
      addToast('Welcome to LifeDrop! Donor profile registered and logged in.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-redDark to-brand-red text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Become a Registered Blood Donor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Join the emergency life-saving network. Your identity remains protected until you accept an emergency call.
          </p>
        </div>

        {errors.form && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Personal &amp; Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Login ID) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (For Emergency Alerts) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Blood & Clinical Parameters */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Clinical Eligibility &amp; Blood Group
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm font-bold"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age (18–65) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Last donation date + automatic eligibility computation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Last Blood Donation Date
                  </label>
                  <span className="text-[11px] text-slate-500">Leave blank if this will be your first donation</span>
                </div>
                <input
                  type="date"
                  value={formData.lastDonatedAt}
                  onChange={e => setFormData({ ...formData, lastDonatedAt: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-red"
                />
              </div>

              {/* Dynamic Eligibility Badge */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                {eligibility.isEligible ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligible to donate immediately (Interval &gt;= 90 days)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Calendar className="w-3.5 h-3.5" />
                    In cooldown: Next eligible in {eligibility.daysRemaining} days (90-day protocol)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Location &amp; Reachability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm font-medium"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Area / Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. Banjara Hills, 500034"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                />
              </div>
            </div>
          </div>

          {/* Availability & Consent */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Available Now Toggle */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Available for Emergency Calls Now
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Toggle off at any time if traveling or unwell.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={e => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 text-brand-red rounded border-slate-300 focus:ring-brand-red accent-brand-red"
              />
            </label>

            {/* Voluntary Consent Checkbox */}
            <label className="flex items-start gap-3 p-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 w-4 h-4 text-brand-red rounded border-slate-300 focus:ring-brand-red accent-brand-red shrink-0"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                I hereby declare that I am voluntarily registering as a blood donor on LifeDrop. I understand that my phone number remains masked until I accept an emergency request, and I agree to be notified for matching patients.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-red-500 px-3">{errors.consent}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-base shadow-xl shadow-red-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span>Registering Profile...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Complete Donor Registration &amp; Activate</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-brand-red font-bold hover:underline">
              Log in to your dashboard
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
