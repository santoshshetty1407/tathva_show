import { useCountdown, formatTime } from '@/hooks';
import { FEST_INFO, EVENTS } from '@/data';
import { Calendar, MapPin, Users, Sparkles, ArrowDown, Zap } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  const countdown = useCountdown(FEST_INFO.startDate);
  const featuredCount = EVENTS.filter((e) => e.featured).length;
  const totalEvents = EVENTS.length;

  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
          alt="Festival night"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 via-transparent to-accent-900/20" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6 animate-fade-in">
          <Sparkles size={14} className="text-gold-400" />
          <span className="text-sm font-semibold text-ink-200">{FEST_INFO.tagline}</span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-4 animate-fade-up tracking-tight">
          TATHVA
          <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-brand-400 via-gold-400 to-accent-400 bg-clip-text text-transparent mt-2">
            {new Date(FEST_INFO.startDate).getFullYear()}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-ink-300 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          Your complete guide to 3 days of technology, gaming, dance, food, and unforgettable nights at NIT Calicut.
        </p>

        {/* Countdown */}
        {countdown.isLive ? (
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-brand-500/20 border border-brand-500/40 mb-8 animate-fade-up">
            <Zap size={24} className="text-brand-300 animate-pulse" />
            <span className="font-display font-bold text-2xl text-brand-300">TATHVA IS LIVE NOW!</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {timeUnits.map((unit) => (
              <div key={unit.label} className="glass rounded-2xl p-3 sm:p-5">
                <div className="font-display font-extrabold text-3xl sm:text-5xl text-white tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-ink-400 font-semibold uppercase tracking-wider mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="flex items-center gap-2 text-ink-300">
            <Calendar size={18} className="text-brand-400" />
            <span className="font-semibold">{totalEvents}+ Events</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <Sparkles size={18} className="text-gold-400" />
            <span className="font-semibold">{featuredCount} Featured Shows</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <Users size={18} className="text-accent-400" />
            <span className="font-semibold">10,000+ Expected</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <MapPin size={18} className="text-pink-400" />
            <span className="font-semibold">9 Campus Zones</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onExplore}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-display font-bold text-lg shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 transition-all duration-300 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          Explore the Fest
          <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
        </button>

        {/* Dates */}
        <div className="mt-8 text-ink-400 text-sm animate-fade-up" style={{ animationDelay: '0.75s' }}>
          {new Date(FEST_INFO.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {' — '}
          {new Date(FEST_INFO.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </section>
  );
}
