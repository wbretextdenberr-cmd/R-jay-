// API client for رايح جاي (Rayeh Jay)
import { 
  User, 
  ReturnTrip, 
  CallRequest, 
  DriverVerification, 
  VehicleCategory, 
  NotificationItem, 
  DriverVehicle,
  AvailableDriver
} from '../types';
import { matchAvailableDrivers } from './routeMatcher';

const STORAGE_KEYS = {
  USER: 'rayeh_jay_current_user',
  TRIPS: 'rayeh_jay_return_trips',
  CALLS: 'rayeh_jay_call_requests',
  VERIFICATION: 'rayeh_jay_driver_verification',
  NOTIFICATIONS: 'rayeh_jay_notifications',
  AVAILABLE: 'rayeh_jay_available_drivers'
};

// إصدار بنية البيانات المحلية. عند تغييره تُمسح بيانات النسخ السابقة (الرحلات التجريبية القديمة) مرة واحدة.
const DATA_VERSION_KEY = 'rayeh_jay_data_version';
const DATA_VERSION = '2';

function purgeLegacyDemoData(): void {
  try {
    if (localStorage.getItem(DATA_VERSION_KEY) === DATA_VERSION) return;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('rayeh_jay_')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
  } catch (_) {}
}
purgeLegacyDemoData();

/** ملف توثيق فارغ لسائق جديد لم يرسل وثائقه بعد. 80 = نقطة بداية محايدة لمؤشر الموثوقية حتى تتوفر تقييمات حقيقية. */
export const EMPTY_VERIFICATION: DriverVerification = {
  ninNumber: '',
  driverLicenseNumber: '',
  licenseIssueDate: '',
  transportPermitNumber: '',
  idCardPhoto: '',
  licensePhoto: '',
  transportPermitPhoto: '',
  vehiclePhoto: '',
  status: 'NOT_SUBMITTED',
  reliabilityScore: 80,
  completedTrips: 0
};

export const api = {
  async getReturnTrips(): Promise<ReturnTrip[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return [];
  },

  async createReturnTrip(trip: Omit<ReturnTrip, 'id' | 'status'>): Promise<ReturnTrip> {
    const trips = await this.getReturnTrips();
    const newTrip: ReturnTrip = {
      ...trip,
      id: `trip_${Date.now()}`,
      status: 'ACTIVE'
    };
    const updated = [newTrip, ...trips];
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updated));
    return newTrip;
  },

  async updateTripDelay(tripId: string, delayReason: string, delayMinutes: number): Promise<ReturnTrip | null> {
    const trips = await this.getReturnTrips();
    const index = trips.findIndex(t => t.id === tripId);
    if (index === -1) return null;

    const trip = trips[index];
    const [hh, mm] = trip.estimatedArrivalTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hh || 12, (mm || 0) + delayMinutes, 0);
    const newEta = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    trip.delayReason = delayReason;
    trip.delayMinutes = delayMinutes;
    trip.status = delayMinutes > 0 ? 'DELAYED' : 'ACTIVE';
    trip.estimatedArrivalTime = newEta;

    trips[index] = trip;
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return trip;
  },

  async finishTripAndEnterRest(tripId: string): Promise<ReturnTrip | null> {
    const trips = await this.getReturnTrips();
    const index = trips.findIndex(t => t.id === tripId);
    if (index === -1) return null;

    const trip = trips[index];
    trip.status = 'RESTING';
    const restUntil = new Date(Date.now() + 4 * 60 * 60 * 1000);
    trip.restUntil = `${String(restUntil.getHours()).padStart(2, '0')}:${String(restUntil.getMinutes()).padStart(2, '0')}`;

    trips[index] = trip;
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return trip;
  },

  async getCalls(): Promise<CallRequest[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALLS);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  },

  async createCallRequest(data: Omit<CallRequest, 'id' | 'createdAt' | 'status' | 'commissionApproved'>): Promise<CallRequest> {
    const calls = await this.getCalls();
    const newCall: CallRequest = {
      ...data,
      id: `call_${Date.now()}`,
      status: 'PENDING_DRIVER',
      commissionApproved: true,
      createdAt: new Date().toISOString()
    };
    const updated = [newCall, ...calls];
    localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(updated));
    return newCall;
  },

  async acceptCallRequest(callId: string): Promise<CallRequest | null> {
    const calls = await this.getCalls();
    const index = calls.findIndex(c => c.id === callId);
    if (index === -1) return null;

    calls[index].status = 'ACCEPTED_WAITING_CALL';
    localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(calls));
    return calls[index];
  },

  async getDriverVerification(driverId: string): Promise<DriverVerification> {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.VERIFICATION}_${driverId}`);
      if (stored) return JSON.parse(stored);
    } catch (_) {}

    return { ...EMPTY_VERIFICATION };
  },

  async saveDriverVerification(driverId: string, verif: DriverVerification): Promise<DriverVerification> {
    try {
      localStorage.setItem(`${STORAGE_KEYS.VERIFICATION}_${driverId}`, JSON.stringify(verif));
    } catch (_) {
      throw new Error('STORAGE_FULL');
    }
    return verif;
  },

  /** حذف كل بيانات مستخدم (رحلاته وطلباته وإتاحته ووثائقه) عند حذف حسابه */
  async deleteUserData(userId: string): Promise<void> {
    try {
      const trips = (await this.getReturnTrips()).filter(t => t.driverId !== userId);
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      const calls = (await this.getCalls()).filter(c => c.clientId !== userId && c.driverId !== userId);
      localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(calls));
      const avail = (await this.getAvailableDrivers()).filter(d => d.driverId !== userId);
      localStorage.setItem(STORAGE_KEYS.AVAILABLE, JSON.stringify(avail));
      localStorage.removeItem(`${STORAGE_KEYS.VERIFICATION}_${userId}`);
    } catch (_) {}
  },

  // ============ AVAILABLE DRIVERS (الميزة الجديدة) ============

  async getAvailableDrivers(): Promise<AvailableDriver[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AVAILABLE);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  },

  async setDriverAvailable(data: Omit<AvailableDriver, 'id' | 'createdAt' | 'status'>): Promise<AvailableDriver> {
    const drivers = await this.getAvailableDrivers();
    // إزالة أي إتاحة سابقة لنفس السائق
    const filtered = drivers.filter(d => d.driverId !== data.driverId);
    const newAvailable: AvailableDriver = {
      ...data,
      id: `avail_${Date.now()}`,
      status: 'EMPTY',
      createdAt: new Date().toISOString()
    };
    const updated = [newAvailable, ...filtered];
    localStorage.setItem(STORAGE_KEYS.AVAILABLE, JSON.stringify(updated));
    return newAvailable;
  },

  async setDriverUnavailable(driverId: string): Promise<void> {
    const drivers = await this.getAvailableDrivers();
    const filtered = drivers.filter(d => d.driverId !== driverId);
    localStorage.setItem(STORAGE_KEYS.AVAILABLE, JSON.stringify(filtered));
  },

  // البحث: زبون يريد من origin إلى destination (نفس منطق المطابقة المستعمل في الشاشة)
  async searchAvailableDrivers(origin: string, destination: string): Promise<AvailableDriver[]> {
    const drivers = await this.getAvailableDrivers();
    return matchAvailableDrivers(origin, destination, drivers);
  },

  suggestVehicleCategory(weightKg: number, description: string): {
    category: VehicleCategory;
    reason: string;
    estimatedWeight: string;
  } {
    const lower = description.toLowerCase();
    
    if (
      lower.includes('جرافة') || 
      lower.includes('حفارة') || 
      lower.includes('جرار') || 
      lower.includes('عتاد') || 
      lower.includes('engin') || 
      lower.includes('pelle') || 
      lower.includes('retrochargeur')
    ) {
      return {
        category: 'PORTE_CHAR',
        reason: 'المنقول عبارة عن عتاد هندسي أو جرافات أشغال عمومية تتطلب شاحنة بورت شار مسطحة خاصة.',
        estimatedWeight: 'حمولة عتاد ثقيل (20-40 طن)'
      };
    }

    if (
      lower.includes('ركاب') || 
      lower.includes('أشخاص') || 
      lower.includes('passager') || 
      lower.includes('famille') || 
      lower.includes('عمال')
    ) {
      if (lower.includes('فريق') || lower.includes('أكثر من 9') || lower.includes('حافلة')) {
        return {
          category: 'D_BUS',
          reason: 'عدد الأفراد كبير ويتطلب حافلة نقل جماعي (أكثر من 9 أشخاص).',
          estimatedWeight: 'نقل جماعي'
        };
      }
      return {
        category: 'B_PASSENGER',
        reason: 'نقل أفراد أو عائلات (حد أقصى 9 أشخاص) يناسبه صنف B السياحي أو الفان.',
        estimatedWeight: 'حتى 9 أشخاص'
      };
    }

    if (weightKg > 19000 || lower.includes('حاوية') || lower.includes('كونتنر') || lower.includes('حبوب')) {
      return {
        category: 'E_TRAILER',
        reason: 'الوزن يتجاوز 19 طناً أو بضاعة حاويات وموانئ تستوجب شاحنة بمقطورة (Semi-remorque صنف E).',
        estimatedWeight: `${(weightKg / 1000).toFixed(1)} طن (صنف E)`
      };
    }

    if (weightKg > 3500 && weightKg <= 19000) {
      return {
        category: 'C1',
        reason: 'الوزن يتراوح بين 3.5 طن و 19 طن وهو مخصص للشاحنات المتوسطة C1.',
        estimatedWeight: `${(weightKg / 1000).toFixed(1)} طن (صنف C1)`
      };
    }

    if (weightKg > 19000) {
      return {
        category: 'C2',
        reason: 'الوزن الإجمالي يتعدى 19 طناً ويتطلب شاحنة نقل ثقيل C2.',
        estimatedWeight: `${(weightKg / 1000).toFixed(1)} طن (صنف C2)`
      };
    }

    return {
      category: 'B_LIGHT',
      reason: 'الوزن أقل من 3.5 طن (بضائع تجارية، أثاث خفيف، طرود، أجهزة) وتكفيها شاحنة نفعية صغيرة صنف B (هاربيل / ماستر).',
      estimatedWeight: weightKg ? `${weightKg} كغ (صنف B)` : '≤ 3.5 طن'
    };
  }
};
