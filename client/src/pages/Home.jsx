import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Droplet, 
  Search, 
  UserPlus, 
  Activity, 
  MapPin, 
  Users, 
  HeartHandshake, 
  ChevronDown, 
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle,
  Database,
  BellRing
} from 'lucide-react';
import BloodDropAnimation from '../components/BloodDropAnimation';
import SystemArchitectureSvg from '../components/SystemArchitectureSvg';
import CompatibilityChart from '../components/CompatibilityChart';

export default function Home() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalDonors: 50,
    citiesCount: 6,
    fulfilledRequests: 4,
    activeRequests: 4,
    availableDonors: 45
  });

  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.totalDonors !== undefined) {
          setStats(data);
        }
      })
      .catch(err => console.log('Stats fetch fallback:', err));
  }, []);

  const faqs = [
    {
      q: 'Who is eligible to donate blood on LifeDrop?',
      a: 'Any healthy individual aged 18 to 65 years, weighing at least 45 kg, with normal hemoglobin (>12.5 g/dL) is eligible. LifeDrop automatically verifies that at least 90 days have elapsed since your last whole blood donation before notifying you.'
    },
    {
      q: 'How often can I donate blood?',
      a: 'Healthy male donors can donate whole blood every 90 days (3 months), and female donors every 120 days (4 months). LifeDrop tracks your donation history and shows a live countdown to your next eligible date.'
    },
    {
      q: 'Is my personal contact information safe?',
      a: 'Yes, absolutely. By design, all donor phone numbers and emails are masked in search results. Your direct phone number is only revealed to an authorized hospital or patient coordinator after you explicitly accept their emergency blood request.'
    },
    {
      q: 'How does emergency matching work?',
      a: 'When an emergency request is lodged, LifeDrop identifies all compatible blood donors (using clinical compatibility rules) within that exact city who are currently available and eligible (>90 days interval). They immediately receive simulated SMS, Email, and in-app emergency alerts.'
    },
    {
      q: 'Are there any registration or service fees?',
      a: 'Never. LifeDrop is a 100% free, voluntary humanitarian platform. Voluntary blood donation is a selfless gift that saves lives.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Glow backdrop circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-red-500/10 via-brand-blue/5 to-purple-500/10 blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-brand-red dark:text-red-400 text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                <span>Zero External Accounts Needed • SQLite Embedded</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                &quot;Blood is to humans what{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-brand-blue">
                  water is to plants.
                </span>&quot;
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Red callout message */}
              <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-brand-red dark:text-red-400 font-bold text-sm sm:text-base flex items-center justify-center lg:justify-start gap-2.5">
                <Droplet className="w-5 h-5 fill-brand-red shrink-0" />
                <span>The right donor at the right time can save a life.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register-donor"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-brand-red hover:bg-brand-redHover text-white text-base shadow-xl shadow-red-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Become a Donor</span>
                </Link>

                <Link
                  to="/find-donor"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-brand-blue hover:text-brand-blue text-base shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5 text-brand-blue" />
                  <span>Find a Donor</span>
                </Link>

                <Link
                  to="/request-blood"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 hover:bg-red-200 text-base transition-colors flex items-center justify-center gap-2"
                >
                  <Activity className="w-5 h-5" />
                  <span>Emergency Request</span>
                </Link>
              </div>
            </div>

            {/* Right Droplet Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <BloodDropAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-brand-red flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {stats.totalDonors}+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Verified Donors
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-brand-blue flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {stats.citiesCount} Major Cities
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pan-India Network
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {stats.fulfilledRequests || 12} Lives Saved
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Requests Fulfilled
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                All 8 Groups
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Instant Smart Match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REAL-LIFE SITUATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
            Urgent Realities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Real-Life Situations Where Every Second Counts
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 font-medium">
            In accidents, surgeries, or critical illness, blood is needed immediately.
          </p>
          <div className="mt-2 text-brand-red font-bold text-base sm:text-lg">
            &quot;The right donor at the right time can save a life.&quot;
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Road accidents */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=600&q=80" 
                alt="Emergency Ambulance Response"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold">
                Golden Hour
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Road Accidents &amp; Trauma
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Severe crash victims suffer massive internal hemorrhage and often require 4 to 10 blood units within 60 minutes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-brand-red flex items-center justify-between">
                <span>Immediate O- / O+ Needed</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>

          {/* Card 2: Surgeries */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80" 
                alt="Hospital Operating Theater"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold">
                Cardiac &amp; Ortho
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Complex Surgeries
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Cardiovascular bypasses, liver transplants, and cancer tumors require dedicated reserve units on standby.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-brand-blue flex items-center justify-between">
                <span>Scheduled &amp; Emergency Standby</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>

          {/* Card 3: Critical Illness */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" 
                alt="Medical Laboratory Blood Analysis"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-bold">
                Thalassemia &amp; Dengue
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Critical Illness &amp; Platelets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Young thalassemia patients and acute dengue cases with crashing platelet counts depend on regular donor cycles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-purple-600 flex items-center justify-between">
                <span>Lifelong Transfusions</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>

          {/* Card 4: Emergency care */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80" 
                alt="Emergency ICU Medical Care"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold">
                Maternal Care
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Emergency Maternal Care
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Postpartum hemorrhage in new mothers requires prompt transfusion to protect both mother and newborn.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 flex items-center justify-between">
                <span>Life-Saving Response</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-brand-blue dark:text-blue-400 mb-2">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How LifeDrop Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            A frictionless 4-step pipeline designed to save minutes when life hangs in balance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-brand-red flex items-center justify-center font-black text-xl mb-4 shadow-inner">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Donor Registration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Volunteers enroll with verified blood type, city, and automated 90-day interval calculation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-brand-blue flex items-center justify-center font-black text-xl mb-4 shadow-inner">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Secure Database</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Donors are safely stored with masked contact numbers to safeguard privacy until verified acceptance.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black text-xl mb-4 shadow-inner">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Search &amp; Match</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Doctors search by patient blood group; clinical compatibility algorithm ranks nearest city donors.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black text-xl mb-4 shadow-inner">
              4
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Life-Saving Donation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Simulated SMS/Email alert is dispatched; donor accepts, unlocking direct coordination.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SYSTEM ARCHITECTURE SVG DIAGRAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SystemArchitectureSvg />
      </section>

      {/* 6. BLOOD GROUP COMPATIBILITY MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CompatibilityChart />
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Everything you need to know about donation protocols and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-brand-red transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-red' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-redDark via-brand-red to-red-600 p-8 sm:p-14 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle background drop pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Droplet className="w-80 h-80" />
          </div>

          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              Be A Hero Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Ready to Save Lives When It Matters Most?
            </h2>
            <p className="text-sm sm:text-base text-red-100">
              Join thousands of everyday heroes across India. Register in under 60 seconds and be on call for critical patient emergencies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
            <Link
              to="/register-donor"
              className="px-8 py-4 rounded-2xl font-bold bg-white text-brand-red hover:bg-red-50 text-base shadow-xl text-center transition-all hover:scale-105"
            >
              Register as Donor
            </Link>
            <Link
              to="/request-blood"
              className="px-8 py-4 rounded-2xl font-bold bg-brand-redDark/80 hover:bg-brand-redDark text-white border border-white/30 text-base text-center transition-all"
            >
              Post Emergency Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
