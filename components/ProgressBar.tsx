export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-base-700">
      <div
        className="h-full rounded-full bg-mint-400 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
