import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardEntry } from "@/lib/types";

export default async function LeaderboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: entries } = await supabase
    .from("profiles")
    .select("id, username, xp, streak")
    .order("xp", { ascending: false })
    .limit(20);

  const typedEntries = (entries ?? []) as LeaderboardEntry[];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Top learners</p>
          <h1 className="font-display text-2xl font-semibold text-ink-100">
            Leaderboard
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-ink-500 hover:text-ink-300"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-base-700 bg-base-900">
        {typedEntries.length === 0 ? (
          <p className="p-6 text-sm text-ink-500">No learners yet.</p>
        ) : (
          typedEntries.map((entry, i) => {
            const isMe = entry.id === user.id;
            const rank = i + 1;
            const medal =
              rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between border-b border-base-700 px-5 py-3.5 last:border-b-0 ${
                  isMe ? "bg-mint-400/5" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center font-display text-sm font-semibold text-ink-500">
                    {medal ?? rank}
                  </span>
                  <span
                    className={`font-display text-sm font-semibold ${
                      isMe ? "text-mint-400" : "text-ink-100"
                    }`}
                  >
                    {entry.username}
                    {isMe && (
                      <span className="ml-2 text-xs font-normal text-ink-500">
                        (you)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="text-amber-400">🔥 {entry.streak}</span>
                  <span className="text-mint-400">{entry.xp} XP</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}