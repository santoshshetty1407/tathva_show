import { useState, useMemo } from 'react';
import { Search, Clock, MapPin, Trophy, Users, IndianRupee, Bell, BellOff, ChevronRight, SlidersHorizontal, CalendarPlus, CalendarCheck } from 'lucide-react';
import { EVENTS, FEST_INFO, CATEGORY_META } from '@/data';
import type { FestEvent, EventCategory } from '@/types';
import { formatTime, formatDate, getEventStatus } from '@/hooks';

interface EventScheduleProps {
  onSelectEvent: (ev: FestEvent) => void;
  isSubscribed: (id: string) => boolean;
  onToggleSubscription: (id: string) => void;
  notificationsEnabled: boolean;
  isScheduled: (id: string) => boolean;
  onToggleSchedule: (id: string) => void;
}

const CATEGORIES: EventCategory[] = ['Technical', 'Gaming', 'Informal', 'Dance', 'Pro Show', 'Workshop', 'Expo', 'Sports'];

export function EventSchedule({ onSelectEvent, isSubscribed, onToggleSubscription, notificationsEnabled, isScheduled, onToggleSchedule }: EventScheduleProps) {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return EVENTS
      .filter((e) => e.day === activeDay)
      .filter((e) => activeCategories.size === 0 || activeCategories.has(e.category))
      .filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q));
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [activeDay, activeCategories, search]);

  const toggleCategory = (cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <section id="events" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">Event Schedule</h2>
          <p className="text-ink-400">Browse all events by day, category, or search for what excites you</p>
        </div>

        {/* Day tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex glass rounded-2xl p-1.5 gap-1">
            {FEST_INFO.days.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`px-5 sm:px-8 py-3 rounded-xl font-display font-bold transition-all duration-200 ${
                  activeDay === d.day
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-ink-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="block text-sm">{d.label}</span>
                <span className="block text-xs opacity-70">{formatDate(d.date).split(',')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, venues, tags..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-light text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
              showFilters || activeCategories.size > 0
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'glass-light text-ink-200 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeCategories.size > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-xs">{activeCategories.size}</span>
            )}
          </button>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 animate-slide-down">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const active = activeCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`chip border transition-all ${
                    active
                      ? `${meta.bg} ${meta.color} ${meta.border} scale-105`
                      : 'bg-white/5 text-ink-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
            {activeCategories.size > 0 && (
              <button
                onClick={() => setActiveCategories(new Set())}
                className="chip bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Event list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-ink-400 text-lg">No events match your filters.</p>
            <button onClick={() => { setSearch(''); setActiveCategories(new Set()); }} className="mt-4 text-brand-400 hover:text-brand-300 font-semibold">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ev) => {
              const meta = CATEGORY_META[ev.category];
              const status = getEventStatus(ev);
              const subscribed = isSubscribed(ev.id);
              return (
                <div
                  key={ev.id}
                  className="group glass rounded-2xl overflow-hidden card-hover cursor-pointer relative"
                  onClick={() => onSelectEvent(ev)}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`chip ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.label}</span>
                    </div>
                    {status === 'live' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSchedule(ev.id);
                        }}
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          isScheduled(ev.id)
                            ? 'bg-gold-500 text-white'
                            : 'bg-ink-900/80 text-ink-300 hover:text-white'
                        }`
                        }
                        title={isScheduled(ev.id) ? 'Remove from my plan' : 'Add to my plan'}
                      >
                        {isScheduled(ev.id) ? <CalendarCheck size={16} /> : <CalendarPlus size={16} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSubscription(ev.id);
                        }}
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          subscribed
                            ? 'bg-brand-500 text-white'
                            : 'bg-ink-900/80 text-ink-300 hover:text-white'
                        }`
                        }
                        title={subscribed ? 'Unsubscribe from reminders' : 'Get reminder before event'}
                      >
                        {subscribed && notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-1">{ev.title}</h3>
                    <div className="space-y-1.5 text-sm text-ink-300">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-brand-400 flex-shrink-0" />
                        <span>{formatTime(ev.startTime)} — {formatTime(ev.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-accent-400 flex-shrink-0" />
                        <span className="line-clamp-1">{ev.venue}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1.5">
                        {ev.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-ink-400 bg-white/5 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ChevronRight size={18} className="text-ink-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

interface EventModalProps {
  event: FestEvent | null;
  onClose: () => void;
  isSubscribed: (id: string) => boolean;
  onToggleSubscription: (id: string) => void;
  notificationsEnabled: boolean;
  isScheduled: (id: string) => boolean;
  onToggleSchedule: (id: string) => void;
}

export function EventModal({ event, onClose, isSubscribed, onToggleSubscription, notificationsEnabled, isScheduled, onToggleSchedule }: EventModalProps) {
  if (!event) return null;
  const meta = CATEGORY_META[event.category];
  const status = getEventStatus(event);
  const subscribed = isSubscribed(event.id);
  const scheduled = isScheduled(event.id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto glass rounded-3xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-ink-950/60 text-white hover:bg-ink-950/80 transition-all hover:scale-105"
          >
            <ChevronRight size={20} className="rotate-45" />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className={`chip ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.label}</span>
            <span className="chip bg-white/10 text-ink-200 border border-white/15">Day {event.day}</span>
            {status === 'live' && (
              <span className="chip bg-red-500/90 text-white border border-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE NOW
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">{event.title}</h2>
          <p className="text-ink-300 mb-6 leading-relaxed">{event.description}</p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <InfoCard icon={Clock} label="Time" value={`${formatTime(event.startTime)} — ${formatTime(event.endTime)}`} color="text-brand-400" />
            <InfoCard icon={MapPin} label="Venue" value={event.venue} color="text-accent-400" />
            <InfoCard icon={Trophy} label="Prize" value={event.prize || '—'} color="text-gold-400" />
            <InfoCard icon={Users} label="Team Size" value={event.teamSize || '—'} color="text-pink-400" />
            <InfoCard icon={IndianRupee} label="Reg. Fee" value={event.registrationFee || 'Free'} color="text-teal-400" />
            <InfoCard icon={MapPin} label="Zone" value={event.zone} color="text-cyan-400" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags.map((tag) => (
              <span key={tag} className="text-xs text-ink-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onToggleSchedule(event.id)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold transition-all duration-200 hover:scale-[1.02] ${
                scheduled
                  ? 'bg-gold-500/20 text-gold-300 border-2 border-gold-500/40 hover:bg-gold-500/30'
                  : 'bg-gold-500/90 text-white hover:bg-gold-400 shadow-lg shadow-gold-500/20'
              }`}
            >
              {scheduled ? <CalendarCheck size={18} /> : <CalendarPlus size={18} />}
              {scheduled ? 'In My Plan' : 'Add to My Plan'}
            </button>
            <button
              onClick={() => onToggleSubscription(event.id)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold transition-all duration-200 hover:scale-[1.02] ${
                subscribed
                  ? 'bg-brand-500/20 text-brand-300 border-2 border-brand-500/40 hover:bg-brand-500/30'
                  : 'bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-500/30'
              }`}
            >
              {subscribed ? <Bell size={18} /> : <BellOff size={18} />}
              {subscribed ? 'Reminders On' : 'Remind Me'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="glass-light rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
        <Icon size={12} className={color} />
        {label}
      </div>
      <div className="text-sm font-semibold text-white line-clamp-1">{value}</div>
    </div>
  );
}
