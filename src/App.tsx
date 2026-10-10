import React, { useState, useEffect } from 'react';
import { CockpitFrame } from './components/CockpitFrame';
import { RayehTopBar } from './components/RayehTopBar';
import { RayehBottomNav } from './components/RayehBottomNav';
import { SmartSuggestModal } from './components/SmartSuggestModal';
import { DriverTripModal } from './components/DriverTripModal';
import { CallProcessModal } from './components/CallProcessModal';
import { DriverVerificationModal } from './components/DriverVerificationModal';
import { ClientPremiumModal } from './components/ClientPremiumModal';
import { AvailableDriverModal } from './components/AvailableDriverModal';

import { RayehHomeScreen } from './screens/RayehHomeScreen';
import { RayehRouteMapScreen } from './screens/RayehRouteMapScreen';
import { RayehCallsScreen } from './screens/RayehCallsScreen';
import { RayehProfileScreen } from './screens/RayehProfileScreen';

import { 
  User, 
  UserRole, 
  Language, 
  ReturnTrip, 
  CallRequest, 
  DriverVerification,
  VehicleCategory,
  AvailableDriver
} from './types';
import { api } from './services/api';
import { IMG } from './assets';
import { isDriverAvailable } from './services/routeMatcher';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [currentTab, setCurrentTab] = useState<string>('home');

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_sofiane',
    name: 'سفيان دراجي',
    phone: '0550 12 34 56',
    email: 'sofiane.transport@algeria.dz',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    wilaya: 'الجزائر العاصمة',
    isPremium: false,
    createdAt: '2026-01-20T10:00:00Z'
  });

  const [returnTrips, setReturnTrips] = useState<ReturnTrip[]>([]);
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>([]);
  const [driverVerification, setDriverVerification] = useState<DriverVerification>({
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
  });

  const [isSmartSuggestOpen, setIsSmartSuggestOpen] = useState(false);
  const [isDriverTripModalOpen, setIsDriverTripModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false);
  const [selectedTripForCall, setSelectedTripForCall] = useState<ReturnTrip | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [trips, calls, verif, avail] = await Promise.all([
          api.getReturnTrips(),
          api.getCalls(),
          api.getDriverVerification(currentUser.id),
          api.getAvailableDrivers()
        ]);
        setReturnTrips(trips);
        setCallRequests(calls);
        setDriverVerification(verif);
        setAvailableDrivers(avail);
      } catch (err) {
        console.warn('Init error:', err);
      }
    };
    initData();
  }, [currentUser.id]);

  const handleSaveDriverTrip = async (tripData: any) => {
    const created = await api.createReturnTrip({
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      driverAvatar: currentUser.avatar,
      reliabilityScore: driverVerification.reliabilityScore,
      vehiclePhoto: IMG.portechar,
      ...tripData
    });
    setReturnTrips([created, ...returnTrips]);
  };

  const handleUpdateTripDelay = async (tripId: string, reason: string, minutes: number) => {
    const updated = await api.updateTripDelay(tripId, reason, minutes);
    if (updated) {
      setReturnTrips(returnTrips.map(t => t.id === tripId ? updated : t));
    }
  };

  const handleFinishTrip = async (tripId: string) => {
    const updated = await api.finishTripAndEnterRest(tripId);
    if (updated) {
      setReturnTrips(returnTrips.map(t => t.id === tripId ? updated : t));
    }
  };

  const handleStartCall = async (trip: ReturnTrip) => {
    setSelectedTripForCall(trip);
  };

  const handleAcceptCall = async (callId: string) => {
    const updated = await api.acceptCallRequest(callId);
    if (updated) {
      setCallRequests(callRequests.map(c => c.id === callId ? updated : c));
    }
  };

  const handleSetAvailable = async (data: {
    from: string;
    to: string;
    via: string[];
    departTime: string;
    vehicleCategory: VehicleCategory;
    vehicleName: string;
    fixedCommissionDzd: number;
  }) => {
    const created = await api.setDriverAvailable({
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      driverAvatar: currentUser.avatar,
      reliabilityScore: driverVerification.reliabilityScore,
      vehicleCategory: data.vehicleCategory,
      vehicleName: data.vehicleName,
      vehiclePhoto: IMG.portechar,
      from: data.from,
      to: data.to,
      via: data.via,
      departTime: data.departTime,
      fixedCommissionDzd: data.fixedCommissionDzd
    });

    setAvailableDrivers([
      created,
      ...availableDrivers.filter(d => d.driverId !== currentUser.id)
    ]);
  };

  const handleSetUnavailable = async () => {
    await api.setDriverUnavailable(currentUser.id);
    setAvailableDrivers(availableDrivers.filter(d => d.driverId !== currentUser.id));
  };

  const activeDriverTrip = returnTrips.find(t => t.driverId === currentUser.id) || returnTrips[0] || null;
  const currentAvailability = isDriverAvailable(currentUser.id, availableDrivers);

  return (
    <CockpitFrame lang={lang}>
      <RayehTopBar
        user={currentUser}
        currentRole={currentRole}
        onSwitchRole={(newRole) => setCurrentRole(newRole)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
        onOpenProfile={() => setCurrentTab('profile')}
      />

      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {currentTab === 'home' ? (
          <RayehHomeScreen
            user={currentUser}
            currentRole={currentRole}
            lang={lang}
            returnTrips={returnTrips}
            availableDrivers={availableDrivers}
            activeDriverTrip={activeDriverTrip}
            onOpenSmartSuggest={() => setIsSmartSuggestOpen(true)}
            onOpenDriverTripModal={() => setIsDriverTripModalOpen(true)}
            onOpenAvailableModal={() => setIsAvailableModalOpen(true)}
            onOpenCallModal={(trip) => handleStartCall(trip)}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
          />
        ) : currentTab === 'route_map' ? (
          <RayehRouteMapScreen
            returnTrips={returnTrips}
            lang={lang}
            onSelectTrip={(trip) => handleStartCall(trip)}
          />
        ) : currentTab === 'calls' ? (
          <RayehCallsScreen
            calls={callRequests}
            currentRole={currentRole}
            lang={lang}
            onAcceptCall={handleAcceptCall}
          />
        ) : currentTab === 'profile' ? (
          <RayehProfileScreen
            user={currentUser}
            currentRole={currentRole}
            verification={driverVerification}
            lang={lang}
            currentAvailability={currentAvailability}
            onToggleLang={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            onSwitchRole={(newRole) => setCurrentRole(newRole)}
            onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            onSetUnavailable={handleSetUnavailable}
          />
        ) : null}
      </main>

      <RayehBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        lang={lang}
        activeCallsCount={callRequests.filter(c => c.status === 'PENDING_DRIVER').length}
      />

      <SmartSuggestModal
        isOpen={isSmartSuggestOpen}
        onClose={() => setIsSmartSuggestOpen(false)}
        lang={lang}
        onApplyCategory={(cat) => {}}
      />

      <DriverTripModal
        isOpen={isDriverTripModalOpen}
        onClose={() => setIsDriverTripModalOpen(false)}
        lang={lang}
        activeTrip={activeDriverTrip}
        onSaveTrip={handleSaveDriverTrip}
        onUpdateDelay={handleUpdateTripDelay}
        onFinishTrip={handleFinishTrip}
      />

      <AvailableDriverModal
        isOpen={isAvailableModalOpen}
        onClose={() => setIsAvailableModalOpen(false)}
        lang={lang}
        onSetAvailable={handleSetAvailable}
      />

      <CallProcessModal
        trip={selectedTripForCall}
        isOpen={!!selectedTripForCall}
        onClose={() => setSelectedTripForCall(null)}
        lang={lang}
        clientName={currentUser.name}
        clientPhone={currentUser.phone}
        onCallAgreed={() => {
          if (selectedTripForCall) {
            api.createCallRequest({
              clientId: currentUser.id,
              clientName: currentUser.name,
              clientPhone: currentUser.phone,
              tripId: selectedTripForCall.id,
              driverId: selectedTripForCall.driverId,
              driverName: selectedTripForCall.driverName,
              driverPhone: selectedTripForCall.driverPhone,
              pickupWilaya: selectedTripForCall.fromWilaya,
              dropoffWilaya: selectedTripForCall.toWilaya,
              cargoType: selectedTripForCall.vehicleName,
              cargoWeight: 'حسب التفاوض',
              commissionDzd: selectedTripForCall.fixedCommissionDzd
            }).then(newCall => {
              setCallRequests([newCall, ...callRequests]);
            });
          }
        }}
      />

      <DriverVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        lang={lang}
        driverId={currentUser.id}
        onSaved={(verif) => setDriverVerification(verif)}
      />

      <ClientPremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        lang={lang}
        isPremium={!!currentUser.isPremium}
        onActivatePremium={() => {
          setCurrentUser({ ...currentUser, isPremium: true });
        }}
      />
    </CockpitFrame>
  );
}
