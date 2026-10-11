import React from 'react';
import { FileText, Heart, Shield } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
          Platform Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          Terms of Voluntary Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Effective October 2026 • Non-Commercial Humanitarian Framework
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Strict Prohibition of Commercial Blood Trade
          </h2>
          <p>
            Under the National Blood Policy of India, the sale and purchase of human blood is strictly illegal and prohibited. LifeDrop is a 100% voluntary, free-of-cost matching platform. Any attempt to solicit commercial remuneration will result in immediate suspension and law enforcement notification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Donor Health &amp; Clinical Eligibility
          </h2>
          <p>
            Donors must verify that they are in good health, between 18 and 65 years of age, and adhere strictly to the 90-day whole blood interval. Donors should never donate while febrile, experiencing acute infection, or taking prohibited medications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Hospital Medical Screening Obligation
          </h2>
          <p>
            LifeDrop facilitates rapid voluntary contact matching. The recipient hospital or licensed blood bank remains solely responsible for mandatory blood testing (HIV, Hepatitis B/C, Syphilis, Malaria) and cross-matching prior to transfusion.
          </p>
        </section>
      </div>
    </div>
  );
}
