import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Filter, 
  Navigation, 
  Coins, 
  ShieldCheck, 
  Coffee,
  AlertCircle,
  PlusCircle,
  Crown,
  Zap
} from 'lucide-react';
import { ReturnTrip, VehicleCategory, User, UserRole, Language, AvailableDriver } from '../types';
import { AutomotiveGridButtons } from '../components/AutomotiveGridButtons';
import { WILAYAS, VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface RayehHomeScreenProps {
  user: User;
  currentRole: UserRole;
  lang: Language;
  returnTrips: ReturnTrip[];
  availableDrivers: AvailableDriver[];
  activeDriverTrip: ReturnTrip | null;
  onOpenSmartSuggest: () => void;
  onOpenDriverTripModal: () => void;
  onOpenAvailableModal: () => void;
  onOpenCallModal: (trip: ReturnTrip) => void;
  onOpenPremiumModal: () => void;
  onOpenVerificationModal: () => void;
}

export const RayehHomeScreen: React.FC<RayehHomeScreenProps> = ({
  user,
  currentRole,
  lang,
  returnTrips,
  availableDrivers,
  activeDriverTrip,
  onOpenSmartSuggest,
  onOpenDriverTripModal,
  onOpenAvailableModal,
  onOpenCallModal,
  onOpenPremiumModal,
  onOpenVerificationModal
}) => {
  const isAr = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'ALL'>('ALL');
  const [pickupWilaya, setPickupWilaya] = useState<string>('وهران');
  const [destinationWilaya, setDestinationWilaya] = useState<string>('الجزائر العاصمة');
  const [filterAlongRoute, setFilterAlongRoute] = useState<boolean>(true);

  // ============ السائقون المتاحون (الميزة الجديدة) ============
  const matchedAvailableDrivers = availableDrivers.filter((d) => {
    if (d.status !== 'EMPTY') return false;

    // المسار الكامل: من + عبر + إلى
    const route = [d.from, ...d.via, d.to];
    const originIdx = route.indexOf(pickupWilaya);
    const destIdx = route.indexOf(destinationWilaya);

    if (originIdx === -1 || destIdx === -1) return false;
    return originIdx < destIdx;
  });

  // ============ السائقون المرشحون (المنطق القديم) ============
  const candidateTrips = returnTrips.filter((trip) => {
    if (trip.status === 'RESTING') return false;

    if (selectedCategory !== 'ALL' && trip.vehicleCategory !== selectedCategory) {
      return false;
    }

    if (filterAlongRoute && trip.acceptAlongRoute) {
      return true;
    }

    const matchesDestination = 
      trip.toWilaya.includes(destinationWilaya) || 
      destinationWilaya.includes(trip.toWilaya);
    
    return matchesDestination;
  });

  const totalResults = matchedAvailableDrivers.length + candidateTrips.length;

  return (
    <div className="w-full flex-1 flex flex-col pb-20 overflow-y-auto no-scrollbar">
      
      {/* 1. REST MODE BANNER */}
      {currentRole === 'driver' && activeDriverTrip?.status === 'RESTING' && (
        <div className="mx-4 mt-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 text-center space-y-2 animate-fade-in shadow-xl">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Coffee className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="font-black text-sm text-white">
            {isAr ? 'أنت في وقت راحتك، استفد منه ☕' : 'Vous êtes en temps de repos, profitez-en ☕'}
          </h3>
          <p className="text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed">
            {isAr 
              ? 'لقد وصلت إلى وجهتك بنجاح. ملفك محجوب مؤقتاً عن قائمة الزبائن حتى ترتاح وتستعيد نشاطك لسلامتك وسلامة الطريق.' 
              : 'Votre mission est terminée. Vous êtes temporairement masqué pour votre repos.'}
          </p>
          <button
            onClick={onOpenDriverTripModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            {isAr ? 'تسجيل رحلة جديدة بعد الراحة' : 'Nouveau trajet après repos'}
          </button>
        </div>
      )}

      {/* 2. DRIVER ACTIVE RETURN TRIP QUICK CARD */}
      {currentRole === 'driver' && activeDriverTrip && activeDriverTrip.status !== 'RESTING' && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isAr ? 'رحلتك العائدة المنشورة حالياً' : 'Votre trajet retour en cours'}
            </span>
            <button
              onClick={onOpenDriverTripModal}
              className="text-[11px] font-bold text-emerald-400 hover:underline"
            >
              {isAr ? 'تعديل / تسجيل تأخير' : 'Modifier / Signaler retard'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-white font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span>{activeDriverTrip.fromWilaya}</span>
            <span className="text-emerald-400 font-mono">➜</span>
            <span>{activeDriverTrip.toWilaya}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>{activeDriverTrip.routeUsed}</span>
            <span className="font-mono text-emerald-400 font-bold">
              ETA: {activeDriverTrip.estimatedArrivalTime}
            </span>
          </div>

          {activeDriverTrip.delayMinutes > 0 && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300">
              {isAr 
                ? `⚠️ تأخير مسجل: +${activeDriverTrip.delayMinutes} دقيقة (${activeDriverTrip.delayReason})` 
                : `⚠️ Retard signalé : +${activeDriverTrip.delayMinutes} min`}
            </div>
          )}
        </div>
      )}

      {/* 3. AUTOMOTIVE 2x2 GRID */}
      <div className="mt-1">
        <AutomotiveGridButtons
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          lang={lang}
        />
      </div>

      {/* 4. ACTIONS BAR */}
      <div className="px-4 py-1.5 flex gap-2">
        <button
          onClick={onOpenSmartSuggest}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-emerald-300" />
          <span>{isAr ? 'زر اقتراح العربة المناسبة' : 'Suggestion intelligente'}</span>
        </button>

        {currentRole === 'driver' ? (
          <button
            onClick={onOpenDriverTripModal}
            className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-1 active:scale-98 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'تسجيل رحلة' : 'Nouveau trajet'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenPremiumModal}
            className="py-2.5 px-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold text-xs flex items-center gap-1 active:scale-98 transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>{isAr ? 'مزايا VIP' : 'VIP'}</span>
          </button>
        )}
      </div>

      {/* 5. CLIENT SEARCH CARD */}
      <div className="mx-4 mt-2 p-3.5 rounded-2xl bg-[#141822] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'البحث عن ناقل عائد (شاحنة فارغة)' : 'Recherche de retour à vide'}</span>
          </span>
          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="text-[10px] text-emerald-400 hover:underline"
            >
              {isAr ? 'إلغاء الفلتر' : 'Tous les véhicules'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              {isAr ? 'من (موقع حمولتك):' : 'Départ (votre position) :'}
            </label>
            <select
              value={pickupWilaya}
              onChange={(e) => setPickupWilaya(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                  {w.code} - {isAr ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              {isAr ? 'إلى (وجهة التوصيل):' : 'Destination :'}
            </label>
            <select
              value={destinationWilaya}
              onChange={(e) => setDestinationWilaya(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                  {w.code} - {isAr ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer pt-0.5">
          <input
            type="checkbox"
            checked={filterAlongRoute}
            onChange={(e) => setFilterAlongRoute(e.target.checked)}
            className="w-4 h-4 accent-emerald-500 rounded"
          />
          <span>{isAr ? 'إظهار السائقين على طول المسار وداخل دائرة 30 كم' : 'Inclure rayon 30 km et trajet complet'}</span>
        </label>
      </div>

      {/* 6. AVAILABLE DRIVERS (الميزة الجديدة - زر متاح فارغ) */}
      {matchedAvailableDrivers.length > 0 && (
        <div className="mx-4 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs text-white">
                {isAr ? 'سائقون متاحون الآن (فارغ)' : 'Chauffeurs disponibles (à vide)'}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
              {matchedAvailableDrivers.length} {isAr ? 'متاح' : 'dispo'}
            </span>
          </div>

          {matchedAvailableDrivers.map((d) => (
            <div 
              key={d.id}
              className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-[#11141c] border border-amber-500/40 hover:border-amber-400/60 shadow-md space-y-3 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={d.driverAvatar}
                    alt={d.driverName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/60"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-slate-950 flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">
                      {d.driverName}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {d.reliabilityScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
                    🟢 {isAr ? 'فارغ الآن' : 'À vide'}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">{d.departTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span className="truncate">{d.from}</span>
                  <span className="text-amber-400 font-mono px-1">➜</span>
                  <span className="truncate">{d.to}</span>
                </div>
                {d.via.length > 0 && (
                  <p className="text-[10px] text-slate-400 truncate">
                    {isAr ? 'عبر: ' : 'Via: '}{d.via.join(' ← ')}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <div className="text-[10px] text-slate-400">
                  <span className="block">{isAr ? 'العمولة الثابتة:' : 'Commission :'}</span>
                  <span className="font-mono font-bold text-amber-400">{d.fixedCommissionDzd} دج</span>
                </div>

                <a
                  href={`tel:${d.driverPhone}`}
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اتصال' : 'Appeler'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. CANDIDATE DRIVERS (المنطق القديم) */}
      <div className="mx-4 mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs text-white">
              {isAr ? 'السائقون المرشحون العائدون:' : 'Transporteurs de retour éligibles :'}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            {candidateTrips.length} {isAr ? 'متاح' : 'disponibles'}
          </span>
        </div>

        {totalResults === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <Truck className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'لا يوجد ناقل عائد يطابق هذا الصنف والوجهة حالياً.' 
                : 'Aucun transporteur trouvé sur ce trajet pour l\'instant.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setFilterAlongRoute(true);
              }}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              {isAr ? 'عرض جميع الأصناف على المسار' : 'Voir tous les véhicules disponibles'}
            </button>
          </div>
        ) : (
          candidateTrips.map((trip) => {
            const catInfo = VEHICLE_CATEGORIES_INFO[trip.vehicleCategory];

            return (
              <div 
                key={trip.id}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-[#181d28] to-[#11141c] border border-slate-800 hover:border-emerald-500/50 shadow-md space-y-3 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={trip.driverAvatar}
                      alt={trip.driverName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/60"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white truncate">
                        {trip.driverName}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {trip.reliabilityScore}% {isAr ? 'موثوقية' : 'Fiabilité'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-semibold truncate mt-0.5">
                      {trip.vehicleName}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                        {isAr ? catInfo?.nameAr : catInfo?.nameFr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-amber-400">
                        <Clock className="w-3 h-3" />
                        ETA: {trip.estimatedArrivalTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span className="truncate">{trip.fromWilaya}</span>
                    <span className="text-emerald-400 font-mono px-1">➜</span>
                    <span className="truncate">{trip.toWilaya}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {trip.routeUsed}
                  </p>
                </div>

                {trip.delayMinutes > 0 && (
                  <div className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{isAr ? `تأخير: +${trip.delayMinutes} دقيقة (${trip.delayReason})` : `Retard: +${trip.delayMinutes} min`}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-400">
                    <span className="block">{isAr ? 'العمولة الثابتة (يدفعها السائق):' : 'Commission forfaitaire :'}</span>
                    <span className="font-mono font-bold text-emerald-400">{catInfo?.fixedCommissionDzd} دج</span>
                  </div>

                  <button
                    onClick={() => onOpenCallModal(trip)}
                    className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اتصال' : 'Appeler'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
