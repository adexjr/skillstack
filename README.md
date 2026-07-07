# SkillStack 🟢

Bite-sized coding lessons with multiple choice and "predict the code output" questions. Built like Mimo/Duolingo, but for learning to code.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Screenshots

<!-- Replace these with real screenshots once deployed. Drop images into a /screenshots folder and update the paths below. -->

| Landing | Dashboard | Lesson |
|---|---|---|
| ![Landing page](./screenshots/landing.png) | ![Dashboard](./screenshots/dashboard.png) | ![Lesson flow](./screenshots/lesson.png) |

---

## Features

- 🔐 **Auth** — Supabase email/password sign-up and sign-in
- 📚 **Courses & Lessons** — JavaScript, Python, React/Next.js, and SQL basics out of the box
- ❓ **Two question types** — multiple choice and "predict the code output"
- ⚡ **XP & self-healing streaks** — miss a day, the streak resets automatically on next visit
- 🏅 **Badges** — 5 seeded achievements, awarded automatically on lesson completion
- 🏆 **Leaderboard** — global ranking by XP
- 👤 **Profile page** — XP, streak, courses completed, badge collection
- 🎨 **Distinct visual identity per page** — matrix-rain landing page, particle-network login, cursor-spotlight dashboard

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Backend / Auth / DB | [Supabase](https://supabase.com/) (Postgres + Row Level Security) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/adexjr/skillstack.git
cd skillstack
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run these files **in order**:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
   - `supabase/schema-additions.sql`
   - `supabase/seed-additional.sql` *(optional — adds Python/React/SQL courses)*
3. Grab your **Project URL** and **anon/publishable key** from Project Settings → API.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Project Structure

```
app/
  page.tsx                    landing page
  login/page.tsx               sign in / sign up
  dashboard/page.tsx           course list, streak/XP, self-healing streak logic
  lesson/[lessonId]/page.tsx   lesson data fetch → LessonRunner
  leaderboard/page.tsx         global XP ranking
  profile/page.tsx             stats + badge collection
  auth/signout/route.ts        sign-out handler
components/
  LessonRunner.tsx             question flow, scoring, badge checks
  QuestionCard.tsx             multiple-choice / code-output question UI
  CourseCard.tsx, ProgressBar.tsx, StreakBadge.tsx, BadgeCard.tsx
  MatrixBackground.tsx         landing page canvas effect
  NetworkBackground.tsx        login page canvas effect
  DashboardBackground.tsx      dashboard cursor-spotlight effect
lib/
  supabase/client.ts            browser client
  supabase/server.ts             server client (cookies)
  streak.ts                     streak reset logic
  badges.ts                     badge award logic
  types.ts
supabase/
  schema.sql                    core tables + RLS policies
  seed.sql                      JavaScript Basics course
  schema-additions.sql          badges, user_badges, leaderboard read policy
  seed-additional.sql           Python, React/Next.js, SQL courses
middleware.ts                  route protection
```

---

## Roadmap / Known Limitations

- [ ] Password reset / OAuth providers
- [ ] Content admin UI (currently seeded via SQL)
- [ ] Friends-only leaderboard (currently global only)
- [ ] Streak freeze (premium feature idea)
- [ ] Course gating for monetization

---

## License

MIT — free to use, modify, and build on.

---

Built by [Adex](https://github.com/adexjr).