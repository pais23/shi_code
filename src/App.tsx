import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_LOCATIONS, 
  INITIAL_RALLIES, 
  INITIAL_BADGES, 
  INITIAL_USER_PROFILE, 
  INITIAL_HUNTS, 
  INITIAL_LEADERBOARD, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PROPOSED_LOCATIONS 
} from './data/initialData';
import { 
  StampLocation, 
  StampRally, 
  UserBadge, 
  UserProfile, 
  HuntRecord, 
  HunterLeaderboardItem, 
  AppNotification, 
  ProposedLocation 
} from './types';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { LocationExplorer } from './components/LocationExplorer';
import { RallyTracker } from './components/RallyTracker';
import { DigitalPassport } from './components/DigitalPassport';
import { LeaderboardAndFeed } from './components/LeaderboardAndFeed';
import { LocationDetailModal } from './components/LocationDetailModal';
import { UploadModal } from './components/UploadModal';
import { ProposeLocationModal } from './components/ProposeLocationModal';
import { NotificationModal } from './components/NotificationModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { SplashScreen } from './components/SplashScreen';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  // Application Mode: '/admin' is the curator dashboard, '/' is the member experience.
  const [currentView, setCurrentView] = useState<'member' | 'admin'>(() =>
    window.location.pathname === '/admin' ? 'admin' : 'member'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname === '/admin' ? 'admin' : 'member');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data States (in-memory / local state)
  const [locations, setLocations] = useState<StampLocation[]>(INITIAL_LOCATIONS);
  const [rallies, setRallies] = useState<StampRally[]>(INITIAL_RALLIES);
  const [badges, setBadges] = useState<UserBadge[]>(INITIAL_BADGES);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [hunts, setHunts] = useState<HuntRecord[]>(INITIAL_HUNTS);
  const [leaderboard, setLeaderboard] = useState<HunterLeaderboardItem[]>(INITIAL_LEADERBOARD);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [proposedLocations, setProposedLocations] = useState<ProposedLocation[]>(INITIAL_PROPOSED_LOCATIONS);

  // User GPS Coordinates
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadTargetLocation, setUploadTargetLocation] = useState<StampLocation | null>(null);
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<StampLocation | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Filter user's personal hunts
  const myHunts = hunts.filter((h) => h.hunterId === 'user-me');
  const myCollectedLocIds = myHunts.map((h) => h.locationId);
  const wishlistLocations = locations.filter((loc) => profile.wishlistedLocationIds.includes(loc.id));

  // Request GPS permission
  const handleRequestGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          // If in an iframe or user declined, set a simulated Bandung/Jakarta location for rich preview
          console.warn('Geolocation notice:', err.message);
          // Set simulated location at Bandung (center of railway heritage)
          setUserCoords({
            lat: -6.9147,
            lng: 107.6025,
          });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserCoords({
        lat: -6.9147,
        lng: 107.6025,
      });
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = (locId: string) => {
    setProfile((prev) => {
      const exists = prev.wishlistedLocationIds.includes(locId);
      const updatedWishlist = exists
        ? prev.wishlistedLocationIds.filter((id) => id !== locId)
        : [...prev.wishlistedLocationIds, locId];
      return {
        ...prev,
        wishlistedLocationIds: updatedWishlist,
      };
    });
  };

  // Open Upload for a specific location
  const handleOpenUpload = (location?: StampLocation) => {
    setUploadTargetLocation(location || null);
    setIsUploadModalOpen(true);
  };

  // Handle New Stamp Upload
  const handleSuccessSubmit = (
    newHuntData: Omit<HuntRecord, 'id' | 'createdAt' | 'likesCount' | 'likedByMe'>
  ) => {
    const newRecord: HuntRecord = {
      ...newHuntData,
      id: `hunt-${Date.now()}`,
      likesCount: 1,
      likedByMe: true,
      createdAt: new Date().toISOString(),
    };

    // 1. Prepend to hunts
    const updatedHunts = [newRecord, ...hunts];
    setHunts(updatedHunts);

    // 2. Increment location's total hunted count
    setLocations((prev) =>
      prev.map((l) =>
        l.id === newRecord.locationId ? { ...l, totalHuntedCount: l.totalHuntedCount + 1 } : l
      )
    );

    // 3. Update User Profile & Rank
    const updatedMyHunts = updatedHunts.filter((h) => h.hunterId === 'user-me');
    const newStampsCount = updatedMyHunts.length;

    // Check Badges
    const updatedBadges = [...badges];
    let newlyUnlockedBadge: UserBadge | null = null;

    // Check "10 Stempel Pertama"
    if (newStampsCount >= 10) {
      const b = updatedBadges.find((x) => x.id === 'badge-10-stamps');
      if (b && !b.isUnlocked) {
        b.isUnlocked = true;
        b.unlockedAt = new Date().toISOString().split('T')[0];
        newlyUnlockedBadge = b;
      }
    }

    // Check "Penjelajah Jawa Barat"
    const jabarCount = updatedMyHunts.filter(
      (h) => h.cityName === 'Bandung' || h.cityName === 'Bogor'
    ).length;
    if (jabarCount >= 3) {
      const b = updatedBadges.find((x) => x.id === 'badge-jabar-explorer');
      if (b && !b.isUnlocked) {
        b.isUnlocked = true;
        b.unlockedAt = new Date().toISOString().split('T')[0];
        newlyUnlockedBadge = b;
      }
    }

    // Check "Kafe & Roastery Hopper"
    const cafeCount = updatedMyHunts.filter((h) => h.category === 'cafe').length;
    if (cafeCount >= 2) {
      const b = updatedBadges.find((x) => x.id === 'badge-coffee-hopper');
      if (b && !b.isUnlocked) {
        b.isUnlocked = true;
        b.unlockedAt = new Date().toISOString().split('T')[0];
        newlyUnlockedBadge = b;
      }
    }

    setBadges(updatedBadges);

    // Check Rally completion
    const completedRallies = rallies.filter((r) =>
      r.checkpointLocationIds.every((locId) =>
        updatedMyHunts.some((h) => h.locationId === locId)
      )
    ).length;

    const unlockedBadgeIds = updatedBadges
      .filter((b) => b.isUnlocked)
      .map((b) => b.id);

    setProfile((prev) => ({
      ...prev,
      totalStamps: newStampsCount,
      completedRalliesCount: completedRallies,
      badges: unlockedBadgeIds,
      rank: Math.max(1, 7 - Math.floor(newStampsCount / 2)),
    }));

    // Update Leaderboard
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.id === 'user-me'
          ? {
              ...item,
              totalStamps: newStampsCount,
              ralliesCompleted: completedRallies,
              rank: Math.max(1, 7 - Math.floor(newStampsCount / 2)),
            }
          : item
      )
    );

    // Celebrate with Confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    // In-app Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `🎉 Stempel ${newRecord.locationName} Berhasil Dicap!`,
      message: `Stempel telah tersimpan di paspor digitalmu. Total koleksi: ${newStampsCount} cap.`,
      date: 'Baru saja',
      type: 'community',
      isRead: false,
      targetTab: 'passport',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (newlyUnlockedBadge) {
      setTimeout(() => {
        alert(`🏆 SELAMAT! Kamu berhasil membuka lencana baru: "${newlyUnlockedBadge?.title}"!`);
      }, 500);
    }
  };

  // Like a hunt
  const handleLikeHunt = (huntId: string) => {
    setHunts((prev) =>
      prev.map((h) => {
        if (h.id === huntId) {
          const isLiked = h.likedByMe;
          return {
            ...h,
            likesCount: isLiked ? h.likesCount - 1 : h.likesCount + 1,
            likedByMe: !isLiked,
          };
        }
        return h;
      })
    );
  };

  // Propose New Location
  const handleSubmitProposal = (
    proposal: Omit<ProposedLocation, 'id' | 'status' | 'submittedAt'>
  ) => {
    const newProp: ProposedLocation = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setProposedLocations((prev) => [newProp, ...prev]);
  };

  // Admin Handlers
  const handleAdminApproveProposal = (proposal: ProposedLocation, customData?: Partial<StampLocation>) => {
    const newLoc: StampLocation = {
      id: `loc-approved-${Date.now()}`,
      name: customData?.name || proposal.name,
      category: customData?.category || proposal.category,
      city: customData?.city || proposal.city,
      province: customData?.province || proposal.province,
      address: customData?.address || proposal.address,
      lat: customData?.lat || proposal.lat,
      lng: customData?.lng || proposal.lng,
      stampImageUrl: customData?.stampImageUrl || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
      stampDesignName: customData?.stampDesignName || `Cap Resmi ${proposal.name}`,
      stampShape: customData?.stampShape || 'round',
      stampInkColor: customData?.stampInkColor || '#9f1239',
      description: customData?.description || proposal.description,
      tipLocation: customData?.tipLocation || proposal.tipLocation,
      isLimitedEvent: false,
      status: 'active',
      totalHuntedCount: 0,
      rating: 5.0,
      contributedBy: proposal.submittedBy,
      isVerifiedLocation: true,
    };

    setLocations((prev) => [newLoc, ...prev]);
    setProposedLocations((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'approved' } : p))
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `✅ Usulan Disetujui: ${newLoc.name}`,
      message: `Titik stempel baru di ${newLoc.city} telah disetujui kurator dan tayang di peta utama!`,
      date: 'Baru saja',
      type: 'location',
      isRead: false,
      targetTab: 'explore',
      targetId: newLoc.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAdminRejectProposal = (proposalId: string, reason?: string) => {
    setProposedLocations((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
  };

  const handleAdminAddLocation = (
    locData: Omit<StampLocation, 'id' | 'totalHuntedCount' | 'rating' | 'contributedBy' | 'isVerifiedLocation'>
  ) => {
    const newLoc: StampLocation = {
      ...locData,
      id: `loc-admin-${Date.now()}`,
      totalHuntedCount: 0,
      rating: 5.0,
      contributedBy: 'Staff Kurator',
      isVerifiedLocation: true,
    };
    setLocations((prev) => [newLoc, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `✨ Titik Stempel Baru: ${newLoc.name}`,
      message: `Kurator telah menambahkan titik stempel baru di ${newLoc.city}. Siap untuk diburu!`,
      date: 'Baru saja',
      type: 'location',
      isRead: false,
      targetTab: 'explore',
      targetId: newLoc.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAdminUpdateLocation = (locId: string, updated: Partial<StampLocation>) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === locId ? { ...loc, ...updated } : loc))
    );
  };

  const handleAdminDeleteLocation = (locId: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== locId));
  };

  const handleAdminAddRally = (rallyData: Omit<StampRally, 'id'>) => {
    const newRally: StampRally = {
      ...rallyData,
      id: `rally-${Date.now()}`,
    };
    setRallies((prev) => [newRally, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `🚩 Stamp Rally Baru: ${newRally.title}`,
      message: `Tantangan rally baru resmi dibuka! Selesaikan seluruh checkpoint dan klaim rewardnya.`,
      date: 'Baru saja',
      type: 'rally',
      isRead: false,
      targetTab: 'rally',
      targetId: newRally.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAdminUpdateRallyStatus = (
    rallyId: string,
    status: 'active' | 'upcoming' | 'completed'
  ) => {
    setRallies((prev) =>
      prev.map((r) => (r.id === rallyId ? { ...r, status } : r))
    );
  };

  const handleAdminDeleteRally = (rallyId: string) => {
    setRallies((prev) => prev.filter((r) => r.id !== rallyId));
  };

  const handleAdminDeleteHunt = (huntId: string) => {
    setHunts((prev) => prev.filter((h) => h.id !== huntId));
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // If user is currently in Admin View, show the dedicated Admin Portal
  if (currentView === 'admin') {
    return (
      <AdminPortal
        locations={locations}
        proposedLocations={proposedLocations}
        rallies={rallies}
        hunts={hunts}
        onApproveProposal={handleAdminApproveProposal}
        onRejectProposal={handleAdminRejectProposal}
        onAddLocation={handleAdminAddLocation}
        onUpdateLocation={handleAdminUpdateLocation}
        onDeleteLocation={handleAdminDeleteLocation}
        onAddRally={handleAdminAddRally}
        onUpdateRallyStatus={handleAdminUpdateRallyStatus}
        onDeleteRally={handleAdminDeleteRally}
        onDeleteHunt={handleAdminDeleteHunt}
      />
    );
  }

  // Otherwise, render the member-facing application
  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 text-zinc-900 pb-28 sm:pb-24 md:pb-12 font-sans selection:bg-rose-600 selection:text-white">
      
      {/* 0. Animated Curving Footsteps & Rubber Stamp Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 1. Header with Brand, GPS & Notification Icons */}
      <Header
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenProposeModal={() => setIsProposeModalOpen(true)}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineModalOpen(true)}
        userCoords={userCoords}
        onRequestGeolocation={handleRequestGeolocation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* 2. Top Sub-Navigation (Desktop) & Smartphone Bottom Dock (Mobile) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpload={() => handleOpenUpload()}
        activeRalliesCount={rallies.filter((r) => r.status === 'active').length}
        onOpenProposeModal={() => setIsProposeModalOpen(true)}
        onRequestGeolocation={handleRequestGeolocation}
        userCoords={userCoords}
      />

      {/* 3. Main Content View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
        
        {/* TAB 1: EXPLORE (PETA & LIST VIEW) */}
        {activeTab === 'explore' && (
          <LocationExplorer
            locations={locations}
            onOpenUpload={handleOpenUpload}
            wishlistIds={profile.wishlistedLocationIds}
            onToggleWishlist={handleToggleWishlist}
            userCoords={userCoords}
            onRequestGeolocation={handleRequestGeolocation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectLocationForDetail={(loc) => setSelectedDetailLocation(loc)}
            communityHunts={hunts}
            myCollectedLocIds={myCollectedLocIds}
          />
        )}

        {/* TAB 2: STAMP RALLY & EVENTS */}
        {activeTab === 'rally' && (
          <RallyTracker
            rallies={rallies}
            locations={locations}
            myHunts={myHunts}
            onOpenUpload={handleOpenUpload}
            onSelectLocationForDetail={(loc) => setSelectedDetailLocation(loc)}
            userName={profile.name}
          />
        )}

        {/* TAB 3: COMMUNITY & LEADERBOARD */}
        {activeTab === 'community' && (
          <LeaderboardAndFeed
            leaderboard={leaderboard}
            communityHunts={hunts}
            onLikeHunt={handleLikeHunt}
            onSelectLocationForDetail={(loc) => setSelectedDetailLocation(loc)}
            locations={locations}
            onOpenUpload={handleOpenUpload}
          />
        )}

        {/* TAB 4: PASSPORT & PROFILE */}
        {activeTab === 'passport' && (
          <DigitalPassport
            profile={profile}
            badges={badges}
            myHunts={myHunts}
            locations={locations}
            wishlistLocations={wishlistLocations}
            onToggleWishlist={handleToggleWishlist}
            onOpenUpload={handleOpenUpload}
            onSelectLocationForDetail={(loc) => setSelectedDetailLocation(loc)}
            onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
          />
        )}

      </main>

      {/* 4. MODALS & OVERLAYS */}

      {/* Location Detail Modal */}
      <LocationDetailModal
        location={selectedDetailLocation}
        onClose={() => setSelectedDetailLocation(null)}
        isWishlisted={selectedDetailLocation ? profile.wishlistedLocationIds.includes(selectedDetailLocation.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenUpload={(loc) => {
          setSelectedDetailLocation(null);
          handleOpenUpload(loc);
        }}
        communityHunts={hunts}
      />

      {/* Photo / Hunt Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        locations={locations}
        preSelectedLocation={uploadTargetLocation}
        userCoords={userCoords}
        onRequestGeolocation={handleRequestGeolocation}
        onSuccessSubmit={handleSuccessSubmit}
        hunterName={profile.name}
        hunterAvatar={profile.avatarUrl}
      />

      {/* Propose Location Modal */}
      <ProposeLocationModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        onSubmitProposal={handleSubmitProposal}
        proposedLocations={proposedLocations}
        userCoords={userCoords}
        onRequestGeolocation={handleRequestGeolocation}
        userName={profile.name}
      />

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNotificationClick={(notif) => {
          if (notif.targetTab) {
            setActiveTab(notif.targetTab);
          }
        }}
      />

      {/* Offline Mode Manager Modal */}
      <OfflineManagerModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        locationsCount={locations.length}
        isOfflineMode={isOfflineMode}
        onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
        lastSyncedTime={new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      />

    </div>
  );
}
