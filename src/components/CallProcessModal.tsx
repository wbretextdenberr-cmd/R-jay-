import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  ArrowRight,
  PhoneCall,
  User,
  MapPin,
  Coins
} from 'lucide-react';
import { ReturnTrip, CallRequest } from '../types';
import { VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface CallProcessModalProps {
  trip: ReturnTrip | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  clientName: string;
  clientPhone: string;
  onCallAgreed?: () => void;
}

export const CallProcessModal: React.FC<CallProcessModalProps> = ({
  trip,
  isOpen,
  onClose,
  lang,
  clientName,
  clientPhone,
  onCallAgreed
}) => {
  const [step, setStep] = useState<'CONFIRM_COMMISSION' | 'WAITING_DRIVER' | 'DRIVER_ACCEPTED' | 'CONNECTED'>('CONFIRM_COMMISSION');
  const [commissionAccepted, setCommissionAccepted] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setStep('CONFIRM_COMMISSION');
    }
  }, [isOpen]);

  if (!isOpen || !trip) return null;
  const isAr = lang === 'ar';
  const categoryInfo = VEHICLE_CATEGORIES_INFO[trip.vehicleCategory];

  const handleStartCallRequest = () => {
    // Step 2: In waiting driver state
    setStep('WAITING_DRIVER');

    // Simulate carrier receiving notification and accepting within 2.5 seconds
    setTimeout(() => {
      setStep('DRIVER_ACCEPTED');
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-slate-800 p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {isAr ? 'طلب اتصال وتنسيق الرحلة العائدة' : 'Mise en relation directe'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {trip.driverName} • {trip.vehicleName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Summary Card */}
        <div className="my-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <img
            src={trip.driverAvatar}
            alt={trip.driverName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/60"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white truncate">{trip.driverName}</h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {trip.reliabilityScore}% {isAr ? 'موثوقية' : 'Fiabilité'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{trip.vehicleName}</span>
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{isAr ? `الوصول التقديري: ${trip.estimatedArrivalTime}` : `Arrivée estimée: ${trip.estimatedArrivalTime}`}</span>
            </p>
          </div>
        </div>

        {/* STEP 1: Commission agreement & fair negotiation rule */}
        {step === 'CONFIRM_COMMISSION' && (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Coins className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'قواعد التفاوض والعمولة الثابتة:' : 'Règles de négociation & commission :'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                <li>
                  {isAr 
                    ? 'السعر بالتراضي هاتفياً: السائق عائد من مهمته فلك الحق في طلب تخفيض عادل ومناسب.' 
                    : 'Le prix se négocie au téléphone : le chauffeur rentre à vide, demandez une réduction équitable.'}
                </li>
                <li>
                  {isAr 
                    ? `عمولة المنصة: مبلغ ثابت قدره (${categoryInfo.fixedCommissionDzd} دج) يدفعه السائق فقط بعد تأكيد تنفيذ الطلب.` 
                    : `Commission plateforme : somme fixe (${categoryInfo.fixedCommissionDzd} DZD) payée par le transporteur uniquement après accord.`}
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={commissionAccepted}
                onChange={(e) => setCommissionAccepted(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-xs text-slate-200 font-medium">
                {isAr ? 'أوافق على الشروط وآلية الاتصال المباشر' : 'J\'accepte les conditions et la mise en relation'}
              </span>
            </label>

            <button
              disabled={!commissionAccepted}
              onClick={handleStartCallRequest}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                commissionAccepted
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-98 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{isAr ? 'إرسال طلب الاتصال للناقل الآن' : 'Envoyer la demande d\'appel'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: Waiting for driver confirmation */}
        {step === 'WAITING_DRIVER' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">
                {isAr ? 'في انتظار تأكيد الناقل...' : 'En attente de confirmation du transporteur...'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {isAr 
                  ? `تم إرسال إشعار فوري إلى ${trip.driverName} على هاتفه. بمجرد ضغطه على "أقبل"، سيظهر لك رقم هاتفه المباشر.` 
                  : `Notification transmise à ${trip.driverName}. Son numéro s'affichera dès acceptation.`}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Driver accepted -> Reveal driver's direct phone number */}
        {step === 'DRIVER_ACCEPTED' && (
          <div className="py-3 space-y-4 animate-slide-up">
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-black text-sm text-emerald-300">
                {isAr ? 'وافق الناقل على طلبك بنجاح!' : 'Demande acceptée par le chauffeur !'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {isAr ? 'الناقل في انتظار اتصالك الهاتفي الآن:' : 'Le chauffeur attend votre appel téléphonique :'}
              </p>
            </div>

            {/* Revealed Phone Box (Exclusive to client) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/60 text-center space-y-2">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                {isAr ? 'رقم هاتف الناقل المباشر' : 'Numéro direct du chauffeur'}
              </span>
              <a
                href={`tel:${trip.driverPhone.replace(/\s+/g, '')}`}
                className="text-2xl font-black font-mono tracking-wider text-emerald-400 block hover:underline active:scale-95 transition-transform"
              >
                {trip.driverPhone}
              </a>
              <span className="text-[10px] text-slate-400 block">
                {isAr ? 'اضغط على الرقم للاتصال الفوري والتفاوض بالتراضي' : 'Cliquez pour composer et négocier le tarif'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-400 inline ml-1 mr-1" />
              {isAr 
                ? 'إذا لم تتفقا على السعر أو الوقت، يمكنك بكل بساطة إغلاق هذا الحوار والاتصال بسائق آخر في القائمة.' 
                : 'En cas de désaccord, vous pouvez contacter un autre chauffeur de la liste sans frais.'}
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${trip.driverPhone.replace(/\s+/g, '')}`}
                onClick={() => {
                  if (onCallAgreed) onCallAgreed();
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{isAr ? 'اتصل الآن' : 'Appeler maintenant'}</span>
              </a>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
