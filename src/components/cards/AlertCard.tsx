import { AlertTriangle, Bell, CloudRain } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  level: "info" | "warning" | "severe";
  kind?: "weather" | "crop" | "market";
}

const levelStyles: Record<AlertItem["level"], string> = {
  info: "border-border bg-secondary",
  warning: "border-warning/40 bg-warning/10",
  severe: "border-destructive/40 bg-destructive/5",
};

export function AlertCard({ alert }: { alert: AlertItem }) {
  const Icon = alert.kind === "weather" ? CloudRain : alert.level === "info" ? Bell : AlertTriangle;

  return (
    <li className={cn("flex gap-3 rounded-md border p-3", levelStyles[alert.level])}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
      <div>
        <p className="font-semibold text-foreground">{alert.title}</p>
        <p className="text-sm text-muted-foreground">{alert.message}</p>
      </div>
    </li>
  );
}
