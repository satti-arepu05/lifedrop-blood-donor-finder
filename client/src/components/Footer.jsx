import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PhoneCall, Mail, MapPin, Heart, Shield, Award, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-redDark to-brand-red flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Life<span className="text-brand-red">Drop</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              &quot;Blood is to humans what water is to plants.&quot; LifeDrop is an emergency matching ecosystem dedicated to eradicating blood shortages and saving critical lives across India.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-bold">
                <PhoneCall className="w-4 h-4 text-brand-red animate-pulse" />
                <span>24/7 Helpline: 1800-LIFEDROP (543 337)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/find-donor" className="hover:text-white transition-colors">Find a Donor</Link></li>
              <li><Link to="/register-donor" className="hover:text-white transition-colors">Become a Donor</Link></li>
              <li><Link to="/request-blood" className="hover:text-white transition-colors">Emergency Request</Link></li>
              <li><Link to="/data" className="hover:text-white transition-colors">Public Registry</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Hospital Login</Link></li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Eligibility</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Age 18–65 years</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Weight &gt; 45 kg</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> 90 days interval</li>
              <li className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-brand-blue" /> Masked donor privacy</li>
              <li><Link to="/about" className="hover:text-white transition-colors text-xs text-brand-red">Read full criteria &rarr;</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About LifeDrop</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><span className="text-xs text-emerald-400 font-medium">Auto-seeding local SQLite</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LifeDrop Foundation. &quot;The right donor at the right time can save a life.&quot;</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red inline mx-0.5" />
            <span>for emergency healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
