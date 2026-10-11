import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-full h-full rounded-3xl bg-red-100 dark:bg-red-950/60 text-brand-red flex items-center justify-center font-black text-4xl shadow-inner">
            404
          </div>
          <Droplet className="w-7 h-7 text-brand-red fill-brand-red absolute -top-2 -right-2 animate-bounce" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500">
          The requested medical record or page is not available. Please return to the homepage or search our voluntary donor directory.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/find-donor"
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Find a Donor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
