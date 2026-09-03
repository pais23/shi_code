import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink, 
  Flag, 
  Camera, 
  Layers, 
  Info,
  Check,
  Navigation,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  StampLocation, 
  ProposedLocation, 
  StampRally, 
  HuntRecord, 
  StampCategory 
} from '../types';
import { getCategoryLabel, getCategoryBadgeClass, getGoogleMapsDirUrl } from '../utils/geoUtils';

export type AdminTab = 'proposals' | 'locations' | 'rallies' | 'feed';

interface AdminPortalProps {
  locations: StampLocation[];
  proposedLocations: ProposedLocation[];
  rallies: StampRally[];
  hunts: HuntRecord[];
  onApproveProposal: (proposal: ProposedLocation, customData?: Partial<StampLocation>) => void;
  onRejectProposal: (proposalId: string, reason?: string) => void;
  onAddLocation: (loc: Omit<StampLocation, 'id' | 'totalHuntedCount' | 'rating' | 'contributedBy' | 'isVerifiedLocation'>) => void;
  onUpdateLocation: (locId: string, updated: Partial<StampLocation>) => void;
  onDeleteLocation: (locId: string) => void;
  onAddRally: (rally: Omit<StampRally, 'id'>) => void;
  onUpdateRallyStatus: (rallyId: string, status: 'active' | 'upcoming' | 'completed') => void;
  onDeleteRally: (rallyId: string) => void;
  onDeleteHunt: (huntId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  locations,
  proposedLocations,
  rallies,
  hunts,
  onApproveProposal,
  onRejectProposal,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  onAddRally,
  onUpdateRallyStatus,
  onDeleteRally,
  onDeleteHunt,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('proposals');

  // Locations management state
  const [locSearch, setLocSearch] = useState<string>('');
  const [locCatFilter, setLocCatFilter] = useState<string>('all');
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<StampLocation | null>(null);

  // New location form state
  const [newLocName, setNewLocName] = useState('');
  const [newLocCategory, setNewLocCategory] = useState<StampCategory>('station');
  const [newLocCity, setNewLocCity] = useState('Bandung');
  const [newLocProvince, setNewLocProvince] = useState('Jawa Barat');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocLat, setNewLocLat] = useState('-6.9147');
  const [newLocLng, setNewLocLng] = useState('107.6025');
  const [newLocStampName, setNewLocStampName] = useState('');
  const [newLocInkColor, setNewLocInkColor] = useState('#9f1239');
  const [newLocShape, setNewLocShape] = useState<'round' | 'square' | 'shield' | 'oval' | 'hexagon'>('round');
  const [newLocTip, setNewLocTip] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  // Rally management state
  const [isAddRallyModalOpen, setIsAddRallyModalOpen] = useState<boolean>(false);
  const [newRallyTitle, setNewRallyTitle] = useState('');
  const [newRallySubtitle, setNewRallySubtitle] = useState('');
  const [newRallyDesc, setNewRallyDesc] = useState('');
  const [newRallyTag, setNewRallyTag] = useState('');
  const [newRallyOrganizer, setNewRallyOrganizer] = useState('Komunitas Stamp Hunter');
  const [newRallyReward, setNewRallyReward] = useState('Sertifikat Digital & E-Badge Khusus');
  const [newRallyCheckpoints, setNewRallyCheckpoints] = useState<string[]>([]);
  const [newRallyStartDate, setNewRallyStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRallyEndDate, setNewRallyEndDate] = useState('2026-12-31');

  // Filtered locations
  const filteredLocations = locations.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(locSearch.toLowerCase()) ||
      l.city.toLowerCase().includes(locSearch.toLowerCase()) ||
      l.address.toLowerCase().includes(locSearch.toLowerCase());
    const matchCat = locCatFilter === 'all' || l.category === locCatFilter;
    return matchSearch && matchCat;
  });

  const handleCreateLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocAddress.trim()) return;

    onAddLocation({
      name: newLocName.trim(),
      category: newLocCategory,
      city: newLocCity.trim(),
      province: newLocProvince.trim(),
      address: newLocAddress.trim(),
      lat: parseFloat(newLocLat) || -6.9147,
      lng: parseFloat(newLocLng) || 107.6025,
      stampImageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
      stampDesignName: newLocStampName.trim() || `Cap Resmi ${newLocName}`,
      stampShape: newLocShape,
      stampInkColor: newLocInkColor,
      description: newLocDesc.trim() || 'Titik stempel resmi ditambahkan oleh tim admin kurator.',
      tipLocation: newLocTip.trim() || 'Tersedia di meja layanan pengunjung / customer service.',
      isLimitedEvent: false,
      status: 'active',
    });

    setIsAddLocationModalOpen(false);
    // Reset
    setNewLocName('');
    setNewLocAddress('');
    setNewLocTip('');
    setNewLocDesc('');
  };

  const handleSaveEditLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;
    onUpdateLocation(editingLocation.id, editingLocation);
    setEditingLocation(null);
  };

  const handleCreateRallySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRallyTitle.trim() || newRallyCheckpoints.length === 0) {
      alert('Pilih minimal 1 titik checkpoint stempel untuk rally ini.');
      return;
    }

    onAddRally({
      title: newRallyTitle.trim(),
      subtitle: newRallySubtitle.trim() || 'Jelajahi rute bertema dan kumpulkan cap stempelnya.',
      description: newRallyDesc.trim() || 'Rally resmi kurator Stamp Hunter ID.',
      tag: newRallyTag.trim() || 'Rally Khusus',
      organizer: newRallyOrganizer.trim(),
      bannerUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      startDate: newRallyStartDate,
      endDate: newRallyEndDate,
      status: 'active',
      rewardDescription: newRallyReward.trim(),
      rewardBadgeId: 'badge-10-stamps',
      checkpointLocationIds: newRallyCheckpoints,
    });

    setIsAddRallyModalOpen(false);
    setNewRallyTitle('');
    setNewRallySubtitle('');
    setNewRallyCheckpoints([]);
  };

  const pendingProposalsCount = proposedLocations.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-stone-100/70 text-zinc-900 pb-28 md:pb-16">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-zinc-900 text-white border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Title & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-xs shrink-0 overflow-hidden">
                <img
                  src="/assets/stamp_hunter_logo.png"
                  alt="Stamp Hunter Indonesia"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-lg font-display font-bold tracking-tight text-white leading-tight truncate">
                    Panel Kurator
                  </h1>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                    Staff
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate hidden xs:block">
                  Stamp Hunter ID • Kurasi & Kelola Titik Stempel
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">

        {/* 1. Statistics Cards (Mobile-friendly compact 2x2 grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          <div 
            onClick={() => setActiveAdminTab('proposals')}
            className={`p-3 sm:p-4 rounded-2xl bg-white border cursor-pointer transition-all active:scale-98 ${
              activeAdminTab === 'proposals' ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'border-zinc-200/90 shadow-2xs hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">
                Usulan Menunggu
              </span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
              {pendingProposalsCount}
            </p>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate mt-0.5">
              {pendingProposalsCount > 0 ? 'Perlu diverifikasi' : 'Antrean bersih'}
            </span>
          </div>

          <div 
            onClick={() => setActiveAdminTab('locations')}
            className={`p-3 sm:p-4 rounded-2xl bg-white border cursor-pointer transition-all active:scale-98 ${
              activeAdminTab === 'locations' ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'border-zinc-200/90 shadow-2xs hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">
                Titik Stempel
              </span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
              {locations.length}
            </p>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate mt-0.5">
              Tersebar di peta
            </span>
          </div>

          <div 
            onClick={() => setActiveAdminTab('rallies')}
            className={`p-3 sm:p-4 rounded-2xl bg-white border cursor-pointer transition-all active:scale-98 ${
              activeAdminTab === 'rallies' ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'border-zinc-200/90 shadow-2xs hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">
                Stamp Rally
              </span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
              {rallies.length}
            </p>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate mt-0.5">
              {rallies.filter((r) => r.status === 'active').length} rally aktif
            </span>
          </div>

          <div 
            onClick={() => setActiveAdminTab('feed')}
            className={`p-3 sm:p-4 rounded-2xl bg-white border cursor-pointer transition-all active:scale-98 ${
              activeAdminTab === 'feed' ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'border-zinc-200/90 shadow-2xs hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">
                Bukti Buruan
              </span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
              {hunts.length}
            </p>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate mt-0.5">
              Upload foto member
            </span>
          </div>

        </div>

        {/* 2. Desktop Workspace Tabs (Hidden on mobile, mobile uses bottom dock) */}
        <div className="hidden md:flex bg-white rounded-2xl border border-zinc-200/90 p-1.5 items-center gap-1 shadow-xs">
          <button
            onClick={() => setActiveAdminTab('proposals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeAdminTab === 'proposals'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Antrean Usulan Member</span>
            {pendingProposalsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {pendingProposalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('locations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeAdminTab === 'locations'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Kelola Titik Stempel ({locations.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('rallies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeAdminTab === 'rallies'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Kelola Stamp Rally ({rallies.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('feed')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeAdminTab === 'feed'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Moderasi Feed Buruan ({hunts.length})</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB A: PROPOSALS CURATION */}
        {activeAdminTab === 'proposals' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                  Antrean Kurasi Usulan Stempel Baru
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-500">
                  Verifikasi titik stempel yang diajukan member sebelum ditampilkan di peta publik.
                </p>
              </div>
            </div>

            {proposedLocations.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-zinc-200/90 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-800">Antrean Bersih</h3>
                <p className="text-xs text-zinc-500">
                  Belum ada usulan lokasi baru yang menunggu ditinjau.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {proposedLocations.map((prop) => {
                  const isPending = prop.status === 'pending';
                  const gmapsNavUrl = getGoogleMapsDirUrl(prop.lat, prop.lng);

                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3.5"
                    >
                      <div className="space-y-3">
                        
                        {/* Header: Badge & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              {getCategoryLabel(prop.category)}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 mt-1 leading-snug break-words">
                              {prop.name}
                            </h3>
                            <p className="text-xs text-zinc-500">
                              {prop.city}, {prop.province}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shrink-0 ${
                              isPending
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : prop.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{isPending ? 'Menunggu' : prop.status === 'approved' ? 'Disetujui' : 'Ditolak'}</span>
                          </span>
                        </div>

                        {/* Details Box */}
                        <div className="p-3 bg-zinc-50/80 rounded-xl space-y-2 text-xs border border-zinc-100">
                          <div>
                            <span className="font-semibold text-zinc-700 block text-[11px]">Alamat Lengkap:</span>
                            <p className="text-zinc-600 mt-0.5 break-words">{prop.address}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-700 block text-[11px]">Panduan Posisi Meja Stempel:</span>
                            <p className="text-zinc-600 mt-0.5 italic break-words">"{prop.tipLocation}"</p>
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-700 block text-[11px]">Deskripsi Stempel:</span>
                            <p className="text-zinc-600 mt-0.5 break-words">{prop.description}</p>
                          </div>
                        </div>

                        {/* Submitter & Gmaps */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[11px] text-zinc-500 pt-1">
                          <span className="truncate">
                            Oleh: <strong className="text-zinc-700">{prop.submittedBy}</strong> ({prop.submittedAt})
                          </span>
                          <a
                            href={gmapsNavUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold shrink-0"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Tes Start Rute</span>
                          </a>
                        </div>
                      </div>

                      {/* Action Buttons (Ergonomic for touch) */}
                      {isPending && (
                        <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onRejectProposal(prop.id, 'Data lokasi belum lengkap atau stempel tidak lagi tersedia.')}
                            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 transition-colors flex items-center justify-center gap-1 active:scale-95"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>

                          <button
                            onClick={() => onApproveProposal(prop)}
                            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center justify-center gap-1 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB B: MANAGE LOCATIONS */}
        {activeAdminTab === 'locations' && (
          <div className="space-y-3 sm:space-y-4">
            
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                  Katalog Titik Stempel Terdaftar ({filteredLocations.length})
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-500">
                  Kelola data titik stempel, ubah panduan meja cap, atau tambahkan lokasi baru.
                </p>
              </div>

              <button
                onClick={() => setIsAddLocationModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Titik Stempel Baru</span>
              </button>
            </div>

            {/* Filter and Search Bar (Responsive) */}
            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-zinc-200/90 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari stasiun, kafe, kota..."
                  value={locSearch}
                  onChange={(e) => setLocSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="w-full sm:w-auto shrink-0">
                <select
                  value={locCatFilter}
                  onChange={(e) => setLocCatFilter(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="station">Stasiun Kereta</option>
                  <option value="post_office">Kantor Pos</option>
                  <option value="cafe">Kafe & Kopi</option>
                  <option value="museum_landmark">Museum & Landmark</option>
                  <option value="nature_tour">Wisata & Alam</option>
                  <option value="bookstore_art">Art & Toko Buku</option>
                </select>
              </div>
            </div>

            {/* Location Cards (Clean mobile layout) */}
            <div className="space-y-2.5">
              {filteredLocations.map((loc) => {
                const navUrl = getGoogleMapsDirUrl(loc.lat, loc.lng);

                return (
                  <div
                    key={loc.id}
                    className="p-3.5 sm:p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all space-y-3"
                  >
                    {/* Top Row: Icon + Name & Status */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: loc.stampInkColor || '#9f1239' }}
                      >
                        <span className="font-display font-bold text-xs uppercase">
                          {loc.name.slice(0, 2)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-zinc-900 break-words">
                            {loc.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-zinc-700">
                            {getCategoryLabel(loc.category)}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {loc.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 break-words">
                          {loc.city}, {loc.province} • {loc.address}
                        </p>
                      </div>
                    </div>

                    {/* Meja Stempel Guide */}
                    <div className="p-2.5 bg-zinc-50 rounded-xl text-xs text-zinc-700 border border-zinc-100">
                      <span className="font-semibold text-zinc-800 text-[11px]">Posisi Meja Stempel: </span>
                      <span className="italic text-zinc-600">"{loc.tipLocation}"</span>
                    </div>

                    {/* Mobile Ergonomic Action Toolbar */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <a
                        href={navUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Rute Maps</span>
                      </a>

                      <button
                        onClick={() => setEditingLocation(loc)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus titik stempel "${loc.name}"?`)) {
                            onDeleteLocation(loc.id);
                          }
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 transition-colors active:scale-95"
                        aria-label="Hapus Lokasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB C: MANAGE RALLIES */}
        {activeAdminTab === 'rallies' && (
          <div className="space-y-3 sm:space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                  Daftar Stamp Rally Bertema ({rallies.length})
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-500">
                  Susun rute rally dan event berburu cap untuk komunitas hunter.
                </p>
              </div>

              <button
                onClick={() => setIsAddRallyModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Stamp Rally Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {rallies.map((rally) => (
                <div
                  key={rally.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                          {rally.tag}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 mt-1 break-words">
                          {rally.title}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Oleh: {rally.organizer}
                        </p>
                      </div>

                      <select
                        value={rally.status}
                        onChange={(e) =>
                          onUpdateRallyStatus(
                            rally.id,
                            e.target.value as 'active' | 'upcoming' | 'completed'
                          )
                        }
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border focus:outline-none shrink-0 ${
                          rally.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : rally.status === 'upcoming'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <option value="active">Aktif</option>
                        <option value="upcoming">Mendatang</option>
                        <option value="completed">Selesai</option>
                      </select>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed break-words">
                      {rally.description}
                    </p>

                    <div className="p-3 bg-zinc-50 rounded-xl space-y-1.5 text-xs border border-zinc-100">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Checkpoint:</span>
                        <span className="font-bold text-zinc-900">
                          {rally.checkpointLocationIds.length} Lokasi Stempel
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Periode:</span>
                        <span className="font-medium text-zinc-800 text-[11px]">
                          {rally.startDate} s/d {rally.endDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Reward:</span>
                        <span className="font-semibold text-rose-600 text-right truncate ml-2">
                          {rally.rewardDescription}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm(`Yakin ingin menghapus rally "${rally.title}"?`)) {
                          onDeleteRally(rally.id);
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-zinc-200 transition-colors flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Stamp Rally</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB D: MODERATE COMMUNITY HUNTS */}
        {activeAdminTab === 'feed' && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                Moderasi Foto & Bukti Buruan Member ({hunts.length})
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500">
                Pantau keaslian stempel yang di-upload member dan bersihkan konten yang tidak sesuai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {hunts.map((hunt) => (
                <div
                  key={hunt.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div className="p-3.5 flex items-center justify-between gap-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={hunt.hunterAvatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-zinc-900 leading-tight truncate">
                          {hunt.hunterName}
                        </h4>
                        <span className="text-[10px] text-zinc-500">{hunt.visitDate}</span>
                      </div>
                    </div>

                    {hunt.isGpsVerified ? (
                      <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        GPS Verified
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full shrink-0">
                        Manual
                      </span>
                    )}
                  </div>

                  <div className="h-44 sm:h-48 bg-zinc-100 relative">
                    <img
                      src={hunt.photoUrl}
                      alt={hunt.locationName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-zinc-950/80 backdrop-blur-xs p-2 rounded-xl text-white text-xs">
                      <p className="font-semibold truncate">{hunt.locationName}</p>
                      <p className="text-[10px] text-zinc-300 truncate">{hunt.cityName}</p>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    {hunt.userNotes && (
                      <p className="text-xs text-zinc-600 italic break-words">
                        "{hunt.userNotes}"
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                      <span>{hunt.likesCount} Hunter menyukai</span>
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus kiriman bukti hunting ini dari linimasa?')) {
                            onDeleteHunt(hunt.id);
                          }
                        }}
                        className="text-xs font-semibold text-zinc-500 hover:text-rose-600 flex items-center gap-1 transition-colors active:scale-95 py-1 px-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 4. MODALS FOR ADMIN ACTIONS (Responsive Bottom-sheet / Dialog) */}

      {/* Modal A: Tambah Lokasi Stempel Baru */}
      {isAddLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/90 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden w-12 h-1 bg-zinc-300 rounded-full mx-auto my-2" />

            <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm sm:text-base">
                    Tambah Titik Stempel Baru
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    Input lokasi stempel langsung ke peta utama
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddLocationModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLocationSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Nama Tempat / Lokasi Stempel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Stasiun Solo Balapan"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Kategori</label>
                  <select
                    value={newLocCategory}
                    onChange={(e) => setNewLocCategory(e.target.value as StampCategory)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="station">Stasiun Kereta</option>
                    <option value="post_office">Kantor Pos</option>
                    <option value="cafe">Kafe & Kopi</option>
                    <option value="museum_landmark">Museum & Landmark</option>
                    <option value="nature_tour">Wisata & Alam</option>
                    <option value="bookstore_art">Art & Toko Buku</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Kota</label>
                  <input
                    type="text"
                    required
                    value={newLocCity}
                    onChange={(e) => setNewLocCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Alamat Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Jl. Wolter Monginsidi No. 112..."
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Latitude</label>
                  <input
                    type="text"
                    value={newLocLat}
                    onChange={(e) => setNewLocLat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Longitude</label>
                  <input
                    type="text"
                    value={newLocLng}
                    onChange={(e) => setNewLocLng(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Posisi Meja Stempel (Panduan Hunter) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Di meja Customer Service peron utara, minta kepada petugas piket."
                  value={newLocTip}
                  onChange={(e) => setNewLocTip(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Bentuk Stempel</label>
                  <select
                    value={newLocShape}
                    onChange={(e) => setNewLocShape(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="round">Bulat (Round)</option>
                    <option value="square">Persegi (Square)</option>
                    <option value="shield">Perisai (Shield)</option>
                    <option value="oval">Oval</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Warna Tinta</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    {['#9f1239', '#18181b', '#1d4ed8', '#047857', '#b45309'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewLocInkColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          newLocInkColor === c ? 'scale-125 ring-2 ring-zinc-900 ring-offset-2' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 pb-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors active:scale-95 shadow-md shadow-rose-600/20"
                >
                  Simpan Titik Stempel ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal B: Edit Lokasi Stempel */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/90 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden w-12 h-1 bg-zinc-300 rounded-full mx-auto my-2" />

            <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm sm:text-base">
                    Edit Data Titik Stempel
                  </h2>
                  <p className="text-[11px] text-zinc-400 truncate max-w-xs">{editingLocation.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingLocation(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLocation} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Nama Tempat</label>
                <input
                  type="text"
                  required
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Kota</label>
                  <input
                    type="text"
                    required
                    value={editingLocation.city}
                    onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Status</label>
                  <select
                    value={editingLocation.status}
                    onChange={(e) => setEditingLocation({ ...editingLocation, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="active">Aktif</option>
                    <option value="temporary">Sementara</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Posisi Meja Stempel (Panduan Hunter)</label>
                <textarea
                  rows={2}
                  required
                  value={editingLocation.tipLocation}
                  onChange={(e) => setEditingLocation({ ...editingLocation, tipLocation: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 pb-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLocation(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-200 hover:bg-zinc-100 text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold text-center"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal C: Tambah Stamp Rally Baru */}
      {isAddRallyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/90 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden w-12 h-1 bg-zinc-300 rounded-full mx-auto my-2" />

            <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm sm:text-base">
                    Buat Stamp Rally Baru
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    Tentukan rute checkpoint dan hadiah lencana
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRallyModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRallySubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Judul Stamp Rally *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Heritage Walk Bandung 2026"
                  value={newRallyTitle}
                  onChange={(e) => setNewRallyTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Kategori / Tag</label>
                  <input
                    type="text"
                    placeholder="Contoh: Heritage / Roastery"
                    value={newRallyTag}
                    onChange={(e) => setNewRallyTag(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-800">Penyelenggara</label>
                  <input
                    type="text"
                    value={newRallyOrganizer}
                    onChange={(e) => setNewRallyOrganizer(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Deskripsi & Cerita Rally</label>
                <textarea
                  rows={2}
                  value={newRallyDesc}
                  onChange={(e) => setNewRallyDesc(e.target.value)}
                  placeholder="Jelaskan rute perjalanan dan keseruan hunting stempel..."
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              {/* Checkpoints Multi-Select */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-800 flex items-center justify-between text-xs">
                  <span>Pilih Checkpoint Stempel ({newRallyCheckpoints.length} dipilih) *</span>
                </label>
                <div className="max-h-36 overflow-y-auto border border-zinc-200 rounded-xl p-2 space-y-1 bg-zinc-50">
                  {locations.map((loc) => {
                    const isSelected = newRallyCheckpoints.includes(loc.id);
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setNewRallyCheckpoints((prev) =>
                            isSelected ? prev.filter((id) => id !== loc.id) : [...prev, loc.id]
                          );
                        }}
                        className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-rose-50 border border-rose-200 font-semibold text-rose-900' : 'hover:bg-white'
                        }`}
                      >
                        <span className="truncate">{loc.name} ({loc.city})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-2" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800">Deskripsi Hadiah / Badge</label>
                <input
                  type="text"
                  value={newRallyReward}
                  onChange={(e) => setNewRallyReward(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 pb-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors active:scale-95 shadow-md shadow-rose-600/20"
                >
                  Publikasikan Stamp Rally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Mobile Bottom Navigation Dock for Admin Portal */}
      <nav 
        id="admin-mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 select-none"
      >
        <div className="max-w-md mx-auto px-2">
          <div className="grid grid-cols-4 items-center h-14">
            
            {/* Tab: Usulan */}
            <button
              onClick={() => setActiveAdminTab('proposals')}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                activeAdminTab === 'proposals' ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Clock className={`w-5 h-5 ${activeAdminTab === 'proposals' ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                {pendingProposalsCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-rose-600 text-white rounded-full text-[8px] font-extrabold flex items-center justify-center ring-1 ring-zinc-900">
                    {pendingProposalsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Usulan</span>
            </button>

            {/* Tab: Titik Lokasi */}
            <button
              onClick={() => setActiveAdminTab('locations')}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                activeAdminTab === 'locations' ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MapPin className={`w-5 h-5 ${activeAdminTab === 'locations' ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Titik Lokasi</span>
            </button>

            {/* Tab: Rally */}
            <button
              onClick={() => setActiveAdminTab('rallies')}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                activeAdminTab === 'rallies' ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flag className={`w-5 h-5 ${activeAdminTab === 'rallies' ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Rally</span>
            </button>

            {/* Tab: Moderasi Feed */}
            <button
              onClick={() => setActiveAdminTab('feed')}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                activeAdminTab === 'feed' ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Camera className={`w-5 h-5 ${activeAdminTab === 'feed' ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Feed Buruan</span>
            </button>

          </div>
        </div>
      </nav>

    </div>
  );
};
