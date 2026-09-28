"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { BottomNav } from "@/components/BottomNav";

const DAILY_CHALLENGE = {
  title: "Map the numbers",
  difficulty: "Beginner",
  prompt:
    "Use map() to return each number multiplied by two, then log the new array.",
  starter: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map((number) => {
  // Return the number multiplied by 2
});
console.log(doubled);`,
  expectedOutput: "[2,4,6,8]",
  explanation:
    "The map() method transforms each item in an array and returns a new array with the same length. Here, each number is multiplied by 2.",
};

export function PracticeRoom() {
  const [code, setCode] = useState(DAILY_CHALLENGE.starter);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);

  function runCode() {
    setIsRunning(true);
    setPassed(false);
    const logs: string[] = [];

    const fakeConsole = {
      log: (...args: unknown[]) => {
        const rendered = args
          .map((arg) =>
            typeof arg === "string"
              ? arg
              : typeof arg === "object"
                ? JSON.stringify(arg)
                : String(arg)
          )
          .join(" ");
        logs.push(rendered);
      },
    };

    try {
      // eslint-disable-next-line no-new-func
      const runner = new Function("console", code);
      runner(fakeConsole);
    } catch (error) {
      logs.push(
        error instanceof Error ? `Error: ${error.message}` : "Error: Something went wrong"
      );
    }

    setOutput(logs);
    setPassed(logs.includes(DAILY_CHALLENGE.expectedOutput));
    setIsRunning(false);
  }

  return (
    <main className="app-grid min-h-screen pb-28 pt-6 text-ink-100 md:pb-12 md:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-7 flex items-end justify-between gap-4 border-b border-base-700/80 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
              Daily practice / JavaScript
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-normal text-ink-100 sm:text-4xl">
              Practice room
            </h1>
          </div>
          <div className="hidden items-center gap-2 pb-1 text-sm text-ink-500 sm:flex">
            <span className="inline-block h-2 w-2 rounded-full bg-mint-400" />
            Session in progress
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.55fr)] lg:items-start">
          <aside className="space-y-4">
            <section className="border-l-2 border-mint-400 bg-base-900/80 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                  Challenge 01 <span className="px-1 text-base-600">/</span> Daily
                </p>
                <span className="rounded-sm bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-400">
                  {DAILY_CHALLENGE.difficulty}
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink-100">
                {DAILY_CHALLENGE.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-300">
                {DAILY_CHALLENGE.prompt}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-base-700 pt-4 text-xs text-ink-500">
                <span aria-hidden="true" className="font-mono text-mint-400">JS</span>
                <span>Arrays</span>
                <span className="text-base-600">·</span>
                <span>3 min</span>
                <span className="ml-auto font-semibold text-amber-400">+25 XP</span>
              </div>
            </section>

            <section className="border border-base-700 bg-base-900/50 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-ink-100">
                  A small hint
                </h3>
                <span className="font-mono text-xs text-ink-500">01</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                map() calls your function once for every value and collects each return value into a new array.
              </p>
            </section>

            {passed && (
              <section className="border border-mint-400/30 bg-mint-400/[0.06] px-5 py-4 sm:px-6" aria-live="polite">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-400">
                  Concept unlocked
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-300">
                  {DAILY_CHALLENGE.explanation}
                </p>
              </section>
            )}
          </aside>

          <section className="overflow-hidden border border-base-700 bg-[#0e1117] shadow-2xl shadow-black/20">
            <div className="flex min-h-12 items-center justify-between border-b border-base-700 bg-base-900/70 px-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink-100">challenge.js</span>
                <span className="h-4 w-px bg-base-700" />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">JavaScript</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCode(DAILY_CHALLENGE.starter);
                  setOutput([]);
                  setPassed(false);
                }}
                className="text-xs font-medium text-ink-500 transition hover:text-ink-100"
              >
                Reset code
              </button>
            </div>

            <div className="practice-editor min-h-[260px] sm:min-h-[330px]">
              <CodeMirror
                aria-label="JavaScript code editor"
                value={code}
                height="330px"
                extensions={[javascript()]}
                onChange={(value) => {
                  setCode(value);
                  setPassed(false);
                }}
                basicSetup={{
                  foldGutter: false,
                  lineNumbers: true,
                  highlightActiveLine: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-700 bg-base-900/50 px-4 py-3 sm:px-5">
              <p className="text-xs text-ink-500">Run your solution to check the output.</p>
              <button
                type="button"
                onClick={runCode}
                disabled={isRunning}
                className="inline-flex min-h-10 items-center justify-center gap-2 bg-mint-400 px-5 text-sm font-semibold text-base-950 transition hover:bg-mint-500 disabled:cursor-wait disabled:opacity-60"
              >
                <span aria-hidden="true" className="text-xs">▶</span>
                {isRunning ? "Running" : "Run code"}
              </button>
            </div>

            <div className="border-t border-base-700">
              <div className="flex items-center justify-between px-4 py-3 sm:px-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                  Console
                </h3>
                {output.length > 0 && (
                  <span className={`text-xs font-medium ${passed ? "text-mint-400" : "text-amber-400"}`}>
                    {passed ? "Output matches" : "Review your result"}
                  </span>
                )}
              </div>
              <div className="min-h-[76px] border-t border-base-800 bg-black/20 px-4 py-3 font-mono text-sm sm:px-5" aria-live="polite">
                {output.length === 0 ? (
                  <p className="text-ink-600">No output yet</p>
                ) : (
                  output.map((entry, index) => (
                    <p key={`${entry}-${index}`} className={entry.startsWith("Error:") ? "text-coral-400" : "text-ink-200"}>
                      <span className="mr-2 text-base-600">›</span>{entry}
                    </p>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
