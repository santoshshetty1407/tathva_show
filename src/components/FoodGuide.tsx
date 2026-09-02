import { useState, useMemo } from 'react';
import { Star, MapPin, Clock, Leaf, Drumstick, IndianRupee, Search } from 'lucide-react';
import { FOOD_STALLS } from '@/data';
import type { FoodStall } from '@/types';

export function FoodGuide() {
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = useMemo(() => {
    return FOOD_STALLS
      .filter((s) => !vegOnly || s.veg)
      .filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.cuisine.toLowerCase().includes(q) || s.specialties.some((sp) => sp.toLowerCase().includes(q));
      });
  }, [search, vegOnly]);

  return (
    <section id="food" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">Food Stalls & Markets</h2>
          <p className="text-ink-400">From Kerala Sadya to shawarma — find every food spot on campus</p>
        </div>

        {/* Search & veg filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, cuisine, or dish..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-light text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
              vegOnly
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'glass-light text-ink-200 hover:bg-white/10'
            }`}
          >
            <Leaf size={18} />
            Veg Only
          </button>
        </div>

        {/* Food stall cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stall) => (
            <FoodCard key={stall.id} stall={stall} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-ink-400 text-lg">No food stalls match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FoodCard({ stall }: { stall: FoodStall }) {
  return (
    <div className="group glass rounded-2xl overflow-hidden card-hover">
      <div className="relative h-40 overflow-hidden">
        <img
          src={stall.image}
          alt={stall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-sm">
          {stall.veg ? (
            <Leaf size={12} className="text-brand-400" />
          ) : (
            <Drumstick size={12} className="text-accent-400" />
          )}
          <span className="text-xs font-bold text-white">{stall.veg ? 'Veg' : 'Non-Veg'}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-sm">
          <Star size={12} className="text-gold-400 fill-gold-400" />
          <span className="text-xs font-bold text-white">{stall.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-white mb-1">{stall.name}</h3>
        <p className="text-sm text-brand-300 font-semibold mb-3">{stall.cuisine}</p>

        <div className="space-y-1.5 text-sm text-ink-300 mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-accent-400 flex-shrink-0" />
            <span className="line-clamp-1">{stall.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gold-400 flex-shrink-0" />
            <span>{stall.openHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee size={14} className="text-teal-400 flex-shrink-0" />
            <span>{stall.priceRange}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
          {stall.specialties.map((sp) => (
            <span key={sp} className="text-xs text-ink-300 bg-white/5 px-2 py-1 rounded-md">
              {sp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
