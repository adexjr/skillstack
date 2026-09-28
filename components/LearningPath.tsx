"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course, Lesson } from "@/lib/types";

interface LearningPathProps {
  courses: Course[];
  lessons: Lesson[];
  completedLessonIds: string[];
}

export function LearningPath({
  courses,
  lessons,
  completedLessonIds,
}: LearningPathProps) {
  const completed = new Set(completedLessonIds);
  const initialCourse =
    courses.find((course) =>
      lessons.some(
        (lesson) =>
          lesson.course_id === course.id && !completed.has(lesson.id)
      )
    ) ?? courses[0];
  const [activeCourseId, setActiveCourseId] = useState(initialCourse?.id ?? "");

  if (courses.length === 0) {
    return (
      <section className="mt-8 border border-base-700 bg-base-900 p-5">
        <p className="text-sm text-ink-500">
          No learning tracks are available yet. Add a course to start your path.
        </p>
      </section>
    );
  }

  const activeCourse =
    courses.find((course) => course.id === activeCourseId) ?? courses[0];
  const courseLessons = lessons
    .filter((lesson) => lesson.course_id === activeCourse.id)
    .sort((first, second) => first.sort_order - second.sort_order);
  const completedCount = courseLessons.filter((lesson) =>
    completed.has(lesson.id)
  ).length;
  const nextLesson = courseLessons.find((lesson) => !completed.has(lesson.id));
  const progress = courseLessons.length
    ? Math.round((completedCount / courseLessons.length) * 100)
    : 0;
  const pathHeight = courseLessons.length * 128;
  const pathPoints = courseLessons.map((_, index) => ({
    x: index % 2 === 0 ? 28 : 72,
    y: 64 + index * 128,
  }));
  const pathD = pathPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = pathPoints[index - 1];
    return `${path} C ${previous.x} ${previous.y + 48}, ${point.x} ${point.y - 48}, ${point.x} ${point.y}`;
  }, "");

  return (
    <section className="mt-8" aria-labelledby="learning-path-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mint-400">
            Your learning trail
          </p>
          <h2
            id="learning-path-title"
            className="mt-1 font-display text-xl font-semibold text-ink-100"
          >
            Small steps. Real skills.
          </h2>
        </div>
        <span className="pb-1 text-xs text-ink-500">
          {courses.length} {courses.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Choose a learning track"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
      >
        {courses.map((course) => {
          const courseCompleted = lessons.filter(
            (lesson) =>
              lesson.course_id === course.id && completed.has(lesson.id)
          ).length;
          const isActive = activeCourse.id === course.id;

          return (
            <button
              key={course.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="learning-path-panel"
              onClick={() => setActiveCourseId(course.id)}
              className={`flex min-h-10 shrink-0 items-center gap-2 border px-3 text-left transition ${
                isActive
                  ? "border-mint-400/50 bg-mint-400/10 text-ink-100"
                  : "border-base-700 bg-base-900 text-ink-500 hover:border-base-600 hover:text-ink-300"
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-mint-400">
                {course.icon}
              </span>
              <span className="text-xs font-medium">{course.title}</span>
              <span className="font-mono text-[10px] text-ink-500">
                {courseCompleted}/{lessons.filter((lesson) => lesson.course_id === course.id).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="learning-path-panel"
        role="tabpanel"
        aria-label={`${activeCourse.title} learning path`}
        className="grid gap-4 border border-base-700 bg-base-900/60 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_260px]"
      >
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-100">
                {activeCourse.title}
              </h3>
              <p className="mt-1 text-xs text-ink-500">
                {activeCourse.description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-lg font-semibold text-mint-400">
                {progress}%
              </p>
              <p className="text-[10px] text-ink-500">
                {completedCount} of {courseLessons.length} complete
              </p>
            </div>
          </div>

          <div
            className="mb-5 h-1.5 overflow-hidden bg-base-800"
            role="progressbar"
            aria-label={`${activeCourse.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full bg-mint-400 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {courseLessons.length === 0 ? (
            <p className="border-t border-base-700 py-4 text-sm text-ink-500">
              Lessons for this track are being prepared.
            </p>
          ) : (
            <ol className="relative isolate">
              <svg
                aria-hidden="true"
                viewBox={`0 0 100 ${pathHeight}`}
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(123, 132, 150, 0.42)"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {courseLessons.map((lesson, index) => {
                const isComplete = completed.has(lesson.id);
                const isNext = nextLesson?.id === lesson.id;
                const status = isComplete
                  ? "Completed"
                  : isNext
                    ? "Up next"
                    : "Coming up";

                return (
                  <li
                    key={lesson.id}
                    className={`flex min-h-32 items-center ${
                      index % 2 === 0
                        ? "justify-start pl-[10%]"
                        : "justify-end pr-[10%]"
                    }`}
                  >
                    <Link
                      href={`/lesson/${lesson.id}`}
                      aria-label={`${lesson.title}, ${status}, about 4 minutes`}
                      className="group flex w-[36%] flex-col items-center py-2 text-center"
                    >
                      <span
                        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-display text-xl transition duration-200 group-hover:scale-105 sm:h-[72px] sm:w-[72px] ${
                          isComplete
                            ? "border-mint-400 bg-mint-400 text-base-950 shadow-[0_0_24px_rgba(127,255,176,0.12)]"
                            : isNext
                              ? "border-mint-400 bg-base-900 text-mint-400 shadow-[0_0_28px_rgba(127,255,176,0.14)] ring-4 ring-mint-400/10"
                              : "border-dashed border-base-600 bg-base-900 text-ink-500"
                        }`}
                      >
                        {isComplete ? "✓" : String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-2 block w-full min-w-0">
                        <span className={`block truncate text-xs font-semibold sm:text-sm ${isNext ? "text-mint-400" : "text-ink-100 group-hover:text-mint-400"}`}>
                          {lesson.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-ink-500">
                          {status} · about 4 minutes
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <aside className="flex flex-col justify-between gap-4 border-t border-base-700 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {nextLesson ? "Ready for your next step?" : "Path complete"}
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-ink-100">
              {nextLesson?.title ?? "Excellent work."}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-500">
              {nextLesson
                ? "One short lesson at a time. Your progress is saved as you go."
                : `You completed the ${activeCourse.title} track.`}
            </p>
          </div>
          {nextLesson ? (
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="flex min-h-11 items-center justify-center gap-2 bg-mint-400 px-4 text-sm font-semibold text-base-950 transition hover:bg-mint-500"
            >
              Continue learning <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="flex min-h-11 items-center justify-center border border-mint-400/30 text-sm font-medium text-mint-400">
              Track complete
            </span>
          )}
        </aside>
      </div>
    </section>
  );
}
