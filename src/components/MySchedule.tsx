import { useMemo, useState } from 'react';
import { CalendarPlus, Clock, MapPin, Share2, Check, X, Copy, Sparkles } from 'lucide-react';
import type { FestEvent } from '@/types';
import { formatDate, formatTime } from '@/hooks';
import { CATEGORY_META } from '@/data';

interface MyScheduleProps {
  events: FestEvent[];
  onRemove: (id: string) => void;
}

export function MySchedule({ events, onRemove }: MyScheduleProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const sortedEvents = useMemo(() => [...events].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)), [events]);
  const shareUrl = `${window.location.origin}${window.location.pathname}#my-schedule`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="my-schedule" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-300 text-sm font-semibold mb-2"><Sparkles size={15} />Your personal fest plan</div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">My Schedule</h2>
            <p className="text-ink-400">Save the moments you care about and never miss your next stop.</p>
          </div>
          {sortedEvents.length > 0 && (
            <button onClick={() => setShareOpen(true)} className="btn-primary self-start sm:self-auto flex items-center gap-2"><Share2 size={17} />Share my plan</button>
          )}
        </div>

        {sortedEvents.length === 0 ? (
          <div className="glass rounded-3xl p-8 sm:p-12 text-center border-dashed">
            <CalendarPlus size={34} className="mx-auto text-brand-400 mb-4" />
            <h3 className="font-display font-bold text-xl text-white">Your plan is empty</h3>
            <p className="text-ink-400 mt-2 max-w-md mx-auto">Tap the calendar icon on any event to build a day-by-day plan you can share with friends.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event) => {
              const meta = CATEGORY_META[event.category];
              return (
                <div key={event.id} className="glass rounded-2xl p-4 group hover:border-brand-500/30 transition-all">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={`chip ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.label}</span>
                    <button onClick={() => onRemove(event.id)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-300 hover:bg-red-500/10 transition-all" aria-label={`Remove ${event.title}`}><X size={15} /></button>
                  </div>
                  <h3 className="font-display font-bold text-white line-clamp-2">{event.title}</h3>
                  <div className="space-y-1.5 mt-3 text-sm text-ink-300">
                    <div className="flex items-center gap-2"><CalendarPlus size={14} className="text-brand-400" />{formatDate(event.date)}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-gold-400" />{formatTime(event.startTime)} — {formatTime(event.endTime)}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-accent-400" />{event.venue}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm" onClick={() => setShareOpen(false)}>
          <div className="glass rounded-3xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h3 className="font-display font-bold text-xl text-white">Share your Tathva plan</h3><button onClick={() => setShareOpen(false)} className="p-2 rounded-lg hover:bg-white/10"><X size={18} className="text-ink-300" /></button></div>
            <div className="rounded-2xl bg-brand-500/10 border border-brand-500/20 p-4 mb-4"><p className="text-sm text-brand-200">Your schedule is ready to share. Send this page to your crew and compare plans together.</p></div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2"><span className="text-xs text-ink-400 truncate flex-1 px-2">{shareUrl}</span><button onClick={copyLink} className="btn-primary !px-3 !py-2 flex items-center gap-1.5 text-sm">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy'}</button></div>
            <p className="text-xs text-ink-500 mt-3">Your plan stays on this device. The shared link opens the fest guide for your friends.</p>
          </div>
        </div>
      )}
    </section>
  );
}
