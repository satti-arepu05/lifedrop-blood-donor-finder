import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Hospital, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  Unlock, 
  ExternalLink,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function HospitalDashboard() {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/requests/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      addToast('Error loading requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadRequests();
  }, [token]);

  const handleMarkFulfilled = async (requestId) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Fulfilled' })
      });
      if (!res.ok) throw new Error('Failed to update');
      addToast('Request successfully marked as Fulfilled! 🎉', 'success');
      loadRequests();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading Hospital Coordination Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-brand-blue to-blue-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
            <Hospital className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {user?.name || 'Hospital Emergency Desk'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Active Hospital Coordinator • Emergency Patient Blood Requests
            </p>
          </div>
        </div>

        <Link
          to="/request-blood"
          className="px-6 py-3 rounded-2xl bg-white text-brand-blue hover:bg-blue-50 font-extrabold text-sm shadow-lg flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Emergency Request</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Broadcasted
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {requests.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Patient cases logged</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active / In-Flight
          </span>
          <div className="text-3xl font-black text-brand-red">
            {requests.filter(r => ['Pending', 'Accepted'].includes(r.status)).length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Urgent blood searches active</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Fulfilled &amp; Saved
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {requests.filter(r => r.status === 'Fulfilled').length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Completed transfusions</span>
        </div>
      </div>

      {/* My Requests List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Emergency Case Roster
            </h2>
            <p className="text-xs text-slate-500">
              Track donor responses, view unlocked contact details, and mark cases fulfilled.
            </p>
          </div>
          <button
            onClick={loadRequests}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6">
            <Activity className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No requests submitted yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Need blood units for surgery or ICU? Create a new emergency request to trigger the match engine.
            </p>
            <Link
              to="/request-blood"
              className="px-5 py-2.5 rounded-xl bg-brand-red text-white font-bold text-xs shadow-md"
            >
              Post First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-9 h-9 rounded-xl bg-brand-red text-white flex items-center justify-center font-black text-sm">
                      {req.blood_group}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Patient: {req.patient_name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === 'Fulfilled'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : req.status === 'Accepted'
                        ? 'bg-blue-100 text-brand-blue dark:bg-blue-950 dark:text-blue-300'
                        : req.status === 'Cancelled'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-red-100 text-brand-red animate-pulse'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {req.urgency}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                    <p><strong>Hospital:</strong> {req.hospital}, {req.city} • <strong>Units:</strong> {req.units}</p>
                    <p className="flex items-center gap-2">
                      <span><strong>Donors Alerted:</strong> {req.total_notified || 0}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">
                        <strong>Accepted:</strong> {req.total_accepted || 0}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={`/request/${req.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Tracker &amp; Contacts</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {req.status !== 'Fulfilled' && (
                    <button
                      onClick={() => handleMarkFulfilled(req.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Fulfilled</span>
                    </button>
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
