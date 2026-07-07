import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveStreak } from "@/lib/streak";
import { BadgeCard } from "@/components/BadgeCard";
import type { Badge, Course, Lesson, Profile, UserBadge, UserProgress } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: badges },
    { data: userBadges },
    { data: completedProgress },
    { data: courses },
    { data: lessons },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("badges").select("*"),
    supabase.from("user_badges").select("*").eq("user_id", user.id),
    supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", true),
    supabase.from("courses").select("*"),
    supabase.from("lessons").select("*"),
  ]);

  const typedProfile = profile as Profile | null;
  const typedBadges = (badges ?? []) as Badge[];
  const typedUserBadges = (userBadges ?? []) as UserBadge[];
  const typedProgress = (completedProgress ?? []) as UserProgress[];
  const typedCourses = (courses ?? []) as Course[];
  const typedLessons = (lessons ?? []) as Lesson[];

  const earnedBadgeIds = new Set(typedUserBadges.map((b) => b.badge_id));
  const effectiveStreak = getEffectiveStreak(
    typedProfile?.last_active ?? null,
    typedProfile?.streak ?? 0
  );

  const completedLessonIds = new Set(typedProgress.map((p) => p.lesson_id));
  const coursesCompleted = typedCourses.filter((course) => {
    const courseLessons = typedLessons.filter((l) => l.course_id === course.id);
    return (
      courseLessons.length > 0 &&
      courseLessons.every((l) => completedLessonIds.has(l.id))
    );
  }).length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Your profile</p>
          <h1 className="font-display text-2xl font-semibold text-ink-100">
            {typedProfile?.username ?? "Coder"}
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-ink-500 hover:text-ink-300"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-base-700 bg-base-900 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-mint-400">
            {typedProfile?.xp ?? 0}
          </p>
          <p className="mt-1 text-xs text-ink-500">Total XP</p>
        </div>
        <div className="rounded-xl border border-base-700 bg-base-900 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-amber-400">
            {effectiveStreak}
          </p>
          <p className="mt-1 text-xs text-ink-500">Day streak</p>
        </div>
        <div className="rounded-xl border border-base-700 bg-base-900 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-ink-100">
            {coursesCompleted}
          </p>
          <p className="mt-1 text-xs text-ink-500">Courses done</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-500">
          Badges
        </h2>
        <p className="mt-1 text-xs text-ink-500">
          {earnedBadgeIds.size}/{typedBadges.length} unlocked
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {typedBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              icon={badge.icon}
              title={badge.title}
              description={badge.description}
              earned={earnedBadgeIds.has(badge.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}