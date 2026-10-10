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
import { isDriverAvailable } from './
