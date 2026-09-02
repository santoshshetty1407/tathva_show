import { useState, useEffect } from 'react';
import { Menu, X, Bell, Calendar, MapPin, UtensilsCrossed, Home, ListChecks, Trophy, Radio } from 'lucide-react';
import { FEST_INFO } from '@/data';

interface NavbarProps {
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'map', label: 'Campus Map', icon: MapPin },
  { id: 'food', label: 'Food & Stalls', icon: UtensilsCrossed },
  { id: 'my-schedule', label: 'My Plan', icon: ListChecks },
  { id: 'gamification', label: 'Quest', icon: Trophy },
  { id: 'updates', label: 'Updates', icon: Radio },
];

export function Navbar({ notificationsEnabled, onToggleNotifications, activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-display font-extrabold text-white text-lg shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
              T
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-white text-lg leading-none">Tathva</span>
              <span className="block text-[10px] text-ink-300 leading-none mt-0.5">NIT Calicut</span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-white bg-white/10'
                      : 'text-ink-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleNotifications}
              className={`relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
                notificationsEnabled
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'bg-white/5 text-ink-300 border border-white/10 hover:text-white'
              }`}
              title={notificationsEnabled ? 'Notifications on' : 'Notifications off'}
            >
              <Bell size={18} className={notificationsEnabled ? 'animate-pulse' : ''} />
              {notificationsEnabled && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-400 rounded-full ring-2 ring-ink-950 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 text-ink-200 border border-white/10"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="glass rounded-2xl p-2 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active ? 'text-white bg-white/10' : 'text-ink-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Fest date strip */}
      <div className="hidden md:block border-t border-white/5 bg-ink-950/50">
        <div className="max-w-7xl mx-auto px-8 py-1.5 text-center text-xs text-ink-400">
          {FEST_INFO.name} {new Date(FEST_INFO.startDate).getFullYear()} · Sept 18-20 · NIT Calicut Campus, Kerala
        </div>
      </div>
    </header>
  );
}
