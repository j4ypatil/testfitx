export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-1.5 bg-light-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-400 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-medium text-light-muted min-w-[32px] text-right">
          {pct}%
        </span>
      </div>
    </div>
  );
}
