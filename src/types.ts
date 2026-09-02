export type EventCategory =
  | 'Technical'
  | 'Gaming'
  | 'Informal'
  | 'Dance'
  | 'Pro Show'
  | 'Workshop'
  | 'Expo'
  | 'Sports';

export type CampusZone =
  | 'Main Building'
  | 'Bhavan A'
  | 'Bhavan B'
  | 'SAC'
  | 'Open Air Theatre'
  | 'NITC Ground'
  | 'CEDTI'
  | 'Library Lawn'
  | 'Parking Lot';

export interface FestEvent {
  id: string;
  title: string;
  category: EventCategory;
  day: 1 | 2 | 3;
  date: string; // ISO date
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  venue: string;
  zone: CampusZone;
  description: string;
  image: string;
  featured?: boolean;
  prize?: string;
  teamSize?: string;
  registrationFee?: string;
  tags: string[];
}

export interface FoodStall {
  id: string;
  name: string;
  cuisine: string;
  zone: CampusZone;
  location: string;
  rating: number;
  priceRange: string;
  specialties: string[];
  openHours: string;
  image: string;
  veg: boolean;
}

export interface CampusPin {
  id: string;
  name: string;
  type: 'event' | 'food' | 'info' | 'game' | 'stage';
  zone: CampusZone;
  x: number; // percentage on map 0-100
  y: number; // percentage on map 0-100
  description: string;
}

export interface FestInfo {
  name: string;
  tagline: string;
  startDate: string;
  endDate: string;
  days: { day: 1 | 2 | 3; label: string; date: string }[];
}

export interface CheckIn {
  id: string;
  playerId: string;
  playerName: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  points: number;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  requirement: (checkIns: CheckIn[]) => boolean;
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'update' | 'alert' | 'event';
  createdAt: string;
}
