import { AvailableDriver, ReturnTrip, VehicleCategory } from '../types';
import { expandRoute, wilayaCode, wilayaName, roadsOnPath } from './roadNetwork';

/**
 * EXACT : انطلاق السائق ووجهته هما نفسهما انطلاق بضاعة الزبون ووجهتها
 * ALONG : السائق يمر بنقطة انطلاق البضاعة ثم بوجهتها (بهذا الترتيب) على طريقه
 */
export type MatchKind = 'EXACT' | 'ALONG';

export interface RouteMatch {
  kind: MatchKind;
  /** المسار الكامل للسائق بأسماء الولايات (بعد التوسيع على شبكة الطرق) */
  routeNames: string[];
  /** رموز الولايات على المسار */
  routeCodes: string[];
  /** الطرق الوطنية المستعملة على المسار (للعرض) */
  roads: string[];
}

/**
 * الفحص الأساسي: هل مسار السائق يحتوي نقطة الزبون ثم وجهته بالترتيب؟
 * يتعامل مع اختلاف كتابة أسماء الولايات (عربي/فرنسي/"الجزائر" و"الجزائر العاصمة").
 */
export function matchRoute(
  routeCodes: string[] | null,
  pickupWilaya: string,
  destinationWilaya: string
): MatchKind | null {
  if (!routeCodes || routeCodes.length < 2) return null;

  const pickup = wilayaCode(pickupWilaya);
  const dest = wilayaCode(destinationWilaya);
  if (!pickup || !dest || pickup === dest) return null;

  const i = routeCodes.indexOf(pickup);
  const j = routeCodes.lastIndexOf(dest);
  if (i === -1 || j === -1 || i >= j) return null; // غير موجودة، أو الاتجاه معكوس

  const exact = i === 0 && j === routeCodes.length - 1;
  return exact ? 'EXACT' : 'ALONG';
}

const buildMatch = (
  kind: MatchKind,
  codes: string[],
  lang: 'ar' | 'fr'
): RouteMatch => ({
  kind,
  routeCodes: codes,
  routeNames: codes.map((c) => wilayaName(c, lang)),
  roads: roadsOnPath(codes)
});

export interface AvailableDriverMatch {
  driver: AvailableDriver;
  match: RouteMatch;
}

export interface ReturnTripMatch {
  trip: ReturnTrip;
  match: RouteMatch;
}

export interface MatchOptions {
  /** فلتر صنف العربة. 'ALL' أو غير محدد = كل الأصناف */
  category?: VehicleCategory | 'ALL';
  /** إظهار السائقين الذين يمرون بطريق الزبون (ALONG). إذا false تظهر المطابقة التامة فقط */
  includeAlongRoute?: boolean;
  lang?: 'ar' | 'fr';
}

const byKindThenReliability = (
  a: { match: RouteMatch; reliability: number },
  b: { match: RouteMatch; reliability: number }
) => {
  if (a.match.kind !== b.match.kind) return a.match.kind === 'EXACT' ? -1 : 1;
  return b.reliability - a.reliability;
};

/** السائقون المعلنون "متاح فارغ" المطابقون لبحث الزبون، مرتبون: مطابق تماماً ثم على الطريق */
export function matchAvailableDriversDetailed(
  pickupWilaya: string,
  destinationWilaya: string,
  drivers: AvailableDriver[],
  options: MatchOptions = {}
): AvailableDriverMatch[] {
  const { category = 'ALL', includeAlongRoute = true, lang = 'ar' } = options;

  return drivers
    .filter((d) => d.status === 'EMPTY')
    .filter((d) => category === 'ALL' || d.vehicleCategory === category)
    .map((driver) => {
      const codes = expandRoute(driver.from, driver.via, driver.to);
      const kind = matchRoute(codes, pickupWilaya, destinationWilaya);
      return kind && codes ? { driver, match: buildMatch(kind, codes, lang) } : null;
    })
    .filter((r): r is AvailableDriverMatch => r !== null)
    .filter((r) => includeAlongRoute || r.match.kind === 'EXACT')
    .sort((a, b) =>
      byKindThenReliability(
        { match: a.match, reliability: a.driver.reliabilityScore },
        { match: b.match, reliability: b.driver.reliabilityScore }
      )
    );
}

/**
 * رحلات العودة المنشورة (ReturnTrip) المطابقة لبحث الزبون.
 * - تُستبعد الرحلات في الراحة (RESTING) أو المنتهية (ARRIVED).
 * - ALONG لا تظهر إلا إذا كان السائق يقبل التحميل في الطريق (acceptAlongRoute).
 */
export function matchReturnTrips(
  pickupWilaya: string,
  destinationWilaya: string,
  trips: ReturnTrip[],
  options: MatchOptions = {}
): ReturnTripMatch[] {
  const { category = 'ALL', includeAlongRoute = true, lang = 'ar' } = options;

  return trips
    .filter((t) => t.status === 'ACTIVE' || t.status === 'DELAYED')
    .filter((t) => category === 'ALL' || t.vehicleCategory === category)
    .map((trip) => {
      const codes = expandRoute(trip.fromWilaya, [], trip.toWilaya);
      const kind = matchRoute(codes, pickupWilaya, destinationWilaya);
      return kind && codes ? { trip, match: buildMatch(kind, codes, lang) } : null;
    })
    .filter((r): r is ReturnTripMatch => r !== null)
    .filter((r) => r.match.kind === 'EXACT' || (includeAlongRoute && r.trip.acceptAlongRoute))
    .sort((a, b) =>
      byKindThenReliability(
        { match: a.match, reliability: a.trip.reliabilityScore },
        { match: b.match, reliability: b.trip.reliabilityScore }
      )
    );
}

/** للتوافق مع الكود القديم: يعيد السائقين فقط بدون تفاصيل المطابقة */
export function matchAvailableDrivers(
  pickupWilaya: string,
  destinationWilaya: string,
  drivers: AvailableDriver[]
): AvailableDriver[] {
  return matchAvailableDriversDetailed(pickupWilaya, destinationWilaya, drivers).map((r) => r.driver);
}

/**
 * التحقق من إتاحة السائق الحالي (هل هو معلن فارغ؟)
 */
export function isDriverAvailable(
  driverId: string,
  drivers: AvailableDriver[]
): AvailableDriver | null {
  return drivers.find((d) => d.driverId === driverId && d.status === 'EMPTY') || null;
}
