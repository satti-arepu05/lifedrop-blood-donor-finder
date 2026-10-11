import React from 'react';
import { Droplet, Heart, Sprout } from 'lucide-react';

export default function BloodDropAnimation() {
  return (
    <div className="relative flex items-center justify-center p-6 select-none">
      {/* Background radial glow */}
      <div className="absolute w-64 h-64 bg-gradient-to-tr from-red-500/20 via-blue-500/20 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Main Container */}
      <div className="relative z-10 flex items-center gap-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border border-red-100 dark:border-slate-800 shadow-xl">
        {/* Blood Droplet (Human) */}
        <div className="flex flex-col items-center group">
          <div className="relative w-20 h-24 flex items-center justify-center">
            {/* Animated SVG Blood Drop */}
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
              <defs>
                <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF5350" />
                  <stop offset="50%" stopColor="#D32F2F" />
                  <stop offset="100%" stopColor="#9A0007" />
                </linearGradient>
                <filter id="bloodGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M50,10 C50,10 85,60 85,85 A35,35 0 0,1 15,85 C15,60 50,10 50,10 Z"
                fill="url(#bloodGrad)"
                className="animate-drop-fall"
              />
              {/* Highlight curve */}
              <path
                d="M32,70 A20,20 0 0,1 45,45"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <Heart className="absolute bottom-5 w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-2 tracking-wide uppercase">
            Blood • Human
          </span>
        </div>

        {/* Dynamic Connector / Equivalence Symbol */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-lg shadow-inner">
            ≈
          </div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
            Life Force
          </span>
        </div>

        {/* Water Droplet (Plant) */}
        <div className="flex flex-col items-center group">
          <div className="relative w-20 h-24 flex items-center justify-center">
            {/* Animated SVG Water Drop */}
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#42A5F5" />
                  <stop offset="50%" stopColor="#1565C0" />
                  <stop offset="100%" stopColor="#0D47A1" />
                </linearGradient>
              </defs>
              <path
                d="M50,10 C50,10 85,60 85,85 A35,35 0 0,1 15,85 C15,60 50,10 50,10 Z"
                fill="url(#waterGrad)"
                className="animate-drop-fall [animation-delay:1s]"
              />
              <path
                d="M32,70 A20,20 0 0,1 45,45"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <Sprout className="absolute bottom-5 w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 tracking-wide uppercase">
            Water • Plant
          </span>
        </div>
      </div>
    </div>
  );
}
