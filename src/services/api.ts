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
import { IMG } from '../assets';

const STORAGE_KEYS = {
  USER: 'rayeh_jay_current_user',
  TRIPS: 'rayeh_jay_return_trips',
  CALLS: 'rayeh_jay_call_requests',
  VERIFICATION: 'rayeh_jay_driver_verification',
  NOTIFICATIONS: 'rayeh_jay_notifications',
  AVAILABLE: 'rayeh_jay_available_drivers'
};

const SEED_TRIPS: ReturnTrip[] = [
  {
    id: 'trip_1',
    driverId: 'drv_101',
    driverName: 'عمي الهاشمي بلقاسم',
    driverPhone: '0555 42 18 90',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    reliabilityScore: 99,
    vehicleCategory: 'PORTE_CHAR',
    vehicleName: 'Mercedes-Benz Actros 3340 Porte-char',
    vehiclePhoto: IMG.portechar,
    fromWilaya: 'ورقلة / حاسي مسعود',
    fromCommune: 'حاسي مسعود',
    toWilaya: 'الجزائر العاصمة',
    toCommune: 'الرويبة',
    routeUsed: 'الطريق الوطني رقم 1 (RN1 العابر للصحراء Trans-Saharienne)',
    departureTime: '06:00',
    estimatedArrivalTime: '16:30',
    acceptAlongRoute: true,
    delayMinutes: 0,
    fixedCommissionDzd: 3500,
    status: 'ACTIVE'
  },
  {
    id: 'trip_2',
    driverId: 'drv_102',
    driverName: 'كريم مرواني',
    driverPhone: '0661 78 33 21',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    reliabilityScore: 97,
    vehicleCategory: 'C2',
    vehicleName: 'Scania R450 شاحنة 26 طن',
    vehiclePhoto: IMG.freight,
    fromWilaya: 'وهران',
    fromCommune: 'السانية',
    toWilaya: 'قسنطينة',
    toCommune: 'الخروب',
    routeUsed: 'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
    departureTime: '08:30',
    estimatedArrivalTime: '15:15',
    acceptAlongRoute: true,
    delayReason: 'ازدحام طفيف بمحول الشفة بالبليدة',
    delayMinutes: 25,
    fixedCommissionDzd: 2000,
    status: 'DELAYED'
  },
  {
    id: 'trip_3',
    driverId: 'drv_103',
    driverName: 'سفيان دراجي',
    driverPhone: '0772 15 64 88',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    reliabilityScore: 96,
    vehicleCategory: 'B_LIGHT',
    vehicleName: 'Renault Master 3.5T Plateau',
    vehiclePhoto: 'https://images.unsplash.com/photo-1586191582056-a60216259020?auto=format&fit=crop&w=400&q=80',
    fromWilaya: 'سطيف',
    fromCommune: 'العلمة',
    toWilaya: 'الجزائر العاصمة',
    toCommune: 'باب الزوار',
    routeUsed: 'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
    departureTime: '10:00',
    estimatedArrivalTime: '13:45',
    acceptAlongRoute: true,
    delayMinutes: 0,
    fixedCommissionDzd: 500,
    status: 'ACTIVE'
  },
  {
    id: 'trip_4',
    driverId: 'drv_104',
    driverName: 'عمر بوقرة',
    driverPhone: '0550 99 22 41',
    driverAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    reliabilityScore: 98,
    vehicleCategory: 'E_TRAILER',
    vehicleName: 'Volvo FH16 Semi-Remorque 40T',
    vehiclePhoto: IMG.freight,
    fromWilaya: 'عنابة',
    fromCommune: 'سيدي عمار',
    toWilaya: 'البليدة',
    toCommune: 'بوفاريك',
    routeUsed: 'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
    departureTime: '05:00',
    estimatedArrivalTime: '14:20',
    acceptAlongRoute: true,
    delayMinutes: 0,
    fixedCommissionDzd: 2500,
    status: 'ACTIVE'
  },
  {
    id: 'trip_5',
    driverId: 'drv_105',
    driverName: 'نور الدين بوعلام',
    driverPhone: '0663 55 11 02',
    driverAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    reliabilityScore: 95,
    vehicleCategory: 'B_PASSENGER',
    vehicleName: 'Toyota HiAce 9 Places Minibus',
    vehiclePhoto: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80',
    fromWilaya: 'تلمسان',
    fromCommune: 'منصورة',
    toWilaya: 'الجزائر العاصمة',
    toCommune: 'بئر مراد رايس',
    routeUsed: 'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
    departureTime: '07:15',
    estimatedArrivalTime: '13:30',
    acceptAlongRoute: true,
    delayMinutes: 0,
    fixedCommissionDzd: 400,
    status: 'ACTIVE'
  }
];

export const api = {
  async getReturnTrips(): Promise<ReturnTrip[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(SEED_TRIPS));
    return SEED_TRIPS;
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

    return {
      ninNumber: '119850241852401',
      driverLicenseNumber: '08541296/16',
      licenseIssueDate: '2020-04-12',
      transportPermitNumber: 'RN-ALG-2024-998',
      idCardPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      licensePhoto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      transportPermitPhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      vehiclePhoto: IMG.portechar,
      trailerPhoto: IMG.freight,
      status: 'VERIFIED',
      reliabilityScore: 98,
      completedTrips: 47
    };
  },

  async saveDriverVerification(driverId: string, verif: DriverVerification): Promise<DriverVerification> {
    localStorage.setItem(`${STORAGE_KEYS.VERIFICATION}_${driverId}`, JSON.stringify(verif));
    return verif;
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

  // البحث: زبون يريد من origin إلى destination
  async searchAvailableDrivers(origin: string, destination: string): Promise<AvailableDriver[]> {
    const drivers = await this.getAvailableDrivers();
    return drivers.filter(d => {
      if (d.status !== 'EMPTY') return false;

      const route = [d.from, ...d.via, d.to];
      const originIdx = route.indexOf(origin);
      const destIdx = route.indexOf(destination);

      if (originIdx === -1 || destIdx === -1) return false;
      return originIdx < destIdx;
    });
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
