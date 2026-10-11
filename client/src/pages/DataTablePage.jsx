import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Droplet, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export default function DataTablePage() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const fetchPublicDonors = async () => {
    try {
      const res = await fetch('/api/donors');
      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDonors();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filtered = donors
    .filter(d => {
      const term = search.toLowerCase();
      return (
        d.displayName?.toLowerCase().includes(term) ||
        d.bloodGroup?.toLowerCase().includes(term) ||
        d.city?.toLowerCase().includes(term) ||
        d.state?.toLowerCase().includes(term) ||
        String(d.id).includes(term)
      );
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'id') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
            Public Demo Registry
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            LifeDrop Donors Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time public audit table with privacy-masked names and clinical eligibility.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by ID, name, blood, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm shadow-sm focus:ring-2 focus:ring-brand-red"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading public registry records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <th onClick={() => handleSort('id')} className="p-4 font-bold cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Donor ID</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('displayName')} className="p-4 font-bold cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Name (Masked)</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('bloodGroup')} className="p-4 font-bold cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Blood Group</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('city')} className="p-4 font-bold cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>City &amp; State</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('lastDonatedAt')} className="p-4 font-bold cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Last Donated</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </th>
                  <th className="p-4 font-bold">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-400">#{d.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {d.displayName}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-100 dark:bg-red-950/80 text-brand-red font-black text-xs">
                        <Droplet className="w-3 h-3 fill-brand-red" />
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {d.city}, {d.state}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {d.lastDonatedAt || 'Never (First-time volunteer)'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {d.available ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Unavailable
                          </span>
                        )}
                        {d.isEligible ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand-blue dark:bg-blue-950/60 dark:text-blue-300">
                            90+ d Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                            In Cooldown
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Displaying {filtered.length} public records</span>
          <span>Privacy Mode Active: Personal details masked until request acceptance</span>
        </div>
      </div>
    </div>
  );
}
