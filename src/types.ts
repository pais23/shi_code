export type StampCategory = 
  | 'station'
  | 'post_office'
  | 'cafe'
  | 'museum_landmark'
  | 'nature_tour'
  | 'community_event'
  | 'bookstore_art';

export interface StampLocation {
  id: string;
  name: string;
  category: StampCategory;
  city: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  stampImageUrl: string;
  stampDesignName: string;
  stampShape: 'round' | 'square' | 'shield' | 'oval' | 'hexagon';
  stampInkColor: string; // hex or color name
  description: string;
  tipLocation: string; // e.g. "Di meja Informasi / CS dekat Pintu Masuk Selatan"
  isLimitedEvent: boolean;
  eventName?: string;
  status: 'active' | 'inactive' | 'temporary';
  totalHuntedCount: number;
  rating: number;
  contributedBy: string;
  isVerifiedLocation: boolean;
}

export interface HuntRecord {
  id: string;
  locationId: string;
  locationName: string;
  cityName: string;
  category: StampCategory;
  photoUrl: string;
  stampInkColor: string;
  visitDate: string;
  userNotes?: string;
  isGpsVerified: boolean;
  distanceMetersAtUpload?: number;
  userCoordinates?: {
    lat: number;
    lng: number;
  };
  hunterId: string;
  hunterName: string;
  hunterAvatar: string;
  likesCount: number;
  likedByMe?: boolean;
  createdAt: string;
}

export interface StampRally {
  id: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  rewardDescription: string;
  rewardBadgeId: string;
  checkpointLocationIds: string[];
  organizer: string;
  tag: string;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'milestone' | 'region' | 'specialty' | 'rally';
  unlockedAt?: string;
  criteria: string;
  isUnlocked: boolean;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  homeCity: string;
  totalStamps: number;
  completedRalliesCount: number;
  rank: number;
  joinDate: string;
  badges: string[];
  wishlistedLocationIds: string[];
}

export interface HunterLeaderboardItem {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  city: string;
  totalStamps: number;
  ralliesCompleted: number;
  topBadge: string;
  rank: number;
}

export interface ProposedLocation {
  id: string;
  name: string;
  category: StampCategory;
  city: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  tipLocation: string;
  stampPhotoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'rally' | 'location' | 'badge' | 'community';
  isRead: boolean;
  targetTab?: 'explore' | 'rally' | 'passport' | 'community';
  targetId?: string;
}
