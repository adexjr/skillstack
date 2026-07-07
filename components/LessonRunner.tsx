"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getEffectiveStreak } from "@/lib/streak";
import { checkAndAwardBadges } from "@/lib/badges";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import type { Question } from "@/lib/types";

const XP_PER_CORRECT = 10;

interface LessonRunnerProps {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  courseTitle: string;
  questions: Question[];
  userId: string;
  currentXp: number;
  currentStreak: number;
  lastActive: string | null;
}

export function LessonRunner({
  lessonId,
  courseId,
  lessonTitle,
  courseTitle,
  questions,
  userId,
  currentXp,
  currentStreak,
  lastActive,
}: LessonRunnerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const currentQuestion = questions[index];
  const progressPct = (index / questions.length) * 100;

  async function handleAnswered(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    setAnswered(true);
  }

  async function handleNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setAnswered(false);
      return;
    }
    await finishLesson();
  }

  async function finishLesson() {
    setSaving(true);

    const earnedXp = correctCount * XP_PER_CORRECT;
    const today = new Date().toISOString().slice(0, 10);
    const alreadyActiveToday = lastActive === today;
    const effectiveStreak = getEffectiveStreak(lastActive, currentStreak);
    const newStreak = alreadyActiveToday ? effectiveStreak : effectiveStreak + 1;

    await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        score: correctCount,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    await supabase
      .from("profiles")
      .update({
        xp: currentXp + earnedXp,
        streak: newStreak,
        last_active: today,
      })
      .eq("id", userId);

    const awarded = await checkAndAwardBadges(supabase, userId, courseId, newStreak);
    setNewBadges(awarded);

    setSaving(false);
    setFinished(true);
  }

  if (finished) {
    const earnedXp = correctCount * XP_PER_CORRECT;
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-base-700 bg-base-900 p-8 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-3 font-display text-xl font-semibold text-ink-100">
          Lesson complete
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {correctCount}/{questions.length} correct · +{earnedXp} XP
        </p>

        {newBadges.length > 0 && (
          <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
              New badge{newBadges.length > 1 ? "s" : ""} unlocked
            </p>
            <p className="mt-1 text-sm text-ink-100">{newBadges.join(", ")}</p>
          </div>
        )}

        <button
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="mt-6 w-full rounded-lg bg-mint-400 py-2.5 font-display text-sm font-semibold text-base-950 transition hover:bg-mint-500"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-2 flex items-center justify-between text-xs text-ink-500">
        <span>
          {courseTitle} · {lessonTitle}
        </span>
        <span>
          {index + 1}/{questions.length}
        </span>
      </div>
      <ProgressBar value={progressPct} />

      <div className="mt-6">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswered={handleAnswered}
        />
      </div>

      <button
        onClick={handleNext}
        disabled={saving || !answered}
        className="mt-4 w-full rounded-lg border border-base-700 py-2.5 font-display text-sm font-semibold text-ink-300 transition hover:border-base-600 disabled:opacity-50"
      >
        {saving
          ? "Saving…"
          : index < questions.length - 1
          ? "Next question"
          : "Finish lesson"}
      </button>
    </div>
  );
}