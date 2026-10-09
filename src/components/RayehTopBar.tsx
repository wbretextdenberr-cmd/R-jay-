import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  X, 
  Lock, 
  Truck, 
  Package
} from 'lucide-react';
import { User, UserRole, Language } from '../types';

interface RayehTopBarProps {
  user: User;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenProfile: () => void;
}

export const RayehTopBar: React.FC<RayehTopBarProps> = ({
  user,
  currentRole,
  onSwitchRole,
  lang,
  onToggleLang,
  onOpenProfile
}) => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  return (
    <>
      <header className="w-full bg-[#12151c]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        
        <button
          onClick={() => setShowSecurityModal(true)}
          className="relative group p-2 rounded-2xl bg-gradient-to-b from-[#221013] via-[#1a0a0c] to-[#0d0405] border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.35)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title={lang === 'ar' ? 'ميثاق الثقة والأمان' : 'Garantie de Sécurité & Confiance'}
        >
          <span className="absolute -inset-0.5 rounded-2xl bg-red-600/30 blur-sm animate-pulse -z-10" />
          <AlertTriangle className="w-5 h-5 text-red-500 fill-red-500/40 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              رايح <span className="text-emerald-400">جاي</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">Rayeh Jay</span>
          </div>

          <div className="mt-1 flex items-center bg-slate-900/90 p-0.5 rounded-full border border-slate-800 text-[10px] font-bold">
            <button
              onClick={() => onSwitchRole('client')}
              className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                currentRole === 'client'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>{lang === 'ar' ? 'زبون (حمولة)' : 'Client'}</span>
            </button>
            <button
              onClick={() => onSwitchRole('driver')}
              className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                currentRole === 'driver'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>{lang === 'ar' ? 'سائق (ناقل)' : 'Chauffeur'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="px-2 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-emerald-400 border border-slate-700/80 flex items-center gap-0.5 transition-colors"
            title="Changer la langue"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === 'ar' ? 'FR' : 'عربي'}</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="relative w-9 h-9 rounded-full ring-2 ring-emerald-500/80 hover:ring-emerald-400 p-0.5 bg-slate-800 overflow-hidden active:scale-95 transition-transform"
            title={lang === 'ar' ? 'الملف الشخصي والتوثيق' : 'Profil & Vérification'}
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-slate-950" />
          </button>
        </div>
      </header>

      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#161a23] border border-slate-800 p-5 shadow-2xl text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-500 shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">
                    {lang === 'ar' ? 'ميثاق الثقة والأمان' : 'Charte de Confiance & Sécurité'}
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    {lang === 'ar' ? 'منصة رايح جاي الموثوقة' : 'Plateforme Rayeh Jay Sécurisée'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-start gap-2.5">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-semibold text-emerald-200">
                  {lang === 'ar' 
                    ? 'كل هذه المعلومات تُخزّن في الخادم لحمايتك وحماية الزبون 🔒'
                    : 'Toutes ces informations sont stockées sur le serveur pour votre protection et celle du client 🔒'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'توثيق إلزامي للسائقين (NIN + رخصة السياقة + رخصة النقل)' : 'Vérification obligatoire des chauffeurs (NIN + permis + licence)'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'مؤشر موثوقية وتقييم حقيقي لمنع ترشيح أي محتال' : 'Score de fiabilité pour écarter tout fraudeur'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'الاتصال بالتراضي هاتفياً وتخفيض عادل للرحلة العائدة' : 'Négociation directe au téléphone avec tarif avantageux'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              {lang === 'ar' ? 'فهمت، شكراً' : 'Compris, merci'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
