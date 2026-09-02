import { AlertTriangle, Bell, CalendarClock, Info, Radio, RefreshCw, Sparkles } from 'lucide-react';
import { useAnnouncements } from '@/hooks';
import type { Announcement } from '@/types';

const META: Record<Announcement['type'], { icon: typeof Info; color: string; label: string }> = {
  info: { icon: Info, color: 'text-cyan-300', label: 'Info' },
  update: { icon: RefreshCw, color: 'text-brand-300', label: 'Update' },
  alert: { icon: AlertTriangle, color: 'text-accent-300', label: 'Alert' },
  event: { icon: CalendarClock, color: 'text-gold-400', label: 'Event' },
};

export function LiveFeed() {
  const { announcements, loading, error } = useAnnouncements();

  return (
    <section id="updates" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div><div className="inline-flex items-center gap-2 text-red-300 text-sm font-semibold mb-2"><Radio size={15} className="animate-pulse" />Live from campus</div><h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">Live Updates</h2><p className="text-ink-400">The latest changes, announcements, and things worth knowing.</p></div>
          <span className="inline-flex items-center gap-2 text-xs text-ink-400"><span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />Auto-refreshing</span>
        </div>
        {loading ? <div className="glass rounded-2xl p-8 text-center text-ink-400">Loading live updates...</div> : error ? <div className="glass rounded-2xl p-8 text-center text-accent-200">{error}</div> : <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{announcements.map((announcement) => <AnnouncementCard key={announcement.id} announcement={announcement} />)}</div>}
        {!loading && !error && announcements.length === 0 && <div className="glass rounded-2xl p-8 text-center text-ink-400">No announcements yet. Check back during the fest.</div>}
      </div>
    </section>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const meta = META[announcement.type];
  const Icon = meta.icon;
  const date = new Date(announcement.createdAt);
  return <article className="glass rounded-2xl p-5 hover:border-white/20 transition-all"><div className="flex items-center justify-between gap-3 mb-4"><span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${meta.color}`}><Icon size={14} />{meta.label}</span><time className="text-xs text-ink-500">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</time></div><p className="text-white font-semibold leading-relaxed">{announcement.message}</p><div className="flex items-center gap-1.5 text-xs text-ink-500 mt-4"><Bell size={12} />Tathva live desk</div></article>;
}
