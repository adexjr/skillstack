interface BadgeCardProps {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}

export function BadgeCard({ icon, title, description, earned }: BadgeCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition ${
        earned
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-base-700 bg-base-900 opacity-40"
      }`}
    >
      <p className="text-2xl">{icon}</p>
      <p className="mt-2 font-display text-sm font-semibold text-ink-100">
        {title}
      </p>
      <p className="mt-1 text-xs text-ink-500">{description}</p>
    </div>
  );
}