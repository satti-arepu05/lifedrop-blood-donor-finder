import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Activity, 
  Droplet, 
  Hospital, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  Unlock,
  UserCheck,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function RequestStatus() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchStatus = async () => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`/api/requests/${id}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load request');
      setData(json);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id, token]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchStatus();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Connecting to live request telemetry...</p>
      </div>
    );
  }

  if (!data || !data.request) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Request Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested emergency case ID does not exist.</p>
        <Link to="/request-blood" className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl">
          Create New Request
        </Link>
      </div>
    );
  }

  const { request, matches, stats } = data;
  const isRequesterOrAdmin = user && (user.id === request.requester_id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              REQ-#{request.id}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              request.status === 'Fulfilled'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : request.status === 'Accepted'
                ? 'bg-blue-100 text-brand-blue dark:bg-blue-950 dark:text-blue-300'
                : request.status === 'Cancelled'
                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                : 'bg-red-100 text-brand-red dark:bg-red-950 dark:text-red-300 animate-pulse'
            }`}>
              ● Status: {request.status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Emergency Blood Request Telemetry
          </h1>
        </div>

        <button
          onClick={fetchStatus}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Lifecycle Progression
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {/* Step 1: Pending */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${
              ['Pending', 'Accepted', 'Fulfilled'].includes(request.status) ? 'bg-brand-red' : 'bg-slate-300 dark:bg-slate-700'
            }`}>
              1
            </div>
            <span className="text-slate-900 dark:text-white">Broadcasted</span>
            <span className="text-[10px] text-slate-400 font-normal">Donors Alerted</span>
          </div>

          {/* Step 2: Accepted */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${
              ['Accepted', 'Fulfilled'].includes(request.status) ? 'bg-brand-blue' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              2
            </div>
            <span className="text-slate-900 dark:text-white">Accepted</span>
            <span className="text-[10px] text-slate-400 font-normal">Contact Unlocked</span>
          </div>

          {/* Step 3: Fulfilled */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${
              request.status === 'Fulfilled' ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              3
            </div>
            <span className="text-slate-900 dark:text-white">Fulfilled</span>
            <span className="text-[10px] text-slate-400 font-normal">Blood Transfused</span>
          </div>

          {/* Step 4: Closed */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${
              ['Fulfilled', 'Cancelled'].includes(request.status) ? 'bg-slate-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              ✓
            </div>
            <span className="text-slate-900 dark:text-white">Closed</span>
            <span className="text-[10px] text-slate-400 font-normal">Record Archived</span>
          </div>
        </div>
      </div>

      {/* Main Request Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/30">
              {request.blood_group}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Patient: {request.patient_name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Hospital className="w-3.5 h-3.5 text-brand-blue" />
                <span>{request.hospital}, {request.city}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block">Units Required:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{request.units} Unit(s)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Urgency:</span>
              <span className={`font-bold text-sm ${request.urgency === 'Critical' ? 'text-brand-red' : 'text-amber-600'}`}>
                {request.urgency}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Needed By:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{request.needed_by || 'Immediate'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Coordinator:</span>
              <span className="font-bold text-slate-900 dark:text-white">{request.contact_name}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block">Direct Emergency Phone:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{request.contact_phone}</span>
            </div>
          </div>

          {request.notes && (
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
              <strong>Clinical Note:</strong> {request.notes}
            </p>
          )}
        </div>

        {/* Action Controls for Hospital / Requester */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">
              Dispatch Stats
            </h4>
            <div className="text-3xl font-black text-brand-red">
              {stats.totalNotified}
            </div>
            <p className="text-xs text-slate-500">Eligible Donors Alerted</p>

            <div className="mt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Accepted:</span>
                <strong className="text-emerald-600 font-bold">{stats.acceptedCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Declined:</span>
                <span className="text-slate-500">{stats.declinedCount}</span>
              </div>
            </div>
          </div>

          {isRequesterOrAdmin && request.status !== 'Fulfilled' && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('Fulfilled')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Fulfilled</span>
              </button>
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('Cancelled')}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-red-50 hover:text-red-600"
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Matched Donors Section & Unlocked Contacts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Matched &amp; Alerted Donors ({matches.length})
            </h3>
            <p className="text-xs text-slate-500">
              Personal contact details unlock once the volunteer accepts the request.
            </p>
          </div>
        </div>

        {matches.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Searching network for eligible donors in this city...
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {matches.map(m => (
              <div key={m.matchId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-brand-red flex items-center justify-center font-bold text-xs shrink-0">
                    {m.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {m.donorName}
                      </span>
                      {m.matchStatus === 'accepted' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Accepted
                        </span>
                      ) : m.matchStatus === 'declined' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800">
                          Declined
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Pending Response
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {m.city} • {m.gender}, {m.age} yrs
                    </span>
                  </div>
                </div>

                {/* Contact Unlock Status */}
                <div className="text-right">
                  {m.isContactUnlocked ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left sm:text-right">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Direct Contact Unlocked:</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        <a href={`tel:${m.donorPhone}`} className="hover:underline text-brand-blue">
                          {m.donorPhone}
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {m.donorEmail}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Contact protected until donor accepts</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
