import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveStreak } from "@/lib/streak";
import { StreakBadge } from "@/components/StreakBadge";
import { CourseCard } from "@/components/CourseCard";
import { DashboardBackground } from "@/components/DashboardBackground";
import type { Course, Lesson, Profile, UserProgress } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: courses }, { data: lessons }, { data: progress }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("lessons").select("*").order("sort_order"),
      supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true),
    ]);

  const typedProfile = profile as Profile | null;
  const typedCourses = (courses ?? []) as Course[];
  const typedLessons = (lessons ?? []) as Lesson[];
  const typedProgress = (progress ?? []) as UserProgress[];

  // Self-healing streak: if a day was missed since last_active, the streak
  // is broken. We compute the true value here and persist it so it doesn't
  // keep showing a stale number on every future visit.
  const effectiveStreak = getEffectiveStreak(
    typedProfile?.last_active ?? null,
    typedProfile?.streak ?? 0
  );
  if (typedProfile && effectiveStreak !== typedProfile.streak) {
    await supabase
      .from("profiles")
      .update({ streak: effectiveStreak })
      .eq("id", user.id);
  }

  const completedLessonIds = new Set(typedProgress.map((p) => p.lesson_id));

  return (
    <main className="relative mx-auto min-h-screen max-w-4xl overflow-hidden px-6 py-10">
      <DashboardBackground />
      <div className="relative z-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Welcome back</p>
          <h1 className="font-display text-2xl font-semibold text-ink-100">
            {typedProfile?.username ?? "Coder"}
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/leaderboard"
            className="text-xs text-ink-500 hover:text-ink-300"
          >
            Leaderboard
          </Link>
          <Link
            href="/profile"
            className="text-xs text-ink-500 hover:text-ink-300"
          >
            Profile
          </Link>
          <StreakBadge
            streak={effectiveStreak}
            xp={typedProfile?.xp ?? 0}
          />
        </div>
      </header>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-500">
          Your courses
        </h2>

        {typedCourses.length === 0 ? (
          <p className="text-sm text-ink-500">
            No courses yet — run the seed script in supabase/seed.sql.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {typedCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                icon={course.icon}
                lessons={typedLessons.filter(
                  (l) => l.course_id === course.id
                )}
                completedLessonIds={completedLessonIds}
              />
            ))}
          </div>
        )}
      </section>

      <form action="/auth/signout" method="post" className="mt-10">
        <button
          type="submit"
          className="text-xs text-ink-500 hover:text-ink-300"
        >
          Sign out
        </button>
      </form>
      </div>
    </main>
  );
}