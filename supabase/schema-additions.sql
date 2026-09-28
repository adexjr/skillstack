create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  icon text not null default '🏅',
  criteria_type text not null check (criteria_type in ('lessons_completed', 'streak', 'course_completed')),
  criteria_value integer not null default 1
);

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id uuid not null references badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);
alter table badges enable row level security;
alter table user_badges enable row level security;

create policy "Badges are publicly readable"
  on badges for select
  using (true);

create policy "User badges are viewable by owner"
  on user_badges for select
  using (auth.uid() = user_id);

create policy "User badges are insertable by owner"
  on user_badges for insert
  with check (auth.uid() = user_id);

create policy "Profiles are publicly readable for leaderboard"
  on profiles for select
  using (true);

insert into badges (slug, title, description, icon, criteria_type, criteria_value)
values
  ('first-lesson', 'First steps', 'Complete your first lesson', '🌱', 'lessons_completed', 1),
  ('five-lessons', 'Getting the hang of it', 'Complete 5 lessons', '📚', 'lessons_completed', 5),
  ('streak-3', 'On a roll', 'Reach a 3-day streak', '🔥', 'streak', 3),
  ('streak-7', 'Week warrior', 'Reach a 7-day streak', '⚡', 'streak', 7),
  ('course-complete', 'Course crusher', 'Finish every lesson in a course', '🏆', 'course_completed', 1)
on conflict (slug) do nothing;