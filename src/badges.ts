import type { Badge, CheckIn } from './types';

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Check in to your first event', icon: 'Flag', color: 'text-brand-300', bg: 'bg-brand-500/15', border: 'border-brand-500/30', requirement: (c) => c.length >= 1 },
  { id: 'tech-junkie', name: 'Tech Junkie', description: 'Attend 3 technical events', icon: 'Cpu', color: 'text-cyan-300', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', requirement: (c) => c.filter((x) => x.eventCategory === 'Technical' || x.eventCategory === 'Workshop').length >= 3 },
  { id: 'night-owl', name: 'Night Owl', description: 'Check in to a pro show', icon: 'Moon', color: 'text-accent-300', bg: 'bg-accent-500/15', border: 'border-accent-500/30', requirement: (c) => c.some((x) => x.eventCategory === 'Pro Show') },
  { id: 'game-on', name: 'Game On', description: 'Attend 2 gaming events', icon: 'Gamepad2', color: 'text-red-300', bg: 'bg-red-500/15', border: 'border-red-500/30', requirement: (c) => c.filter((x) => x.eventCategory === 'Gaming').length >= 2 },
  { id: 'foodie', name: 'Foodie', description: 'Explore 5 campus events', icon: 'Utensils', color: 'text-gold-400', bg: 'bg-gold-500/15', border: 'border-gold-500/30', requirement: (c) => c.length >= 5 },
  { id: 'fest-legend', name: 'Fest Legend', description: 'Check in to 10 events', icon: 'Crown', color: 'text-pink-300', bg: 'bg-pink-500/15', border: 'border-pink-500/30', requirement: (c) => c.length >= 10 },
];

export function getEarnedBadges(checkIns: CheckIn[]): Badge[] {
  return BADGES.filter((badge) => badge.requirement(checkIns));
}
