interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "amber";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "border-border text-text-primary",
    emerald: "border-emerald text-emerald",
    amber: "border-amber text-amber",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-2xl border px-3 py-1 text-xs font-medium ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
