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
import { AuthScreen } from './screens/AuthScreen';

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
import { api, EMPTY_VERIFICATION } from './services/api';
import { auth } from './services/auth';
import { IMG } from './assets';
import { isDriverAvailable } from './services/routeMatcher';

// أرقام الهاتف: تُقرأ من اليسار إلى اليمين حتى في الواجهة العربية (بدل أن تنقلب مجموعات الأرقام)
const PHONE_FIX_CSS = `
a[href^="tel:"].font-mono{direction:ltr;unicode-bidi:isolate;text-align:center}
p.font-mono.text-emerald-400.mt-0\\.5{direction:ltr;unicode-bidi:isolate;width:fit-content}
`;

interface MainAppProps {
  user: User;
  lang: Language;
  setLang: (l: Language) => void;
  onUserUpdate: (patch: Partial<Pick<User, 'name' | 'wilaya' | 'email' | 'isPremium' | 'premiumPlan'>>) => void;
  onLogout: () => void;
  onDeleteAccount: (password: string) => Promise<void>;
}

function MainApp({ user: currentUser, lang, setLang, onUserUpdate, onLogout, onDeleteAccount }: MainAppProps) {
  const currentRole: UserRole = currentUser.role;
  const [currentTab, setCurrentTab] = useState<string>('home');

  const [returnTrips, setReturnTrips] = useState<ReturnTrip[]>([]);
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>([]);
  const [driverVerification, setDriverVerification] = useState<DriverVerification>({ ...EMPTY_VERIFICATION });

  const [isSmartSuggestOpen, setIsSmartSuggestOpen] = useState(false);
  const [isDriverTripModalOpen, setIsDriverTripModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false);
  const [selectedTripForCall, setSelectedTripForCall] = useState<ReturnTrip | null>(null);
  const [suggestion, setSuggestion] = useState<{ category: VehicleCategory; nonce: number } | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);

  // السائق لا ينشر رحلة ولا يعلن توفره قبل أن يرسل وثائقه
  const guardDriverAction = (action: () => void) => {
    if (currentRole === 'driver' && driverVerification.status === 'NOT_SUBMITTED') {
      setVerificationRequired(true);
      setIsVerificationModalOpen(true);
      return;
    }
    action();
  };

  const handleSaveVerification = async (verif: DriverVerification) => {
    const saved = await api.saveDriverVerification(currentUser.id, verif);
    setDriverVerification(saved);
  };

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
  // نافذة إدارة الرحلة تخص الرحلة الجارية فقط. بعد الراحة أو الوصول تُفتح نافذة تسجيل رحلة جديدة.
  const manageableTrip =
    activeDriverTrip && activeDriverTrip.status !== 'RESTING' && activeDriverTrip.status !== 'ARRIVED'
      ? activeDriverTrip
      : null;
  const currentAvailability = isDriverAvailable(currentUser.id, availableDrivers);

  return (
    <CockpitFrame lang={lang}>
      <style>{PHONE_FIX_CSS}</style>
      <RayehTopBar
        user={currentUser}
        currentRole={currentRole}
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
            onOpenDriverTripModal={() => guardDriverAction(() => setIsDriverTripModalOpen(true))}
            onOpenAvailableModal={() => guardDriverAction(() => setIsAvailableModalOpen(true))}
            onOpenCallModal={(trip) => handleStartCall(trip)}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
            suggestion={suggestion}
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
            onLogout={onLogout}
            onDeleteAccount={onDeleteAccount}
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
        onApplyCategory={(cat) => {
          setSuggestion({ category: cat, nonce: Date.now() });
          setCurrentTab('home');
        }}
      />

      <DriverTripModal
        isOpen={isDriverTripModalOpen}
        onClose={() => setIsDriverTripModalOpen(false)}
        lang={lang}
        activeTrip={manageableTrip}
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
        onClose={() => {
          setIsVerificationModalOpen(false);
          setVerificationRequired(false);
        }}
        lang={lang}
        driverId={currentUser.id}
        existing={driverVerification}
        required={verificationRequired}
        onSaved={handleSaveVerification}
      />

      <ClientPremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        lang={lang}
        isPremium={!!currentUser.isPremium}
        onActivatePremium={() => onUserUpdate({ isPremium: true })}
      />
    </CockpitFrame>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    let alive = true;
    auth
      .getSession()
      .then(u => {
        if (alive) setUser(u);
      })
      .catch(() => {})
      .then(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const toggleLang = () => setLang(lang === 'ar' ? 'fr' : 'ar');

  const handleUserUpdate = async (
    patch: Partial<Pick<User, 'name' | 'wilaya' | 'email' | 'isPremium' | 'premiumPlan'>>
  ) => {
    if (!user) return;
    try {
      setUser(await auth.updateProfile(user.id, patch));
    } catch (_) {}
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const handleDeleteAccount = async (password: string) => {
    if (!user) return;
    await auth.deleteAccount(user.id, password);
    await api.deleteUserData(user.id);
    setUser(null);
  };

  if (!ready) {
    return <div className="min-h-screen w-full bg-slate-950" />;
  }

  if (!user) {
    return (
      <CockpitFrame lang={lang}>
        <AuthScreen lang={lang} onToggleLang={toggleLang} onAuthenticated={setUser} />
      </CockpitFrame>
    );
  }

  return (
    <MainApp
      key={user.id}
      user={user}
      lang={lang}
      setLang={setLang}
      onUserUpdate={handleUserUpdate}
      onLogout={handleLogout}
      onDeleteAccount={handleDeleteAccount}
    />
  );
}
