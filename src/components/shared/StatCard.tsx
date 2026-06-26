import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, tone = "default", hint, delay = 0,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  hint?: string;
  delay?: number;
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
    danger:  "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
    info:    "bg-[color:var(--color-info)]/10 text-[color:var(--color-info)]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
    >
      <Card className="p-4 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
          {Icon && (
            <span className={cn("h-8 w-8 rounded-md grid place-items-center", toneClasses[tone])}>
              <Icon className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </Card>
    </motion.div>
  );
}
