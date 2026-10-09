import React from 'react';
import { Home, Compass, UserCheck, BellRing, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface RayehBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  activeCallsCount?: number;
}

export const RayehBottomNav: React.FC<RayehBottomNavProps> = ({
  currentTab,
  onSelectTab,
  lang,
  activeCallsCount = 0
}) => {
  const isAr = lang === 'ar';

  const items = [
    { 
      id: 'home', 
      labelAr: 'الرئيسية', 
      labelFr: 'Accueil', 
      icon: Home 
    },
    { 
      id: 'route_map', 
      labelAr: 'على طريقي', 
      labelFr: 'Sur ma route', 
      icon: Compass 
    },
    { 
      id: 'profile', 
      labelAr: 'حسابي', 
      labelFr: 'Mon Profil', 
      icon: UserCheck 
    },
    { 
      id: 'calls', 
      labelAr: 'الطلبات', 
      labelFr: 'Appels', 
      icon: BellRing,
      badge: activeCallsCount > 0 ? activeCallsCount : null 
    }
  ];

  return (
    <nav className="w-full bg-[#101319]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 sticky bottom-0 z-40 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'text-emerald-400 font-bold scale-105' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1.5 w-8 h-[2.5px] rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            )}

            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-transform ${
                  isActive 
                    ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]' 
                    : 'stroke-2'
                }`} 
              />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md shadow-rose-600/50">
                  {item.badge}
                </span>
              )}
            </div>

            <span className="text-[10.5px] mt-1 tracking-tight leading-none">
              {isAr ? item.labelAr : item.labelFr}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
