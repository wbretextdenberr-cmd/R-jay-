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

// ---------------------------------------------------------------
// الصورة الرمزية والصور
// ---------------------------------------------------------------

const AVATAR_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

/** صورة رمزية (أول حرف من الاسم) كرابط data:، دون أي اتصال بالإنترنت */
export function makeAvatar(name: string): string {
  const clean = (name || '').trim();
  const first = clean.charAt(0).toUpperCase() || '?';
  const initial = first === '&' ? '+' : first === '<' || first === '>' ? '?' : first;
  let h = 0;
  for (let i = 0; i < clean.length; i++) h = (h * 31 + clean.charCodeAt(i)) >>> 0;
  const bg = AVATAR_COLORS[h % AVATAR_COLORS.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="${bg}"/>` +
    `<text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#022c22">${initial}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** يصغّر صورة مختارة (حتى 900 بكسل) ويحوّلها إلى JPEG مضغوط كرابط data: ليسهل حفظها */
export function compressImage(file: File, maxSide = 900, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('DECODE_FAILED'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('CANVAS_FAILED'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
