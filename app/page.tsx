import Link from "next/link";
import { MatrixBackground } from "@/components/MatrixBackground";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center overflow-hidden px-6 py-20">
      <MatrixBackground />
      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-sm text-mint-400">$ npx learn --start</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink-100 md:text-5xl">
            Learn to code
            <br />
            <span className="text-mint-400">one guess at a time.</span>
          </h1>
          <p className="mt-5 max-w-md text-ink-300">
            Predict what the code does. Pick the right answer. Build a streak.
            No videos, no fluff — just reps that stick.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-mint-400 px-6 py-3 font-display text-sm font-semibold text-base-950 shadow-glow transition hover:bg-mint-500"
            >
              Start learning — it's free
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-base-700 bg-base-900 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-base-700 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-coral-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint-500/70" />
            <span className="ml-3 font-mono text-xs text-ink-500">
              lesson-01.js
            </span>
          </div>
          <div className="p-5 font-mono text-sm">
            <p className="text-ink-500">// What does this log?</p>
            <p className="mt-2 text-ink-100">
              <span className="text-amber-400">const</span> nums = [1, 2, 3];
            </p>
            <p className="text-ink-100">
              console.<span className="text-mint-400">log</span>(nums.
              <span className="text-mint-400">map</span>(n =&gt; n * 2));
            </p>
            <div className="mt-5 space-y-2">
              <div className="rounded-md border border-mint-400/40 bg-mint-400/10 px-3 py-2 text-mint-400">
                [2, 4, 6]
              </div>
              <div className="rounded-md border border-base-700 px-3 py-2 text-ink-300">
                [1, 2, 3, 1, 2, 3]
              </div>
              <div className="rounded-md border border-base-700 px-3 py-2 text-ink-300">
                undefined
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
