import React from 'react';
import { Truck, Layers, Bus, Construction, Check } from 'lucide-react';
import { VehicleCategory } from '../types';

interface AutomotiveGridButtonsProps {
  selectedCategory: VehicleCategory | 'ALL';
  onSelectCategory: (category: VehicleCategory | 'ALL') => void;
  lang: 'ar' | 'fr';
}

export const AutomotiveGridButtons: React.FC<AutomotiveGridButtonsProps> = ({
  selectedCategory,
  onSelectCategory,
  lang
}) => {
  const isAr = lang === 'ar';

  const buttons = [
    {
      id: 'B_LIGHT' as VehicleCategory,
      titleAr: 'نقل البضائع',
      titleFr: 'Fret de Marchandises',
      subAr: 'شاحنات B و C1 و C2',
      subFr: 'Poids légers & lourds',
      ledColor: 'emerald', // Top-left Green (matching screenshot)
      icon: (
        <svg className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" viewBox="0 0 64 64" fill="none">
          {/* Heavy flatbed / commercial tow truck icon with chrome bevels */}
          <rect x="6" y="24" width="22" height="24" rx="4" fill="url(#metalGrad)" stroke="#34d399" strokeWidth="2" />
          <path d="M28 32h14l8 8v8H28V32z" fill="url(#metalGrad2)" stroke="#34d399" strokeWidth="2" />
          <rect x="8" y="28" width="12" height="8" rx="2" fill="#10b981" fillOpacity="0.4" stroke="#6ee7b7" strokeWidth="1" />
          {/* Crane / Tow arm */}
          <path d="M12 24L24 10l18 6" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="42" cy="16" r="3" fill="#10b981" stroke="#fff" strokeWidth="1" />
          {/* Wheels */}
          <circle cx="16" cy="48" r="6" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="16" cy="48" r="2.5" fill="#e2e8f0" />
          <circle cx="36" cy="48" r="6" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="36" cy="48" r="2.5" fill="#e2e8f0" />
          <circle cx="46" cy="48" r="6" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="46" cy="48" r="2.5" fill="#e2e8f0" />
          <defs>
            <linearGradient id="metalGrad" x1="6" y1="24" x2="28" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#475569" />
              <stop offset="0.5" stopColor="#1e293b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="metalGrad2" x1="28" y1="32" x2="50" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#334155" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'PORTE_CHAR' as VehicleCategory,
      titleAr: 'عتاد ثقيل',
      titleFr: 'Engins & Porte-Char',
      subAr: 'بورت شار وجرافات',
      subFr: 'Pelles & Travaux',
      ledColor: 'red', // Top-right Red (matching screenshot)
      icon: (
        <svg className="w-12 h-12 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" viewBox="0 0 64 64" fill="none">
          {/* Crossed heavy tools & mechanical gear */}
          <path d="M14 48L46 16M48 14c2-2 6-1 8 1s3 6 1 8L50 26l-6-6 3-3zM18 52l-4 4-6-6 4-4 6 6z" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="url(#redMetalGrad)" />
          <path d="M46 48L14 16M14 14c-2-2-6-1-8 1s-3 6-1 8l7 3 6-6-3-3zM48 52l4 4 6-6-4-4-6 6z" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="url(#redMetalGrad)" />
          <circle cx="32" cy="32" r="5" fill="#881337" stroke="#fda4af" strokeWidth="1.5" />
          <defs>
            <linearGradient id="redMetalGrad" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e11d48" />
              <stop offset="0.7" stopColor="#4c0519" />
              <stop offset="1" stopColor="#1c0309" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'E_TRAILER' as VehicleCategory,
      titleAr: 'شاحنة بمقطورة',
      titleFr: 'Semi-Remorque (E)',
      subAr: 'حاويات وسيمي 40T',
      subFr: 'Trajets longue distance',
      ledColor: 'emerald', // Bottom-left Green (matching screenshot)
      icon: (
        <svg className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" viewBox="0 0 64 64" fill="none">
          {/* Fuel dispenser / Long container cargo trailer */}
          <rect x="10" y="16" width="30" height="28" rx="3" fill="url(#greenMetalGrad)" stroke="#34d399" strokeWidth="2" />
          {/* Container ribs */}
          <path d="M16 18v24M22 18v24M28 18v24M34 18v24" stroke="#6ee7b7" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Cabin head */}
          <path d="M40 26h12l6 7v11H40V26z" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
          {/* Wheels */}
          <circle cx="16" cy="48" r="5.5" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
          <circle cx="26" cy="48" r="5.5" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
          <circle cx="50" cy="48" r="5.5" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
          <defs>
            <linearGradient id="greenMetalGrad" x1="10" y1="16" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#334155" />
              <stop offset="0.6" stopColor="#1e293b" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'B_PASSENGER' as VehicleCategory,
      titleAr: 'نقل الأشخاص',
      titleFr: 'Transport Voyageurs',
      subAr: 'فان وحافلات (B / D)',
      subFr: 'Navettes & Minibus',
      ledColor: 'red', // Bottom-right Red (matching screenshot)
      icon: (
        <svg className="w-12 h-12 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" viewBox="0 0 64 64" fill="none">
          {/* Wheel & Spanner luxury emblem */}
          <circle cx="32" cy="32" r="18" fill="url(#wheelGrad)" stroke="#fb7185" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="11" fill="#4c0519" stroke="#fda4af" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="5" fill="#fff" />
          {/* Rims */}
          <path d="M32 14v7M32 43v7M14 32h7M43 32h7M20 20l5 5M39 39l5 5M20 44l5-5M39 25l5-5" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          {/* Side wrench */}
          <path d="M46 12l6 6-12 12-4-2-2-4 12-12z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1.5" />
          <defs>
            <linearGradient id="wheelGrad" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="0.7" stopColor="#0f172a" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full px-4 py-3">
      {/* 2x2 Tactile Automotive Cockpit Button Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 max-w-sm mx-auto">
        {buttons.map((btn) => {
          const isSelected = selectedCategory === btn.id;
          const isEmerald = btn.ledColor === 'emerald';

          return (
            <button
              key={btn.id}
              onClick={() => onSelectCategory(isSelected ? 'ALL' : btn.id)}
              className={`group relative rounded-[28px] p-3 sm:p-4 aspect-square flex flex-col items-center justify-between transition-all duration-200 active:scale-95 cursor-pointer select-none text-center ${
                /* Metallic outer frame styling */
                'bg-gradient-to-b from-[#2b303c] via-[#1a1e27] to-[#101319]'
              } ${
                /* Outer border with chrome bevel */
                'border-[2.5px] border-[#3a4150] shadow-[0_12px_24px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.15)]'
              } ${
                isSelected ? 'ring-2 ring-emerald-400 scale-[1.02]' : ''
              }`}
            >
              {/* Inner Beveled Recess Container */}
              <div className="absolute inset-1.5 rounded-[22px] bg-gradient-to-b from-[#12151c] to-[#0a0c10] border border-black/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] pointer-events-none" />

              {/* Four Edge Glowing Neon Tubes (Faithfully matching the reference photo) */}
              {isEmerald ? (
                <>
                  {/* Top neon tube */}
                  <span className="absolute top-1 left-6 right-6 h-[3px] rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] opacity-90 group-hover:opacity-100" />
                  {/* Bottom neon tube */}
                  <span className="absolute bottom-1 left-6 right-6 h-[3px] rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] opacity-90 group-hover:opacity-100" />
                  {/* Left neon tube */}
                  <span className="absolute top-6 bottom-6 left-1 w-[3px] rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] opacity-90 group-hover:opacity-100" />
                  {/* Right neon tube */}
                  <span className="absolute top-6 bottom-6 right-1 w-[3px] rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] opacity-90 group-hover:opacity-100" />
                </>
              ) : (
                <>
                  {/* Top neon tube */}
                  <span className="absolute top-1 left-6 right-6 h-[3px] rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] opacity-90 group-hover:opacity-100" />
                  {/* Bottom neon tube */}
                  <span className="absolute bottom-1 left-6 right-6 h-[3px] rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] opacity-90 group-hover:opacity-100" />
                  {/* Left neon tube */}
                  <span className="absolute top-6 bottom-6 left-1 w-[3px] rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] opacity-90 group-hover:opacity-100" />
                  {/* Right neon tube */}
                  <span className="absolute top-6 bottom-6 right-1 w-[3px] rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] opacity-90 group-hover:opacity-100" />
                </>
              )}

              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-20 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Icon Container with Floating Depth */}
              <div className="relative z-10 flex-1 flex items-center justify-center pt-2">
                <div className="transform transition-transform group-hover:scale-105 group-active:scale-95">
                  {btn.icon}
                </div>
              </div>

              {/* Text Label Underneath Icon (High legibility Arabic title) */}
              <div className="relative z-10 w-full pt-1 pb-0.5">
                <span className="block text-sm font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                  {isAr ? btn.titleAr : btn.titleFr}
                </span>
                <span className="block text-[9.5px] font-medium text-slate-400 leading-tight mt-0.5 truncate">
                  {isAr ? btn.subAr : btn.subFr}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
