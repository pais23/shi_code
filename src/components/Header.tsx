import React, { useState } from 'react';
import { 
  Stamp, 
  Bell, 
  PlusCircle, 
  Wifi, 
  WifiOff, 
  MapPin,
  Search,
  Sparkles,
  Footprints,
  X
} from 'lucide-react';
import { AppNotification } from '../types';

interface HeaderProps {
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProposeModal: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  userCoords: { lat: number; lng: number } | null;
  onRequestGeolocation: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenNotifications,
  onOpenProposeModal,
  isOfflineMode,
  onToggleOfflineMode,
  userCoords,
  onRequestGeolocation,
  searchQuery,
  onSearchChange,
  activeTab,
  onReplaySplash,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md text-zinc-900 border-b border-zinc-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Top main branding bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16 gap-2 sm:gap-3">
          
          {/* Brand Identity with Official Stamp Hunter Indonesia Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-sm shrink-0 group hover:scale-105 transition-all cursor-pointer active:scale-95 overflow-hidden"
              onClick={onReplaySplash}
              title="Stamp Hunter Indonesia • Klik untuk putar animasi stempel"
            >
              <img 
                src="/assets/stamp_hunter_logo.png" 
                alt="Logo Resmi Stamp Hunter Indonesia" 
                className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-base sm:text-lg md:text-xl font-display font-extrabold tracking-tight text-zinc-900 leading-tight">
                  STAMP HUNTER <span className="text-rose-600">ID</span>
                </h1>
                {/* <span className="hidden xl:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                  Resmi
                </span> */}
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium hidden xs:block line-clamp-1">
                Komunitas Berburu Stempel & Cap Nusantara
              </p>
            </div>
          </div>

          {/* Desktop Center Search with Modern Pill Style */}
          {activeTab === 'explore' && (
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-3">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari stasiun, kafe, kantor pos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-100/90 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 rounded-full border border-zinc-200/80 focus:outline-none focus:bg-white focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Action Icons & Badges (Mobile Ergonomic) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Mobile Search Toggle (When in Explore Tab) */}
            {activeTab === 'explore' && (
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`md:hidden p-2 rounded-full border transition-all active:scale-95 ${
                  isMobileSearchOpen || searchQuery
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200/80'
                }`}
                aria-label="Cari stempel"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* GPS Proximity / Geolocation Action */}
            <button
              id="header-gps-btn"
              onClick={onRequestGeolocation}
              title={userCoords ? 'GPS Aktif (Akurasi Tinggi)' : 'Aktifkan GPS untuk Menemukan Stempel Terdekat'}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                userCoords
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70 border border-zinc-200/80'
              }`}
            >
              <MapPin className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${userCoords ? 'text-emerald-600 animate-pulse' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline text-[11px]">
                {userCoords ? 'GPS Aktif' : 'Cek Jarak'}
              </span>
            </button>

            {/* Offline Cache Mode Switch */}
            <button
              id="header-offline-btn"
              onClick={onToggleOfflineMode}
              title={isOfflineMode ? 'Mode Offline Aktif' : 'Penyimpanan Offline'}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                isOfflineMode
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70 border border-zinc-200/80'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600" />
                  <span className="hidden sm:inline text-[11px]">Offline Siap</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-zinc-500" />
                  <span className="hidden sm:inline text-[11px]">Offline</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              id="header-notif-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200/80 rounded-full transition-colors active:scale-95"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {activeTab === 'explore' && isMobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Cari stasiun, kafe, kota, cap..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-zinc-100 text-sm text-zinc-900 placeholder-zinc-400 rounded-full border border-zinc-300/80 focus:outline-none focus:bg-white focus:border-rose-500 font-medium shadow-inner"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-bold"
                >
                  ✕
                </button>
              ) : (
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};


