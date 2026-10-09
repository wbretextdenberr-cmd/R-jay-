import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Lock, 
  Crown, 
  Globe, 
  Smartphone,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { User, DriverVerification, UserRole, Language } from '../types';
import { VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface RayehProfileScreenProps {
  user: User;
  currentRole: UserRole;
  verification: DriverVerification;
  lang: Language;
  onToggleLang: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenVerificationModal: () => void;
  onOpenPremiumModal: () => void;
}

export const RayehProfileScreen: React.FC<RayehProfileScreenProps> = ({
  user,
  currentRole,
  verification,
  lang,
  onToggleLang,
  onSwitchRole,
  onOpenVerificationModal,
  onOpenPremiumModal
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full flex-1 flex flex-col p-4 pb-20 overflow-y-auto no-scrollbar space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. Profile Header Card */}
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
            {user.isPremium && (
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className="text-xs font-mono text-emerald-400 mt-0.5">{user.phone}</p>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{user.wilaya} • الجزائر</span>
          </p>
        </div>
      </div>

      {/* 2. Security Notice Box (Mandatory text) */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center gap-2.5">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs font-bold text-emerald-300 leading-snug">
          {isAr 
            ? 'كل هذه المعلومات تُخزّن في الخادم لحمايتك وحماية الزبون 🔒' 
            : 'Toutes ces informations sont stockées sur le serveur pour votre protection et celle du client 🔒'}
        </p>
      </div>

      {/* 3. Driver Mandatory Verification Section */}
      <div className="p-4 rounded-3xl bg-[#141822] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-xs text-white">
              {isAr ? 'ملف التوثيق الإلزامي للناقل' : 'Dossier de Vérification Chauffeur'}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {verification.reliabilityScore}% {isAr ? 'مؤشر الموثوقية' : 'Score'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isAr ? 'رقم التعريف الوطني (NIN):' : 'N° NIN :'}</span>
            <span className="font-mono text-white font-semibold truncate block">{verification.ninNumber}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isAr ? 'رقم رخصة السياقة:' : 'N° Permis :'}</span>
            <span className="font-mono text-white font-semibold truncate block">{verification.driverLicenseNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-slate-300">
            <span>{isAr ? 'رخصة النقل' : 'Licence'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-slate-300">
            <span>{isAr ? 'صور العربة والمقطورة' : 'Photos camion'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <button
          onClick={onOpenVerificationModal}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          {isAr ? 'تعديل بيانات التوثيق والوثائق' : 'Mettre à jour les documents'}
        </button>
      </div>

      {/* 4. Client Premium 5 Benefits Showcase */}
      <div className="p-4 rounded-3xl bg-[#141822] border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-xs text-white">
              {isAr ? 'باقة الزبون المميز (5 مزايا VIP)' : 'Abonnement Client VIP'}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            {user.isPremium ? (isAr ? 'مفعل' : 'Actif') : (isAr ? 'ترقية' : 'Upgrade')}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          {isAr 
            ? 'أولوية الظهور، إشعارات فورية، إلغاء مجاني ومرن، دعم أولوي 24/7، وتقارير شهرية شاملة.' 
            : 'Priorité, alertes push, annulation gratuite, support 24/7 et rapports mensuels.'}
        </p>

        <button
          onClick={onOpenPremiumModal}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
        >
          {isAr ? 'استعراض وإدارة مزايا VIP الخمسة' : 'Gérer mes avantages VIP'}
        </button>
      </div>

      {/* 5. App Settings & Identity */}
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
            {currentRole === 'driver' ? (isAr ? 'سائق (ناقل بضائع)' : 'Chauffeur') : (isAr ? 'زبون (صاحب حمولة)' : 'Client')}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-slate-300">{isAr ? 'إصدار أندرويد APK' : 'Version Android'}</span>
          <span className="font-mono text-slate-400">Rayeh-Jay v1.0.0-DZ</span>
        </div>
      </div>

    </div>
  );
};
