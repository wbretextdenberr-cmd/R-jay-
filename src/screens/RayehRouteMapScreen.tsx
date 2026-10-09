import React, { useEffect, useRef } from 'react';
import { Compass, Truck, Phone, Navigation, ShieldCheck } from 'lucide-react';
import { ReturnTrip, Language } from '../types';
import { WILAYAS, VEHICLE_CATEGORIES_INFO } from '../locales/translations';

interface RayehRouteMapScreenProps {
  returnTrips: ReturnTrip[];
  lang: Language;
  onSelectTrip: (trip: ReturnTrip) => void;
}

export const RayehRouteMapScreen: React.FC<RayehRouteMapScreenProps> = ({
  returnTrips,
  lang,
  onSelectTrip
}) => {
  const isAr = lang === 'ar';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // ✅ استيراد ديناميكي — لا يوقف تحميل التطبيق
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (cancelled || !mapContainerRef.current || mapInstanceRef.current) return;

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [36.25, 3.5],
        zoom: 7,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ تحديث العلامات عندما تتغير الرحلات
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // مسح الطبقات السابقة
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const highwayCoordinates: [number, number][] = [
      [34.88, -1.32], [35.19, -0.63], [35.70, -0.63], [35.74, 0.55],
      [36.26, 1.97], [36.47, 2.83], [36.75, 3.05], [36.76, 3.47],
      [36.38, 3.90], [36.19, 5.41], [36.36, 6.61], [36.90, 7.76]
    ];

    L.polyline(highwayCoordinates, {
      color: '#10b981',
      weight: 3,
      opacity: 0.7,
      dashArray: '6, 8'
    }).addTo(map);

    returnTrips.forEach((trip) => {
      if (trip.status === 'RESTING') return;

      const destWilaya = WILAYAS.find(w => trip.toWilaya.includes(w.nameAr) || trip.toWilaya.includes(w.nameFr)) || WILAYAS[0];
      const startWilaya = WILAYAS.find(w => trip.fromWilaya.includes(w.nameAr) || trip.fromWilaya.includes(w.nameFr)) || WILAYAS[1];

      L.circle([destWilaya.lat, destWilaya.lng], {
        radius: 30000,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.12,
        weight: 1.5
      }).addTo(map);

      L.polyline([[startWilaya.lat, startWilaya.lng], [destWilaya.lat, destWilaya.lng]], {
        color: '#34d399',
        weight: 2.5,
        opacity: 0.8
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 12px; background: #0f172a; border: 2px solid #10b981; box-shadow: 0 0 12px rgba(16,185,129,0.8); cursor: pointer;">
            <span style="font-size: 18px;">🚛</span>
            <span style="position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; background: #10b981; border-radius: 50%; border: 2px solid #000;"></span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([startWilaya.lat, startWilaya.lng], { icon: markerIcon }).addTo(map);

      marker.on('click', () => {
        onSelectTrip(trip);
      });
    });
  }, [returnTrips, onSelectTrip]);

  return (
    <div className="w-full flex-1 flex flex-col relative pb-20">
      <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none">
        <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-xl flex items-center justify-between pointer-events-auto" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
            <div>
              <h4 className="text-xs font-bold text-white">
                {isAr ? 'رادار المسارات ودائرة 30 كم' : 'Radar des Trajets & Rayon 30 km'}
              </h4>
              <p className="text-[10px] text-slate-400">
                {isAr ? 'اضغط على أي شاحنة في مسارك للاتصال' : 'Touchez un camion pour appeler le chauffeur'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            {returnTrips.filter(t => t.status !== 'RESTING').length} {isAr ? 'ناقل نشط' : 'actifs'}
          </span>
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full h-[620px] max-h-[80vh] flex-1" />
    </div>
  );
};
