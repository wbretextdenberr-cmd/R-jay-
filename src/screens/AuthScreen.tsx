import React, { useState } from 'react';
import { Truck, Package, Eye, EyeOff, Globe, Lock, Phone, User as UserIcon } from 'lucide-react';
import { User, Language } from '../types';
import { WILAYAS } from '../locales/translations';
import { auth, AuthError, AuthErrorCode } from '../services/auth';

interface AuthScreenProps {
  lang: Language;
  onToggleLang: () => void;
  onAuthenticated: (user: User) => void;
}

const ERRORS: Record<AuthErrorCode | 'MISMATCH', { ar: string; fr: string }> = {
  NAME_INVALID: { ar: 'الاسم قصير جداً (3 أحرف على الأقل).', fr: 'Nom trop court (3 caractères minimum).' },
  PHONE_INVALID: { ar: 'رقم الهاتف غير صالح. مثال: 0550123456', fr: 'Numéro invalide. Exemple : 0550123456' },
  EMAIL_INVALID: { ar: 'البريد الإلكتروني غير صالح.', fr: 'Adresse e-mail invalide.' },
  PASSWORD_WEAK: { ar: 'كلمة المرور قصيرة (8 أحرف على الأقل).', fr: 'Mot de passe trop court (8 caractères minimum).' },
  ROLE_INVALID: { ar: 'اختر نوع الحساب.', fr: 'Choisissez le type de compte.' },
  WILAYA_REQUIRED: { ar: 'اختر ولايتك.', fr: 'Choisissez votre wilaya.' },
  PHONE_EXISTS: { ar: 'هذا الرقم مسجّل من قبل، سجّل الدخول بدلاً من ذلك.', fr: 'Ce numéro est déjà inscrit, connectez-vous.' },
  BAD_CREDENTIALS: { ar: 'الرقم أو كلمة المرور غير صحيحة.', fr: 'Numéro ou mot de passe incorrect.' },
  NO_CRYPTO: { ar: 'متصفحك لا يدعم التشفير المطلوب لحماية كلمة المرور.', fr: 'Votre navigateur ne supporte pas le chiffrement requis.' },
  STORAGE: { ar: 'تعذّر الحفظ على هذا الجهاز (التخزين ممتلئ أو معطّل).', fr: "Impossible d'enregistrer sur cet appareil (stockage plein ou désactivé)." },
  NOT_FOUND: { ar: 'الحساب غير موجود.', fr: 'Compte introuvable.' },
  MISMATCH: { ar: 'كلمتا المرور غير متطابقتين.', fr: 'Les mots de passe ne correspondent pas.' }
};

const inputCls =
  'w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none';

export const AuthScreen: React.FC<AuthScreenProps> = ({ lang, onToggleLang, onAuthenticated }) => {
  const isAr = lang === 'ar';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [role, setRole] = useState<'client' | 'driver'>('client');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (mode === 'signup' && password !== confirm) {
      setError(ERRORS.MISMATCH[lang]);
      return;
    }

    setBusy(true);
    try {
      const user =
        mode === 'login'
          ? await auth.signIn(phone, password)
          : await auth.signUp({ name, phone, email, password, role, wilaya });
      onAuthenticated(user);
    } catch (err) {
      const code: AuthErrorCode | null = err instanceof AuthError ? err.code : null;
      setError(code ? ERRORS[code][lang] : isAr ? 'حدث خطأ غير متوقع.' : 'Une erreur est survenue.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-black text-white">
            رايح <span className="text-emerald-400">جاي</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono tracking-wider">Rayeh Jay</div>
        </div>
        <button
          type="button"
          onClick={onToggleLang}
          className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-[11px] font-bold text-emerald-400 border border-slate-700/80 flex items-center gap-1"
        >
          <Globe className="w-3 h-3" />
          <span>{isAr ? 'FR' : 'عربي'}</span>
        </button>
      </div>

      <div>
        <h1 className="text-lg font-black text-white">
          {mode === 'login'
            ? isAr ? 'تسجيل الدخول' : 'Connexion'
            : isAr ? 'إنشاء حساب جديد' : 'Créer un compte'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {isAr
            ? 'ربط أصحاب الحمولات بالناقلين العائدين فارغين في الجزائر.'
            : 'Reliez les expéditeurs aux transporteurs en retour à vide en Algérie.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signup' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  role === 'client'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>{isAr ? 'صاحب حمولة (زبون)' : 'Expéditeur (client)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  role === 'driver'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>{isAr ? 'ناقل (سائق)' : 'Transporteur'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                <UserIcon className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />
                {isAr ? 'الاسم الكامل' : 'Nom complet'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className={inputCls}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            <Phone className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />
            {isAr ? 'رقم الهاتف' : 'Numéro de téléphone'}
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0550 12 34 56"
            autoComplete="tel"
            required
            dir="ltr"
            className={`${inputCls} font-mono`}
          />
        </div>

        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'ولايتك' : 'Votre wilaya'}
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                required
                className={inputCls}
              >
                <option value="">{isAr ? 'اختر الولاية' : 'Choisir la wilaya'}</option>
                {WILAYAS.map(w => (
                  <option key={w.code} value={w.nameAr}>
                    {w.code} - {isAr ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {isAr ? 'البريد الإلكتروني (اختياري)' : 'E-mail (facultatif)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                dir="ltr"
                className={inputCls}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            <Lock className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />
            {isAr ? 'كلمة المرور' : 'Mot de passe'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              dir="ltr"
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={isAr ? 'إظهار أو إخفاء كلمة المرور' : 'Afficher ou masquer le mot de passe'}
              className="absolute top-1/2 -translate-y-1/2 end-2 text-slate-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {mode === 'signup' && (
            <p className="text-[10px] text-slate-500 mt-1">
              {isAr ? '8 أحرف على الأقل.' : '8 caractères minimum.'}
            </p>
          )}
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {isAr ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              dir="ltr"
              className={inputCls}
            />
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-[12px] text-red-300 font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          {busy
            ? isAr ? 'لحظة...' : 'Un instant...'
            : mode === 'login'
              ? isAr ? 'دخول' : 'Se connecter'
              : isAr ? 'إنشاء الحساب' : 'Créer mon compte'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
        className="text-xs font-bold text-emerald-400 text-center"
      >
        {mode === 'login'
          ? isAr ? 'ليس لديك حساب؟ أنشئ حساباً' : "Pas de compte ? Créez-en un"
          : isAr ? 'لديك حساب؟ سجّل الدخول' : 'Déjà un compte ? Connectez-vous'}
      </button>

      <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-auto">
        {isAr
          ? 'نسخة تجريبية: الحساب وبياناته محفوظان على هذا الجهاز فقط، ولا يظهران على هاتف آخر.'
          : 'Version de test : le compte et ses données sont enregistrés uniquement sur cet appareil.'}
      </p>
    </div>
  );
};
