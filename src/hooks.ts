import { useEffect, useState, useCallback } from 'react';
import type { Announcement, CheckIn, FestEvent } from './types';
import { supabase } from '@/lib/supabase';
import { getEarnedBadges } from '@/badges';
import { EVENTS } from '@/data';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

function calc(target: string): Countdown {
  const now = Date.now();
  const targetTime = new Date(target).getTime();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isLive: false,
  };
}

export function useCountdown(targetDate: string): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => calc(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calc(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

export interface NotificationState {
  enabled: boolean;
  reminderMinutes: number;
  subscribedEvents: string[];
}

const STORAGE_KEY = 'tathva-notifications';

function loadState(): NotificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { enabled: false, reminderMinutes: 15, subscribedEvents: [] };
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>(loadState);
  const [activeNotification, setActiveNotification] = useState<FestEvent | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleNotifications = useCallback(() => {
    setState((s) => ({ ...s, enabled: !s.enabled }));
  }, []);

  const setReminderMinutes = useCallback((minutes: number) => {
    setState((s) => ({ ...s, reminderMinutes: minutes }));
  }, []);

  const toggleEventSubscription = useCallback((eventId: string) => {
    setState((s) => {
      const subscribed = s.subscribedEvents.includes(eventId);
      return {
        ...s,
        subscribedEvents: subscribed
          ? s.subscribedEvents.filter((id) => id !== eventId)
          : [...s.subscribedEvents, eventId],
      };
    });
  }, []);

  // Check for events starting soon
  useEffect(() => {
    if (!state.enabled) return;

    const check = () => {
      const now = new Date();
      const events = (typeof window !== 'undefined' && (window as any).__TATHVA_EVENTS__) || [];
      for (const ev of events) {
        if (!state.subscribedEvents.includes(ev.id)) continue;
        const start = new Date(`${ev.date}T${ev.startTime}:00`);
        const reminderTime = new Date(start.getTime() - state.reminderMinutes * 60000);
        const diff = now.getTime() - reminderTime.getTime();
        // Trigger if within 30 seconds of the reminder time and not already shown
        if (diff >= 0 && diff < 30000) {
          setActiveNotification(ev);
          setTimeout(() => setActiveNotification(null), 8000);
        }
      }
    };

    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [state.enabled, state.subscribedEvents, state.reminderMinutes]);

  return {
    ...state,
    activeNotification,
    toggleNotifications,
    setReminderMinutes,
    toggleEventSubscription,
    isSubscribed: (eventId: string) => state.subscribedEvents.includes(eventId),
  };
}

const SCHEDULE_KEY = 'tathva-my-schedule';

export function useMySchedule() {
  const [scheduledIds, setScheduledIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SCHEDULE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(scheduledIds));
  }, [scheduledIds]);

  const toggleSchedule = useCallback((eventId: string) => {
    setScheduledIds((ids) => ids.includes(eventId) ? ids.filter((id) => id !== eventId) : [...ids, eventId]);
  }, []);

  return {
    scheduledIds,
    scheduledEvents: EVENTS.filter((event) => scheduledIds.includes(event.id)),
    isScheduled: (eventId: string) => scheduledIds.includes(eventId),
    toggleSchedule,
  };
}

export function useLiveEvents(events: FestEvent[]) {
  const [, refresh] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => refresh((value) => value + 1), 30000);
    return () => clearInterval(interval);
  }, []);
  return events.filter((event) => getEventStatus(event) === 'live');
}

const PLAYER_KEY = 'tathva-player';

interface PlayerProfile {
  id: string;
  name: string;
}

function getPlayer(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PLAYER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Use a new profile when local storage is unavailable or malformed.
  }
  const player = { id: crypto.randomUUID(), name: 'Guest Explorer' };
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  return player;
}

function mapCheckIn(row: Record<string, unknown>): CheckIn {
  return {
    id: String(row.id),
    playerId: String(row.player_id),
    playerName: String(row.player_name),
    eventId: String(row.event_id),
    eventTitle: String(row.event_title),
    eventCategory: row.event_category as CheckIn['eventCategory'],
    points: Number(row.points),
    createdAt: String(row.created_at),
  };
}

export function useGamification() {
  const [player, setPlayer] = useState<PlayerProfile>(() => getPlayer());
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ name: string; points: number; visits: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const [{ data: ownRows, error: ownError }, { data: leaderboardRows, error: leaderboardError }] = await Promise.all([
      supabase.from('check_ins').select('*').eq('player_id', player.id).order('created_at', { ascending: false }),
      supabase.from('check_ins').select('player_name, points'),
    ]);
    if (ownError || leaderboardError) {
      setError('The leaderboard is temporarily unavailable. Your local schedule still works.');
      setLoading(false);
      return;
    }
    setCheckIns((ownRows ?? []).map((row) => mapCheckIn(row as Record<string, unknown>)));
    const totals = new Map<string, { points: number; visits: number }>();
    (leaderboardRows ?? []).forEach((row) => {
      const name = String((row as Record<string, unknown>).player_name);
      const current = totals.get(name) ?? { points: 0, visits: 0 };
      current.points += Number((row as Record<string, unknown>).points);
      current.visits += 1;
      totals.set(name, current);
    });
    setLeaderboard(Array.from(totals.entries()).map(([name, value]) => ({ name, ...value })).sort((a, b) => b.points - a.points).slice(0, 10));
    setLoading(false);
  }, [player.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const updatePlayerName = useCallback((name: string) => {
    const next = { ...player, name: name.trim() || 'Guest Explorer' };
    setPlayer(next);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(next));
  }, [player]);

  const checkIn = useCallback(async (event: FestEvent) => {
    if (checkIns.some((item) => item.eventId === event.id)) return { ok: false, message: 'You already checked in to this event.' };
    const { error: insertError } = await supabase.from('check_ins').insert({
      player_id: player.id,
      player_name: player.name,
      event_id: event.id,
      event_title: event.title,
      event_category: event.category,
      points: 10,
    });
    if (insertError) return { ok: false, message: 'Check-in could not be saved. Please try again.' };
    await refresh();
    return { ok: true, message: 'Check-in recorded. You earned 10 points!' };
  }, [checkIns, player, refresh]);

  return { player, checkIns, leaderboard, loading, error, updatePlayerName, checkIn, earnedBadges: getEarnedBadges(checkIns), refresh };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error: queryError } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(20);
    if (queryError) {
      setError('Live updates are temporarily unavailable.');
    } else {
      setAnnouncements((data ?? []).map((row) => ({
        id: String(row.id),
        message: String(row.message),
        type: row.type as Announcement['type'],
        createdAt: String(row.created_at),
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const channel = supabase.channel('tathva-announcements').on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => { void load(); }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [load]);

  return { announcements, loading, error };
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getEventStatus(ev: FestEvent): 'upcoming' | 'live' | 'past' {
  const now = new Date();
  const start = new Date(`${ev.date}T${ev.startTime}:00`);
  const end = new Date(`${ev.date}T${ev.endTime}:00`);
  // Handle overnight events (end time <= start time means next day)
  const actualEnd = end <= start ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : end;
  if (now < start) return 'upcoming';
  if (now >= start && now <= actualEnd) return 'live';
  return 'past';
}
