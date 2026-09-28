"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

const DEFAULT_CODE = `// Try anything — this runs in your browser
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
console.log(doubled);

function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("coder"));`;

type LogEntry = { type: "log" | "error"; text: string };

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);

  function runCode() {
    setRunning(true);
    const logs: LogEntry[] = [];

    const fakeConsole = {
      log: (...args: unknown[]) => {
        logs.push({
          type: "log",
          text: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        });
      },
    };

    try {
      // eslint-disable-next-line no-new-func
      const runner = new Function("console", code);
      runner(fakeConsole);
    } catch (err) {
      logs.push({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    }

    setOutput(logs);
    setRunning(false);
  }

  return (
    <main className="relative min-h-screen px-6 pb-28 pt-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="text-xs text-ink-500">Practice</p>
          <h1 className="font-display text-2xl font-semibold text-ink-100">
            Code Playground
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Write JavaScript, hit run, see what happens. No lesson, no pressure.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-base-700 bg-base-900">
          <div className="flex items-center gap-1.5 border-b border-base-700 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-coral-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint-500/70" />
            <span className="ml-3 font-mono text-xs text-ink-500">
              playground.js
            </span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-64 w-full resize-none bg-base-800 p-4 font-mono text-sm text-ink-100 outline-none"
          />
        </div>

        <button
          onClick={runCode}
          disabled={running}
          className="mt-4 w-full rounded-lg bg-mint-400 py-2.5 font-display text-sm font-semibold text-base-950 transition hover:bg-mint-500 disabled:opacity-60"
        >
          {running ? "Running…" : "▶ Run code"}
        </button>

        <div className="mt-4 overflow-hidden rounded-xl border border-base-700 bg-base-900">
          <p className="border-b border-base-700 px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink-500">
            Console output
          </p>
          <div className="min-h-[100px] space-y-1.5 p-4 font-mono text-sm">
            {output.length === 0 ? (
              <p className="text-ink-500">Run your code to see output here.</p>
            ) : (
              output.map((entry, i) => (
                <p
                  key={i}
                  className={
                    entry.type === "error" ? "text-coral-400" : "text-ink-100"
                  }
                >
                  {entry.type === "error" ? "✕ " : "› "}
                  {entry.text}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}