import { useState } from 'react';
import { MapPin, X, Navigation, Layers } from 'lucide-react';
import { CAMPUS_PINS, EVENTS, FOOD_STALLS } from '@/data';
import type { CampusPin } from '@/types';

const PIN_STYLES: Record<CampusPin['type'], { color: string; ring: string; label: string }> = {
  event: { color: 'bg-brand-500', ring: 'ring-brand-400/50', label: 'Event Venue' },
  food: { color: 'bg-accent-500', ring: 'ring-accent-400/50', label: 'Food Court' },
  stage: { color: 'bg-purple-500', ring: 'ring-purple-400/50', label: 'Stage / Pro Show' },
  game: { color: 'bg-red-500', ring: 'ring-red-400/50', label: 'Gaming Zone' },
  info: { color: 'bg-cyan-500', ring: 'ring-cyan-400/50', label: 'Info Desk' },
};

export function CampusMap() {
  const [selected, setSelected] = useState<CampusPin | null>(null);
  const [filter, setFilter] = useState<CampusPin['type'] | 'all'>('all');

  const visiblePins = CAMPUS_PINS.filter((p) => filter === 'all' || p.type === filter);

  const getEventsAtPin = (pin: CampusPin) => EVENTS.filter((e) => e.zone === pin.zone);
  const getFoodAtPin = (pin: CampusPin) => FOOD_STALLS.filter((f) => f.zone === pin.zone);

  const filterTypes: { type: CampusPin['type'] | 'all'; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'event', label: 'Events' },
    { type: 'food', label: 'Food' },
    { type: 'stage', label: 'Stages' },
    { type: 'game', label: 'Gaming' },
    { type: 'info', label: 'Info' },
  ];

  return (
    <section id="map" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">Interactive Campus Map</h2>
          <p className="text-ink-400">Find every event, food stall, and zone across the NIT Calicut campus</p>
        </div>

        {/* Filter legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 text-ink-400 text-sm mr-2">
            <Layers size={16} />
            <span className="font-semibold">Filter:</span>
          </div>
          {filterTypes.map((f) => (
            <button
              key={f.type}
              onClick={() => setFilter(f.type)}
              className={`chip border transition-all ${
                filter === f.type
                  ? 'bg-white/15 text-white border-white/30 scale-105'
                  : 'bg-white/5 text-ink-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="relative glass rounded-3xl overflow-hidden">
          {/* Map background - stylized campus */}
          <div className="aspect-[4/3] sm:aspect-[16/10] relative bg-ink-900">
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(75, 100, 144, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(75, 100, 144, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Roads */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 75">
              {/* Main horizontal road */}
              <line x1="0" y1="42" x2="100" y2="42" stroke="#31405d" strokeWidth="3" strokeLinecap="round" />
              {/* Main vertical road */}
              <line x1="48" y1="0" x2="48" y2="75" stroke="#31405d" strokeWidth="3" strokeLinecap="round" />
              {/* Secondary roads */}
              <line x1="0" y1="20" x2="48" y2="20" stroke="#2a354e" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="62" x2="100" y2="62" stroke="#2a354e" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="42" x2="72" y2="75" stroke="#2a354e" strokeWidth="2" strokeLinecap="round" />
              <line x1="25" y1="42" x2="25" y2="75" stroke="#2a354e" strokeWidth="2" strokeLinecap="round" />

              {/* Building blocks */}
              <rect x="5" y="24" width="30" height="12" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="52" y="44" width="16" height="14" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="35" y="58" width="10" height="10" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="50" y="24" width="18" height="12" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="75" y="44" width="18" height="14" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="76" y="62" width="18" height="10" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
              <rect x="18" y="48" width="18" height="12" rx="2" fill="#1a2235" stroke="#31405d" strokeWidth="0.5" opacity="0.8" />
            </svg>

            {/* Zone labels */}
            <div className="absolute top-[12%] left-[10%] text-xs text-ink-500 font-semibold uppercase tracking-wider">Library</div>
            <div className="absolute top-[18%] left-[48%] text-xs text-ink-500 font-semibold uppercase tracking-wider">Main Bldg</div>
            <div className="absolute top-[28%] left-[48%] text-xs text-ink-500 font-semibold uppercase tracking-wider">OAT</div>
            <div className="absolute top-[44%] left-[68%] text-xs text-ink-500 font-semibold uppercase tracking-wider">Ground</div>
            <div className="absolute top-[44%] left-[20%] text-xs text-ink-500 font-semibold uppercase tracking-wider">SAC</div>
            <div className="absolute bottom-[8%] left-[50%] text-xs text-ink-500 font-semibold uppercase tracking-wider">CEDTI</div>
            <div className="absolute bottom-[5%] left-[80%] text-xs text-ink-500 font-semibold uppercase tracking-wider">Parking</div>

            {/* Pins */}
            {visiblePins.map((pin) => {
              const style = PIN_STYLES[pin.type];
              const isSelected = selected?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelected(pin)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  <span className={`absolute inset-0 ${style.color} rounded-full animate-pulse-ring ${style.ring} ring-4`} />
                  <span
                    className={`relative block w-6 h-6 sm:w-8 sm:h-8 ${style.color} rounded-full ring-4 ${style.ring} transition-all duration-200 group-hover:scale-125 ${
                      isSelected ? 'scale-150 ring-8' : ''
                    }`}
                  />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] sm:text-xs text-ink-200 font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {pin.name}
                  </span>
                </button>
              );
            })}

            {/* Compass */}
            <div className="absolute top-4 left-4 glass-light rounded-xl p-2.5 flex flex-col items-center gap-0.5">
              <Navigation size={16} className="text-brand-400" />
              <span className="text-[10px] text-ink-400 font-bold">N</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-6 py-4 border-t border-white/5 bg-ink-950/50">
            {Object.entries(PIN_STYLES).map(([type, style]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-ink-300">
                <span className={`w-3 h-3 rounded-full ${style.color}`} />
                {style.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pin detail popover */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="relative max-w-md w-full glass rounded-3xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-all">
              <X size={18} className="text-ink-300" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-10 h-10 rounded-xl ${PIN_STYLES[selected.type].color} flex items-center justify-center`}>
                <MapPin size={20} className="text-white" />
              </span>
              <div>
                <h3 className="font-display font-bold text-xl text-white">{selected.name}</h3>
                <span className="text-xs text-ink-400">{PIN_STYLES[selected.type].label}</span>
              </div>
            </div>
            <p className="text-ink-300 text-sm mb-4">{selected.description}</p>

            {getEventsAtPin(selected).length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Events Here</h4>
                <div className="space-y-1.5">
                  {getEventsAtPin(selected).map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between text-sm glass-light rounded-lg px-3 py-2">
                      <span className="text-white font-semibold line-clamp-1">{ev.title}</span>
                      <span className="text-xs text-ink-400 ml-2 whitespace-nowrap">Day {ev.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getFoodAtPin(selected).length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Food Stalls Here</h4>
                <div className="space-y-1.5">
                  {getFoodAtPin(selected).map((stall) => (
                    <div key={stall.id} className="flex items-center justify-between text-sm glass-light rounded-lg px-3 py-2">
                      <span className="text-white font-semibold">{stall.name}</span>
                      <span className="text-xs text-accent-400">{stall.priceRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
