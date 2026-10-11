import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Droplet, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const POPULAR_CITIES = ['', 'Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Vijayawada'];

export default function FindDonor() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [available, setAvailable] = useState(searchParams.get('available') || '');
  const [eligible, setEligible] = useState(searchParams.get('eligible') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');

  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (bloodGroup) params.append('bloodGroup', bloodGroup);
      if (city) params.append('city', city);
      if (available) params.append('available', available);
      if (eligible) params.append('eligible', eligible);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      const res = await fetch(`/api/donors/search?${params.toString()}`);
      const data = await res.json();
      setDonors(data.donors || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, city, available, eligible, sort, page]);

  const handleReset = () => {
    setBloodGroup('');
    setCity('');
    setAvailable('');
    setEligible('');
    setSort('recent');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
            Active Registry
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Find Voluntary Blood Donors
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search verified donors by blood group, city, and real-time medical eligibility.
          </p>
        </div>

        {/* Create emergency request shortcut */}
        <Link
          to="/request-blood"
          className="px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Post Emergency Need</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={e => { setBloodGroup(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.filter(Boolean).map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              City / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Hyderabad, Bengaluru"
              value={city}
              onChange={e => { setCity(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Availability
            </label>
            <select
              value={available}
              onChange={e => { setAvailable(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Any Availability</option>
              <option value="true">Available Now Only</option>
            </select>
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              90-Day Eligibility
            </label>
            <select
              value={eligible}
              onChange={e => { setEligible(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All Donors</option>
              <option value="true">Eligible to Donate (90+ days)</option>
              <option value="false">In Cooldown (&lt; 90 days)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-red"
            >
              <option value="recent">Recently Active</option>
              <option value="city">Nearest City (Alphabetical)</option>
            </select>
          </div>
        </div>

        {/* Reset button & count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500">
            Showing {donors.length} of {total} registered donors
          </span>
          <button
            onClick={handleReset}
            className="text-brand-red hover:underline flex items-center gap-1 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : donors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Droplet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Donors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search criteria or create an emergency request so our dispatch engine can alert standby volunteers.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map(donor => (
            <div
              key={donor.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top card row: Name + Blood badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-red transition-colors">
                      {donor.displayName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{donor.city}, {donor.state}</span>
                      {donor.area && <span className="opacity-75">({donor.area})</span>}
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-redDark to-brand-red text-white flex flex-col items-center justify-center font-black text-sm shadow-md shadow-red-500/25 shrink-0">
                    <Droplet className="w-3.5 h-3.5 fill-white mb-0.5" />
                    <span>{donor.bloodGroup}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {donor.available ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Unavailable
                    </span>
                  )}

                  {donor.isEligible ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-brand-blue dark:bg-blue-950/60 dark:text-blue-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Eligible (90+ Days)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      <Clock className="w-3 h-3" />
                      Due in {donor.daysUntilEligible}d
                    </span>
                  )}
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Donated:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {donor.lastDonatedAt || 'First Time Volunteer'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Age / Gender:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {donor.age} yrs • {donor.gender}
                    </span>
                  </div>

                  {/* Masked Contact Details */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3 h-3" /> Phone:
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {donor.maskedPhone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Mail className="w-3 h-3" /> Email:
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {donor.maskedEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/request-blood?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&city=${encodeURIComponent(donor.city)}`}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-brand-red dark:hover:bg-brand-red text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Request Blood From This Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-semibold px-3 text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
