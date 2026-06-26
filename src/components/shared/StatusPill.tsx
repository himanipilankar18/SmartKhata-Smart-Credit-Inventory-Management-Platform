import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  const map: Record<Tone, string> = {
    success: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
    danger:  "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
    info:    "bg-[color:var(--color-info)]/10 text-[color:var(--color-info)]",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", map[tone])}>
      {children}
    </span>
  );
}
