import React from 'react';
import { UserCheck, Smartphone, Database, Hospital, BellRing, ArrowRight } from 'lucide-react';

export default function SystemArchitectureSvg() {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
          End-to-End Infrastructure
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          LifeDrop System Architecture
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Autonomous matching pipeline connecting life-saving donors and emergency rooms with a real-time notification loop.
        </p>
      </div>

      {/* Responsive Architecture Flow */}
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {/* Node 1: Donor Registration */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-red-50 to-white dark:from-red-950/20 dark:to-slate-800 border border-red-200/60 dark:border-red-900/40 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-lg shadow-red-500/30 mb-3">
              <UserCheck className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Donor</h4>
            <span className="text-xs font-medium text-brand-red dark:text-red-400 mb-1">Registration & Consent</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Volunteers register blood group, location & 90-day interval status.
            </p>
          </div>

          {/* Node 2: Web / Mobile App */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-800 border border-blue-200/60 dark:border-blue-900/40 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
              <Smartphone className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">2. Web/Mobile App</h4>
            <span className="text-xs font-medium text-brand-blue dark:text-blue-400 mb-1">Frontend Layer</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              React + Vite portal provides rapid emergency intake and masked browsing.
            </p>
          </div>

          {/* Node 3: Database & Engine */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-800 border border-purple-200/60 dark:border-purple-900/40 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
              <Database className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">3. Secure Database</h4>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">SQLite + Match Logic</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Encrypted storage computes compatibility rules & 90-day intervals.
            </p>
          </div>

          {/* Node 4: Hospital / Patient */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-800 border border-emerald-200/60 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
              <Hospital className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">4. Hospital / Patient</h4>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Search & Request</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Doctors submit emergency demand; contacts unlock upon acceptance.
            </p>
          </div>
        </div>

        {/* Feedback Loop Banner (Bottom notification bridge) */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-blue-500/10 border-2 border-dashed border-red-300 dark:border-red-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Feedback Loop: Notifications (SMS / Email / App)</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase font-mono">Live Dispatch</span>
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hospital requests trigger targeted broadcasts to matched donors. When accepted, hospital receives unlocked direct phone & coordinate info!
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-brand-red dark:text-red-400">
            <span>Donation Fulfilled</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
