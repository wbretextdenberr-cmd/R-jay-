import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Crown, 
  MapPin,
  Zap,
  XCircle
} from 'lucide-react';
import { User, DriverVerification, UserRole, Language, AvailableDriver } from '../types';

interface RayehProfileScreenProps {
  user: User;
  currentRole: UserRole;
  verification: DriverVerification;
  lang: Language;
  currentAvailability: AvailableDriver | null;
  onToggleLang: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenVerificationModal: () => void;
  onOpenPremiumModal: () => void;
  onSetUnavailable: () => void;
}

export const RayehProfileScreen: React.FC<RayehProfileScreenProps> = ({
  user,
  currentRole,
  verification,
  lang,
  currentAvailability,
  onToggleLang,
  onSwitchRole,
  onOpenVerificationModal,
  onOpenPremiumModal,
  onSetUnavailable
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full flex-1 flex flex-col p-4 pb-20 overflow-y-auto no-scrollbar space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#181d28] to-[#11141c] border border-slate-800 shadow-xl flex items-center gap-3.5">
        <div className="relative">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/80"
            referrerPolicy="no-referrer"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-sm text-white truncate">{user.name}</h3>
            {user.isPremium && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
          </div>
          <p className="text-xs font-mono text-emerald-400 mt-0.5">{user.phone}</p>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{user.wilaya} • الجزائر</span>
          </p>
        </div>
      </div>

      {/* ✅ كرت الإتاحة */}
      {currentRole === 'driver' && currentAvailability && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-amber-950/40 to-[#141822] border border-amber-500/50 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-current" />
              <h4 className="font-bold text-xs text-white">
                {isAr ? 'أنت متاح فارغ الآن' : 'Vous êtes disponible à vide'}
              </h4>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>{currentAvailability.from}</span>
              <span className="text-amber-400 font-mono">➜</span>
              <span>{currentAvailability.to}</span>
            </div>
            {currentAvailability.via.length > 0 && (
              <p className="text-[10px] text-slate-400">
                {isAr ? 'عبر: ' : 'Via: '}{currentAvailability.via.join(' ← ')}
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-mono">
              ⏰ {currentAvailability.departTime}
            </p>
          </div>

          <button
            onClick={onSetUnavailable}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>{isAr ? 'إلغاء الإتاحة (لن أظهر للزبائن)' : 'Désactiver ma disponibilité'}</span>
          </button>
        </div>
      )}

      <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center gap-2.5">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs font-bold text-emerald-300 leading-snug">
          {isAr 
            ? 'كل هذه المعلومات تُخزّن في الخادم لحمايتك وحماية الزبون 🔒' 
            : 'Toutes ces informations sont stockées sur le serveur 🔒'}
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-[#141822] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-xs text-white">
              {isAr ? 'ملف التوثيق الإلزامي للناقل' : 'Dossier de Vérification'}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {verification.reliabilityScore}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isAr ? 'NIN:' : 'N° NIN :'}</span>
            <span className="font-mono text-white font-semibold truncate block">{verification.ninNumber}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isAr ? 'رخصة السياقة:' : 'Permis :'}</span>
            <span className="font-mono text-white font-semibold truncate block">{verification.driverLicenseNumber}</span>
          </div>
        </div>

        <button
          onClick={onOpenVerificationModal}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          {isAr ? 'تعديل بيانات التوثيق' : 'Mettre à jour les documents'}
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-[#141822] border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-xs text-white">
              {isAr ? 'باقة VIP' : 'Abonnement VIP'}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            {user.isPremium ? (isAr ? 'مفعل' : 'Actif') : (isAr ? 'ترقية' : 'Upgrade')}
          </span>
        </div>

        <button
          onClick={onOpenPremiumModal}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
        >
          {isAr ? 'إدارة مزايا VIP' : 'Gérer mes avantages VIP'}
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-[#141822] border border-slate-800 shadow-xl space-y-2 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
          <span className="text-slate-300">{isAr ? 'لغة التطبيق' : 'Langue'}</span>
          <button
            onClick={onToggleLang}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-bold"
          >
            {isAr ? 'العربية (FR)' : 'Français (AR)'}
          </button>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
          <span className="text-slate-300">{isAr ? 'الوضع النشط' : 'Rôle actif'}</span>
          <span className="font-bold text-emerald-400">
            {currentRole === 'driver' ? (isAr ? 'سائق' : 'Chauffeur') : (isAr ? 'زبون' : 'Client')}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-slate-300">{isAr ? 'الإصدار' : 'Version'}</span>
          <span className="font-mono text-slate-400">Rayeh-Jay v1.0.0-DZ</span>
        </div>
      </div>

    </div>
  );
};
