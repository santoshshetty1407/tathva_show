import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Award, Trophy, Target, Crown, Cpu, Moon, Gamepad2, Utensils, Flag, QrCode, X, Check, Pencil, Medal } from 'lucide-react';
import type { Badge, CheckIn, FestEvent } from '@/types';

interface GamificationProps {
  player: { name: string };
  checkIns: CheckIn[];
  earnedBadges: Badge[];
  leaderboard: { name: string; points: number; visits: number }[];
  loading: boolean;
  error: string;
  onUpdateName: (name: string) => void;
  onCheckIn: (event: FestEvent) => Promise<{ ok: boolean; message: string }>;
  events: FestEvent[];
}

const ICONS = { Award, Trophy, Target, Crown, Cpu, Moon, Gamepad2, Utensils, Flag, Medal };

export function Gamification({ player, checkIns, earnedBadges, leaderboard, loading, error, onUpdateName, onCheckIn, events }: GamificationProps) {
  const [name, setName] = useState(player.name);
  const [editingName, setEditingName] = useState(false);
  const [qrEvent, setQrEvent] = useState<FestEvent | null>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [status, setStatus] = useState('');
  const points = checkIns.reduce((sum, item) => sum + item.points, 0);
  const nextBadge = earnedBadges.length < 6 ? 'Keep exploring to unlock more badges' : 'All badges unlocked — you are a Fest Legend';

  useEffect(() => {
    if (!qrEvent) return;
    const checkInUrl = `${window.location.origin}${window.location.pathname}?checkin=${encodeURIComponent(qrEvent.id)}#gamification`;
    void QRCode.toDataURL(checkInUrl, { width: 260, margin: 2, color: { dark: '#f4f6fb', light: '#0f1422' } }).then(setQrUrl);
  }, [qrEvent]);

  const saveName = () => {
    onUpdateName(name);
    setEditingName(false);
  };

  const handleCheckIn = async (event: FestEvent) => {
    const result = await onCheckIn(event);
    setStatus(result.message);
    setTimeout(() => setStatus(''), 3500);
  };

  return (
    <section id="gamification" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-gold-400 text-sm font-semibold mb-2"><Trophy size={15} />Explore. Check in. Win.</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">Tathva Quest</h2>
          <p className="text-ink-400">Turn your fest trail into points, badges, and bragging rights.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="glass rounded-3xl p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-400 font-bold">Your explorer profile</p>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-2"><input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} autoFocus className="bg-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50" /><button onClick={saveName} className="p-2 rounded-lg bg-brand-500 text-white"><Check size={16} /></button></div>
                ) : (
                  <button onClick={() => setEditingName(true)} className="flex items-center gap-2 mt-1 group"><h3 className="font-display font-bold text-2xl text-white">{player.name}</h3><Pencil size={14} className="text-ink-500 group-hover:text-brand-300" /></button>
                )}
              </div>
              <div className="flex gap-3">
                <Stat value={String(points)} label="Points" accent="text-gold-400" />
                <Stat value={String(checkIns.length)} label="Check-ins" accent="text-brand-300" />
                <Stat value={String(earnedBadges.length)} label="Badges" accent="text-accent-300" />
              </div>
            </div>

            {status && <div className="mb-4 px-4 py-3 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-200 text-sm flex items-center gap-2"><Check size={16} />{status}</div>}
            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-200 text-sm">{error}</div>}

            <div className="flex items-center justify-between mb-3"><h4 className="font-display font-bold text-white">Earned badges</h4><span className="text-xs text-ink-500">{nextBadge}</span></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {earnedBadges.map((badge) => <BadgeCard key={badge.id} badge={badge} earned />)}
              {Array.from({ length: Math.max(0, 6 - earnedBadges.length) }).map((_, index) => <BadgeCard key={`locked-${index}`} badge={{ id: `locked-${index}`, name: 'Locked badge', description: 'Keep exploring', icon: 'Award', color: 'text-ink-500', bg: 'bg-white/5', border: 'border-white/5', requirement: () => false }} earned={false} />)}
            </div>

            <div className="mt-7 pt-6 border-t border-white/5"><h4 className="font-display font-bold text-white mb-3">Quick check-in</h4><div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">{events.slice(0, 8).map((event) => { const checked = checkIns.some((item) => item.eventId === event.id); return <button key={event.id} onClick={() => void handleCheckIn(event)} disabled={checked} className={`flex-shrink-0 text-left w-40 p-3 rounded-xl border transition-all ${checked ? 'bg-brand-500/10 border-brand-500/25 opacity-70' : 'bg-white/5 border-white/10 hover:border-brand-400/40 hover:bg-white/10'}`}><p className="text-xs font-semibold text-white line-clamp-2">{event.title}</p><span className={`text-[10px] mt-2 block ${checked ? 'text-brand-300' : 'text-ink-500'}`}>{checked ? 'Checked in' : '+10 points'}</span></button>; })}</div><p className="text-xs text-ink-500 mt-3">At the venue, scan the event QR code to check in. This button is available for preview.</p></div>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5"><div><p className="text-xs uppercase tracking-widest text-ink-400 font-bold">Live rankings</p><h3 className="font-display font-bold text-2xl text-white mt-1">Leaderboard</h3></div><Medal size={25} className="text-gold-400" /></div>
            {loading ? <div className="py-10 text-center text-ink-400">Loading rankings...</div> : leaderboard.length === 0 ? <div className="py-10 text-center text-ink-400">Be the first explorer on the board.</div> : <div className="space-y-2">{leaderboard.map((entry, index) => <div key={`${entry.name}-${index}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${entry.name === player.name ? 'bg-brand-500/15 border border-brand-500/25' : 'bg-white/5'}`}><span className={`w-7 text-center font-display font-bold ${index === 0 ? 'text-gold-400' : index === 1 ? 'text-ink-200' : index === 2 ? 'text-accent-300' : 'text-ink-500'}`}>{index + 1}</span><div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-sm font-bold text-white">{entry.name.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{entry.name}</p><p className="text-xs text-ink-500">{entry.visits} {entry.visits === 1 ? 'check-in' : 'check-ins'}</p></div><span className="font-display font-bold text-gold-400 text-sm">{entry.points} pts</span></div>)}</div>}
            <div className="mt-6 pt-5 border-t border-white/5"><h4 className="font-display font-bold text-white mb-3">Venue QR codes</h4><div className="space-y-2 max-h-52 overflow-y-auto">{events.map((event) => <button key={event.id} onClick={() => setQrEvent(event)} className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"><QrCode size={17} className="text-brand-300" /><span className="text-sm text-ink-200 truncate flex-1">{event.title}</span><span className="text-xs text-ink-500">View QR</span></button>)}</div></div>
          </div>
        </div>
      </div>

      {qrEvent && <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-sm" onClick={() => setQrEvent(null)}><div className="glass rounded-3xl p-6 text-center max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}><div className="flex justify-end"><button onClick={() => setQrEvent(null)} className="p-2 rounded-lg hover:bg-white/10"><X size={18} className="text-ink-300" /></button></div><QrCode size={22} className="mx-auto text-brand-300 mb-2" /><h3 className="font-display font-bold text-xl text-white">{qrEvent.title}</h3><p className="text-sm text-ink-400 mt-1 mb-5">Scan at the venue to earn 10 points</p>{qrUrl ? <img src={qrUrl} alt={`Check-in QR code for ${qrEvent.title}`} className="w-64 h-64 mx-auto rounded-xl" /> : <div className="w-64 h-64 mx-auto rounded-xl bg-white/10 animate-pulse" />}<p className="text-xs text-ink-500 mt-4">Keep this code visible for attendees.</p></div></div>}
    </section>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent: string }) { return <div className="text-center min-w-[60px]"><p className={`font-display font-extrabold text-xl ${accent}`}>{value}</p><p className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">{label}</p></div>; }

function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) { const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Award; return <div className={`rounded-xl border p-3 ${earned ? `${badge.bg} ${badge.border}` : 'bg-white/[0.02] border-white/5 opacity-45'}`}><Icon size={21} className={earned ? badge.color : 'text-ink-500'} /><p className="text-xs font-bold text-white mt-2">{badge.name}</p><p className="text-[10px] text-ink-400 mt-0.5 leading-tight">{badge.description}</p></div>; }
