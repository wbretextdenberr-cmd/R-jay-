import { AvailableDriver } from '../types';

/**
 * منطق المطابقة: يتحقق أن pickupWilaya تقع قبل destinationWilaya
 * على مسار السائق (from → via → to).
 */
export function matchAvailableDrivers(
  pickupWilaya: string,
  destinationWilaya: string,
  drivers: AvailableDriver[]
): AvailableDriver[] {
  return drivers.filter((driver) => {
    if (driver.status !== 'EMPTY') return false;

    const route = [driver.from, ...driver.via, driver.to];
    const originIdx = route.indexOf(pickupWilaya);
    const destIdx = route.indexOf(destinationWilaya);

    // كلتا الولايتين موجودتان على المسار
    if (originIdx === -1 || destIdx === -1) return false;

    // الترتيب صحيح: نقطة الزبون قبل وجهته
    return originIdx < destIdx;
  });
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
