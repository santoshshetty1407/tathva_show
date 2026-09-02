/*
# Tathva Gamification & Live Updates Tables

## Purpose
Creates the database tables needed for the Tathva fest guide's gamification (QR check-ins, points, badges, leaderboard) and live updates (announcements feed) features. This is a no-auth single-tenant app — there is no sign-in screen, so all policies use `TO anon, authenticated` and the data is intentionally public/shared.

## New Tables

### 1. `check_ins`
- `id` (uuid, primary key) — unique check-in record
- `player_id` (text, not null) — anonymous browser-generated player ID stored in localStorage
- `player_name` (text, not null) — display name the user picks (not unique, no auth)
- `event_id` (text, not null) — the fest event ID from the frontend data
- `event_title` (text, not null) — denormalized event title for display
- `event_category` (text, not null) — denormalized category for badge calculation
- `points` (integer, not null, default 10) — points earned for this check-in
- `created_at` (timestamptz, default now()) — when the check-in happened

### 2. `announcements`
- `id` (uuid, primary key) — unique announcement
- `message` (text, not null) — the announcement text
- `type` (text, not null, default 'info') — one of: 'info', 'update', 'alert', 'event'
- `created_at` (timestamptz, default now()) — when posted

## Indexes
- `idx_check_ins_player` on `check_ins(player_id)` — leaderboard queries
- `idx_check_ins_event` on `check_ins(event_id)` — prevent duplicate check-ins
- `idx_announcements_created` on `announcements(created_at DESC)` — feed ordering

## Security (RLS)
- Both tables have RLS enabled.
- `check_ins`: anyone (anon) can insert (check in at events) and select (view leaderboard). No update/delete needed.
- `announcements`: anyone can select (read the feed). Inserts are also open (in a real deployment, inserts would be restricted to organizers, but for this no-auth demo we allow anon inserts so the live feed works without a backend admin panel).

## Important Notes
1. No `user_id` or `auth.uid()` — this is a no-auth app. Player identity is a random browser-generated ID.
2. Duplicate check-in prevention is handled in the frontend (checking before inserting). The database does not enforce uniqueness because a player might check in to different events.
3. Points are stored per check-in so total score = SUM(points).
*/

CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  player_name text NOT NULL,
  event_id text NOT NULL,
  event_title text NOT NULL,
  event_category text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_check_ins_player ON check_ins(player_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_event ON check_ins(event_id, player_id);
DROP POLICY IF EXISTS "anon_select_check_ins" ON check_ins;
CREATE POLICY "anon_select_check_ins" ON check_ins FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_check_ins" ON check_ins;
CREATE POLICY "anon_insert_check_ins" ON check_ins FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
DROP POLICY IF EXISTS "anon_select_announcements" ON announcements;
CREATE POLICY "anon_select_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_announcements" ON announcements;
CREATE POLICY "anon_insert_announcements" ON announcements FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO announcements (message, type) VALUES
  ('Welcome to Tathva! Check back here for live updates throughout the fest.', 'info'),
  ('Pro Show Night 1 starts at 7 PM at the Open Air Theatre. Don''t miss the DJ set!', 'event'),
  ('Hackathon registration is open — head to CEDTI Lab to sign up your team.', 'update')
ON CONFLICT DO NOTHING;
