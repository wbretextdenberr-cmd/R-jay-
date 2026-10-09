import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  Coffee, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ReturnTrip, VehicleCategory } from '../types';
import { WILAYAS, ALGERIAN_HIGHWAYS, VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface DriverTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  activeTrip: ReturnTrip | null;
  onSaveTrip: (tripData: any) => void;
  onUpdateDelay: (tripId: string, reason: string, minutes: number) => void;
  onFinishTrip: (tripId: string) => void;
}

export const DriverTripModal: React.FC<DriverTripModalProps> = ({
  isOpen,
  onClose,
  lang,
  activeTrip,
  onSaveTrip,
  onUpdateDelay,
  onFinishTrip
}) => {
  const isAr = lang === 'ar';

  // New Trip State
  const [fromWilaya, setFromWilaya] = useState(WILAYAS[0].nameAr);
  const [toWilaya, setToWilaya] = useState(WILAYAS[1].nameAr);
  const [routeUsed, setRouteUsed] = useState(ALGERIAN_HIGHWAYS[0]);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('14:30');
  const [acceptAlongRoute, setAcceptAlongRoute] = useState(true);
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('C1');
  const [vehicleName, setVehicleName] = useState('Renault Trucks D16 4x2');

  // Delay State for active trip
  const [delayReason, setDelayReason] = useState(activeTrip?.delayReason || '');
  const [delayMinutes, setDelayMinutes] = useState(activeTrip?.delayMinutes || 0);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTrip({
      vehicleCategory,
      vehicleName,
      fromWilaya,
      fromCommune: fromWilaya,
      toWilaya,
      toCommune: toWilaya,
      routeUsed,
      departureTime,
      estimatedArrivalTime,
      acceptAlongRoute,
      delayMinutes: 0,
      fixedCommissionDzd: VEHICLE_CATEGORIES_INFO[vehicleCategory]?.fixedCommissionDzd || 1000
    });
    onClose();
  };

  const handleDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;
    onUpdateDelay(activeTrip.id, delayReason, delayMinutes);
    onClose();
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {activeTrip 
                  ? (isAr ? 'إدارة رحلة العودة الحالية' : 'Gestion du trajet retour') 
                  : (isAr ? 'تسجيل رحلة عودة جديدة (الرحلة الفارغة)' : 'Déclarer un retour à vide')}
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">
                {isAr ? 'السائق يسجل مساره والزبائن يبحثون ويتصلون' : 'Vous déclarez votre route, les clients appellent'}
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

        {/* If driver already has an active trip: Delay or Finish management */}
        {activeTrip ? (
          <div className="py-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'المسار النشط:' : 'Trajet actif :'}</span>
                <span className="text-xs font-bold text-emerald-400">{activeTrip.routeUsed}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white font-semibold">
                <span>{activeTrip.fromWilaya}</span>
                <span className="text-emerald-400">➜</span>
                <span>{activeTrip.toWilaya}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>{isAr ? `الانطلاق: ${activeTrip.departureTime}` : `Départ: ${activeTrip.departureTime}`}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {isAr ? `الوصول التقديري: ${activeTrip.estimatedArrivalTime}` : `ETA: ${activeTrip.estimatedArrivalTime}`}
                </span>
              </div>
            </div>

            {/* Delay Field Section */}
            <form onSubmit={handleDelaySubmit} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAr ? 'خانة التأخير (تحديث وقت الوصول تلقائياً):' : 'Signaler un retard (Mise à jour automatique de l\'ETA) :'}</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  {isAr ? 'سبب التأخير (ازدحام، عطل، طقس، استراحة):' : 'Cause du retard (bouchon, météo, pause) :'}
                </label>
                <input
                  type="text"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder={isAr ? 'مثال: ازدحام عند مدخل البويرة' : 'Ex: Ralentissement à Bouira'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  {isAr ? `مدة التأخير: +${delayMinutes} دقيقة` : `Durée du retard: +${delayMinutes} min`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <p className="text-[10px] text-amber-300/80">
                {isAr 
                  ? '⚡ بمجرد الحفظ، سيتغير وقت الوصول التقديري تلقائياً لدى جميع الزبائن الذين يشاهدون ملفك.' 
                  : '⚡ L\'heure d\'arrivée estimée sera immédiatement recalculée pour tous les clients.'}
              </p>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isAr ? 'تحديث التأخير والوصول التقديري' : 'Actualiser l\'ETA'}
              </button>
            </form>

            {/* End of Trip & Rest Mode Trigger */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onFinishTrip(activeTrip.id);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Coffee className="w-4 h-4" />
                <span>{isAr ? 'إنهاء الرحلة وبدء وقت الراحة ☕' : 'Terminer le trajet & Pause méritée'}</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-1">
                {isAr 
                  ? 'عند وصولك تختفي من القائمة وتدخل وضع الراحة لحمايتك' 
                  : 'Vous serez masqué de la liste durant votre temps de repos'}
              </p>
            </div>
          </div>
        ) : (
          /* Form to Register a New Return Trip */
          <form onSubmit={handleCreateSubmit} className="py-4 space-y-3.5">
            {/* From -> To Wilayas */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'من (الانطلاق):' : 'De (Départ) :'}
                </label>
                <select
                  value={fromWilaya}
                  onChange={(e) => setFromWilaya(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                >
                  {WILAYAS.map(w => (
                    <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                      {w.code} - {isAr ? w.nameAr : w.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'إلى (الوصول/العودة):' : 'Vers (Arrivée) :'}
                </label>
                <select
                  value={toWilaya}
                  onChange={(e) => setToWilaya(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                >
                  {WILAYAS.map(w => (
                    <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                      {w.code} - {isAr ? w.nameAr : w.nameFr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Road Taken */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {isAr ? 'الطريق المسلوك:' : 'Itinéraire emprunté :'}
              </label>
              <select
                value={routeUsed}
                onChange={(e) => setRouteUsed(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                {ALGERIAN_HIGHWAYS.map((h, i) => (
                  <option key={i} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Category & Name */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'صنف العربة:' : 'Catégorie :'}
                </label>
                <select
                  value={vehicleCategory}
                  onChange={(e) => setVehicleCategory(e.target.value as VehicleCategory)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                >
                  {Object.entries(VEHICLE_CATEGORIES_INFO).map(([key, info]) => (
                    <option key={key} value={key}>
                      {isAr ? info.nameAr : info.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'اسم وموديل العربة:' : 'Nom du véhicule :'}
                </label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'وقت الانطلاق:' : 'Heure de départ :'}
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'وقت الوصول التقديري (ETA):' : 'Heure d\'arrivée (ETA) :'}
                </label>
                <input
                  type="time"
                  value={estimatedArrivalTime}
                  onChange={(e) => setEstimatedArrivalTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Along Route Checkbox ("أنقل لأي أحد على طول طريقي / في كل اتجاه") */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptAlongRoute}
                onChange={(e) => setAcceptAlongRoute(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-emerald-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">
                  {isAr ? 'أنقل لأي أحد على طول طريقي / في كل اتجاه' : 'Charger tout le long de mon trajet'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isAr 
                    ? 'يسمح لزبائن الولايات الواقعة على مسار الطريق السيار بالاتصال بك للاستفادة من رحلتك الفارغة.' 
                    : 'Permet aux clients des villes traversées de vous solliciter.'}
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
            >
              {isAr ? 'تأكيد ونشر مسار رحلة العودة' : 'Publier mon trajet de retour'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
