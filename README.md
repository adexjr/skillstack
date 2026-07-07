# Mimo MVP

A bite-sized coding lessons app — multiple choice + "predict the code output" questions, XP, and daily streaks. Built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Grab your Project URL and anon public key from Project Settings → API.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## How it works

- **Auth**: Supabase email/password. On sign-up, a `profiles` row is created (username, xp, streak).
- **Dashboard** (`/dashboard`): lists courses with per-course progress bars, pulled from `user_progress`.
- **Lesson flow** (`/lesson/[lessonId]`): client-side question runner (`LessonRunner.tsx`) walks through each question, tracks score locally, then on completion writes to `user_progress` and bumps `xp`/`streak` on the profile.
- **Streak logic**: increments once per calendar day the user completes a lesson (`last_active` compared to today). This is intentionally simple for the MVP — it does not yet reset the streak if a day is skipped. A cron/edge function checking `last_active` daily would be the next step.

## What's deliberately out of scope for the MVP

- Streak reset on missed days (needs a scheduled job)
- Course/lesson admin UI (content is seeded via SQL)
- Password reset / OAuth providers
- Leaderboards, hearts/lives system, badges

## File structure

```
app/
  page.tsx                 landing page
  login/page.tsx           sign in / sign up
  dashboard/page.tsx        course list + streak/XP
  lesson/[lessonId]/page.tsx  lesson data fetch → LessonRunner
  auth/signout/route.ts     sign-out handler
components/
  CourseCard.tsx
  QuestionCard.tsx
  LessonRunner.tsx
  ProgressBar.tsx
  StreakBadge.tsx
lib/
  supabase/client.ts        browser client
  supabase/server.ts        server client (cookies)
  types.ts
supabase/
  schema.sql                tables + RLS policies
  seed.sql                  1 course, 3 lessons, 10 questions
middleware.ts               protects /dashboard and /lesson routes
```
