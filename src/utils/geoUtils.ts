import { StampCategory } from '../types';

/**
 * Calculate distance between two coordinates in meters using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format distance to human-readable string (e.g. "450 m" or "12.4 km").
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return '';
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Build exact Google Maps Navigation URL with instant navigation/start direction mode.
 */
export function getGoogleMapsDirUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&dir_action=navigate`;
}

export function getCategoryLabel(category: StampCategory): string {
  switch (category) {
    case 'station':
      return 'Stasiun Kereta';
    case 'post_office':
      return 'Kantor Pos';
    case 'cafe':
      return 'Kafe & Kopi';
    case 'museum_landmark':
      return 'Museum & Landmark';
    case 'nature_tour':
      return 'Wisata & Alam';
    case 'community_event':
      return 'Event Pop-up';
    case 'bookstore_art':
      return 'Art & Toko Buku';
    default:
      return 'Lokasi Stempel';
  }
}

export function getCategoryBadgeClass(category: StampCategory): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case 'station':
      return { bg: 'bg-blue-50 text-blue-800', text: 'text-blue-700', border: 'border-blue-200' };
    case 'post_office':
      return { bg: 'bg-orange-50 text-orange-800', text: 'text-orange-700', border: 'border-orange-200' };
    case 'cafe':
      return { bg: 'bg-amber-50 text-amber-800', text: 'text-amber-700', border: 'border-amber-200' };
    case 'museum_landmark':
      return { bg: 'bg-purple-50 text-purple-800', text: 'text-purple-700', border: 'border-purple-200' };
    case 'nature_tour':
      return { bg: 'bg-emerald-50 text-emerald-800', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'community_event':
      return { bg: 'bg-rose-50 text-rose-800', text: 'text-rose-700', border: 'border-rose-200' };
    case 'bookstore_art':
      return { bg: 'bg-teal-50 text-teal-800', text: 'text-teal-700', border: 'border-teal-200' };
    default:
      return { bg: 'bg-slate-100 text-slate-800', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
