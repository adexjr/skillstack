import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonRunner } from "@/components/LessonRunner";
import type { Course, Lesson, Profile, Question } from "@/lib/types";

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: lesson }, { data: questions }, { data: profile }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("*, courses(title)")
        .eq("id", params.lessonId)
        .single(),
      supabase
        .from("questions")
        .select("*")
        .eq("lesson_id", params.lessonId)
        .order("sort_order"),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);

  if (!lesson) {
    notFound();
  }

  const typedLesson = lesson as Lesson & { courses: { title: string } | null };
  const typedQuestions = (questions ?? []) as Question[];
  const typedProfile = profile as Profile | null;

  if (typedQuestions.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-ink-500">This lesson has no questions yet.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <LessonRunner
        lessonId={typedLesson.id}
        courseId={typedLesson.course_id}
        lessonTitle={typedLesson.title}
        courseTitle={typedLesson.courses?.title ?? "Course"}
        questions={typedQuestions}
        userId={user.id}
        currentXp={typedProfile?.xp ?? 0}
        currentStreak={typedProfile?.streak ?? 0}
        lastActive={typedProfile?.last_active ?? null}
      />
    </main>
  );
}