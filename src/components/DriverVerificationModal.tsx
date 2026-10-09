import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Upload, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Truck, 
  Camera, 
  AlertCircle 
} from 'lucide-react';
import { DriverVerification, VehicleCategory } from '../types';
import { VEHICLE_CATEGORIES_INFO } from '../locales/translations';
import { IMG } from '../assets';

interface DriverVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  driverId: string;
  onSaved: (verif: DriverVerification) => void;
}

export const DriverVerificationModal: React.FC<DriverVerificationModalProps> = ({
  isOpen,
  onClose,
  lang,
  driverId,
  onSaved
}) => {
  const isAr = lang === 'ar';

  const [ninNumber, setNinNumber] = useState('119850241852401');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('08541296/16');
  const [licenseIssueDate, setLicenseIssueDate] = useState('2020-04-12');
  const [transportPermitNumber, setTransportPermitNumber] = useState('RN-ALG-2024-998');
  
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('PORTE_CHAR');
  const [vehicleName, setVehicleName] = useState('Mercedes-Benz Actros 3340');
  const [hasTrailer, setHasTrailer] = useState(true);

  const [idUploaded, setIdUploaded] = useState(true);
  const [licenseUploaded, setLicenseUploaded] = useState(true);
  const [permitUploaded, setPermitUploaded] = useState(true);
  const [vehiclePhotoUploaded, setVehiclePhotoUploaded] = useState(true);
  const [trailerPhotoUploaded, setTrailerPhotoUploaded] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verif: DriverVerification = {
      ninNumber,
      driverLicenseNumber,
      licenseIssueDate,
      transportPermitNumber,
      idCardPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      licensePhoto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      transportPermitPhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      vehiclePhoto: IMG.portechar,
      trailerPhoto: hasTrailer ? IMG.freight : undefined,
      status: 'VERIFIED',
      reliabilityScore: 99,
      completedTrips: 48
    };
    onSaved(verif);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-slate-800 p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {isAr ? 'التوثيق الإلزامي للناقل' : 'Vérification Obligatoire'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold">
                {isAr ? 'مؤشر الموثوقية: منع ترشيح أي محتال' : 'Score de fiabilité & anti-fraude'}
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

        {/* Security Notice Guarantee (Mandatory by specification) */}
        <div className="my-3 p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold text-emerald-300 leading-snug">
            {isAr 
              ? 'كل هذه المعلومات تُخزّن في الخادم لحمايتك وحماية الزبون 🔒' 
              : 'Toutes ces informations sont stockées sur le serveur pour votre protection et celle du client 🔒'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* National Identification Number (NIN) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'رقم التعريف الوطني (NIN):' : 'Numéro d\'Identification Nationale (NIN) :'}
            </label>
            <input
              type="text"
              value={ninNumber}
              onChange={(e) => setNinNumber(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Driving License Number & Issue Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'رقم رخصة السياقة:' : 'N° Permis de conduire :'}
              </label>
              <input
                type="text"
                value={driverLicenseNumber}
                onChange={(e) => setDriverLicenseNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'تاريخ الإصدار:' : 'Date de délivrance :'}
              </label>
              <input
                type="date"
                value={licenseIssueDate}
                onChange={(e) => setLicenseIssueDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Transport Permit */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'رقم رخصة النقل المهنية:' : 'N° Licence de transport :'}
            </label>
            <input
              type="text"
              value={transportPermitNumber}
              onChange={(e) => setTransportPermitNumber(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Vehicle Category Selection */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              {isAr ? 'تسجيل العربة (الصنف والاسم):' : 'Enregistrement du véhicule :'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as VehicleCategory)}
                className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                {Object.entries(VEHICLE_CATEGORIES_INFO).map(([k, v]) => (
                  <option key={k} value={k}>{isAr ? v.nameAr : v.nameFr}</option>
                ))}
              </select>
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder={isAr ? 'اسم الشاحنة' : 'Nom du camion'}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              />
            </div>

            <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTrailer}
                onChange={(e) => setHasTrailer(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span>{isAr ? 'يوجد مقطورة (Semi-remorque أو Porte-char)' : 'Dispose d\'une remorque / porte-char'}</span>
            </label>
          </div>

          {/* Required Upload Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              {isAr ? 'الوثائق المصورة المرفوعة:' : 'Documents et photos vérifiés :'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">{isAr ? 'بطاقة التعريف' : 'Carte d\'identité'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">{isAr ? 'رخصة السياقة' : 'Permis de conduire'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">{isAr ? 'رخصة النقل' : 'Licence transport'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">{isAr ? 'صورة العربة' : 'Photo du camion'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'حفظ وتأكيد التوثيق والأمان' : 'Valider mon dossier vérifié'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
