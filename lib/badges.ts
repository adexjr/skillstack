import type { SupabaseClient } from "@supabase/supabase-js";

interface BadgeRow {
  id: string;
  slug: string;
  title: string;
  criteria_type: "lessons_completed" | "streak" | "course_completed";
  criteria_value: number;
}

/**
 * Checks all badge criteria against the user's current stats and awards
 * any newly-earned badges. Returns the titles of badges awarded this call
 * (empty array if none), so the UI can show a "new badge!" moment.
 */
export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
  currentStreak: number
): Promise<string[]> {
  const [{ data: badges }, { data: alreadyEarned }, { count: lessonsCompleted }] =
    await Promise.all([
      supabase.from("badges").select("*"),
      supabase.from("user_badges").select("badge_id").eq("user_id", userId),
      supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true),
    ]);

  const earnedBadgeIds = new Set((alreadyEarned ?? []).map((b) => b.badge_id));
  const typedBadges = (badges ?? []) as BadgeRow[];

  // Check whether every lesson in the current course is now completed.
  const [{ data: courseLessons }, { data: completedInCourse }] = await Promise.all([
    supabase.from("lessons").select("id").eq("course_id", courseId),
    supabase
      .from("user_progress")
      .select("lesson_id, lessons!inner(course_id)")
      .eq("user_id", userId)
      .eq("completed", true)
      .eq("lessons.course_id", courseId),
  ]);

  const courseCompleted =
    (courseLessons?.length ?? 0) > 0 &&
    (completedInCourse?.length ?? 0) >= (courseLessons?.length ?? 0);

  const newlyAwarded: string[] = [];

  for (const badge of typedBadges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    let earned = false;
    if (badge.criteria_type === "lessons_completed") {
      earned = (lessonsCompleted ?? 0) >= badge.criteria_value;
    } else if (badge.criteria_type === "streak") {
      earned = currentStreak >= badge.criteria_value;
    } else if (badge.criteria_type === "course_completed") {
      earned = courseCompleted;
    }

    if (earned) {
      const { error } = await supabase
        .from("user_badges")
        .insert({ user_id: userId, badge_id: badge.id });

      if (!error) {
        newlyAwarded.push(badge.title);
      }
    }
  }

  return newlyAwarded;
}