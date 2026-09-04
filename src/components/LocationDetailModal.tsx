import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Heart, 
  Camera, 
  CheckCircle2, 
  Info, 
  Share2, 
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StampLocation, HuntRecord } from '../types';
import { getGoogleMapsDirUrl, getCategoryLabel, getCategoryBadgeClass, formatDistance } from '../utils/geoUtils';
import { StampImpression } from './StampImpression';

interface LocationDetailModalProps {
  location: StampLocation | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (locId: string) => void;
  onOpenUpload: (loc: StampLocation) => void;
  distanceMeters?: number | null;
  communityHunts: HuntRecord[];
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onOpenUpload,
  distanceMeters,
  communityHunts,
}) => {
  if (!location) return null;

  const locHunts = communityHunts.filter((h) => h.locationId === location.id);
  const badgeColors = getCategoryBadgeClass(location.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Stempel ${location.name} - Stamp Hunter Indonesia`,
        text: `Ayo buru stempel ${location.name} di ${location.city}! Cek tips lokasi mejanya.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Stempel ${location.name} (${location.city}) - Koordinat: ${location.lat}, ${location.lng}. Panduan: ${location.tipLocation}`
      );
      alert('Info lokasi stempel berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200/90 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with Stamp Overlay */}
        <div className="relative h-48 sm:h-56 bg-zinc-900 overflow-hidden">
          <img
            src={location.stampImageUrl}
            alt={location.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/60 hover:bg-zinc-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Category & City Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${badgeColors.bg} border ${badgeColors.border} backdrop-blur-md`}>
              {getCategoryLabel(location.category)}
            </span>
            {location.isLimitedEvent && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                Event Rally
              </span>
            )}
          </div>

          {/* Bottom Title inside Image */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight drop-shadow-sm">
                {location.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {location.city}, {location.province}
                {distanceMeters !== undefined && distanceMeters !== null && (
                  <span className="ml-1 text-rose-300 font-semibold">
                    • {formatDistance(distanceMeters)} dari posisimu
                  </span>
                )}
              </p>
            </div>

            {/* Stamp Impression Mock */}
            <div className="hidden sm:block">
              <StampImpression
                name={location.name}
                category={location.category}
                city={location.city}
                inkColor={location.stampInkColor}
                shape={location.stampShape}
                size="sm"
                rotationDeg={-6}
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[calc(85vh-200px)] overflow-y-auto space-y-5">
          
          {/* Action Bar (Google Maps, Wishlist, Share) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              id="detail-maps-btn"
              href={getGoogleMapsDirUrl(location.lat, location.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4 text-rose-400" />
              <span>Arahkan ke Lokasi (Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              id="detail-wishlist-btn"
              onClick={() => onToggleWishlist(location.id)}
              className={`px-4 py-2.5 rounded-full border font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">
                {isWishlisted ? 'Di Wishlist' : 'Tandai Rencana'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
              title="Bagikan Lokasi"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Physical Stamp Location Tip */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-start gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl text-zinc-700 shrink-0">
              <Info className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                Tips Posisi Meja & Bak Stempel:
              </h4>
              <p className="text-sm font-medium text-zinc-800 mt-0.5">
                {location.tipLocation}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                💡 Saran: Bawa kertas paspor bergramatur &gt;100gsm agar tinta stempel tidak tembus.
              </p>
            </div>
          </div>

          {/* Description & Stamp Design Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              {/* <Sparkles className="w-4 h-4 text-rose-500" /> */}
              Tentang Desain Stempel
            </h3>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-sm text-zinc-700 space-y-1">
              <p className="font-semibold text-zinc-900">
                🏷️ {location.stampDesignName}
              </p>
              <p className="text-zinc-600 text-xs leading-relaxed">
                {location.description}
              </p>
            </div>
          </div>

          {/* Address & Coordinates */}
          <div className="text-xs text-zinc-500 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-1">
            <p className="font-semibold text-zinc-800">Alamat Lengkap:</p>
            <p className="text-zinc-600">{location.address}</p>
            <p className="font-mono text-[11px] text-zinc-400">
              Koordinat GPS: {location.lat}, {location.lng}
            </p>
          </div>

          {/* Community Hunter Gallery for this Location */}
          <div className="space-y-3 pt-2 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-rose-500" />
                  Galeri Hasil Buruan Komunitas ({locHunts.length})
                </h3>
                <p className="text-xs text-zinc-500">
                  Foto-foto stempel yang berhasil dicap oleh para member di lokasi ini
                </p>
              </div>
              <button
                onClick={() => onOpenUpload(location)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                Upload Hasilmu
              </button>
            </div>

            {locHunts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locHunts.map((hunt) => (
                  <div key={hunt.id} className="p-3.5 rounded-2xl border border-zinc-200/80 bg-white shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={hunt.hunterAvatar}
                        alt={hunt.hunterName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {hunt.hunterName}
                        </p>
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          {hunt.visitDate}
                        </p>
                      </div>
                      {hunt.isGpsVerified && (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5 uppercase tracking-wider" title="Terverifikasi GPS di Lokasi">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          GPS
                        </span>
                      )}
                    </div>

                    <div className="relative h-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                      <img
                        src={hunt.photoUrl}
                        alt={hunt.locationName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {hunt.userNotes && (
                      <p className="text-xs text-zinc-600 italic line-clamp-2">
                        &ldquo;{hunt.userNotes}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
                <Camera className="w-8 h-8 text-zinc-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-zinc-900">Belum ada foto buruan di lokasi ini</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Jadilah member pertama yang mendokumentasikan stempel ini!</p>
                <button
                  onClick={() => onOpenUpload(location)}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-semibold shadow-xs hover:bg-rose-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Upload Stempel Pertama
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => onOpenUpload(location)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Bukti Hunting</span>
          </button>
        </div>

      </div>
    </div>
  );
};
