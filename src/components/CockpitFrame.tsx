import React, { ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { IMG } from '../assets';

interface CockpitFrameProps {
  children: ReactNode;
  isCockpitView: boolean;
  onToggleView: () => void;
  lang: 'ar' | 'fr';
}

export const CockpitFrame: React.FC<CockpitFrameProps> = ({
  children,
  isCockpitView,
  onToggleView,
  lang
}) => {
  if (!isCockpitView) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {/* Floating Quick View Switcher */}
        <div className="fixed top-2 left-2 z-50">
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-emerald-400 border border-slate-700/80 text-xs backdrop-blur-md shadow-lg transition-all"
            title={lang === 'ar' ? 'عرض داخل مقصورة القيادة' : 'Vue habitacle cockpit'}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{lang === 'ar' ? 'عرض المقصورة' : 'Mode Cockpit'}</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-slate-950 select-none">
      {/* Cinematic Automotive Dashboard Background (From Generated Asset) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 pointer-events-none filter blur-[1.5px]"
        style={{
          backgroundImage: `url(${IMG.cockpit})`
        }}
      />
      {/* Vignette Overlay & Cockpit Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80 pointer-events-none" />

      {/* Floating Control Bar for Frame Options */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={onToggleView}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold backdrop-blur-md shadow-xl transition-all"
        >
          <Monitor className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ar' ? 'ملء الشاشة' : 'Plein écran'}</span>
        </button>
      </div>

      {/* Smartphone Chassis Frame (Echoing the reference image) */}
      <div className="relative z-10 w-full max-w-[420px] h-[890px] max-h-[96vh] rounded-[48px] p-3.5 bg-gradient-to-b from-[#2a2d34] via-[#15171c] to-[#0c0e12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.12)] border-[3px] border-[#3e434d]/60 flex flex-col overflow-hidden">
        
        {/* Metal Phone Edge Highlights */}
        <div className="absolute inset-[1px] rounded-[46px] border border-white/10 pointer-events-none" />

        {/* Top Speaker Ear-piece & Front Camera Notch */}
        <div className="w-full flex items-center justify-center pt-1.5 pb-1 relative z-30">
          <div className="h-4 w-28 bg-[#090b0e] rounded-full border border-white/5 flex items-center justify-center px-3 gap-2">
            <div className="w-8 h-1 rounded-full bg-slate-700/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#111622] border border-slate-700/60" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 w-full rounded-[36px] overflow-hidden bg-[#0e1117] flex flex-col relative border border-white/5 shadow-inner">
          <AndroidStatusBar />
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {children}
          </div>
          {/* iOS / Android Home Swipe Bar Indicator */}
          <div className="w-full py-1.5 bg-[#090b0e] flex items-center justify-center">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
