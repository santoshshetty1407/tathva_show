import { Calendar, MapPin, Heart, Github, Instagram, Twitter } from 'lucide-react';
import { FEST_INFO } from '@/data';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-display font-extrabold text-white text-xl shadow-lg shadow-brand-500/30">
                T
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl block leading-none">Tathva</span>
                <span className="text-xs text-ink-400">NIT Calicut</span>
              </div>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed">
              {FEST_INFO.tagline}. Three days of technology, culture, and celebration at the National Institute of Technology, Calicut, Kerala.
            </p>
          </div>

          {/* Quick info */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Fest Details</h4>
            <div className="space-y-2 text-sm text-ink-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-400" />
                September 18-20, {new Date(FEST_INFO.startDate).getFullYear()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent-400" />
                NIT Calicut Campus, Kattangal, Kerala 673601
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all hover:scale-105" aria-label="Instagram">
                <Instagram size={20} className="text-ink-300" />
              </a>
              <a href="#" className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all hover:scale-105" aria-label="Twitter">
                <Twitter size={20} className="text-ink-300" />
              </a>
              <a href="#" className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all hover:scale-105" aria-label="GitHub">
                <Github size={20} className="text-ink-300" />
              </a>
            </div>
            <p className="text-xs text-ink-500 mt-4">
              Follow for live updates, photos, and announcements throughout the fest.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Tathva, NIT Calicut. Made with passion for the campus community.
          </p>
          <p className="text-xs text-ink-500 flex items-center gap-1.5">
            Built with <Heart size={12} className="text-red-400 fill-red-400" /> by a student, for students
          </p>
        </div>
      </div>
    </footer>
  );
}
