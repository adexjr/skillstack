-- =========================================
-- skill stack — Supabase schema
-- Run this in the Supabase SQL editor
-- =========================================

-- Profiles: one row per auth user
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);

-- Courses: top-level subjects (e.g. "JavaScript Basics")
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  icon text not null default '💻',
  sort_order integer not null default 0
);

-- Lessons: belong to a course
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

-- Questions: belong to a lesson. type is 'multiple_choice' or 'code_output'
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  type text not null check (type in ('multiple_choice', 'code_output')),
  prompt text not null,
  code_snippet text,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  sort_order integer not null default 0
);

-- User progress: one row per (user, lesson)
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  completed boolean not null default false,
  score integer not null default 0,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- =========================================
-- Row Level Security
-- =========================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;

-- Profiles: users can read/update only their own row
create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on profiles for insert
  with check (auth.uid() = id);

-- Courses, lessons, questions: publicly readable (content, not user data)
create policy "Courses are publicly readable"
  on courses for select
  using (true);

create policy "Lessons are publicly readable"
  on lessons for select
  using (true);

create policy "Questions are publicly readable"
  on questions for select
  using (true);

-- User progress: users can read/write only their own rows
create policy "Progress is viewable by owner"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Progress is insertable by owner"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Progress is updatable by owner"
  on user_progress for update
  using (auth.uid() = user_id);
