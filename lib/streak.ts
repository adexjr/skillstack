/**
 * Returns what the streak SHOULD be right now, given the last active date.
 * If more than 1 day has passed since last_active, the streak is broken and
 * resets to 0 — even if the stored value in the database is stale.
 */
export function getEffectiveStreak(
  lastActive: string | null,
  storedStreak: number
): number {
  if (!lastActive) return 0;

  const last = new Date(`${lastActive}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Same day or consecutive day — streak still holds.
  if (diffDays <= 1) return storedStreak;

  // A day (or more) was missed — streak is broken.
  return 0;
}