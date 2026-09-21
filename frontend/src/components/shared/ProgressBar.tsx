interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-text-primary/70">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-2xl border border-border bg-background">
        <div
          className="h-full bg-emerald transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
