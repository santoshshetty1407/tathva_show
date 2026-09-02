import { Bell, X, Clock, MapPin } from 'lucide-react';
import type { FestEvent } from '@/types';
import { formatTime } from '@/hooks';

interface NotificationToastProps {
  event: FestEvent | null;
  onDismiss: () => void;
}

export function NotificationToast({ event, onDismiss }: NotificationToastProps) {
  if (!event) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[200] animate-slide-down">
      <div className="glass rounded-2xl p-4 shadow-2xl shadow-brand-500/20 border-brand-500/30 max-w-sm sm:w-96 ml-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center animate-pulse">
            <Bell size={20} className="text-brand-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Event Starting Soon</span>
            </div>
            <h4 className="font-display font-bold text-white text-sm mb-1 line-clamp-1">{event.title}</h4>
            <div className="flex items-center gap-3 text-xs text-ink-300">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-brand-400" />
                {formatTime(event.startTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-accent-400" />
                <span className="line-clamp-1">{event.venue}</span>
              </span>
            </div>
          </div>
          <button onClick={onDismiss} className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-all">
            <X size={16} className="text-ink-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
