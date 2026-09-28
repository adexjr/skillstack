import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveStreak } from "@/lib/streak";
import { BottomNav } from "@/components/BottomNav";
import { LearningPath } from "@/components/LearningPath";
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
  const totalLessons = typedLessons.length;
  const completionPercent = totalLessons
    ? Math.min(100, Math.round((completedLessonIds.size / totalLessons) * 100))
    : 0;
  const nextLesson = typedLessons.find(
    (lesson) => !completedLessonIds.has(lesson.id)
  );
  const nextCourse = nextLesson
    ? typedCourses.find((course) => course.id === nextLesson.course_id)
    : null;

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl bg-base-950 pb-28 pt-6 text-ink-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-base-700/80 pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mint-400">
              Your learning space
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
              Keep going, {typedProfile?.username ?? "Coder"}
            </h1>
          </div>
          <div className="shrink-0 border border-amber-400/30 bg-amber-400/[0.06] px-3 py-2 text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-500">
              Current streak
            </p>
            <p className="mt-0.5 font-display text-sm font-semibold text-amber-400">
              {effectiveStreak} {effectiveStreak === 1 ? "day" : "days"}
            </p>
          </div>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-9">
          <LearningPath
            courses={typedCourses}
            lessons={typedLessons}
            completedLessonIds={Array.from(completedLessonIds)}
          />

          <aside className="space-y-4 lg:sticky lg:top-24 lg:mt-8">
            <section className="border border-base-700 bg-base-900 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Daily practice
              </p>
              <h2 className="mt-2 font-display text-lg font-semibold text-ink-100">
                Arrays & map
              </h2>
              <p className="mt-1 text-xs leading-5 text-ink-500">
                A quick JavaScript challenge to keep your skills warm.
              </p>
              <Link
                href="/practice"
                className="mt-4 flex min-h-10 items-center justify-center bg-mint-400 px-4 text-sm font-semibold text-base-950 transition hover:bg-mint-500"
              >
                Open practice <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </section>

            <section className="border border-base-700 bg-base-900 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Your progress
              </p>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-display text-3xl font-semibold text-ink-100">
                  {completionPercent}%
                </span>
                <span className="pb-1 text-xs text-ink-500">all tracks</span>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden bg-base-800"
                role="progressbar"
                aria-label="Overall course progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercent}
              >
                <div
                  className="h-full bg-mint-400 transition-[width] duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="mt-4 flex justify-between border-t border-base-700 pt-3 text-xs">
                <span className="text-ink-500">Lessons complete</span>
                <span className="font-medium text-ink-100">
                  {completedLessonIds.size} / {totalLessons}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-ink-500">Total XP</span>
                <span className="font-medium text-amber-400">
                  {typedProfile?.xp ?? 0} XP
                </span>
              </div>
            </section>

            {nextLesson && (
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="group block border-l-2 border-mint-400 bg-base-900/70 px-4 py-3 transition hover:bg-base-900"
              >
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-mint-400">
                  Pick up your path
                </span>
                <span className="mt-1 block font-display text-sm font-semibold text-ink-100 group-hover:text-mint-400">
                  {nextLesson.title}
                </span>
                <span className="mt-0.5 block text-[10px] text-ink-500">
                  {nextCourse?.title ?? "Next lesson"}
                </span>
              </Link>
            )}
          </aside>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}