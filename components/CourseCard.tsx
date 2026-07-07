import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import type { Lesson } from "@/lib/types";

interface CourseCardProps {
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  completedLessonIds: Set<string>;
}

export function CourseCard({
  title,
  description,
  icon,
  lessons,
  completedLessonIds,
}: CourseCardProps) {
  const completedCount = lessons.filter((l) =>
    completedLessonIds.has(l.id)
  ).length;
  const progress = lessons.length
    ? (completedCount / lessons.length) * 100
    : 0;
  const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id));

  return (
    <div className="rounded-xl border border-base-700 bg-base-900 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-base-800 text-lg">
            {icon}
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-ink-100">
              {title}
            </h3>
            <p className="text-xs text-ink-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-ink-500">
          <span>
            {completedCount}/{lessons.length} lessons
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {lessons.length === 0 ? (
        <p className="mt-4 text-xs text-ink-500">Lessons coming soon.</p>
      ) : nextLesson ? (
        <Link
          href={`/lesson/${nextLesson.id}`}
          className="mt-4 block w-full rounded-lg bg-mint-400 py-2 text-center font-display text-sm font-semibold text-base-950 transition hover:bg-mint-500"
        >
          {completedCount === 0 ? "Start course" : "Continue"}
        </Link>
      ) : (
        <div className="mt-4 rounded-lg border border-mint-400/30 bg-mint-400/10 py-2 text-center font-display text-sm font-semibold text-mint-400">
          Course complete ✓
        </div>
      )}
    </div>
  );
}
