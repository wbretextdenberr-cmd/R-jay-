import { WILAYAS } from '../locales/translations';

/**
 * شبكة الطرق الوطنية الجزائرية على مستوى الولايات.
 *
 * كل طريق = قائمة مرتبة برموز الولايات التي يمر بها.
 * ولايات التقاطع (غرداية، قسنطينة، معسكر ...) تربط الطرق ببعضها فتتكوّن شبكة واحدة.
 *
 * لإضافة طريق جديد أو تصحيح مسار: عدّل المصفوفة ROADS فقط، ولا حاجة لتغيير أي شيء آخر.
 * confidence: 'high'  = مسار مؤكد من مصادر الطرق الوطنية
 *             'check' = مسار متوسط الثقة، يُنصح بمراجعته ميدانياً
 */
export interface Road {
  id: string;
  nameAr: string;
  codes: string[];
  confidence: 'high' | 'check';
}

export const ROADS: Road[] = [
  // ---------- الطرق الوطنية الكبرى ----------
  // تحقق: 68 (قصر البخاري) و63 (عين وسارة) على RN1 حسب التقسيم الإداري الجديد
  { id: 'RN1', nameAr: 'RN1 الطريق العابر للصحراء', confidence: 'high',
    codes: ['16', '09', '26', '68', '63', '17', '03', '47', '58', '53', '11', '54'] },
  { id: 'RN1A', nameAr: 'RN1A الجلفة - أفلو', confidence: 'high', codes: ['17', '59'] },
  { id: 'RN1B', nameAr: 'RN1B الجلفة - مسعد - تقرت', confidence: 'high', codes: ['17', '62', '55'] },
  { id: 'RN2', nameAr: 'RN2 وهران - عين تموشنت - تلمسان', confidence: 'high', codes: ['31', '46', '13'] },
  { id: 'RN3', nameAr: 'RN3 سكيكدة - قسنطينة - باتنة - بسكرة - تقرت - ورقلة - إليزي - جانت', confidence: 'high',
    codes: ['21', '25', '04', '05', '66', '07', '57', '55', '30', '33', '56'] },
  { id: 'RN4', nameAr: 'RN4 الجزائر - وهران', confidence: 'high', codes: ['16', '09', '44', '02', '48', '31'] },
  { id: 'RN5', nameAr: 'RN5 الجزائر - قسنطينة', confidence: 'high', codes: ['16', '35', '10', '34', '19', '25'] },
  { id: 'RN6', nameAr: 'RN6 طريق الواحات', confidence: 'high',
    codes: ['31', '29', '20', '32', '45', '08', '52', '01', '50'] },
  { id: 'RN7', nameAr: 'RN7 غليزان - معسكر - سيدي بلعباس - تلمسان', confidence: 'high', codes: ['48', '29', '22', '13'] },
  { id: 'RN22', nameAr: 'RN22 تلمسان - العريشة - النعامة', confidence: 'high', codes: ['46', '13', '69', '45'] },
  { id: 'RN44', nameAr: 'RN44 سكيكدة - عنابة - الطارف', confidence: 'high', codes: ['21', '23', '36'] },
  { id: 'RN50', nameAr: 'RN50 بشار - تندوف', confidence: 'high', codes: ['08', '37'] },
  { id: 'RN51', nameAr: 'RN51 تيميمون - المنيعة - ورقلة', confidence: 'high', codes: ['49', '58', '30'] },
  { id: 'RN51A', nameAr: 'RN51A تيميمون - أدرار', confidence: 'high', codes: ['49', '01'] },
  { id: 'RN52', nameAr: 'RN52 أدرار - عين صالح', confidence: 'high', codes: ['01', '53'] },
  { id: 'ORG-GHA', nameAr: 'ورقلة - غرداية', confidence: 'high', codes: ['30', '47'] },

  // ---------- الطريق السيار شرق-غرب ----------
  { id: 'A1-EST', nameAr: 'الطريق السيار شرق-غرب (الشرق)', confidence: 'high',
    codes: ['16', '35', '10', '34', '19', '43', '25', '24', '23', '36'] },
  { id: 'A1-OUEST', nameAr: 'الطريق السيار شرق-غرب (الغرب)', confidence: 'high',
    codes: ['16', '09', '44', '02', '48', '22', '13'] },

  // ---------- الطريق الساحلي ----------
  { id: 'RN11', nameAr: 'الطريق الساحلي RN11', confidence: 'high', codes: ['31', '27', '02', '42', '16'] },

  // ---------- طرق متوسطة الثقة: يُنصح بمراجعتها ----------
  { id: 'RN9', nameAr: 'RN9 سطيف - بجاية', confidence: 'check', codes: ['19', '06'] },
  { id: 'RN12', nameAr: 'RN12 الجزائر - بومرداس - تيزي وزو - بجاية', confidence: 'check', codes: ['16', '35', '15', '06'] },
  { id: 'RN43', nameAr: 'RN43 بجاية - جيجل - سكيكدة', confidence: 'check', codes: ['06', '18', '21'] },
  { id: 'RN10', nameAr: 'RN10 قسنطينة - أم البواقي - تبسة', confidence: 'check', codes: ['25', '04', '12'] },
  { id: 'RN88', nameAr: 'RN88 باتنة - خنشلة', confidence: 'check', codes: ['05', '40'] },
  { id: 'RN16', nameAr: 'RN16 تقرت - الوادي', confidence: 'check', codes: ['55', '39'] }
];

// =====================================================================
// مطابقة أسماء الولايات (عربي / فرنسي / اختلافات الكتابة) إلى رمز الولاية
// =====================================================================

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064B-\u065F\u0640]/g, '') // تشكيل + accents
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[’'`´]/g, '')
    .replace(/[-–_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const EXTRA_ALIASES: Record<string, string[]> = {
  '16': ['الجزائر', 'الجزائر العاصمة', 'Algiers', 'Alger'],
  '30': ['ورقلة', 'حاسي مسعود', 'Hassi Messaoud'],
  '11': ['Tamanghasset'],
  '28': ['Msila', 'المسيله'],
  '46': ['عين تيموشنت'],
  '58': ['El Menia', 'المنيعه'],
  '53': ['In Salah', 'عين صالح'],
  '35': ['Boumerdes'],
  '34': ['BBA']
};

const aliasToCode = new Map<string, string>();
for (const w of WILAYAS) {
  const keys = [w.nameAr, w.nameFr, ...w.nameAr.split('/'), ...(EXTRA_ALIASES[w.code] || [])];
  for (const k of keys) aliasToCode.set(normalize(k), w.code);
}

const byCode = new Map(WILAYAS.map((w) => [w.code, w]));

/** اسم الولاية (بأي كتابة) → رمزها، أو null إن لم تُعرف */
export function wilayaCode(name: string | undefined | null): string | null {
  if (!name) return null;
  return aliasToCode.get(normalize(name)) ?? null;
}

/** رمز الولاية → اسمها بلغة العرض */
export function wilayaName(code: string, lang: 'ar' | 'fr' = 'ar'): string {
  const w = byCode.get(code);
  if (!w) return code;
  return lang === 'ar' ? w.nameAr : w.nameFr;
}

// =====================================================================
// الرسم البياني + أقصر مسار (Dijkstra)
// =====================================================================

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

interface Edge { to: string; km: number; roads: string[] }
const graph = new Map<string, Map<string, Edge>>();

function link(a: string, b: string, roadId: string) {
  const wa = byCode.get(a);
  const wb = byCode.get(b);
  if (!wa || !wb || a === b) return;
  const km = haversineKm(wa, wb);
  for (const [x, y] of [[a, b], [b, a]] as const) {
    if (!graph.has(x)) graph.set(x, new Map());
    const m = graph.get(x)!;
    const e = m.get(y);
    if (e) {
      if (!e.roads.includes(roadId)) e.roads.push(roadId);
    } else {
      m.set(y, { to: y, km, roads: [roadId] });
    }
  }
}

for (const road of ROADS) {
  for (let i = 0; i < road.codes.length - 1; i++) link(road.codes[i], road.codes[i + 1], road.id);
}

/** أقصر مسار بين ولايتين عبر شبكة الطرق (يشمل البداية والنهاية)، أو null إن لم يوجد */
export function findPath(fromCode: string, toCode: string): string[] | null {
  if (fromCode === toCode) return [fromCode];
  if (!graph.has(fromCode) || !graph.has(toCode)) return null;

  const dist = new Map<string, number>([[fromCode, 0]]);
  const prev = new Map<string, string>();
  const visited = new Set<string>();

  while (true) {
    let cur: string | null = null;
    let best = Infinity;
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < best) {
        best = d;
        cur = node;
      }
    }
    if (cur === null) return null;
    if (cur === toCode) break;
    visited.add(cur);
    for (const e of graph.get(cur)!.values()) {
      const nd = best + e.km;
      if (nd < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, nd);
        prev.set(e.to, cur);
      }
    }
  }

  const path = [toCode];
  while (path[0] !== fromCode) path.unshift(prev.get(path[0])!);
  return path;
}

/**
 * يوسّع قائمة محطات (انطلاق ← محطات إضافية ← وصول) إلى مسار كامل بالرموز،
 * بحيث يُستبدل كل مقطع بين محطتين بأقصر طريق في الشبكة.
 * إن لم يوجد طريق لمقطع ما يُترك كما هو (قفزة مباشرة).
 */
export function expandRouteCodes(stops: string[]): string[] {
  const codes = stops.filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < codes.length; i++) {
    if (i === 0) {
      out.push(codes[0]);
      continue;
    }
    const leg = findPath(codes[i - 1], codes[i]) ?? [codes[i - 1], codes[i]];
    for (const c of leg.slice(1)) if (out[out.length - 1] !== c) out.push(c);
  }
  return out;
}

/** نفس expandRouteCodes لكن بالأسماء. يعيد null إن كانت ولاية الانطلاق أو الوصول غير معروفة. */
export function expandRoute(from: string, via: string[], to: string): string[] | null {
  const f = wilayaCode(from);
  const t = wilayaCode(to);
  if (!f || !t) return null;
  const mid = (via || []).map(wilayaCode).filter((c): c is string => !!c);
  return expandRouteCodes([f, ...mid, t]);
}

/** المسار المقترح تلقائياً لعرضه للسائق، بأسماء الولايات بلغة العرض */
export function suggestRouteNames(
  from: string,
  via: string[],
  to: string,
  lang: 'ar' | 'fr' = 'ar'
): string[] {
  const codes = expandRoute(from, via, to);
  return codes ? codes.map((c) => wilayaName(c, lang)) : [];
}

/** أسماء الطرق الوطنية التي يمر بها مسار معيّن (للعرض) */
export function roadsOnPath(codes: string[]): string[] {
  const used: string[] = [];
  for (let i = 0; i < codes.length - 1; i++) {
    const e = graph.get(codes[i])?.get(codes[i + 1]);
    for (const r of e?.roads ?? []) if (!used.includes(r)) used.push(r);
  }
  return used;
}
