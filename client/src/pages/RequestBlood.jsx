import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  Droplet, 
  Hospital, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  FileText,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RequestBlood() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: searchParams.get('bloodGroup') || 'O+',
    units: 2,
    hospital: '',
    city: searchParams.get('city') || 'Hyderabad',
    urgency: 'Critical',
    contactName: user?.name || '',
    contactPhone: user?.phone || '+91 98480 12345',
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      addToast('Please login or register to broadcast an emergency blood request', 'error');
      navigate('/login', { state: { from: '/request-blood' } });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          units: parseInt(formData.units, 10)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit blood request');
      }

      setSuccessInfo(data);
      addToast(`Emergency Request Created! ${data.notifiedDonorsCount} donor(s) notified instantly.`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (successInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Emergency Request Dispatched!
          </h2>

          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-brand-red dark:text-red-400 font-bold text-lg">
            🚀 {successInfo.notifiedDonorsCount} matching eligible donor(s) in {formData.city} have been alerted via SMS, Email &amp; App!
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Our autonomous matching algorithm prioritized compatible donors with 90+ days intervals. You will receive an immediate notification as soon as a donor accepts.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => navigate(`/request/${successInfo.request.id}`)}
              className="px-8 py-3.5 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-sm shadow-lg shadow-red-500/25 transition-transform hover:scale-105"
            >
              View Live Request Status Tracker
            </button>
            <button
              onClick={() => setSuccessInfo(null)}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-redDark to-brand-red text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Post an Emergency Blood Request
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Instant compatibility algorithm broadcasts to verified donors in your hospital&apos;s city.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <div>
              <span>You must be logged in as a hospital or patient to dispatch requests. </span>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/request-blood' } })}
                className="font-bold underline ml-1"
              >
                Log In Now &rarr;
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Blood Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Patient &amp; Required Blood Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sundaram"
                  value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group Needed *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-black focus:ring-2 focus:ring-brand-red"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Units (Pints) Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.units}
                  onChange={e => setFormData({ ...formData, units: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Urgency Level *
                </label>
                <select
                  value={formData.urgency}
                  onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-extrabold focus:ring-2 focus:ring-brand-red ${
                    formData.urgency === 'Critical'
                      ? 'text-red-600 dark:text-red-400'
                      : formData.urgency === 'Urgent'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <option value="Critical">🚨 Critical (Needed within 1-2 Hours)</option>
                  <option value="Urgent">⚠️ Urgent (Needed within 24 Hours)</option>
                  <option value="Normal">🟢 Normal (Scheduled Surgery / Standby)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Hospital &amp; City Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Medical Center Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Hospitals, Jubilee Hills"
                  value={formData.hospital}
                  onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City (Match Radius) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Suresh / Coordinator"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Direct Phone / Emergency Extension *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98480 12345"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Required By Date
                </label>
                <input
                  type="date"
                  value={formData.neededBy}
                  onChange={e => setFormData({ ...formData, neededBy: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Notes / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. ICU Bed #4, ICU In-charge Dr. Roy"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-base shadow-xl shadow-red-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span>Broadcasting Request to Matching Donors...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Broadcast Emergency Request &amp; Alert Donors</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
