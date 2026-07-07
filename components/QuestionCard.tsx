"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  onAnswered: (correct: boolean) => void;
}

export function QuestionCard({ question, onAnswered }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === question.correct_answer;

  function handleSelect(option: string) {
    if (submitted) return;
    setSelected(option);
  }

  function handleSubmit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    onAnswered(selected === question.correct_answer);
  }

  return (
    <div className="rounded-xl border border-base-700 bg-base-900 p-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ink-500">
        {question.type === "code_output" ? "Predict the output" : "Multiple choice"}
      </p>

      <p className="mt-3 text-base text-ink-100">{question.prompt}</p>

      {question.code_snippet && (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-base-700 bg-base-800 p-4 font-mono text-sm text-ink-100">
          {question.code_snippet}
        </pre>
      )}

      <div className="mt-5 space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const showResult = submitted && isSelected;
          const showCorrectHighlight =
            submitted && option === question.correct_answer;

          let stateClasses =
            "border-base-700 hover:border-base-600 text-ink-100";

          if (showCorrectHighlight) {
            stateClasses = "border-mint-400 bg-mint-400/10 text-mint-400";
          } else if (showResult && !isCorrect) {
            stateClasses = "border-coral-500 bg-coral-500/10 text-coral-400";
          } else if (isSelected) {
            stateClasses = "border-mint-400/60 bg-mint-400/5 text-ink-100";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => handleSelect(option)}
              className={`w-full rounded-lg border px-4 py-3 text-left font-mono text-sm transition ${stateClasses} disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {submitted && question.explanation && (
        <p
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            isCorrect
              ? "border-mint-400/30 bg-mint-400/5 text-mint-400"
              : "border-coral-500/30 bg-coral-500/5 text-coral-400"
          }`}
        >
          {isCorrect ? "Correct — " : "Not quite — "}
          {question.explanation}
        </p>
      )}

      {!submitted && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-5 w-full rounded-lg bg-mint-400 py-2.5 font-display text-sm font-semibold text-base-950 transition hover:bg-mint-500 disabled:opacity-40"
        >
          Check answer
        </button>
      )}
    </div>
  );
}
