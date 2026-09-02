import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HappeningNow } from '@/components/HappeningNow';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { EventSchedule, EventModal } from '@/components/EventSchedule';
import { CampusMap } from '@/components/CampusMap';
import { FoodGuide } from '@/components/FoodGuide';
import { MySchedule } from '@/components/MySchedule';
import { Gamification } from '@/components/Gamification';
import { LiveFeed } from '@/components/LiveFeed';
import { NotificationToast } from '@/components/NotificationToast';
import { NotificationPanel } from '@/components/NotificationPanel';
import { Footer } from '@/components/Footer';
import { useNotifications, useMySchedule, useGamification } from '@/hooks';
import { EVENTS } from '@/data';
import type { FestEvent } from '@/types';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const notifications = useNotifications();
  const mySchedule = useMySchedule();
  const gamification = useGamification();

  useEffect(() => {
    (window as any).__TATHVA_EVENTS__ = EVENTS;
  }, []);

  useEffect(() => {
    const sections = ['home', 'events', 'map', 'food', 'my-schedule', 'gamification', 'updates'];
    const handler = () => {
      const scrollY = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveSection(id);
            return;
          }
        }
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavigate = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleNotifications = () => {
    if (!notifications.enabled) setNotifPanelOpen(true);
    notifications.toggleNotifications();
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar
        notificationsEnabled={notifications.enabled}
        onToggleNotifications={handleToggleNotifications}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main>
        <Hero onExplore={() => handleNavigate('events')} />
        <HappeningNow onSelectEvent={setSelectedEvent} />
        <FeaturedCarousel onSelectEvent={setSelectedEvent} />
        <EventSchedule
          onSelectEvent={setSelectedEvent}
          isSubscribed={notifications.isSubscribed}
          onToggleSubscription={notifications.toggleEventSubscription}
          notificationsEnabled={notifications.enabled}
          isScheduled={mySchedule.isScheduled}
          onToggleSchedule={mySchedule.toggleSchedule}
        />
        <CampusMap />
        <FoodGuide />
        <MySchedule events={mySchedule.scheduledEvents} onRemove={mySchedule.toggleSchedule} />
        <Gamification
          player={{ name: gamification.player.name }}
          checkIns={gamification.checkIns}
          earnedBadges={gamification.earnedBadges}
          leaderboard={gamification.leaderboard}
          loading={gamification.loading}
          error={gamification.error}
          onUpdateName={gamification.updatePlayerName}
          onCheckIn={gamification.checkIn}
          events={EVENTS}
        />
        <LiveFeed />
      </main>

      <Footer />

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isSubscribed={notifications.isSubscribed}
        onToggleSubscription={notifications.toggleEventSubscription}
        notificationsEnabled={notifications.enabled}
        isScheduled={mySchedule.isScheduled}
        onToggleSchedule={mySchedule.toggleSchedule}
      />

      <NotificationPanel
        open={notifPanelOpen}
        enabled={notifications.enabled}
        reminderMinutes={notifications.reminderMinutes}
        subscribedCount={notifications.subscribedEvents.length}
        onToggle={notifications.toggleNotifications}
        onSetMinutes={notifications.setReminderMinutes}
        onClose={() => setNotifPanelOpen(false)}
      />

      <NotificationToast
        event={notifications.activeNotification}
        onDismiss={() => {/* managed by hook timeout */}}
      />
    </div>
  );
}

export default App;
