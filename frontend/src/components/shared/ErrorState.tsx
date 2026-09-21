interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-text-primary/80">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-2xl border border-emerald px-4 py-2 text-sm text-emerald"
        >
          Retry
        </button>
      )}
    </div>
  );
}
