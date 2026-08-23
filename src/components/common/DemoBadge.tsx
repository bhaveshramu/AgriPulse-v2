import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  label?: string;
  className?: string;
}

/** Marks any value on screen that comes from demo data, never a live source. */
export function DemoBadge({ label = "Demo Data", className }: DemoBadgeProps) {
  return (
    <span className={cn("demo-chip", className)}>
      <Info className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
