import React, { ReactNode } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';

interface CockpitFrameProps {
  children: ReactNode;
  lang: 'ar' | 'fr';
}

export const CockpitFrame: React.FC<CockpitFrameProps> = ({
  children,
  lang
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <AndroidStatusBar />
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {children}
      </div>
    </div>
  );
};
