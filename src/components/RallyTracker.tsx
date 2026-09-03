import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flag, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Navigation, 
  Camera, 
  Gift, 
  Award, 
  Share2, 
  X,
  ExternalLink,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { StampRally, StampLocation, HuntRecord } from '../types';
import { getGoogleMapsDirUrl, getCategoryLabel } from '../utils/geoUtils';

interface RallyTrackerProps {
  rallies: StampRally[];
  locations: StampLocation[];
  myHunts: HuntRecord[];
  onOpenUpload: (location: StampLocation) => void;
  onSelectLocationForDetail: (location: StampLocation) => void;
  userName: string;
}

export const RallyTracker: React.FC<RallyTrackerProps> = ({
  rallies,
  locations,
  myHunts,
  onOpenUpload,
  onSelectLocationForDetail,
  userName,
}) => {
  const [selectedRally, setSelectedRally] = useState<StampRally | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<StampRally | null>(null);

  // Helper to get location by ID
  const getLocation = (id: string) => locations.find((l) => l.id === id);

  // Helper to check if a checkpoint has been visited/hunted
  const isCheckpointCollected = (locId: string) => {
    return myHunts.some((h) => h.locationId === locId);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Artistic Flair Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 text-white p-6 sm:p-8 shadow-sm border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
            <Flag className="w-3.5 h-3.5 text-rose-400" />
            Program Stamp Rally 2025
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white leading-tight">
            Ikuti <span className="text-rose-400">Stamp Rally</span> & Raih Reward Eksklusif
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Kunjungi checkpoint stempel bertema, lengkapi semua cap di paspormu, dan klaim pin lencana fisik serta e-sertifikat resmi!
          </p>
        </div>

        <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 z-10">
          <Trophy className="w-8 h-8 text-rose-400" />
          <div>
            <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest block">
              Status Rally Kamu
            </span>
            <span className="text-base font-bold text-white">
              {rallies.filter((r) => r.checkpointLocationIds.every(isCheckpointCollected)).length} dari {rallies.length} Selesai
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Rallies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {rallies.map((rally) => {
          const checkpointLocations = rally.checkpointLocationIds
            .map((id) => getLocation(id))
            .filter((l): l is StampLocation => Boolean(l));

          const collectedCount = rally.checkpointLocationIds.filter(isCheckpointCollected).length;
          const totalCount = rally.checkpointLocationIds.length;
          const isCompleted = collectedCount === totalCount && totalCount > 0;
          const progressPercent = Math.round((collectedCount / totalCount) * 100);

          return (
            <div
              key={rally.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-sm ${
                isCompleted ? 'border-emerald-500/80' : 'border-zinc-200/90 hover:border-zinc-300'
              }`}
            >
              {/* Banner Image */}
              <div className="relative h-44 bg-zinc-900 overflow-hidden">
                <img
                  src={rally.bannerUrl}
                  alt={rally.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                    {rally.tag}
                  </span>
                  {isCompleted ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selesai! 🎉
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900/70 text-white backdrop-blur-xs border border-white/15">
                      Berlangsung
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-bold text-white text-base leading-snug drop-shadow-sm">
                    {rally.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5 font-medium">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    Hingga {rally.endDate}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3.5">
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {rally.description}
                  </p>

                  {/* Reward Box */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
                    <Gift className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                        Hadiah Rally:
                      </span>
                      <p className="text-xs font-semibold text-zinc-900">
                        {rally.rewardDescription}
                      </p>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600">
                        Progress Stempel:
                      </span>
                      <span className="font-bold text-zinc-900">
                        {collectedCount} / {totalCount} Checkpoint ({progressPercent}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/80">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Checkpoints Preview List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Titik Stempel:
                    </span>
                    <div className="space-y-1">
                      {checkpointLocations.map((loc) => {
                        const isDone = isCheckpointCollected(loc.id);
                        return (
                          <div
                            key={loc.id}
                            onClick={() => onSelectLocationForDetail(loc)}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : 'bg-stone-50/60 border-stone-200/80 text-zinc-700 hover:bg-zinc-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                              )}
                              <span className={`truncate font-medium ${isDone ? 'line-through text-emerald-800' : ''}`}>
                                {loc.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-medium shrink-0 ml-1">
                              {loc.city}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                  {isCompleted ? (
                    <button
                      onClick={() => {
                        triggerConfetti();
                        setShowCertificateModal(rally);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>Klaim Sertifikat & Reward</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedRally(rally)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Panduan Rally</span>
                      <ChevronRight className="w-4 h-4 text-rose-400" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Rally Modal */}
      {selectedRally && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200/90 my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {selectedRally.tag}
                  </span>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-zinc-900 mt-2">
                    {selectedRally.title}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Penyelenggara: {selectedRally.organizer}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRally(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed">
                {selectedRally.description}
              </p>

              {/* Checkpoints with direct Maps routing */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                  Titik Stempel Rally ({selectedRally.checkpointLocationIds.length})
                </h4>

                <div className="space-y-2">
                  {selectedRally.checkpointLocationIds.map((id) => {
                    const loc = getLocation(id);
                    if (!loc) return null;
                    const isDone = isCheckpointCollected(loc.id);

                    return (
                      <div
                        key={loc.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDone ? 'bg-emerald-50/70 border-emerald-200' : 'bg-stone-50/60 border-stone-200/80'
                        }`}
                      >
                        <div className="min-w-0 flex items-start gap-2.5">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-semibold text-zinc-900 text-sm">{loc.name}</p>
                            <p className="text-xs text-zinc-500">{loc.city} • {loc.tipLocation}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <a
                            href={getGoogleMapsDirUrl(loc.lat, loc.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Navigation className="w-3 h-3 text-rose-400" />
                            Maps
                          </a>
                          {!isDone && (
                            <button
                              onClick={() => {
                                setSelectedRally(null);
                                onOpenUpload(loc);
                              }}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedRally(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* E-Certificate Modal when completed */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-3xl shadow-xl border border-stone-300 overflow-hidden my-auto p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setShowCertificateModal(null)}
              className="absolute top-4 right-4 p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Stamp */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600 text-white shadow-md mx-auto ring-4 ring-rose-100">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                KOMUNITAS STAMP HUNTER INDONESIA
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900">
                SERTIFIKAT KELULUSAN RALLY
              </h2>
              <div className="w-20 h-0.5 bg-rose-600 mx-auto mt-2"></div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-zinc-800 space-y-2">
              <p className="text-xs text-zinc-500">Diberikan dengan bangga kepada:</p>
              <p className="text-lg font-bold text-zinc-900">{userName}</p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Telah berhasil menyelesaikan seluruh tantangan titik stempel dalam rally resmi:
              </p>
              <p className="text-sm font-bold text-rose-600">
                &ldquo;{showCertificateModal.title}&rdquo;
              </p>
            </div>

            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              🎁 Hadiah Resmi: {showCertificateModal.rewardDescription}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  alert('Sertifikat berhasil diunduh sebagai gambar siap share!');
                  setShowCertificateModal(null);
                }}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Simpan & Bagikan Sertifikat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
