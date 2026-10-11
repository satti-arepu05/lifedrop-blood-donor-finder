import React, { useState } from 'react';
import { Droplet, Info, Check, X } from 'lucide-react';

const BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

// Key: Recipient, Values: Can receive from
const CAN_RECEIVE_FROM = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

// Key: Donor, Values: Can donate to
const CAN_DONATE_TO = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

export default function CompatibilityChart() {
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [mode, setMode] = useState('recipient'); // 'recipient' or 'donor'

  const compatibleList = mode === 'recipient'
    ? (CAN_RECEIVE_FROM[selectedGroup] || [])
    : (CAN_DONATE_TO[selectedGroup] || []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-brand-red dark:text-red-400 mb-2">
            Clinical Compatibility
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Blood Group Compatibility Matrix
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any blood group to simulate emergency compatibility matching.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start">
          <button
            onClick={() => setMode('recipient')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'recipient'
                ? 'bg-brand-red text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            I am a Patient (Receiving)
          </button>
          <button
            onClick={() => setMode('donor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'donor'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            I am a Donor (Giving)
          </button>
        </div>
      </div>

      {/* Blood Group Pill Buttons */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-8">
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = selectedGroup === bg;
          return (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl font-bold text-base transition-all ${
                isSelected
                  ? 'bg-brand-red text-white shadow-lg shadow-red-500/25 scale-105'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Droplet className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-brand-red'}`} />
              <span>{bg}</span>
              {bg === 'O-' && <span className="text-[9px] mt-0.5 opacity-80 uppercase tracking-tighter">Univ. Donor</span>}
              {bg === 'AB+' && <span className="text-[9px] mt-0.5 opacity-80 uppercase tracking-tighter">Univ. Recip.</span>}
            </button>
          );
        })}
      </div>

      {/* Selected Result Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            {mode === 'recipient' ? 'Selected Patient Blood Group' : 'Selected Donor Blood Group'}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl font-black text-brand-red dark:text-red-400">
              {selectedGroup}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {mode === 'recipient'
                ? `Can safely receive from ${compatibleList.length} blood type(s):`
                : `Can safely donate to ${compatibleList.length} blood type(s):`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end">
          {compatibleList.map(bg => (
            <span
              key={bg}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              {bg}
            </span>
          ))}
        </div>
      </div>

      {/* Full Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <th className="p-3 sm:p-4 font-bold">Recipient Group (Patient)</th>
              {BLOOD_GROUPS.map(donor => (
                <th key={donor} className="p-3 sm:p-4 text-center font-bold">
                  {donor}
                  <span className="block text-[10px] font-normal text-slate-400">Donor</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {BLOOD_GROUPS.map(recipient => {
              const receivesFrom = CAN_RECEIVE_FROM[recipient] || [];
              const isCurrent = recipient === selectedGroup;
              return (
                <tr
                  key={recipient}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-red-50/60 dark:bg-red-950/20 font-bold'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-3 sm:p-4 flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-red inline-block" />
                    {recipient}
                    {recipient === 'AB+' && <span className="text-[10px] text-brand-blue font-semibold ml-1">(Universal Recipient)</span>}
                    {recipient === 'O-' && <span className="text-[10px] text-brand-red font-semibold ml-1">(Universal Donor)</span>}
                  </td>
                  {BLOOD_GROUPS.map(donor => {
                    const isMatch = receivesFrom.includes(donor);
                    return (
                      <td key={donor} className="p-3 sm:p-4 text-center">
                        {isMatch ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mx-auto">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helpful Clinical Legend */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-blue" />
          <span><strong>O Negative (O-)</strong> red blood cells can be given to all blood types (Universal Donor).</span>
        </div>
        <div>
          <span><strong>AB Positive (AB+)</strong> patients can receive red blood cells of any type (Universal Recipient).</span>
        </div>
      </div>
    </div>
  );
}
