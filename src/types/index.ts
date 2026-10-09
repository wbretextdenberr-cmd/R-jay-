// Types for رايح جاي (Rayeh Jay)
// تطبيق ربط أصحاب الحمولات بالناقلين العائدين (حل مشكلة الرحلة الفارغة في الجزائر)

export type Language = 'ar' | 'fr';

export type UserRole = 'client' | 'driver' | 'admin';

export type VehicleCategory = 
  | 'B_LIGHT'       // B النفعي: ≤ 3.5 طن
  | 'C1'            // C1: من 3.5 طن إلى 19 طن
  | 'C2'            // C2: أكثر من 19 طن
  | 'E_TRAILER'     // E: شاحنة + مقطورة > 750 كغ
  | 'PORTE_CHAR'    // Porte-char: عتاد ثقيل وجرافات
  | 'B_PASSENGER'   // B: سيارات سياحية ونفعية ≤ 9 أشخاص
  | 'D_BUS';        // D: حافلات النقل الجماعي > 9 أشخاص

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  wilaya: string;
  isPremium?: boolean;
  premiumPlan?: string;
  createdAt: string;
}

export interface DriverVerification {
  ninNumber: string; // رقم التعريف الوطني
  driverLicenseNumber: string; // رقم رخصة السياقة
  licenseIssueDate: string;
  transportPermitNumber: string; // رقم رخصة النقل
  idCardPhoto: string;
  licensePhoto: string;
  transportPermitPhoto: string;
  vehiclePhoto: string;
  trailerPhoto?: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'REJECTED';
  reliabilityScore: number; // e.g. 98%
  completedTrips: number;
}

export interface DriverVehicle {
  id: string;
  driverId: string;
  category: VehicleCategory;
  modelName: string;
  registrationNumber: string; // e.g. 01452-119-16
  maxPayloadKg: number;
  hasTrailer: boolean;
  trailerType?: string;
  photoUrl: string;
  trailerPhotoUrl?: string;
}

export type TripStatus = 'ACTIVE' | 'DELAYED' | 'ARRIVED' | 'RESTING';

export interface ReturnTrip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  reliabilityScore: number;
  vehicleCategory: VehicleCategory;
  vehicleName: string;
  vehiclePhoto: string;
  fromWilaya: string;
  fromCommune: string;
  toWilaya: string;
  toCommune: string;
  routeUsed: string; // e.g. "الطريق السيار شرق-غرب (A1)"
  departureTime: string;
  estimatedArrivalTime: string; // HH:mm
  acceptAlongRoute: boolean; // "أنقل لأي أحد على طول طريقي / في كل اتجاه"
  delayReason?: string;
  delayMinutes: number;
  fixedCommissionDzd: number;
  status: TripStatus;
  restUntil?: string; // وقت الراحة بعد الوصول
}

export interface CargoSearchQuery {
  pickupWilaya: string;
  dropoffWilaya: string;
  vehicleCategory?: VehicleCategory | 'ALL';
  cargoType?: string;
  cargoWeightKg?: number;
  alongRouteOnly?: boolean;
}

export type CallRequestStatus = 
  | 'PENDING_DRIVER'       // في انتظار تأكيد الناقل
  | 'ACCEPTED_WAITING_CALL'// السائق قبل -> في انتظار اتصال الزبون
  | 'IN_CALL'              // الزبون يتصل حالياً
  | 'AGREED'               // تم الاتفاق هاتفياً
  | 'REJECTED'             // رفض الناقل
  | 'REST_MODE';           // السائق دخل في وقت الراحة

export interface CallRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  tripId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  pickupWilaya: string;
  dropoffWilaya: string;
  cargoType: string;
  cargoWeight: string;
  notes?: string;
  commissionDzd: number;
  commissionApproved: boolean;
  status: CallRequestStatus;
  createdAt: string;
}

export interface WilayaData {
  code: string;
  nameFr: string;
  nameAr: string;
  lat: number;
  lng: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  titleAr: string;
  titleFr: string;
  bodyAr: string;
  bodyFr: string;
  type: 'incoming_call_request' | 'carrier_accepted' | 'carrier_delayed' | 'rest_mode_reminder' | 'system';
  read: boolean;
  timestamp: string;
  requestId?: string;
}
