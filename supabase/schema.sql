create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  icon text not null default '💻',
  sort_order integer not null default 0
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);
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


create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  completed boolean not null default false,
  score integer not null default 0,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);



alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on profiles for insert
  with check (auth.uid() = id);


create policy "Courses are publicly readable"
  on courses for select
  using (true);

create policy "Lessons are publicly readable"
  on lessons for select
  using (true);

create policy "Questions are publicly readable"
  on questions for select
  using (true);


create policy "Progress is viewable by owner"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Progress is insertable by owner"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Progress is updatable by owner"
  on user_progress for update
  using (auth.uid() = user_id);
