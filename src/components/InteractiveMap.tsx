import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { StampLocation } from '../types';
import { getGoogleMapsDirUrl, getCategoryLabel } from '../utils/geoUtils';

interface InteractiveMapProps {
  locations: StampLocation[];
  selectedLocation: StampLocation | null;
  onSelectLocation: (location: StampLocation) => void;
  userCoords: { lat: number; lng: number } | null;
  onOpenUpload: (location: StampLocation) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userCoords,
  onOpenUpload,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center: Indonesia / Java center
    const defaultCenter: [number, number] = [-6.9147, 107.6025]; // Bandung / Java
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 7,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap Standard Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Location Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      // Create custom HTML icon
      const isSelected = selectedLocation?.id === loc.id;
      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case 'station': return '#1e3a8a';
          case 'post_office': return '#ea580c';
          case 'cafe': return '#d97706';
          case 'museum_landmark': return '#9333ea';
          case 'nature_tour': return '#15803d';
          default: return '#0284c7';
        }
      };

      const markerColor = getCategoryColor(loc.category);

      const customIcon = L.divIcon({
        className: 'custom-stamp-marker',
        html: `
          <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white ring-2 ring-black/10" style="background-color: ${markerColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="8"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            ${loc.isLimitedEvent ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-ping"></span><span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full"></span>' : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectLocation(loc);
        map.setView([loc.lat, loc.lng], 14, { animate: true });
      });

      markersRef.current[loc.id] = marker;
    });

    // If we have locations and no active selection, adjust bounds
    if (locations.length > 0 && !selectedLocation && !userCoords) {
      const group = L.featureGroup(Object.values(markersRef.current) as L.Layer[]);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [locations, selectedLocation, onSelectLocation]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></span>
            <div class="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Lokasi Anda Sekarang</b>');

      userMarkerRef.current = marker;
    }
  }, [userCoords]);

  // Pan to selected location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocation) return;

    map.setView([selectedLocation.lat, selectedLocation.lng], 14, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[550px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      {/* Map Container */}
      <div id="leaflet-map-element" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Selected Location Card Preview on Map */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {getCategoryLabel(selectedLocation.category)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {selectedLocation.city}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                {selectedLocation.name}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {selectedLocation.address}
              </p>
            </div>
            <button
              onClick={() => onSelectLocation(selectedLocation)}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 p-1"
            >
              Lihat Detail
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <a
              href={getGoogleMapsDirUrl(selectedLocation.lat, selectedLocation.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              Arahkan ke Lokasi (Google Maps)
            </a>
            <button
              onClick={() => onOpenUpload(selectedLocation)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
