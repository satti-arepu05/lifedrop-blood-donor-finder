import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Clock, 
  Calendar, 
  MapPin, 
  Bell, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  User, 
  Phone, 
  Mail,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function DonorDashboard() {
  const { user, token, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Edit form state
  const [isAvailable, setIsAvailable] = useState(true);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [lastDonatedAt, setLastDonatedAt] = useState('');

  const loadDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Get Me / Donor profile
      const meRes = await fetch('/api/auth/me', { headers });
      const meData = await meRes.json();
      if (meData.user?.donor) {
        const d = meData.user.donor;
        setProfile(d);
        setIsAvailable(Boolean(d.available));
        setCity(d.city || '');
        setArea(d.area || '');
        setLastDonatedAt(d.last_donated_at || '');
      }

      // 2. Incoming requests matches
      const reqRes = await fetch('/api/requests/donor/incoming', { headers });
      const reqData = await reqRes.json();
      setIncomingRequests(Array.isArray(reqData) ? reqData : []);

      // 3. Notifications inbox
      const notifRes = await fetch('/api/notifications', { headers });
      const notifData = await notifRes.json();
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } catch (err) {
      console.error(err);
      addToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token]);

  // Compute countdown to 90 days eligibility
  const calculateDaysRemaining = (dateStr) => {
    if (!dateStr) return 0;
    const lastDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 90 - diffDays);
  };

  const daysRemaining = calculateDaysRemaining(lastDonatedAt);
  const isEligible = daysRemaining === 0;

  // Toggle availability instantly
  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      const res = await fetch('/api/donors/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ available: nextVal })
      });
      if (!res.ok) throw new Error('Failed to update status');
      addToast(`Availability updated to ${nextVal ? 'Available' : 'Unavailable'}`, 'success');
      refreshUser();
    } catch (err) {
      setIsAvailable(!nextVal);
      addToast(err.message, 'error');
    }
  };

  // Save profile changes (city, area, last donation date)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/donors/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          city,
          area,
          lastDonatedAt: lastDonatedAt || null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      addToast('Profile updated successfully', 'success');
      setProfile(data.donor);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Respond to incoming emergency request (Accept / Decline)
  const handleRespondRequest = async (requestId, responseType) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ response: responseType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit response');

      addToast(
        responseType === 'accept'
          ? '🎉 Request Accepted! Hospital has received your contact info.'
          : 'Request declined.',
        responseType === 'accept' ? 'success' : 'info'
      );
      loadDashboardData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Mark notification as read
  const handleMarkNotificationRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your LifeDrop Donor command center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-brand-red to-brand-redDark text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
            {profile?.blood_group || '🩸'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              {profile?.city || 'India'} • Registered Voluntary Donor
            </p>
          </div>
        </div>

        {/* Live Availability Toggle Switch */}
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl self-start md:self-auto">
          <span className="text-xs font-bold">
            {isAvailable ? '🟢 Available for Emergencies' : '⏸️ Currently On Pause'}
          </span>
          <button
            onClick={handleToggleAvailability}
            className="text-white hover:scale-110 transition-transform"
            title="Toggle Availability"
          >
            {isAvailable ? (
              <ToggleRight className="w-8 h-8 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Grid: Countdown Clock + Eligibility + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Eligible Donation Countdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Eligibility Protocol
            </span>
            <Clock className="w-4 h-4 text-brand-red" />
          </div>

          <div className="my-2">
            {isEligible ? (
              <div>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  Ready Now!
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  You have fulfilled the 90-day clinical recovery period.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-500">
                    {daysRemaining}
                  </span>
                  <span className="text-sm font-bold text-slate-500">Days Remaining</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Based on last whole blood donation on {lastDonatedAt}.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Interval Required: <strong>90 Days</strong></span>
            <span className="text-brand-red font-bold">Safe &amp; Healthy</span>
          </div>
        </div>

        {/* Incoming Emergency Requests Badge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Emergency Matches
            </span>
            <Activity className="w-4 h-4 text-brand-blue" />
          </div>

          <div className="my-2">
            <div className="text-4xl font-black text-slate-900 dark:text-white">
              {incomingRequests.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active patient requests matching your blood group &amp; city.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-brand-blue font-semibold">
            {incomingRequests.filter(r => r.match_status === 'accepted').length} Accepted • Respond below
          </div>
        </div>

        {/* Notifications Counter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Notifications Hub
            </span>
            <Bell className="w-4 h-4 text-purple-600" />
          </div>

          <div className="my-2">
            <div className="text-4xl font-black text-purple-600">
              {notifications.filter(n => !n.read).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unread SMS, email &amp; in-app emergency alerts.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            {notifications.length} Total Messages Logged
          </div>
        </div>
      </div>

      {/* Incoming Requests Section with Accept / Decline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Incoming Emergency Blood Requests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review requests from local hospitals. Accepting unlocks your verified contact info to the doctor.
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6">
            <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Pending Requests</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              There are no urgent blood requests matching your group in {profile?.city || 'your area'} right now. You will be alerted immediately if a need arises.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map(match => (
              <div
                key={match.match_id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  match.match_status === 'accepted'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : match.match_status === 'declined'
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-red-200 dark:border-red-900/60 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-red text-white">
                      {match.blood_group}
                    </span>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      Patient: {match.patient_name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      match.urgency === 'Critical' ? 'bg-red-100 text-brand-red' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {match.urgency}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                    <p><strong>Hospital:</strong> {match.hospital}, {match.city}</p>
                    <p><strong>Units Required:</strong> {match.units} unit(s) • Needed: {match.needed_by || 'Immediate'}</p>
                    {match.notes && <p className="text-slate-500 italic">&quot;{match.notes}&quot;</p>}
                  </div>
                </div>

                {/* Accept / Decline actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {match.match_status === 'accepted' ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        Accepted • Contact Shared
                      </span>
                    </div>
                  ) : match.match_status === 'declined' ? (
                    <span className="text-xs text-slate-400 font-semibold px-3 py-1.5">
                      Declined
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleRespondRequest(match.request_id, 'accept')}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept &amp; Save Life</span>
                      </button>
                      <button
                        onClick={() => handleRespondRequest(match.request_id, 'declined')}
                        className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout: Profile Settings & Notifications Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Update Location &amp; Donation History
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Last Blood Donation Date
              </label>
              <input
                type="date"
                value={lastDonatedAt}
                onChange={e => setLastDonatedAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-red"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Automatically recalculates your 90-day cooldown countdown.
              </span>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              {savingProfile ? 'Saving...' : 'Update Donor Details'}
            </button>
          </form>
        </div>

        {/* Notifications Inbox */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Notifications &amp; Alerts Inbox
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {notifications.length} alerts
            </span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No notifications in your inbox.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto pr-1">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkNotificationRead(n.id)}
                  className={`py-3.5 px-3 rounded-xl transition-colors cursor-pointer ${
                    !n.read ? 'bg-red-50/50 dark:bg-red-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand-red inline-block" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {n.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {n.created_at}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
