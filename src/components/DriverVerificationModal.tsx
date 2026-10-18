import React, { useEffect, useState } from 'react';
import { ShieldCheck, X, Lock, Camera, AlertCircle } from 'lucide-react';
import { DriverVerification } from '../types';
import { compressImage } from '../services/helpers';

interface DriverVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'fr';
  driverId: string;
  existing: DriverVerification;
  /** true عندما فُتحت النافذة لأن السائق حاول نشر رحلة قبل إرسال وثائقه */
  required?: boolean;
  onSaved: (verif: DriverVerification) => Promise<void> | void;
}

interface PhotosState {
  idCard: string;
  license: string;
  permit: string;
  vehicle: string;
  trailer: string;
}

const EMPTY_PHOTOS: PhotosState = { idCard: '', license: '', permit: '', vehicle: '', trailer: '' };

const inputCls =
  'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 outline-none';

const PhotoField: React.FC<{
  label: string;
  value: string;
  busy: boolean;
  isAr: boolean;
  onPick: (file: File) => void;
  onClear: () => void;
}> = ({ label, value, busy, isAr, onPick, onClear }) => (
  <div className={`p-2.5 rounded-xl bg-slate-950 border ${value ? 'border-emerald-500/40' : 'border-slate-800'} space-y-1.5`}>
    <span className="text-[11px] text-slate-300 block truncate">{label}</span>
    {value ? (
      <div className="relative">
        <img src={value} alt={label} className="w-full h-20 object-cover rounded-lg" />
        <button
          type="button"
          onClick={onClear}
          aria-label={isAr ? 'حذف الصورة' : 'Supprimer la photo'}
          className="absolute top-1 end-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <label
        className={`flex items-center justify-center gap-1.5 h-20 rounded-lg border border-dashed border-slate-700 text-[11px] text-emerald-400 cursor-pointer ${
          busy ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Camera className="w-4 h-4" />
        <span>{isAr ? 'رفع صورة' : 'Ajouter une photo'}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f) onPick(f);
            e.target.value = '';
          }}
        />
      </label>
    )}
  </div>
);

export const DriverVerificationModal: React.FC<DriverVerificationModalProps> = ({
  isOpen,
  onClose,
  lang,
  existing,
  required,
  onSaved
}) => {
  const isAr = lang === 'ar';

  const [ninNumber, setNinNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [transportPermitNumber, setTransportPermitNumber] = useState('');
  const [hasTrailer, setHasTrailer] = useState(false);
  const [photos, setPhotos] = useState<PhotosState>(EMPTY_PHOTOS);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  // عند كل فتح للنافذة: نملأ الحقول بما حُفظ سابقاً (فارغة لسائق جديد)
  useEffect(() => {
    if (!isOpen) return;
    setNinNumber(existing.ninNumber);
    setDriverLicenseNumber(existing.driverLicenseNumber);
    setLicenseIssueDate(existing.licenseIssueDate);
    setTransportPermitNumber(existing.transportPermitNumber);
    setHasTrailer(!!existing.trailerPhoto);
    setPhotos({
      idCard: existing.idCardPhoto,
      license: existing.licensePhoto,
      permit: existing.transportPermitPhoto,
      vehicle: existing.vehiclePhoto,
      trailer: existing.trailerPhoto || ''
    });
    setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const pick = async (key: keyof PhotosState, file: File) => {
    setPhotoBusy(true);
    setError(null);
    try {
      const url = await compressImage(file);
      setPhotos(p => ({ ...p, [key]: url }));
    } catch (_) {
      setError(isAr ? 'تعذّر قراءة الصورة، جرّب صورة أخرى.' : "Impossible de lire l'image, essayez-en une autre.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const clear = (key: keyof PhotosState) => setPhotos(p => ({ ...p, [key]: '' }));

  const validate = (): string | null => {
    if (!/^\d{18}$/.test(ninNumber.trim())) {
      return isAr ? 'رقم التعريف الوطني (NIN) يتكون من 18 رقماً.' : 'Le NIN comporte 18 chiffres.';
    }
    if (!driverLicenseNumber.trim()) return isAr ? 'أدخل رقم رخصة السياقة.' : 'Saisissez le n° de permis.';
    if (!licenseIssueDate || new Date(licenseIssueDate).getTime() > Date.now()) {
      return isAr ? 'تاريخ إصدار الرخصة غير صالح.' : "Date de délivrance invalide.";
    }
    if (!transportPermitNumber.trim()) return isAr ? 'أدخل رقم رخصة النقل.' : 'Saisissez le n° de licence de transport.';
    if (!photos.idCard || !photos.license || !photos.permit || !photos.vehicle) {
      return isAr
        ? 'ارفع صور: بطاقة التعريف، رخصة السياقة، رخصة النقل، والعربة.'
        : "Ajoutez les photos : carte d'identité, permis, licence et camion.";
    }
    if (hasTrailer && !photos.trailer) return isAr ? 'ارفع صورة المقطورة.' : 'Ajoutez la photo de la remorque.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    const verif: DriverVerification = {
      ninNumber: ninNumber.trim(),
      driverLicenseNumber: driverLicenseNumber.trim(),
      licenseIssueDate,
      transportPermitNumber: transportPermitNumber.trim(),
      idCardPhoto: photos.idCard,
      licensePhoto: photos.license,
      transportPermitPhoto: photos.permit,
      vehiclePhoto: photos.vehicle,
      trailerPhoto: hasTrailer ? photos.trailer : undefined,
      status: 'UNDER_REVIEW',
      reliabilityScore: existing.reliabilityScore,
      completedTrips: existing.completedTrips
    };

    setBusy(true);
    setError(null);
    try {
      await onSaved(verif);
      onClose();
    } catch (_) {
      setError(
        isAr
          ? 'تعذّر الحفظ: مساحة التخزين على الجهاز ممتلئة. جرّب صوراً أصغر.'
          : "Échec de l'enregistrement : stockage plein. Essayez des photos plus petites."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl bg-[#141822] border border-slate-800 p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        dir={isAr ? 'rtl' : 'ltr'}
      >
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
            aria-label={isAr ? 'إغلاق' : 'Fermer'}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {required && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/50 flex items-start gap-2 text-xs text-amber-200 font-semibold leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'أرسل وثائقك أولاً لتتمكن من نشر رحلاتك والإعلان عن توفرك.'
                : "Envoyez d'abord vos documents pour publier vos trajets et votre disponibilité."}
            </span>
          </div>
        )}

        <div className="my-3 p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold text-emerald-300 leading-snug">
            {isAr
              ? 'في هذه النسخة التجريبية تُحفظ بياناتك على جهازك فقط 🔒'
              : 'Dans cette version de test, vos données sont enregistrées uniquement sur votre appareil 🔒'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'رقم التعريف الوطني (NIN) - 18 رقماً:' : "Numéro d'Identification Nationale (NIN) - 18 chiffres :"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={ninNumber}
              onChange={(e) => setNinNumber(e.target.value.replace(/\D/g, '').slice(0, 18))}
              dir="ltr"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'رقم رخصة السياقة:' : 'N° Permis de conduire :'}
              </label>
              <input
                type="text"
                value={driverLicenseNumber}
                onChange={(e) => setDriverLicenseNumber(e.target.value)}
                dir="ltr"
                className={inputCls}
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
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'رقم رخصة النقل المهنية:' : 'N° Licence de transport :'}
            </label>
            <input
              type="text"
              value={transportPermitNumber}
              onChange={(e) => setTransportPermitNumber(e.target.value)}
              dir="ltr"
              className={inputCls}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={hasTrailer}
              onChange={(e) => setHasTrailer(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
            <span>{isAr ? 'عربتي بمقطورة (Semi-remorque أو Porte-char)' : "Mon véhicule a une remorque / porte-char"}</span>
          </label>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              {isAr ? 'الوثائق والصور المطلوبة:' : 'Documents et photos requis :'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <PhotoField
                label={isAr ? 'بطاقة التعريف' : "Carte d'identité"}
                value={photos.idCard}
                busy={photoBusy}
                isAr={isAr}
                onPick={(f) => pick('idCard', f)}
                onClear={() => clear('idCard')}
              />
              <PhotoField
                label={isAr ? 'رخصة السياقة' : 'Permis de conduire'}
                value={photos.license}
                busy={photoBusy}
                isAr={isAr}
                onPick={(f) => pick('license', f)}
                onClear={() => clear('license')}
              />
              <PhotoField
                label={isAr ? 'رخصة النقل' : 'Licence transport'}
                value={photos.permit}
                busy={photoBusy}
                isAr={isAr}
                onPick={(f) => pick('permit', f)}
                onClear={() => clear('permit')}
              />
              <PhotoField
                label={isAr ? 'صورة العربة' : 'Photo du camion'}
                value={photos.vehicle}
                busy={photoBusy}
                isAr={isAr}
                onPick={(f) => pick('vehicle', f)}
                onClear={() => clear('vehicle')}
              />
              {hasTrailer && (
                <PhotoField
                  label={isAr ? 'صورة المقطورة' : 'Photo de la remorque'}
                  value={photos.trailer}
                  busy={photoBusy}
                  isAr={isAr}
                  onPick={(f) => pick('trailer', f)}
                  onClear={() => clear('trailer')}
                />
              )}
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-[12px] text-red-300 font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || photoBusy}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'إرسال الوثائق للمراجعة' : 'Envoyer mon dossier pour vérification'}</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            {isAr
              ? 'تبقى حالتك «قيد المراجعة» إلى أن تُراجَع وثائقك.'
              : 'Votre statut reste « en cours de vérification » jusqu\'à la revue de vos documents.'}
          </p>
        </form>
      </div>
    </div>
  );
};
