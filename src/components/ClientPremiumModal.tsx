import React from 'react';
import { 
  Crown, 
  X, 
  Check, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Headphones, 
  FileSpreadsheet, 
  Sparkles 
} from 'lucide-react';
import { CLIENT_PREMIUM_BENEFITS } from '../locales/translations';

interface ClientPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  isPremium: boolean;
  onActivatePremium: () => void;
}

export const ClientPremiumModal: React.FC<ClientPremiumModalProps> = ({
  isOpen,
  onClose,
  lang,
  isPremium,
  onActivatePremium
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const icons = [
    Zap,              // 1. أولوية الظهور
    Sparkles,         // 2. إشعارات فورية
    RefreshCw,        // 3. إلغاء مجاني
    Headphones,       // 4. دعم أولوي
    FileSpreadsheet   // 5. تقارير شهرية
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-amber-500/40 p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {isAr ? 'باقة الزبون المميز (رايح جاي VIP)' : 'Abonnement Client VIP'}
              </h3>
              <p className="text-[10px] text-amber-400 font-semibold">
                {isAr ? '5 مزايا حصرية لأصحاب الحمولات والتجار' : '5 avantages exclusifs pour vos expéditions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Advantages List */}
        <div className="py-4 space-y-2.5">
          {CLIENT_PREMIUM_BENEFITS.map((b, idx) => {
            const Icon = icons[idx] || Check;
            return (
              <div 
                key={b.id}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white">
                    {idx + 1}. {isAr ? b.titleAr : b.titleFr}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {isAr ? b.descAr : b.descFr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{isAr ? 'الاشتراك الشهري للتجار والشركات:' : 'Tarif mensuel pro :'}</span>
            <span className="font-mono font-bold text-amber-400 text-sm">2,500 دج / شهر</span>
          </div>

          <button
            onClick={() => {
              onActivatePremium();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isPremium
                ? (isAr ? 'أنت مشترك بالفعل في باقة VIP' : 'Vous êtes déjà abonné VIP')
                : (isAr ? 'تفعيل مزايا VIP الخمسة الآن' : 'Activer les 5 avantages VIP')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
