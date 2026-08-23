import { DemoBadge } from "@/components/common/DemoBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations/en";
import type { AdvisoryItem } from "@/types";

const categoryKeys: Record<AdvisoryItem["category"], TranslationKey> = {
  crop: "category.crop",
  weather: "category.weather",
  disease: "category.disease",
  irrigation: "category.irrigation",
  sowing: "category.sowing",
  harvest: "category.harvest",
  market: "category.market",
};

export function AdvisoryCard({ advisory }: { advisory: AdvisoryItem }) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{t(categoryKeys[advisory.category])}</Badge>
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
