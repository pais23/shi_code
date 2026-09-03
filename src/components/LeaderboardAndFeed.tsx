import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Heart, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Medal, 
  Sparkles, 
  Users, 
  Camera,
  Navigation,
  Share2
} from 'lucide-react';
import { HunterLeaderboardItem, HuntRecord, StampLocation } from '../types';
import { getGoogleMapsDirUrl } from '../utils/geoUtils';

interface LeaderboardAndFeedProps {
  leaderboard: HunterLeaderboardItem[];
  communityHunts: HuntRecord[];
  onLikeHunt: (huntId: string) => void;
  onSelectLocationForDetail: (location: StampLocation) => void;
  locations: StampLocation[];
  onOpenUpload: (loc: StampLocation) => void;
}

export const LeaderboardAndFeed: React.FC<LeaderboardAndFeedProps> = ({
  leaderboard,
  communityHunts,
  onLikeHunt,
  onSelectLocationForDetail,
  locations,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'monthly' | 'stations'>('all');

  const getLocation = (locId: string) => locations.find((l) => l.id === locId);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 text-white p-6 sm:p-8 shadow-sm border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Ruang Komunitas
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white leading-tight">
            Feed Buruan & <span className="text-rose-400">Papan Peringkat</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Lihat hasil cap stempel terbaru dari member di seluruh nusantara dan pantau posisimu di papan peringkat hunter!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15 shrink-0 z-10">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'feed'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Feed Buruan</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        </div>

        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 1. COMMUNITY HUNT FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              Linimasa Hunting Terkini ({communityHunts.length} Kiriman)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {communityHunts.map((hunt) => {
              const loc = getLocation(hunt.locationId);

              return (
                <div
                  key={hunt.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Author Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={hunt.hunterAvatar}
                        alt={hunt.hunterName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <h4 className="font-semibold text-xs text-zinc-900 leading-tight">
                          {hunt.hunterName}
                        </h4>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          {hunt.visitDate}
                        </p>
                      </div>
                    </div>

                    {hunt.isGpsVerified && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        GPS Verified
                      </span>
                    )}
                  </div>

                  {/* Stamp Photo */}
                  <div className="relative h-64 sm:h-72 bg-zinc-100">
                    <img
                      src={hunt.photoUrl}
                      alt={hunt.locationName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Location overlay tag on photo */}
                    <div 
                      onClick={() => loc && onSelectLocationForDetail(loc)}
                      className="absolute bottom-3 left-3 right-3 bg-zinc-950/80 backdrop-blur-xs p-3 rounded-xl text-white flex items-center justify-between cursor-pointer hover:bg-zinc-950 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-xs truncate flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          {hunt.locationName}
                        </p>
                        <p className="text-[10px] text-zinc-300 truncate font-medium">
                          {hunt.cityName}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider shrink-0">
                        Detail &rarr;
                      </span>
                    </div>
                  </div>

                  {/* User Notes and Cheering / Likes */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {hunt.userNotes && (
                      <p className="text-xs text-zinc-600 leading-relaxed italic">
                        &ldquo;{hunt.userNotes}&rdquo;
                      </p>
                    )}

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onLikeHunt(hunt.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                          hunt.likedByMe
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${hunt.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{hunt.likesCount} Apresiasi</span>
                      </button>

                      {loc && (
                        <a
                          href={getGoogleMapsDirUrl(loc.lat, loc.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-800 hover:text-rose-600 font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5 text-rose-500" />
                          <span>Rute Maps</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {leaderboard.slice(0, 3).map((hunter, index) => {
              const medals = [
                { color: 'bg-rose-600 text-white', border: 'border-rose-200/80', label: 'Juara 1 👑' },
                { color: 'bg-zinc-800 text-white', border: 'border-zinc-200', label: 'Juara 2 🥈' },
                { color: 'bg-stone-700 text-white', border: 'border-stone-200', label: 'Juara 3 🥉' },
              ];

              return (
                <div
                  key={hunter.id}
                  className={`relative bg-white rounded-2xl p-6 border ${medals[index].border} shadow-xs flex flex-col items-center text-center space-y-3.5`}
                >
                  <span className={`px-3.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${medals[index].color} shadow-xs`}>
                    {medals[index].label}
                  </span>

                  <div className="relative">
                    <img
                      src={hunter.avatarUrl}
                      alt={hunter.name}
                      className="w-18 h-18 rounded-full object-cover ring-2 ring-zinc-200 shadow-xs"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                      #{hunter.rank}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">{hunter.name}</h4>
                    <p className="text-xs text-rose-600 font-mono font-medium">{hunter.handle}</p>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{hunter.city}</span>
                  </div>

                  <div className="w-full pt-3 border-t border-zinc-100 flex items-center justify-around text-xs">
                    <div>
                      <span className="block font-bold text-rose-600 text-base">{hunter.totalStamps}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Stempel</span>
                    </div>
                    <div>
                      <span className="block font-bold text-zinc-900 text-base">{hunter.ralliesCompleted}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Rally</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-semibold text-zinc-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    🎖️ {hunter.topBadge}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900">
                Peringkat Seluruh Komunitas
              </h4>
              <span className="text-xs text-zinc-500 font-medium">
                Update real-time dari log hunting
              </span>
            </div>

            <div className="divide-y divide-zinc-100">
              {leaderboard.map((item) => {
                const isMe = item.id === 'user-me';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                      isMe ? 'bg-rose-50/50 font-semibold border-l-2 border-rose-600' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-7 text-center font-bold text-sm ${isMe ? 'text-rose-600' : 'text-zinc-400'}`}>
                        #{item.rank}
                      </span>
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                            {item.name}
                          </p>
                          {isMe && (
                            <span className="text-[9px] px-2 py-0.5 bg-rose-600 text-white rounded-full font-semibold uppercase tracking-wider">
                              Kamu
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate font-medium">
                          {item.handle} • {item.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <span className="block font-bold text-zinc-900 text-sm">
                          {item.totalStamps} <span className="text-[10px] font-normal text-zinc-500">Cap</span>
                        </span>
                        <span className="text-[10px] text-rose-600 font-semibold hidden sm:block">
                          {item.ralliesCompleted} Rally
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
