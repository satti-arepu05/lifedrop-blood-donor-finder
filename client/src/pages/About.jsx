import React from 'react';
import { Droplet, Heart, Shield, Award, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-brand-red uppercase tracking-wider">
          Our Humanitarian Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Saving Lives Through Swift, Transparent Blood Matching
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          &quot;Blood is to humans what water is to plants.&quot; LifeDrop was established with a single goal: to ensure no patient loses their life due to the unavailability of matching blood during the golden hour.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-brand-red flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            A zero-shortage India where every emergency room and rural healthcare center can summon verified donors in under 30 minutes.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy by Default</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Donor contact details remain strictly masked and protected. Donors only share their phone numbers when they voluntarily accept an alert.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clinical Integrity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our automated 90-day cooldown rules protect donor health, preventing premature repeat donations and ensuring red blood cell safety.
          </p>
        </div>
      </div>
    </div>
  );
}
