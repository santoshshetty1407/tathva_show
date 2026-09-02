import { useLiveEvents, formatTime } from '@/hooks';
import { EVENTS, CATEGORY_META } from '@/data';
import { Radio, MapPin, Clock, ChevronRight, Zap } from 'lucide-react';
import type { FestEvent } from '@/types';

interface HappeningNowProps {
  onSelectEvent: (event: FestEvent) => void;
}

export function HappeningNow({ onSelectEvent }: HappeningNowProps) {
  const liveEvents = useLiveEvents(EVENTS);

  return (
    <section className="px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-5 sm:p-7 border-brand-500/25 shadow-2xl shadow-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                <Radio size={20} className="text-red-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 ring-4 ring-ink-950 animate-pulse" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">Happening Right Now</h2>
                <p className="text-sm text-ink-400">Find something exciting near you</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-white/5 text-xs font-semibold text-ink-300">
              <Zap size={13} className="text-gold-400" />
              Live campus guide
            </span>
          </div>

          {liveEvents.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/5 px-5 py-7 text-center">
              <p className="text-white font-semibold">Nothing is live at this moment</p>
              <p className="text-sm text-ink-400 mt-1">Check the schedule to plan your next stop.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {liveEvents.map((event) => {
                const meta = CATEGORY_META[event.category];
                return (
                  <button key={event.id} onClick={() => onSelectEvent(event)} className="text-left group rounded-2xl bg-white/5 border border-white/10 hover:border-brand-400/40 hover:bg-white/10 transition-all p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`chip ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.label}</span>
                      <ChevronRight size={17} className="text-ink-500 group-hover:text-brand-300 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-display font-bold text-white mt-3 line-clamp-1">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-ink-300">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-brand-400" />{formatTime(event.startTime)} — {formatTime(event.endTime)}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-accent-400" />{event.zone}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
