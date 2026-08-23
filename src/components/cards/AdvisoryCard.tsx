import { DemoBadge } from "@/components/common/DemoBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdvisoryItem } from "@/types";

const categoryLabels: Record<AdvisoryItem["category"], string> = {
  crop: "Crop care",
  weather: "Weather",
  disease: "Disease prevention",
  irrigation: "Irrigation",
  sowing: "Sowing",
  harvest: "Harvest",
  market: "Selling",
};

export function AdvisoryCard({ advisory }: { advisory: AdvisoryItem }) {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{categoryLabels[advisory.category]}</Badge>
          {advisory.cropName ? <Badge variant="outline">{advisory.cropName}</Badge> : null}
          {advisory.isDemo ? <DemoBadge /> : null}
        </div>
        <CardTitle className="text-base leading-snug">{advisory.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{advisory.body}</p>
      </CardContent>
    </Card>
  );
}
