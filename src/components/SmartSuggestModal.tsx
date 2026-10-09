import React, { useState } from 'react';
import { Sparkles, X, Check, Truck, Scale, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { VehicleCategory } from '../types';
import { VEHICLE_CATEGORIES_INFO } from '../locales/translations';
import { api } from '../services/api';

interface SmartSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  onApplyCategory: (cat: VehicleCategory) => void;
}

export const SmartSuggestModal: React.FC<SmartSuggestModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyCategory
}) => {
  const [description, setDescription] = useState('');
  const [weightKg, setWeightKg] = useState<number>(1500);
  const [suggestedResult, setSuggestedResult] = useState<any>(null);

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = api.suggestVehicleCategory(weightKg, description);
    setSuggestedResult(result);
  };

  const quickPresets = [
    { labelAr: 'جرافة أو عتاد هندسي', labelFr: 'Pelleteuse / Engin TP', desc: 'جرافة كتربيلار عتاد ثقيل', weight: 28000 },
    { labelAr: 'أثاث منزلي / أجهزة كهرومنزلية', labelFr: 'Déménagement / Électroménager', desc: 'أثاث شقة 3 غرف وأجهزة', weight: 1800 },
    { labelAr: 'مواد بناء وأسمنت', labelFr: 'Matériaux de construction', desc: 'أكياس إسمنت وحديد تسليح', weight: 12000 },
    { labelAr: 'شحنة ميناء وحاوية 40 قدم', labelFr: 'Conteneur portuaire 40ft', desc: 'حاوية مستوردة بضائع عامة', weight: 26000 },
    { labelAr: 'نقل عمال أو ركاب', labelFr: 'Transport de personnes', desc: 'فريق عمل ورشة 7 أفراد', weight: 600 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-emerald-500/30 p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {isAr ? 'اقتراح ذكي لنوع العربة' : 'Suggestion Intelligente'}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                {isAr ? 'صف حمولتك والنظام يحدد الشاحنة المناسبة' : 'Décrivez votre chargement pour obtenir le bon véhicule'}
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

        <form onSubmit={handleCalculate} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isAr ? 'أمثلة سريعة شائعة:' : 'Exemples rapides :'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setDescription(preset.desc);
                    setWeightKg(preset.weight);
                    const res = api.suggestVehicleCategory(preset.weight, preset.desc);
                    setSuggestedResult(res);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-emerald-400 transition-all"
                >
                  {isAr ? preset.labelAr : preset.labelFr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'وصف المنقول بالتفصيل:' : 'Description de la marchandise :'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isAr ? 'مثال: جرافة هيدروليكية، أو 10 باليتات مواد غذائية، أو أثاث منزلي...' : 'Ex: Pelleteuse 25T, 10 palettes de denrées, meuble...'}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white text-xs placeholder:text-slate-600 outline-none resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الوزن التقديري (بالكيلوغرام):' : 'Poids estimé (en kg) :'}</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {weightKg >= 1000 ? `${(weightKg / 1000).toFixed(1)} طن (${weightKg} كغ)` : `${weightKg} كغ`}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="40000"
              step="100"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{isAr ? 'تحليل واقتراح العربة' : 'Analyser et proposer'}</span>
          </button>
        </form>

        {suggestedResult && (
          <div className="mt-2 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 animate-slide-up space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {isAr ? 'العربة الموصى بها:' : 'Véhicule Recommandé :'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {VEHICLE_CATEGORIES_INFO[suggestedResult.category as VehicleCategory]?.typeAr}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white">
                  {isAr 
                    ? VEHICLE_CATEGORIES_INFO[suggestedResult.category as VehicleCategory]?.nameAr 
                    : VEHICLE_CATEGORIES_INFO[suggestedResult.category as VehicleCategory]?.nameFr}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {VEHICLE_CATEGORIES_INFO[suggestedResult.category as VehicleCategory]?.maxWeightAr}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <Info className="w-3.5 h-3.5 text-emerald-400 inline ml-1 mr-1" />
              {suggestedResult.reason}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 text-slate-300">
              <span>{isAr ? 'العمولة الثابتة المقررة:' : 'Commission fixe :'}</span>
              <span className="font-mono font-bold text-emerald-400">
                {VEHICLE_CATEGORIES_INFO[suggestedResult.category as VehicleCategory]?.fixedCommissionDzd} دج
              </span>
            </div>

            <button
              onClick={() => {
                onApplyCategory(suggestedResult.category);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'تطبيق هذا الصنف والبحث فوراً' : 'Sélectionner et rechercher'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
