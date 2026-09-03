import React, { useState, useEffect } from 'react';
import { 
  X, 
  Camera, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Sparkles, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { StampLocation, HuntRecord } from '../types';
import { calculateDistanceMeters, formatDistance } from '../utils/geoUtils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StampLocation[];
  preSelectedLocation?: StampLocation | null;
  userCoords: { lat: number; lng: number } | null;
  onRequestGeolocation: () => void;
  onSuccessSubmit: (newHunt: Omit<HuntRecord, 'id' | 'createdAt' | 'likesCount' | 'likedByMe'>) => void;
  hunterName: string;
  hunterAvatar: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  locations,
  preSelectedLocation,
  userCoords,
  onRequestGeolocation,
  onSuccessSubmit,
  hunterName,
  hunterAvatar,
}) => {
  const [selectedLocId, setSelectedLocId] = useState<string>(
    preSelectedLocation?.id || locations[0]?.id || ''
  );
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [userNotes, setUserNotes] = useState<string>('');
  const [selectedInkColor, setSelectedInkColor] = useState<string>('#9f1239');
  const [isVerifyingGps, setIsVerifyingGps] = useState<boolean>(false);
  const [gpsVerified, setGpsVerified] = useState<boolean>(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  // Update selected location if preSelectedLocation changes
  useEffect(() => {
    if (preSelectedLocation) {
      setSelectedLocId(preSelectedLocation.id);
      setSelectedInkColor(preSelectedLocation.stampInkColor || '#9f1239');
    }
  }, [preSelectedLocation]);

  // Selected location object
  const activeLocation = locations.find((l) => l.id === selectedLocId);

  // Check GPS Proximity
  useEffect(() => {
    if (userCoords && activeLocation) {
      const dist = calculateDistanceMeters(
        userCoords.lat,
        userCoords.lng,
        activeLocation.lat,
        activeLocation.lng
      );
      setDistanceMeters(dist);
      // If within 300 meters, mark as GPS verified
      setGpsVerified(dist <= 300);
    } else {
      setDistanceMeters(null);
      setGpsVerified(false);
    }
  }, [userCoords, activeLocation]);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample stamps for quick testing
  const sampleImages = [
    { label: 'Stempel KAI Gambir', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cap Pos Pasar Baru', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80' },
    { label: 'Stempel Stasiun Bandung', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cap Lawang Sewu', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLocation) return;

    const finalPhoto = photoPreview || activeLocation.stampImageUrl;

    onSuccessSubmit({
      locationId: activeLocation.id,
      locationName: activeLocation.name,
      cityName: activeLocation.city,
      category: activeLocation.category,
      photoUrl: finalPhoto,
      stampInkColor: selectedInkColor,
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      userNotes: userNotes.trim() || 'Berhasil mengabadikan stempel resmi di lokasi!',
      isGpsVerified: gpsVerified,
      distanceMetersAtUpload: distanceMeters ?? undefined,
      userCoordinates: userCoords || undefined,
      hunterId: 'user-me',
      hunterName: hunterName,
      hunterAvatar: hunterAvatar,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200/90 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg tracking-tight">
                Upload Bukti Hunting Stempel
              </h2>
              <p className="text-xs text-zinc-300">
                Dokumentasikan cap hasil buruan ke paspor digitalmu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto">
          
          {/* 1. Pilih Lokasi Stempel */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Pilih Lokasi Stempel <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.city}) - {loc.category}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Verifikasi Geolocation / GPS Proximity Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-900" />
                Verifikasi Lokasi GPS:
              </span>
              {!userCoords && (
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifyingGps(true);
                    onRequestGeolocation();
                    setTimeout(() => setIsVerifyingGps(false), 1200);
                  }}
                  className="font-semibold text-rose-600 hover:underline"
                >
                  {isVerifyingGps ? 'Mengecek GPS...' : 'Aktifkan GPS'}
                </button>
              )}
            </div>

            {userCoords && activeLocation ? (
              <div className="flex items-center justify-between text-xs pt-1">
                {gpsVerified ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Terverifikasi di Lokasi ({formatDistance(distanceMeters)})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-stone-800 font-medium bg-stone-100 px-3 py-1 rounded-full border border-stone-200 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Jarak: {formatDistance(distanceMeters)} (Arsip manual tetap diizinkan)</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500">
                Izinkan akses lokasi browser untuk mendapatkan badge <strong className="text-emerald-700 font-semibold">Hunter Otentik GPS</strong>!
              </p>
            )}
          </div>

          {/* 3. Photo Upload / Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                Foto Stempel / Cap Asli <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                Bisa upload atau pilih preset
              </span>
            </label>

            {photoPreview ? (
              <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-dashed border-rose-500 bg-zinc-100">
                <img
                  src={photoPreview}
                  alt="Preview Bukti"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview('')}
                  className="absolute top-2 right-2 px-3 py-1 bg-zinc-900/70 hover:bg-zinc-900 text-white rounded-full text-xs font-semibold backdrop-blur-xs"
                >
                  Ganti Foto
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl bg-zinc-50 hover:bg-stone-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                  <span className="text-xs font-semibold text-zinc-700">
                    Klik untuk Ambil Foto / Pilih File
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    JPG, PNG dari kamera ponsel atau galeri
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Quick preset selector for desktop testing */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Atau gunakan contoh foto stempel:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {sampleImages.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoPreview(sample.url)}
                        className="p-1 rounded-xl border border-zinc-200 hover:border-zinc-400 text-left text-[10px] font-medium text-zinc-700 truncate bg-zinc-50 hover:bg-zinc-100 flex items-center gap-1 transition-colors"
                      >
                        <img src={sample.url} alt="" className="w-5 h-5 rounded-lg object-cover" />
                        <span className="truncate">{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Tanggal & Warna Tinta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-900" />
                Tanggal Berkunjung
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Warna Tinta Cap
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { color: '#9f1239', label: 'Merah Carmine' },
                  { color: '#18181b', label: 'Tinta Gelap' },
                  { color: '#1d4ed8', label: 'Biru Royal' },
                  { color: '#047857', label: 'Hijau Zamrud' },
                  { color: '#7c3aed', label: 'Ungu' },
                  { color: '#b45309', label: 'Cokelat Amber' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setSelectedInkColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform ${
                      selectedInkColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-zinc-900' : 'opacity-80'
                    }`}
                    title={c.label}
                  >
                    {selectedInkColor === c.color && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Catatan Singkat Hunter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Catatan Pengalaman (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Tintanya masih sangat basah, petugas CS peron 1 ramah sekali!"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan ke Paspor Digital & Feed</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
