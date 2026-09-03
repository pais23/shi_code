import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Navigation, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  Trophy, 
  ExternalLink,
  Download,
  X,
  UserCheck
} from 'lucide-react';
import { UserProfile, UserBadge, HuntRecord, StampLocation } from '../types';
import { StampImpression } from './StampImpression';
import { getGoogleMapsDirUrl, getCategoryLabel } from '../utils/geoUtils';

interface DigitalPassportProps {
  profile: UserProfile;
  badges: UserBadge[];
  myHunts: HuntRecord[];
  locations: StampLocation[];
  wishlistLocations: StampLocation[];
  onToggleWishlist: (locId: string) => void;
  onOpenUpload: (loc: StampLocation) => void;
  onSelectLocationForDetail: (loc: StampLocation) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const DigitalPassport: React.FC<DigitalPassportProps> = ({
  profile,
  badges,
  myHunts,
  locations,
  wishlistLocations,
  onToggleWishlist,
  onOpenUpload,
  onSelectLocationForDetail,
  onUpdateProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'passport' | 'badges' | 'wishlist'>('passport');
  const [selectedHuntForDetail, setSelectedHuntForDetail] = useState<HuntRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioInput, setBioInput] = useState<string>(profile.bio);

  const unlockedBadges = badges.filter((b) => profile.badges.includes(b.id) || b.isUnlocked);

  return (
    <div className="space-y-6">
      
      {/* Hunter Identity & Passport Header Card */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-800 overflow-hidden">
        
        {/* Ambient Warm Atmosphere */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Hunter Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-white/20 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1.5 rounded-full shadow-xs" title="Rank Hunter #7">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight truncate">
                  {profile.name}
                </h1>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Rank #{profile.rank}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono font-medium">
                {profile.handle} • {profile.homeCity}
              </p>
              
              {isEditingBio ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="text-xs px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 text-white focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      onUpdateProfile({ bio: bioInput });
                      setIsEditingBio(false);
                    }}
                    className="text-xs font-semibold text-rose-400 hover:underline"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <p 
                  onClick={() => setIsEditingBio(true)}
                  className="text-xs text-zinc-400 line-clamp-1 max-w-md cursor-pointer hover:text-white transition-colors"
                  title="Klik untuk edit bio"
                >
                  &ldquo;{profile.bio}&rdquo; ✏️
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics & Share Action */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="block text-xl font-bold text-white">{myHunts.length}</span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-300">Stempel</span>
              </div>

              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="block text-xl font-bold text-amber-300">{unlockedBadges.length}</span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-300">Badge</span>
              </div>

              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="block text-xl font-bold text-emerald-400">{wishlistLocations.length}</span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-zinc-300">Wishlist</span>
              </div>
            </div>

            <button
              id="passport-share-btn"
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-full border border-zinc-200/80 w-fit overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('passport')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'passport'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Paspor Stempel ({myHunts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'badges'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Lencana ({unlockedBadges.length}/{badges.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'wishlist'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Rencana Buruan ({wishlistLocations.length})</span>
        </button>
      </div>

      {/* 1. PASSPORT DIGITAL BOOK PAGE */}
      {activeSubTab === 'passport' && (
        <div className="space-y-4">
          
          {/* Passport Book Frame */}
          <div className="bg-[#FAF9F6] border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            
            {/* Book Spine Center Divider Accent */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-stone-200/60 hidden md:block" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/80 gap-2 mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-semibold block">
                  BUKU PASPOR RESMI PEMBURU STEMPEL
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900">
                  Paspor Koleksi Stempel Nusantara
                </h2>
              </div>
              <div className="text-right font-mono text-xs text-zinc-500">
                <span>NO: ID-PASSPORT-2025-08492</span>
              </div>
            </div>

            {myHunts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {myHunts.map((hunt, idx) => {
                  return (
                    <div
                      key={hunt.id}
                      onClick={() => setSelectedHuntForDetail(hunt)}
                      className="group relative bg-white hover:bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs cursor-pointer transition-all duration-200 flex flex-col items-center justify-between min-h-[170px] text-center"
                    >
                      {/* Serial Number Tag */}
                      <span className="text-[9px] font-mono font-semibold text-zinc-400 uppercase">
                        STAMP #{String(idx + 1).padStart(3, '0')}
                      </span>

                      {/* Vector Stamp Rubber Impression */}
                      <div className="my-1.5 group-hover:scale-105 transition-transform">
                        <StampImpression
                          name={hunt.locationName}
                          category={hunt.category}
                          city={hunt.cityName}
                          inkColor={hunt.stampInkColor}
                          date={hunt.visitDate}
                          size="sm"
                          rotationDeg={((idx % 4) - 2) * 3}
                        />
                      </div>

                      {/* Stamp Meta Label */}
                      <div className="w-full">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {hunt.locationName}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-medium mt-0.5">
                          <span>{hunt.cityName}</span>
                          {hunt.isGpsVerified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" title="GPS Verified" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <BookOpen className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-base font-display font-bold text-zinc-900">Paspor Digitalmu Masih Kosong</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Ayo mulai berburu stempel unik pertama di stasiun, kafe, kantor pos, atau museum terdekat!
                </p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-wider">
              <span>LEMBAR BUKTI RESMI KOMUNITAS</span>
              <span>TERVERIFIKASI DIGITAL</span>
            </div>

          </div>

        </div>
      )}

      {/* 2. BADGES & GAMIFICATION TAB */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const isUnlocked = profile.badges.includes(badge.id) || badge.isUnlocked;

              return (
                <div
                  key={badge.id}
                  className={`relative rounded-2xl p-5 border transition-all ${
                    isUnlocked
                      ? 'bg-white border-zinc-200/90 shadow-xs'
                      : 'bg-zinc-50/70 border-dashed border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      <Award className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-zinc-900 truncate">
                          {badge.title}
                        </h4>
                        {isUnlocked ? (
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 uppercase tracking-wider">
                            Terbuka
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-zinc-500 bg-zinc-200 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                            Terkunci
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                      
                      <div className="mt-2.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                        <span>Kriteria: {badge.criteria}</span>
                        {isUnlocked && badge.unlockedAt && (
                          <span className="text-emerald-700 font-semibold">{badge.unlockedAt}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. WISHLIST / SIMPAN LOKASI TAB */}
      {activeSubTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {getCategoryLabel(loc.category)}
                      </span>
                      <button
                        onClick={() => onToggleWishlist(loc.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                        title="Hapus dari Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>

                    <h4 
                      onClick={() => onSelectLocationForDetail(loc)}
                      className="font-bold text-zinc-900 text-base cursor-pointer hover:text-rose-600 transition-colors"
                    >
                      {loc.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{loc.city} • {loc.address}</p>
                    
                    <div className="p-3 rounded-xl bg-stone-50 text-xs text-zinc-700 border border-stone-200/80">
                      <strong className="text-zinc-900">Meja Cap:</strong> {loc.tipLocation}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                    <a
                      href={getGoogleMapsDirUrl(loc.lat, loc.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold"
                    >
                      <Navigation className="w-3.5 h-3.5 text-rose-400" />
                      <span>Rute Maps</span>
                    </a>
                    <button
                      onClick={() => onOpenUpload(loc)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-zinc-200/90 p-6">
              <Heart className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <h4 className="font-bold text-zinc-900 text-sm">Belum Ada Rencana Buruan</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Buka tab Jelajah dan klik ikon hati untuk menyusun daftar rencana buruan stempelmu!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Hunt Photo & Detail Modal */}
      {selectedHuntForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200 my-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedHuntForDetail(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">
                Bukti Hunting Koleksi Paspor
              </span>
              <h3 className="text-lg font-bold text-zinc-900">
                {selectedHuntForDetail.locationName}
              </h3>
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {selectedHuntForDetail.cityName} • {selectedHuntForDetail.visitDate}
              </p>
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img
                src={selectedHuntForDetail.photoUrl}
                alt={selectedHuntForDetail.locationName}
                className="w-full h-full object-cover"
              />
              {selectedHuntForDetail.isGpsVerified && (
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-emerald-600 text-white text-[11px] font-semibold rounded-full shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GPS Terverifikasi
                </div>
              )}
            </div>

            {selectedHuntForDetail.userNotes && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-zinc-700 italic">
                &ldquo;{selectedHuntForDetail.userNotes}&rdquo;
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedHuntForDetail(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shareable Passport Summary Card Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl p-6 shadow-2xl border border-zinc-800 text-white space-y-4 my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Stamp Card with Official Badge */}
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md">
                <img
                  src="/assets/stamp_hunter_logo.png"
                  alt="Official Member Stamp Hunter Indonesia"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-300/90 font-semibold uppercase">
                  PASPOR PEMBURU RESMI
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Stamp Hunter Indonesia
                </h3>
              </div>
              <div className="w-12 h-0.5 bg-amber-400/60 mx-auto mt-1"></div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/50"
              />
              <div>
                <p className="font-bold text-sm text-white">{profile.name}</p>
                <p className="text-xs text-rose-400 font-mono">{profile.handle}</p>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Peringkat #{profile.rank} Nasional</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-lg font-bold text-white">{myHunts.length}</span>
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Stempel</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-lg font-bold text-amber-300">{unlockedBadges.length}</span>
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Badge</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-lg font-bold text-emerald-400">3</span>
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Kota</span>
              </div>
            </div>

            {/* Stamp Stamp Mock Grid */}
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 block text-center font-medium">
                Cap Terkoleksi Terbaru:
              </span>
              <div className="flex items-center justify-center gap-2">
                {myHunts.slice(0, 3).map((h, i) => (
                  <div key={i} className="scale-75 origin-center">
                    <StampImpression
                      name={h.locationName}
                      category={h.category}
                      city={h.cityName}
                      inkColor={h.stampInkColor}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowShareModal(false);
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Bagikan ke Media Sosial
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
