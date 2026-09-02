import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Trophy } from 'lucide-react';
import { EVENTS, CATEGORY_META } from '@/data';
import type { FestEvent } from '@/types';
import { formatTime, formatDate } from '@/hooks';

interface FeaturedCarouselProps {
  onSelectEvent: (ev: FestEvent) => void;
}

export function FeaturedCarousel({ onSelectEvent }: FeaturedCarouselProps) {
  const featured = EVENTS.filter((e) => e.featured);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % featured.length), [featured.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + featured.length) % featured.length), [featured.length]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const current = featured[index];
  if (!current) return null;
  const meta = CATEGORY_META[current.category];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-1">Featured Events</h2>
            <p className="text-ink-400">The headline acts you don't want to miss</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={prev}
              className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all hover:scale-105"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all hover:scale-105"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden group cursor-pointer"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={() => onSelectEvent(current)}
        >
          <div className="aspect-[16/10] sm:aspect-[21/9] relative">
            {featured.map((ev, i) => (
              <div
                key={ev.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />
              </div>
            ))}

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-3">
                <span className={`chip ${meta.bg} ${meta.color} border ${meta.border}`}>
                  {meta.label}
                </span>
                <span className="chip bg-white/10 text-ink-200 border border-white/15">
                  Day {current.day}
                </span>
                {current.prize && (
                  <span className="chip bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center gap-1">
                    <Trophy size={12} />
                    {current.prize}
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-white mb-3 max-w-2xl">
                {current.title}
              </h3>
              <p className="text-ink-200 text-sm sm:text-base max-w-xl mb-4 line-clamp-2">
                {current.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-brand-400" />
                  {formatTime(current.startTime)} — {formatTime(current.endTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-accent-400" />
                  {current.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="text-gold-400" />
                  {formatDate(current.date)}
                </span>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute top-4 right-4 flex gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
