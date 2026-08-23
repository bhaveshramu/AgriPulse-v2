import { Sprout } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Crop } from "@/types";

const healthLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  healthy: { label: "Healthy", variant: "default" },
  watch: { label: "Needs watching", variant: "secondary" },
  affected: { label: "Affected", variant: "destructive" },
};

interface CropCardProps {
  crop: Pick<Crop, "name" | "variety" | "growth_stage" | "health_status"> & { lastScan?: string | null };
  action?: React.ReactNode;
}

export function CropCard({ crop, action }: CropCardProps) {
  const health = healthLabels[crop.health_status] ?? healthLabels.healthy;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Sprout className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-foreground">
              {crop.name}
              {crop.variety ? <span className="text-muted-foreground"> · {crop.variety}</span> : null}
            </p>
            <p className="text-sm text-muted-foreground">Stage: {crop.growth_stage}</p>
            <p className="text-sm text-muted-foreground">
              Last crop check: {crop.lastScan ? crop.lastScan : "Not checked yet"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={health.variant}>{health.label}</Badge>
          {action}
        </div>
      </CardContent>
    </Card>
  );
}
