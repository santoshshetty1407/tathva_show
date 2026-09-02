import { Bell, BellOff, Clock, Check, X } from 'lucide-react';

interface NotificationPanelProps {
  open: boolean;
  enabled: boolean;
  reminderMinutes: number;
  subscribedCount: number;
  onToggle: () => void;
  onSetMinutes: (m: number) => void;
  onClose: () => void;
}

const REMINDER_OPTIONS = [5, 10, 15, 30, 60];

export function NotificationPanel({
  open,
  enabled,
  reminderMinutes,
  subscribedCount,
  onToggle,
  onSetMinutes,
  onClose,
}: NotificationPanelProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full glass rounded-3xl p-6 animate-scale-in mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-all">
          <X size={18} className="text-ink-300" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${enabled ? 'bg-brand-500/20' : 'bg-white/5'}`}>
            {enabled ? <Bell size={24} className="text-brand-300" /> : <BellOff size={24} className="text-ink-400" />}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white">Event Notifications</h3>
            <p className="text-sm text-ink-400">Get reminded before your subscribed events</p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all mb-6 ${
            enabled ? 'bg-brand-500/15 border border-brand-500/30' : 'glass-light'
          }`}
        >
          <div className="text-left">
            <div className="font-semibold text-white">{enabled ? 'Notifications Enabled' : 'Notifications Disabled'}</div>
            <div className="text-xs text-ink-400 mt-0.5">
              {enabled ? 'You will receive reminders for subscribed events' : 'Turn on to receive event reminders'}
            </div>
          </div>
          <div className={`relative w-12 h-7 rounded-full transition-all ${enabled ? 'bg-brand-500' : 'bg-ink-700'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
          </div>
        </button>

        {/* Reminder time */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-200 mb-3">
            <Clock size={16} className="text-brand-400" />
            Remind me before event
          </div>
          <div className="flex flex-wrap gap-2">
            {REMINDER_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => onSetMinutes(m)}
                disabled={!enabled}
                className={`chip border transition-all ${
                  reminderMinutes === m
                    ? 'bg-brand-500 text-white border-brand-400 scale-105'
                    : 'glass-light text-ink-300 border-white/10 hover:bg-white/10'
                } ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {m < 60 ? `${m} min` : '1 hr'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-sm text-ink-300">
          <Check size={16} className="text-brand-400" />
          You're subscribed to <span className="font-bold text-white">{subscribedCount}</span> {subscribedCount === 1 ? 'event' : 'events'}
        </div>

        <p className="text-xs text-ink-500 mt-4 text-center">
          Tip: Subscribe to events from the event cards or detail view. Keep this tab open to receive notifications.
        </p>
      </div>
    </div>
  );
}
