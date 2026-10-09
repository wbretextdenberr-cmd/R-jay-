import React, { useState, useEffect } from 'react';
import { CockpitFrame } from './components/CockpitFrame';
import { RayehTopBar } from './components/RayehTopBar';
import { RayehBottomNav } from './components/RayehBottomNav';
import { SmartSuggestModal } from './components/SmartSuggestModal';
import { DriverTripModal } from './components/DriverTripModal';
import { CallProcessModal } from './components/CallProcessModal';
import { DriverVerificationModal } from './components/DriverVerificationModal';
import { ClientPremiumModal } from './components/ClientPremiumModal';

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
  VehicleCategory
} from './types';
import { api } from './services/api';
import { IMG } from './assets';

export default function App() {
  // 1. Core State
  const [lang, setLang] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<UserRole>('client'); // Default as Client (searching) with easy 1-click toggle to Driver
  const [isCockpitView, setIsCockpitView] = useState<boolean>(true); // Starts in cockpit phone view matching the user's reference image
  const [currentTab, setCurrentTab] = useState<string>('home');

  // 2. Active User
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

  // 3. Application Data
  const [returnTrips, setReturnTrips] = useState<ReturnTrip[]>([]);
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
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

  // 4. Modals State
  const [isSmartSuggestOpen, setIsSmartSuggestOpen] = useState(false);
  const [isDriverTripModalOpen, setIsDriverTripModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedTripForCall, setSelectedTripForCall] = useState<ReturnTrip | null>(null);

  // Sync HTML dir attribute with language (RTL for Arabic, LTR for French)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Load Trips, Calls, and Verification
  useEffect(() => {
    const initData = async () => {
      try {
        const [trips, calls, verif] = await Promise.all([
          api.getReturnTrips(),
          api.getCalls(),
          api.getDriverVerification(currentUser.id)
        ]);
        setReturnTrips(trips);
        setCallRequests(calls);
        setDriverVerification(verif);
      } catch (err) {
        console.warn('Init error:', err);
      }
    };
    initData();
  }, [currentUser.id]);

  // Handle Driver registering a new return trip
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

  // Handle Driver Delay update
  const handleUpdateTripDelay = async (tripId: string, reason: string, minutes: number) => {
    const updated = await api.updateTripDelay(tripId, reason, minutes);
    if (updated) {
      setReturnTrips(returnTrips.map(t => t.id === tripId ? updated : t));
    }
  };

  // Handle Driver Finishing Trip (triggers Rest Mode)
  const handleFinishTrip = async (tripId: string) => {
    const updated = await api.finishTripAndEnterRest(tripId);
    if (updated) {
      setReturnTrips(returnTrips.map(t => t.id === tripId ? updated : t));
    }
  };

  // Handle Client initiating call
  const handleStartCall = async (trip: ReturnTrip) => {
    setSelectedTripForCall(trip);
  };

  // Handle Driver accepting incoming call
  const handleAcceptCall = async (callId: string) => {
    const updated = await api.acceptCallRequest(callId);
    if (updated) {
      setCallRequests(callRequests.map(c => c.id === callId ? updated : c));
    }
  };

  // Active Driver Trip (if currently in driver mode)
  const activeDriverTrip = returnTrips.find(t => t.driverId === currentUser.id) || returnTrips[0] || null;

  return (
    <CockpitFrame
      isCockpitView={isCockpitView}
      onToggleView={() => setIsCockpitView(!isCockpitView)}
      lang={lang}
    >
      {/* Top Bar with Hazard Warning Triangle & Profile */}
      <RayehTopBar
        user={currentUser}
        currentRole={currentRole}
        onSwitchRole={(newRole) => setCurrentRole(newRole)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
        onOpenProfile={() => setCurrentTab('profile')}
      />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {currentTab === 'home' ? (
          <RayehHomeScreen
            user={currentUser}
            currentRole={currentRole}
            lang={lang}
            returnTrips={returnTrips}
            activeDriverTrip={activeDriverTrip}
            onOpenSmartSuggest={() => setIsSmartSuggestOpen(true)}
            onOpenDriverTripModal={() => setIsDriverTripModalOpen(true)}
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
            onToggleLang={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            onSwitchRole={(newRole) => setCurrentRole(newRole)}
            onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          />
        ) : null}
      </main>

      {/* Bottom Navigation with Green LED underglow */}
      <RayehBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        lang={lang}
        activeCallsCount={callRequests.filter(c => c.status === 'PENDING_DRIVER').length}
      />

      {/* MODALS */}

      {/* 1. Smart Suggest Modal ("زر اقتراح العربة") */}
      <SmartSuggestModal
        isOpen={isSmartSuggestOpen}
        onClose={() => setIsSmartSuggestOpen(false)}
        lang={lang}
        onApplyCategory={(cat) => {
          // Can filter or auto-select
        }}
      />

      {/* 2. Driver Return Trip Registration & Delay Management */}
      <DriverTripModal
        isOpen={isDriverTripModalOpen}
        onClose={() => setIsDriverTripModalOpen(false)}
        lang={lang}
        activeTrip={activeDriverTrip}
        onSaveTrip={handleSaveDriverTrip}
        onUpdateDelay={handleUpdateTripDelay}
        onFinishTrip={handleFinishTrip}
      />

      {/* 3. Direct Call Process Modal (Client calls & reveals phone) */}
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

      {/* 4. Driver Mandatory Verification Modal */}
      <DriverVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        lang={lang}
        driverId={currentUser.id}
        onSaved={(verif) => setDriverVerification(verif)}
      />

      {/* 5. Client 6 Premium Benefits Modal */}
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
