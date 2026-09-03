import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Heart, 
  Camera, 
  Map as MapIcon, 
  List, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Compass,
  ArrowUpDown,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StampLocation, StampCategory, HuntRecord } from '../types';
import { calculateDistanceMeters, formatDistance, getGoogleMapsDirUrl, getCategoryLabel, getCategoryBadgeClass } from '../utils/geoUtils';
import { InteractiveMap } from './InteractiveMap';
import { StampImpression } from './StampImpression';

interface LocationExplorerProps {
  locations: StampLocation[];
  onOpenUpload: (loc: StampLocation) => void;
  wishlistIds: string[];
  onToggleWishlist: (locId: string) => void;
  userCoords: { lat: number; lng: number } | null;
  onRequestGeolocation: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectLocationForDetail: (loc: StampLocation) => void;
  communityHunts: HuntRecord[];
  myCollectedLocIds: string[];
}

export const LocationExplorer: React.FC<LocationExplorerProps> = ({
  locations,
  onOpenUpload,
  wishlistIds,
  onToggleWishlist,
  userCoords,
  onRequestGeolocation,
  searchQuery,
  onSearchChange,
  onSelectLocationForDetail,
  communityHunts,
  myCollectedLocIds,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'distance' | 'name'>('popular');
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [onlyEvents, setOnlyEvents] = useState<boolean>(false);
  const [mapSelectedLocation, setMapSelectedLocation] = useState<StampLocation | null>(null);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set(locations.map((l) => l.city));
    return Array.from(set).sort();
  }, [locations]);

  // Categories list
  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Kategori', icon: '🌟' },
    { id: 'station', label: 'Stasiun Kereta', icon: '🚂' },
    { id: 'post_office', label: 'Kantor Pos', icon: '📮' },
    { id: 'cafe', label: 'Kafe & Kopi', icon: '☕' },
    { id: 'museum_landmark', label: 'Museum & Landmark', icon: '🏛️' },
    { id: 'nature_tour', label: 'Wisata Alam', icon: '🌲' },
    { id: 'community_event', label: 'Event Pop-up', icon: '🎪' },
    { id: 'bookstore_art', label: 'Art & Vinyl', icon: '🎨' },
  ];

  // Filter & Sort Logic
  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = loc.name.toLowerCase().includes(q);
          const matchCity = loc.city.toLowerCase().includes(q);
          const matchAddr = loc.address.toLowerCase().includes(q);
          const matchDesc = loc.description.toLowerCase().includes(q);
          const matchDesign = loc.stampDesignName.toLowerCase().includes(q);
          if (!matchName && !matchCity && !matchAddr && !matchDesc && !matchDesign) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
          return false;
        }

        // City filter
        if (selectedCity !== 'all' && loc.city !== selectedCity) {
          return false;
        }

        // Wishlist filter
        if (onlyWishlist && !wishlistIds.includes(loc.id)) {
          return false;
        }

        // Event filter
        if (onlyEvents && !loc.isLimitedEvent) {
          return false;
        }

        return true;
      })
      .map((loc) => {
        let distance: number | null = null;
        if (userCoords) {
          distance = calculateDistanceMeters(userCoords.lat, userCoords.lng, loc.lat, loc.lng);
        }
        return {
          ...loc,
          distanceMeters: distance,
        };
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && userCoords) {
          return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity);
        }
        if (sortBy === 'popular') {
          return b.totalHuntedCount - a.totalHuntedCount;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    locations,
    searchQuery,
    selectedCategory,
    selectedCity,
    onlyWishlist,
    onlyEvents,
    sortBy,
    userCoords,
    wishlistIds,
  ]);

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Modern Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 text-white p-6 sm:p-8 shadow-sm border border-zinc-800">
        {/* Modern ambient backdrop */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-200 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Database Stempel Nusantara</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white leading-tight">
            Eksplorasi & Buru <span className="text-rose-500">Stempel Otentik</span> Nusantara
          </h1>
          
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal max-w-xl">
            Panduan rute navigasi Google Maps ke meja Customer Service, arsipkan hasil cap di paspor digital, dan selesaikan tantangan rally berhadiah.
          </p>

          {/* Quick Metrics Bar with Modern Pill Styling */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 font-medium">
              <span className="text-rose-400 text-sm font-bold">{locations.length}</span>
              <span className="text-zinc-200">Lokasi Aktif</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 font-medium">
              <span className="text-emerald-400 text-sm font-bold">{uniqueCities.length}</span>
              <span className="text-zinc-200">Kota</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 font-medium">
              <span className="text-amber-300 text-sm font-bold">{myCollectedLocIds.length}</span>
              <span className="text-zinc-200">Koleksi Paspor</span>
            </div>
          </div>
        </div>

        {/* Official Stamp Hunter Indonesia Pin Badge Emblem */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
          <div className="relative group">
            <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-2xl backdrop-blur-xs transform rotate-3 hover:rotate-6 transition-transform">
              <img
                src="/assets/stamp_hunter_logo.png"
                alt="Logo Resmi Stamp Hunter Indonesia"
                className="w-full h-full object-cover rounded-full shadow-inner"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search on mobile + View Mode Switch + Filter Bars */}
      <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200/80">
        
        {/* Top Controls: Mobile Search + View Mode Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari nama tempat, stasiun, kafe, kota, alamat..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100/90 text-sm text-zinc-900 placeholder-zinc-400 rounded-full border border-zinc-200/70 focus:outline-none focus:bg-white focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 transition-all font-medium"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <MapPin className="w-4 h-4" />
            </div>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle (Pills) */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full self-end sm:self-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'both'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scrolling Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Dropdowns & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/70">
              <span className="text-zinc-500 font-medium">Kota:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-semibold text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kota ({uniqueCities.length})</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/70">
              <ArrowUpDown className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as 'popular' | 'distance' | 'name';
                  if (val === 'distance' && !userCoords) {
                    onRequestGeolocation();
                  }
                  setSortBy(val);
                }}
                className="bg-transparent font-semibold text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">Terpopuler</option>
                <option value="distance">Jarak Terdekat (GPS)</option>
                <option value="name">Nama (A - Z)</option>
              </select>
            </div>

            {/* Wishlist Quick Toggle */}
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 border transition-all ${
                onlyWishlist
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200/70 hover:bg-zinc-200/70'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Wishlist ({wishlistIds.length})</span>
            </button>

            {/* Event Rally Only Toggle */}
            <button
              onClick={() => setOnlyEvents(!onlyEvents)}
              className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 border transition-all ${
                onlyEvents
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200/70 hover:bg-zinc-200/70'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Event Rally</span>
            </button>
          </div>

          <span className="text-zinc-500 font-medium">
            Menampilkan <strong className="text-zinc-900">{filteredLocations.length}</strong> lokasi
          </span>
        </div>
      </div>

      {/* Main Content: Map & List based on viewMode */}
      <div className="space-y-6">
        
        {/* Map View */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-zinc-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-500" />
                Peta Sebaran Stempel Nusantara
              </h3>
              {!userCoords && (
                <button
                  onClick={onRequestGeolocation}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Aktifkan GPS
                </button>
              )}
            </div>

            <InteractiveMap
              locations={filteredLocations}
              selectedLocation={mapSelectedLocation}
              onSelectLocation={(loc) => {
                setMapSelectedLocation(loc);
                onSelectLocationForDetail(loc);
              }}
              userCoords={userCoords}
              onOpenUpload={onOpenUpload}
            />
          </div>
        )}

        {/* Location List View */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-zinc-900 flex items-center gap-2">
                <List className="w-4 h-4 text-rose-500" />
                Daftar Lokasi Stempel ({filteredLocations.length})
              </h3>
            </div>

            {filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLocations.map((loc) => {
                  const isWishlisted = wishlistIds.includes(loc.id);
                  const isCollected = myCollectedLocIds.includes(loc.id);
                  const badgeColors = getCategoryBadgeClass(loc.category);
                  const locCommunityCount = communityHunts.filter((h) => h.locationId === loc.id).length;

                  return (
                    <div
                      key={loc.id}
                      className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Header Card */}
                      <div className="p-4 sm:p-5 space-y-3">
                        
                        {/* Badges & Actions */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeColors.bg} border ${badgeColors.border}`}>
                              {getCategoryLabel(loc.category)}
                            </span>
                            {loc.isLimitedEvent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white">
                                Event
                              </span>
                            )}
                            {isCollected && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Di Paspor
                              </span>
                            )}
                          </div>

                          {/* Wishlist Heart Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist(loc.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isWishlisted
                                ? 'bg-rose-50 text-rose-500'
                                : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/70'
                            }`}
                            title={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Title & Preview Image */}
                        <div 
                          className="flex gap-3 cursor-pointer"
                          onClick={() => onSelectLocationForDetail(loc)}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-zinc-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
                              {loc.name}
                            </h4>
                            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="truncate">{loc.city}</span>
                              {loc.distanceMeters !== undefined && loc.distanceMeters !== null && (
                                <span className="text-emerald-600 font-semibold shrink-0">
                                  • {formatDistance(loc.distanceMeters)}
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Stamp graphic thumbnail */}
                          <div className="shrink-0">
                            <StampImpression
                              name={loc.name}
                              category={loc.category}
                              city={loc.city}
                              inkColor={loc.stampInkColor}
                              shape={loc.stampShape}
                              size="sm"
                              rotationDeg={-4}
                            />
                          </div>
                        </div>

                        {/* Stamp Description / Tip */}
                        <div 
                          className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700 cursor-pointer hover:bg-stone-100/60 transition-colors"
                          onClick={() => onSelectLocationForDetail(loc)}
                        >
                          <p className="font-bold text-[10px] text-stone-800 uppercase tracking-wider flex items-center gap-1">
                            <span>Meja Cap & Registrasi:</span>
                          </p>
                          <p className="text-xs line-clamp-2 mt-0.5 text-stone-600 font-medium">
                            {loc.tipLocation}
                          </p>
                        </div>

                        {/* Community stats */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3 text-zinc-400" />
                            {locCommunityCount > 0 ? `${locCommunityCount} buruan terverifikasi` : 'Belum ada foto'}
                          </span>
                          <span className="text-zinc-400 font-mono text-[10px]">
                            {loc.stampDesignName.substring(0, 24)}..
                          </span>
                        </div>

                      </div>

                      {/* Card Footer: Google Maps Action + Upload Shortcut */}
                      <div className="p-3 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between gap-2">
                        <a
                          id={`maps-link-${loc.id}`}
                          href={getGoogleMapsDirUrl(loc.lat, loc.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                          title="Buka Navigasi Rute di Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Arahkan Maps</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>

                        <button
                          onClick={() => onOpenUpload(loc)}
                          className="inline-flex items-center justify-center gap-1 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                          title="Upload Bukti Stempel di Lokasi Ini"
                        >
                          <Camera className="w-3.5 h-3.5 text-rose-600" />
                          <span>Upload</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-zinc-200">
                <MapPin className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                <h4 className="font-semibold text-zinc-700 text-sm">Tidak ada lokasi stempel yang cocok</h4>
                <p className="text-xs text-zinc-500 mt-1">Coba ubah kata kunci pencarian atau bersihkan filter yang aktif.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedCity('all');
                    onSearchChange('');
                    setOnlyWishlist(false);
                    setOnlyEvents(false);
                  }}
                  className="mt-4 px-5 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
