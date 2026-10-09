import React, { useState } from 'react';
import { Zap, X, Check, MapPin, Plus, Minus, Truck } from 'lucide-react';
import { Language, VehicleCategory } from '../types';
import { WILAYAS, VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface AvailableDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSetAvailable: (data: {
    from: string;
    to: string;
    via: string[];
    departTime: string;
    vehicleCategory: VehicleCategory;
    vehicleName: string;
    fixedCommissionDzd: number;
  }) => void;
}

export const AvailableDriverModal: React.FC<AvailableDriverModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSetAvailable
}) => {
  const isAr = lang === 'ar';

  const [from, setFrom] = useState('بشار');
  const [to, setTo] = useState('الجزائر العاصمة');
  const [via, setVia] = useState<string[]>(['وهران']);
  const [departTime, setDepartTime] = useState('غداً 06:00');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('C1');
  const [vehicleName, setVehicleName] = useState('Renault Trucks D16');

  if (!isOpen) return null;

  const addVia = () => {
    setVia([...via, '']);
  };

  const removeVia = (index: number) => {
    setVia(via.filter((_, i) => i !== index));
  };

  const updateVia = (index: number, value: string) => {
    const updated = [...via];
    updated[index] = value;
    setVia(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVia = via.filter(v => v.trim() !== '');
    onSetAvailable({
      from,
      to,
      via: cleanVia,
      departTime,
      vehicleCategory,
      vehicleName,
      fixedCommissionDzd: VEHICLE_CATEGORIES_INFO[vehicleCategory]?.fixedCommissionDzd || 1000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-amber-500/40 p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {isAr ? 'أنا متاح فارغ 🟢' : 'Je suis disponible (à vide) 🟢'}
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                {isAr ? 'أعلن مسارك ليظهر لك الزبائن فوراً' : 'Déclarez votre trajet aux clients'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* From */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? '📍 من (نقطة البداية):' : '📍 De (Point de départ) :'}
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-sm outline-none"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                  {w.code} - {isAr ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Via (intermediate wilayas) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-200">
                {isAr ? '🛣️ عبر (الولايات الوسيطة):' : '🛣️ Via (villes traversées) :'}
              </label>
              <button
                type="button"
                onClick={addVia}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAr ? 'أضف ولاية' : 'Ajouter'}
              </button>
            </div>

            <div className="space-y-2">
              {via.length === 0 && (
                <p className="text-[11px] text-slate-500 text-center py-2">
                  {isAr ? 'لم تضف أي ولاية وسيطة بعد' : 'Aucune ville intermédiaire'}
                </p>
              )}
              {via.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <select
                    value={v}
                    onChange={(e) => updateVia(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs outline-none"
                  >
                    <option value="">{isAr ? 'اختر ولاية' : 'Choisir'}</option>
                    {WILAYAS.map(w => (
                      <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                        {w.code} - {isAr ? w.nameAr : w.nameFr}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeVia(idx)}
                    className="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? '🎯 إلى (الوجهة النهائية):' : '🎯 Vers (Destination finale) :'}
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-sm outline-none"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={isAr ? w.nameAr : w.nameFr}>
                  {w.code} - {isAr ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Depart time */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? '⏰ وقت المرور بنقطة "من":' : '⏰ Heure de départ :'}
            </label>
            <input
              type="text"
              value={departTime}
              onChange={(e) => setDepartTime(e.target.value)}
              placeholder={isAr ? 'مثال: غداً 06:00' : 'Ex: Demain 06:00'}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-sm outline-none"
            />
          </div>

          {/* Vehicle */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
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
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'اسم العربة:' : 'Véhicule :'}
              </label>
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>{isAr ? 'تفعيل الإتاحة للزبائن' : 'Activer ma disponibilité'}</span>
          </button>

          <p className="text-[10px] text-slate-500 text-center leading-snug">
            {isAr 
              ? '⚡ ستظهر لجميع الزبائن الذين تقع حمولتهم على طول مسارك، ويمكنهم الاتصال بك مباشرة.' 
              : '⚡ Vous apparaîtrez à tous les clients dont la marchandise se trouve sur votre route.'}
          </p>
        </form>
      </div>
    </div>
  );
};
