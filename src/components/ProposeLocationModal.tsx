import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';
import { ProposedLocation, StampCategory, StampLocation } from '../types';

interface ProposeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (proposal: Omit<ProposedLocation, 'id' | 'status' | 'submittedAt'>) => void;
  proposedLocations: ProposedLocation[];
  userCoords: { lat: number; lng: number } | null;
  onRequestGeolocation: () => void;
  userName: string;
}

export const ProposeLocationModal: React.FC<ProposeLocationModalProps> = ({
  isOpen,
  onClose,
  onSubmitProposal,
  proposedLocations,
  userCoords,
  onRequestGeolocation,
  userName,
}) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<StampCategory>('station');
  const [city, setCity] = useState<string>('Bandung');
  const [province, setProvince] = useState<string>('Jawa Barat');
  const [address, setAddress] = useState<string>('');
  const [lat, setLat] = useState<string>('-6.9147');
  const [lng, setLng] = useState<string>('107.6025');
  const [description, setDescription] = useState<string>('');
  const [tipLocation, setTipLocation] = useState<string>('');
  const [showSubmissions, setShowSubmissions] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleUseCurrentGPS = () => {
    if (userCoords) {
      setLat(userCoords.lat.toFixed(6));
      setLng(userCoords.lng.toFixed(6));
    } else {
      onRequestGeolocation();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onSubmitProposal({
      name: name.trim(),
      category,
      city: city.trim(),
      province: province.trim(),
      address: address.trim(),
      lat: parseFloat(lat) || -6.9147,
      lng: parseFloat(lng) || 107.6025,
      description: description.trim() || 'Stempel unik baru ditemukan oleh member komunitas.',
      tipLocation: tipLocation.trim() || 'Tersedia di meja resepsionis / meja informasi utama.',
      submittedBy: userName,
    });

    // Reset fields
    setName('');
    setAddress('');
    setDescription('');
    setTipLocation('');
    alert('Terima kasih! Usulan lokasi stempel baru berhasil dikirim dan masuk antrean kurasi komunitas.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg tracking-tight">
                Usulkan Lokasi Stempel Baru
              </h2>
              <p className="text-xs text-zinc-300">
                Bantu database komunitas berkembang dengan temuan barumu
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

        {/* Tab switch inside modal */}
        <div className="flex items-center border-b border-zinc-200 bg-zinc-50 px-5 pt-3">
          <button
            type="button"
            onClick={() => setShowSubmissions(false)}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              !showSubmissions ? 'border-rose-600 text-rose-600' : 'border-transparent text-zinc-500'
            }`}
          >
            Formulir Usulan
          </button>
          <button
            type="button"
            onClick={() => setShowSubmissions(true)}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              showSubmissions ? 'border-rose-600 text-rose-600' : 'border-transparent text-zinc-500'
            }`}
          >
            <span>Daftar Usulan Komunitas ({proposedLocations.length})</span>
          </button>
        </div>

        {/* Body */}
        {!showSubmissions ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 max-h-[calc(85vh-160px)] overflow-y-auto text-xs">
            
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Setiap lokasi yang kamu usulkan akan ditinjau oleh kurator komunitas sebelum tampil secara publik di peta direktori utama.
              </p>
            </div>

            {/* Nama Tempat */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                Nama Lokasi / Tempat Stempel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Museum Kereta Ambarawa"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            {/* Kategori & Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StampCategory)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="station">Stasiun Kereta Api</option>
                  <option value="post_office">Kantor Pos Indonesia</option>
                  <option value="cafe">Kafe & Kedai Kopi</option>
                  <option value="museum_landmark">Museum & Cagar Budaya</option>
                  <option value="nature_tour">Taman Wisata & Alam</option>
                  <option value="community_event">Event Pop-up Komunitas</option>
                  <option value="bookstore_art">Toko Buku & Art Studio</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Kota / Kabupaten</label>
                <input
                  type="text"
                  placeholder="Contoh: Semarang"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Jl. Stasiun No. 1, Panjang, Ambarawa"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 font-medium focus:outline-none"
              />
            </div>

            {/* Koordinat GPS */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">Koordinat Lat / Lng</label>
                <button
                  type="button"
                  onClick={handleUseCurrentGPS}
                  className="text-[11px] font-bold text-[#F97316] hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  Gunakan Posisi Saya
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Latitude (cth: -6.9147)"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Longitude (cth: 107.6025)"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-mono"
                />
              </div>
            </div>

            {/* Posisi Meja Stempel */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                Tips Posisi Meja / Letak Stempel <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Di meja customer service peron 1, minta ke petugas berseragam."
                required
                value={tipLocation}
                onChange={(e) => setTipLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 resize-none focus:outline-none"
              />
            </div>

            {/* Deskripsi Stempel */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Deskripsi Desain Stempel</label>
              <textarea
                rows={2}
                placeholder="Contoh: Motif lokomotif uap bergerigi dengan tulisan Ambarawa."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 resize-none focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {/* <Sparkles className="w-4 h-4" /> */}
                Kirim Usulan Lokasi
              </button>
            </div>

          </form>
        ) : (
          <div className="p-5 sm:p-6 space-y-3 max-h-[calc(85vh-160px)] overflow-y-auto">
            {proposedLocations.map((prop) => (
              <div key={prop.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{prop.name}</span>
                    <p className="text-[11px] text-slate-500">{prop.city} • {prop.address}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Menunggu Review
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl text-zinc-700">
                  <p className="text-[11px]"><strong>Meja Cap:</strong> {prop.tipLocation}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Diusulkan oleh: {prop.submittedBy} ({prop.submittedAt})</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
