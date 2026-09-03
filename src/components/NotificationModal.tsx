import React from 'react';
import { 
  X, 
  Bell, 
  Flag, 
  MapPin, 
  Award, 
  Users, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'rally':
        return <Flag className="w-4 h-4 text-orange-600" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-blue-900" />;
      case 'badge':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Users className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Notifikasi & Komunitas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs px-5">
          <span className="text-slate-500 font-medium">
            {notifications.filter((n) => !n.isRead).length} Belum Dibaca
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="font-bold text-[#F97316] hover:underline flex items-center gap-1 uppercase tracking-wider text-[10px]"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai Semua Dibaca
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5 max-h-[calc(75vh-120px)] overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onNotificationClick(notif);
                onClose();
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                notif.isRead
                  ? 'bg-white border-slate-200 hover:bg-slate-50'
                  : 'bg-orange-50/50 border-orange-200 shadow-xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs ${notif.isRead ? 'font-bold text-slate-800' : 'font-extrabold text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
