import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-brand-blue uppercase">
          Donor Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          Privacy &amp; Data Security Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Last updated: October 2026 • Compliant with Indian healthcare privacy standards
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-red" />
            1. Principle of Default Contact Masking
          </h2>
          <p>
            LifeDrop never sells, rents, or makes public voluntary donor contact numbers. When visitors search for donors on our public registry or search tools, personal phone numbers and email addresses are automatically masked (e.g. +91 98*** **45).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-brand-blue" />
            2. Explicit Consent Required for Contact Unlocking
          </h2>
          <p>
            When an emergency blood request is dispatched, matched donors receive notifications. A hospital or patient coordinator only receives the donor&apos;s direct phone number if the donor clicks &quot;Accept&quot; within their dashboard or notification prompt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            3. Data Retention &amp; Local Encryption
          </h2>
          <p>
            All account passwords are encrypted with bcrypt prior to database storage. Authentication is governed by signed JSON Web Tokens (JWT) with standard expiration. Donors can pause their availability or request full account deletion at any time.
          </p>
        </section>
      </div>
    </div>
  );
}
