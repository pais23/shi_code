import React, { useState } from 'react';
import { 
  Map, 
  Flag, 
  Camera, 
  Trophy, 
  BookOpen, 
  Plus, 
  MapPin, 
  Sparkles, 
  X, 
  ChevronRight,
  Compass,
  Footprints
} from 'lucide-react';

export type NavTab = 'explore' | 'rally' | 'community' | 'passport';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenUpload: () => void;
  activeRalliesCount: number;
  onOpenProposeModal?: () => void;
  onRequestGeolocation?: () => void;
  userCoords?: { lat: number; lng: number } | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenUpload,
  activeRalliesCount,
  onOpenProposeModal,
  onRequestGeolocation,
  userCoords,
}) => {
  // Mobile Quick Action Sheet modal state
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    // Vibrate gently on mobile devices if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <>
      {/* 1. DESKTOP SUB-NAVBAR (Visible on md screens and above) */}
      <nav className="hidden md:block bg-white border-b border-zinc-200/70 sticky top-16 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <button
                id="desktop-tab-explore"
                onClick={() => handleTabClick('explore')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeTab === 'explore'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Peta & Lokasi</span>
              </button>

              <button
                id="desktop-tab-rally"
                onClick={() => handleTabClick('rally')}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeTab === 'rally'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>Stamp Rally</span>
                {activeRalliesCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeRalliesCount}
                  </span>
                )}
              </button>

              <button
                id="desktop-tab-community"
                onClick={() => handleTabClick('community')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeTab === 'community'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Komunitas</span>
              </button>

              <button
                id="desktop-tab-passport"
                onClick={() => handleTabClick('passport')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeTab === 'passport'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Paspor Saya</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onOpenProposeModal && (
                <button
                  id="desktop-propose-btn"
                  onClick={onOpenProposeModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-full transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Usul Stempel</span>
                </button>
              )}

              <button
                id="desktop-upload-btn"
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Bukti Hunting</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE PHONE AUTHENTIC BOTTOM NAVBAR (Visible on mobile screens) */}
      <nav 
        id="mobile-bottom-navbar" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 select-none"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="max-w-md mx-auto px-2">
          <div className="grid grid-cols-5 items-end justify-items-center h-15">
            
            {/* 1. Tab: Jelajah Peta */}
            <button
              id="mobile-nav-explore"
              onClick={() => handleTabClick('explore')}
              className={`flex flex-col items-center justify-center w-full py-1.5 rounded-2xl active:scale-90 transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'text-rose-600 font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Compass className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'explore' ? 'stroke-[2.4px] scale-110 text-rose-600' : 'stroke-[1.8px]'
                }`} />
                {activeTab === 'explore' && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-rose-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                activeTab === 'explore' ? 'font-bold text-rose-600' : 'font-medium text-zinc-500'
              }`}>
                Jelajah
              </span>
            </button>

            {/* 2. Tab: Stamp Rally */}
            <button
              id="mobile-nav-rally"
              onClick={() => handleTabClick('rally')}
              className={`flex flex-col items-center justify-center w-full py-1.5 rounded-2xl active:scale-90 transition-all duration-200 ${
                activeTab === 'rally'
                  ? 'text-rose-600 font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Flag className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'rally' ? 'stroke-[2.4px] scale-110 text-rose-600' : 'stroke-[1.8px]'
                }`} />
                {activeRalliesCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-rose-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {activeRalliesCount}
                  </span>
                )}
                {activeTab === 'rally' && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-rose-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                activeTab === 'rally' ? 'font-bold text-rose-600' : 'font-medium text-zinc-500'
              }`}>
                Rally
              </span>
            </button>

            {/* 3. Center Elevated Mobile Action Button (Hunting Hub) */}
            <div className="flex flex-col items-center justify-center -mt-6">
              <button
                id="mobile-nav-action-hub"
                onClick={() => setIsActionSheetOpen(true)}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-rose-600 hover:to-rose-500 text-white flex flex-col items-center justify-center shadow-lg shadow-zinc-900/30 ring-4 ring-white active:scale-90 transition-all duration-200 cursor-pointer group"
                aria-label="Menu Aksi Berburu Stempel"
              >
                <div className="relative">
                  <Camera className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full ring-1 ring-zinc-900 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full ring-1 ring-zinc-900" />
                </div>
              </button>
              <span className="text-[10px] mt-0.5 font-bold text-zinc-700 tracking-tight leading-none">
                Berburu
              </span>
            </div>

            {/* 4. Tab: Komunitas */}
            <button
              id="mobile-nav-community"
              onClick={() => handleTabClick('community')}
              className={`flex flex-col items-center justify-center w-full py-1.5 rounded-2xl active:scale-90 transition-all duration-200 ${
                activeTab === 'community'
                  ? 'text-rose-600 font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Trophy className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'community' ? 'stroke-[2.4px] scale-110 text-rose-600' : 'stroke-[1.8px]'
                }`} />
                {activeTab === 'community' && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-rose-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                activeTab === 'community' ? 'font-bold text-rose-600' : 'font-medium text-zinc-500'
              }`}>
                Komunitas
              </span>
            </button>

            {/* 5. Tab: Paspor Digital */}
            <button
              id="mobile-nav-passport"
              onClick={() => handleTabClick('passport')}
              className={`flex flex-col items-center justify-center w-full py-1.5 rounded-2xl active:scale-90 transition-all duration-200 ${
                activeTab === 'passport'
                  ? 'text-rose-600 font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <BookOpen className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'passport' ? 'stroke-[2.4px] scale-110 text-rose-600' : 'stroke-[1.8px]'
                }`} />
                {activeTab === 'passport' && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-rose-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                activeTab === 'passport' ? 'font-bold text-rose-600' : 'font-medium text-zinc-500'
              }`}>
                Paspor
              </span>
            </button>

          </div>
        </div>
      </nav>

      {/* 3. MOBILE BOTTOM ACTION SHEET (Khas aplikasi smartphone) */}
      {isActionSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsActionSheetOpen(false)}
          />

          {/* Action Sheet Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200 border-t border-zinc-200/80">
            {/* Native Mobile Drag Pill Handle */}
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-base font-display font-bold text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>Aksi Berburu Stempel</span>
                </h3>
                <p className="text-xs text-zinc-500">Pilih aktivitas hunting yang ingin kamu lakukan</p>
              </div>
              <button
                onClick={() => setIsActionSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action List */}
            <div className="space-y-2 pt-1">
              
              {/* Option 1: Upload Bukti Hunting (Primary) */}
              <button
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenUpload();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 text-left transition-all active:scale-98"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Upload Bukti Stempel</h4>
                    <p className="text-[11px] text-zinc-500">Unggah foto hasil cap stempel buruanmu</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-600" />
              </button>

              {/* Option 2: Usulkan Lokasi Baru */}
              {onOpenProposeModal && (
                <button
                  onClick={() => {
                    setIsActionSheetOpen(false);
                    onOpenProposeModal();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-left transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Usulkan Titik Stempel Baru</h4>
                      <p className="text-[11px] text-zinc-500">Temukan stempel di stasiun/kafe yang belum ada di peta</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              )}

              {/* Option 3: GPS Stempel Terdekat */}
              {onRequestGeolocation && (
                <button
                  onClick={() => {
                    setIsActionSheetOpen(false);
                    onRequestGeolocation();
                    onTabChange('explore');
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-left transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {userCoords ? 'Perbarui Lokasi GPS' : 'Aktifkan GPS & Cari Terdekat'}
                      </h4>
                      <p className="text-[11px] text-zinc-500">Urutkan stempel unik berdasarkan jarak dari posisimu</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              )}

            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsActionSheetOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold text-center transition-colors"
            >
              Tutup Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
