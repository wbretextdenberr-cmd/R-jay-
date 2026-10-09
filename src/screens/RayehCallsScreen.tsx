import React from 'react';
import { 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  Truck, 
  User, 
  Phone, 
  Coins, 
  ShieldCheck, 
  ArrowRight,
  Package
} from 'lucide-react';
import { CallRequest, UserRole, Language } from '../types';

interface RayehCallsScreenProps {
  calls: CallRequest[];
  currentRole: UserRole;
  lang: Language;
  onAcceptCall: (callId: string) => void;
}

export const RayehCallsScreen: React.FC<RayehCallsScreenProps> = ({
  calls,
  currentRole,
  lang,
  onAcceptCall
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full flex-1 flex flex-col p-4 pb-20 overflow-y-auto no-scrollbar space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white">
              {currentRole === 'driver' 
                ? (isAr ? 'طلبات الاتصال الواردة من الزبائن' : 'Demandes d\'appel reçues') 
                : (isAr ? 'متابعة الاتصال والتنسيق الهاتفي' : 'Mes demandes de mise en relation')}
            </h3>
            <p className="text-[10px] text-slate-400">
              {isAr ? 'تأكيد السائق ← كشف رقم الهاتف ← اتصال مباشر وتفاوض' : 'Confirmation chauffeur ← Révélation du numéro ← Négociation'}
            </p>
          </div>
        </div>
      </div>

      {/* Commission Reminder Rule */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-slate-300">
        <Coins className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="leading-snug">
          {isAr 
            ? 'الربح: مبلغ ثابت حسب صنف العربة يدفعه السائق فقط بعد تأكيد تنفيذ الطلب والتراضي هاتفياً.' 
            : 'Commission : forfait fixe selon le véhicule payé par le chauffeur après accord téléphonique.'}
        </p>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {calls.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <PhoneCall className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'لا توجد طلبات اتصال نشطة حالياً. عند ضغط الزبون على "اتصال" تظهر هنا فوراً.' 
                : 'Aucune demande active. Dès qu\'un client appuie sur "Appeler", elle s\'affiche ici.'}
            </p>
          </div>
        ) : (
          calls.map((call) => {
            const isPending = call.status === 'PENDING_DRIVER';
            const isAccepted = call.status === 'ACCEPTED_WAITING_CALL';

            return (
              <div 
                key={call.id}
                className="p-4 rounded-2xl bg-[#141822] border border-slate-800 shadow-lg space-y-3"
              >
                {/* Header Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAccepted 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  }`}>
                    {isAccepted 
                      ? (isAr ? 'تم القبول • في انتظار الاتصال' : 'Accepté • En attente d\'appel') 
                      : (isAr ? 'في انتظار تأكيد الناقل' : 'En attente confirmation chauffeur')}
                  </span>
                </div>

                {/* Cargo & Client Info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white">
                      {call.cargoType} ({call.cargoWeight})
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'الزبون:' : 'Client :'} <span className="text-slate-200 font-semibold">{call.clientName}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-1">
                      <span>{call.pickupWilaya}</span>
                      <span>➜</span>
                      <span>{call.dropoffWilaya}</span>
                    </div>
                  </div>
                </div>

                {/* If Driver Mode & Pending: Driver can click "اقبل" */}
                {currentRole === 'driver' && isPending && (
                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => onAcceptCall(call.id)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>{isAr ? 'أقبل الطلب' : 'Accepter'}</span>
                    </button>
                  </div>
                )}

                {/* If Driver Mode & Accepted: Driver sees "في انتظار اتصال الزبون" */}
                {currentRole === 'driver' && isAccepted && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-300 block">
                      {isAr ? 'في انتظار اتصال الزبون...' : 'En attente de l\'appel du client...'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {isAr 
                        ? 'لقد ظهر رقم هاتفك للزبون وسيصلك اتصاله خلال دقائق للتفاوض' 
                        : 'Votre numéro est visible pour le client, vous recevrez son appel incessamment'}
                    </span>
                  </div>
                )}

                {/* If Client Mode & Accepted: Client sees revealed phone number */}
                {currentRole === 'client' && isAccepted && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'رقم هاتف الناقل:' : 'Numéro du chauffeur :'}</span>
                      <a href={`tel:${call.driverPhone}`} className="text-sm font-black font-mono text-emerald-400 hover:underline">
                        {call.driverPhone}
                      </a>
                    </div>
                    <a
                      href={`tel:${call.driverPhone}`}
                      className="py-2 px-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isAr ? 'اتصل' : 'Appeler'}</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
