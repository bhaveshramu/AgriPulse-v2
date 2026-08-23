import { Sprout } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations/en";
import type { Crop } from "@/types";

const healthLabels: Record<string, { key: TranslationKey; variant: "default" | "secondary" | "destructive" }> = {
  healthy: { key: "card.health.healthy", variant: "default" },
  watch: { key: "card.health.watch", variant: "secondary" },
  affected: { key: "card.health.affected", variant: "destructive" },
};

interface CropCardProps {
  crop: Pick<Crop, "name" | "variety" | "growth_stage" | "health_status"> & { lastScan?: string | null };
  action?: React.ReactNode;
}

export function CropCard({ crop, action }: CropCardProps) {
  const t = useTranslation();
  const health = healthLabels[crop.health_status] ?? healthLabels["healthy"]!;

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
            <p className="text-sm text-muted-foreground">
              {t("card.stage")}: {crop.growth_stage}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("card.lastCheck")}: {t("card.notCheckedYet")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={health.variant}>{t(health.key)}</Badge>
          {action}
        </div>
      </CardContent>
    </Card>
  );
}
