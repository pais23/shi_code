import React from 'react';
import { 
  X, 
  WifiOff, 
  HardDrive, 
  CheckCircle2, 
  MapPin, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { StampLocation } from '../types';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationsCount: number;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  lastSyncedTime: string;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  locationsCount,
  isOfflineMode,
  onToggleOffline,
  lastSyncedTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 my-auto p-6 space-y-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#F97316]/20 text-[#F97316]">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-base sm:text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Mode Offline Ringan
              </h3>
              <p className="text-xs text-slate-500">
                Akses direktori stempel tanpa koneksi internet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#0F172A]" />
              <span className="text-xs font-bold text-slate-800">
                Penyimpanan Lokal:
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {locationsCount} Lokasi Tersimpan
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Data nama tempat, koordinat GPS, tips posisi meja stempel, dan foto stempel telah di-cache di memori browser perangkatmu.
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sinkronisasi Terakhir:</span>
            <span className="font-mono font-medium">{lastSyncedTime}</span>
          </div>
        </div>

        {/* Tips for Remote Stations */}
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Tips untuk Ekspedisi Stasiun Terpencil:
          </span>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            Saat berada di stasiun kecil tanpa sinyal, kamu tetap bisa membuka koordinat dan petunjuk letak meja stempel. Foto hunting yang kamu upload saat offline akan otomatis tersimpan di paspor digitalmu!
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              onToggleOffline();
              alert(
                isOfflineMode
                  ? 'Mode offline dinonaktifkan. Aplikasi akan mengambil update langsung saat ada sinyal.'
                  : 'Mode offline aktif! Seluruh database lokasi sekarang tersimpan offline.'
              );
            }}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              isOfflineMode
                ? 'bg-[#F97316] text-white border-[#F97316] shadow-md'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isOfflineMode ? 'Matikan Mode Offline' : 'Aktifkan Mode Offline'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
