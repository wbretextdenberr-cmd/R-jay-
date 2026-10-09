import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-400 text-xs px-4 py-1.5 flex items-center justify-between select-none z-50 border-b border-slate-800/60">
      <div className="flex items-center gap-1 font-semibold text-slate-300">
        <span>{currentTime || '12:00'}</span>
        <span className="text-[10px] text-amber-500 font-bold ml-1">4G+</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-slate-300">89%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
