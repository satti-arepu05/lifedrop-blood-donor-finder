import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Download, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Bell, 
  RefreshCw, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const PIE_COLORS = ['#D32F2F', '#1565C0', '#2E7D32', '#ED6C02', '#9C27B0', '#0288D1', '#7B1FA2', '#00796B'];

export default function AdminPanel() {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'donors' | 'requests' | 'notifications'
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state for donors
  const [donorSearch, setDonorSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');

  const loadAllAdminData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Donors
      const donorsRes = await fetch('/api/admin/donors', { headers });
      const donorsData = await donorsRes.json();
      setDonors(Array.isArray(donorsData) ? donorsData : []);

      // 3. Requests
      const reqRes = await fetch('/api/admin/requests', { headers });
      const reqData = await reqRes.json();
      setRequests(Array.isArray(reqData) ? reqData : []);

      // 4. Notifications
      const notifRes = await fetch('/api/admin/notifications', { headers });
      const notifData = await notifRes.json();
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } catch (err) {
      console.error(err);
      addToast('Error fetching admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadAllAdminData();
  }, [token]);

  const handleToggleVerify = async (donorId, currentVerified) => {
    try {
      const nextVerified = currentVerified ? 0 : 1;
      const res = await fetch(`/api/admin/donors/${donorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ verified: nextVerified })
      });
      if (!res.ok) throw new Error('Failed to update status');
      addToast(`Donor ${nextVerified ? 'Verified' : 'Suspended'}`, 'success');
      setDonors(prev => prev.map(d => d.id === donorId ? { ...d, verified: nextVerified } : d));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteDonor = async (donorId) => {
    if (!window.confirm('Are you sure you want to delete this donor and their account?')) return;
    try {
      const res = await fetch(`/api/admin/donors/${donorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      addToast('Donor deleted from system', 'success');
      setDonors(prev => prev.filter(d => d.id !== donorId));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch('/api/admin/export/donors.csv', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifedrop_donors_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      addToast('CSV export downloaded successfully', 'success');
    } catch (err) {
      addToast('Failed to export CSV', 'error');
    }
  };

  const filteredDonors = donors.filter(d => {
    const matchesSearch = !donorSearch || 
      d.name?.toLowerCase().includes(donorSearch.toLowerCase()) || 
      d.email?.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.phone?.includes(donorSearch);
    const matchesCity = !cityFilter || d.city?.toLowerCase() === cityFilter.toLowerCase();
    const matchesBlood = !bloodGroupFilter || d.blood_group === bloodGroupFilter;
    return matchesSearch && matchesCity && matchesBlood;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading Central Administrator Control Hub...</p>
      </div>
    );
  }

  const bloodGroupChartData = (stats?.bloodGroups || []).map(b => ({
    name: b.blood_group,
    count: b.count
  }));

  const topCitiesChartData = (stats?.topCities || []).map(c => ({
    name: c.city,
    donors: c.count
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              LifeDrop Central Administration
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Mission Control • System Analytics, Donor Governance, &amp; Dispatch Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportCsv}
            className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Export Donors CSV</span>
          </button>
          <button
            onClick={loadAllAdminData}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 System Overview &amp; Analytics
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'donors'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🩸 Donor Management ({donors.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🚨 Requests Roster ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'notifications'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🔔 Notification Logs ({notifications.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Donors</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalDonors}</span>
              <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">● 100% Verified SQLite Data</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Cities Covered</span>
              <span className="text-3xl font-black text-brand-blue">{stats?.citiesCount}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Major Indian Metros</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Requests</span>
              <span className="text-3xl font-black text-brand-red">{stats?.totalRequests}</span>
              <span className="text-[11px] text-brand-red block mt-1 font-semibold">{stats?.activeRequests} Active in ICU</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Fulfilled Donations</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.fulfilledRequests}</span>
              <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">Lives Saved</span>
            </div>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blood Groups Distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-card space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Donors by Blood Group Distribution
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bloodGroupChartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="count" fill="#D32F2F" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* City Distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-card space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Top Cities Donor Density
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCitiesChartData} layout="vertical">
                    <XAxis type="number" stroke="#888888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={80} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="donors" fill="#1565C0" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DONOR MANAGEMENT TABLE */}
      {activeTab === 'donors' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Registered Donors Directory
              </h2>
              <p className="text-xs text-slate-500">
                Full unmasked administration view. Verify, suspend, or manage donor eligibility.
              </p>
            </div>

            {/* Search input */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name, phone, email..."
                  value={donorSearch}
                  onChange={e => setDonorSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold">ID</th>
                  <th className="p-3 font-bold">Donor Name</th>
                  <th className="p-3 font-bold">Blood Group</th>
                  <th className="p-3 font-bold">Contact Details</th>
                  <th className="p-3 font-bold">Location</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDonors.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-400">#{d.id}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {d.name}
                      <span className="block text-[11px] font-normal text-slate-400">{d.gender}, {d.age} yrs</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/80 text-brand-red font-black text-xs">
                        {d.blood_group}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <div>{d.phone}</div>
                      <div className="text-slate-400">{d.email}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {d.city}, {d.state}
                      {d.area && <span className="block text-[10px] text-slate-400">{d.area}</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.verified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800'
                        }`}>
                          {d.verified ? 'Verified' : 'Suspended'}
                        </span>
                        <span className={`text-[10px] font-semibold ${d.available ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {d.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleVerify(d.id, d.verified)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            d.verified ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title={d.verified ? 'Suspend Donor' : 'Verify Donor'}
                        >
                          {d.verified ? 'Suspend' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDeleteDonor(d.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete Donor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REQUESTS ROSTER */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Blood Emergency Requests ({requests.length})
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold">ID</th>
                  <th className="p-3 font-bold">Patient</th>
                  <th className="p-3 font-bold">Group &amp; Units</th>
                  <th className="p-3 font-bold">Hospital &amp; City</th>
                  <th className="p-3 font-bold">Requester</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-400">#{r.id}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {r.patient_name}
                      <span className={`block text-[10px] font-semibold ${r.urgency === 'Critical' ? 'text-brand-red' : 'text-amber-600'}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-brand-red">{r.blood_group}</span> ({r.units} units)
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {r.hospital}, {r.city}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {r.requester_name}
                      <span className="block text-[10px] text-slate-400">{r.contact_phone}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'Accepted' ? 'bg-blue-100 text-brand-blue' :
                        r.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-brand-red'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`/request/${r.id}`}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-blue font-bold hover:underline"
                      >
                        Tracker
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS LOG */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Audit Trail: SMS / Email / App Dispatches
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {notifications.map(n => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase font-bold">
                      {n.channel}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{n.created_at}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                <div className="mt-1 text-[11px] text-slate-400">
                  Recipient User: <strong>{n.user_name}</strong> ({n.user_email})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
