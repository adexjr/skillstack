export function StreakBadge({ streak, xp }: { streak: number; xp: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
        <span className="text-base leading-none">🔥</span>
        <span className="font-display text-sm font-semibold text-amber-400">
          {streak}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-mint-400/30 bg-mint-400/10 px-3 py-1.5">
        <span className="text-base leading-none">⚡</span>
        <span className="font-display text-sm font-semibold text-mint-400">
          {xp} XP
        </span>
      </div>
    </div>
  );
}
