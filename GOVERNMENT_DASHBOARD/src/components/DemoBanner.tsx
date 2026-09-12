import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white px-6 py-2.5 shadow-inner border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-extrabold text-emerald-400 uppercase tracking-widest text-[10px]">Command Centre Live</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">
          Smart India Hackathon — <em>“Accessibility & Quality of Public Healthcare Services in Rural Areas”</em>
        </span>
      </div>

      {/* USP Pipeline Indicator */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full text-[10px] font-black text-emerald-300 border border-slate-800">
        <span>DATA</span>
        <ArrowRight className="w-3 h-3 text-emerald-400" />
        <span>DETECTION</span>
        <ArrowRight className="w-3 h-3 text-emerald-400" />
        <span>PREDICTION</span>
        <ArrowRight className="w-3 h-3 text-emerald-400" />
        <span className="text-slate-950 bg-emerald-400 px-1.5 py-0.5 rounded font-black">ACTION</span>
      </div>
    </div>
  );
};

export const SyntheticDataFooter: React.FC = () => {
  return (
    <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 flex-shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <span>
          <strong className="text-amber-400 font-extrabold">DEMO / SYNTHETIC DATA NOTICE:</strong> All health metrics, patient numbers, and village indicators displayed are synthetic sample data prepared for <strong>Tamil Nadu → Salem District</strong>.
        </span>
      </div>
      <span className="font-mono text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-800/60 whitespace-nowrap">
        COMMAND SYSTEM PROTOTYPE
      </span>
    </div>
  );
};
