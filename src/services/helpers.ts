import { wilayaCode } from './roadNetwork';

// ---------------------------------------------------------------
// الهاتف وواتساب
// ---------------------------------------------------------------

/** يحوّل رقماً جزائرياً (0550 12 34 56) إلى الصيغة الدولية بلا + (213550123456) */
export function toIntlPhone(phone: string): string {
  const d = (phone || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return d.slice(1);
  if (d.startsWith('00')) return d.slice(2);
  if (d.startsWith('213')) return d;
  if (d.startsWith('0')) return '213' + d.slice(1);
  return '213' + d;
}

/** رابط محادثة واتساب مع رقم، ونص جاهز اختيارياً */
export function whatsappUrl(phone: string, text?: string): string {
  const base = `https://wa.me/${toIntlPhone(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** رابط مشاركة نص في واتساب (المستخدم يختار الجهة أو المجموعة) */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** رسالة الزبون الجاهزة للسائق */
export function clientToDriverMessage(isAr: boolean, pickup: string, dest: string): string {
  return isAr
    ? `السلام عليكم، وجدتك في تطبيق رايح جاي. عندي بضاعة من ${pickup} إلى ${dest}. هل أنت متاح؟`
    : `Bonjour, je vous ai trouvé sur Rayeh Jay. J'ai une marchandise de ${pickup} vers ${dest}. Êtes-vous disponible ?`;
}

/** إعلان رحلة عودة جاهز للنشر في مجموعات واتساب أو فيسبوك */
export function buildTripAd(
  isAr: boolean,
  t: { from: string; to: string; vehicleName: string; eta: string; phone: string }
): string {
  return isAr
    ? `🚛 شاحنة عائدة فارغة\n📍 من: ${t.from}\n🏁 إلى: ${t.to}\n🚚 ${t.vehicleName}\n🕒 الوصول المتوقع: ${t.eta}\n📞 ${t.phone}\n\nعبر تطبيق رايح جاي`
    : `🚛 Camion en retour à vide\n📍 De : ${t.from}\n🏁 Vers : ${t.to}\n🚚 ${t.vehicleName}\n🕒 Arrivée prévue : ${t.eta}\n📞 ${t.phone}\n\nVia l'application Rayeh Jay`;
}

// ---------------------------------------------------------------
// تقدير المسافة والمدة (تقريبي)
// ---------------------------------------------------------------

const AVG_TRUCK_KMH = 55;

export function formatTripEstimate(km: number, isAr: boolean): string {
  const hours = km / AVG_TRUCK_KMH;
  const dur =
    hours < 1
      ? `${Math.max(1, Math.round(hours * 60))} ${isAr ? 'دقيقة' : 'min'}`
      : `${Math.round(hours * 10) / 10} ${isAr ? 'ساعة' : 'h'}`;
  return `≈ ${km} ${isAr ? 'كم' : 'km'} · ≈ ${dur}`;
}

// ---------------------------------------------------------------
// المسارات المحفوظة (تُخزَّن في المتصفح)
// ---------------------------------------------------------------

export interface SavedRoute {
  from: string; // رمز الولاية
  to: string;   // رمز الولاية
}

const SAVED_KEY = 'rayeh_saved_routes_v1';

export function loadSavedRoutes(): SavedRoute[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r: any) => r && typeof r.from === 'string' && typeof r.to === 'string'
    );
  } catch (_) {
    return [];
  }
}

export function storeSavedRoutes(routes: SavedRoute[]): void {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(routes));
  } catch (_) {}
}

export function routeKeyFromNames(from: string, to: string): SavedRoute | null {
  const f = wilayaCode(from);
  const t = wilayaCode(to);
  if (!f || !t || f === t) return null;
  return { from: f, to: t };
}
