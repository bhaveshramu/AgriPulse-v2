import { CalendarDays } from "lucide-react";

import { DemoBadge } from "@/components/common/DemoBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations/en";
import type { DiseaseResult } from "@/types";

const severityLabel: Record<
  DiseaseResult["severity"],
  { key: TranslationKey; variant: "default" | "secondary" | "destructive" }
> = {
  low: { key: "severity.low", variant: "secondary" },
  medium: { key: "severity.medium", variant: "default" },
  high: { key: "severity.high", variant: "destructive" },
};

export function DiseaseScanCard({ result }: { result: DiseaseResult }) {
  const t = useTranslation();
  const severity = severityLabel[result.severity];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{t("disease.result")}</CardTitle>
        {result.isDemo ? <DemoBadge label={t("common.exampleResult")} /> : null}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <img
          src={result.imageUrl}
          alt={`Photo of the ${result.cropName} leaf that was checked`}
          className="h-44 w-full rounded-md border border-border object-cover sm:h-full"
        />
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{t("disease.crop")}</dt>
            <dd className="font-semibold text-foreground">{result.cropName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("disease.possible")}</dt>
            <dd className="font-display text-lg font-semibold text-foreground">{result.diseaseName}</dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {t("disease.confidence")} {result.confidencePercent}%
            </Badge>
            <Badge variant={severity.variant}>{t(severity.key)}</Badge>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("disease.whatYouCanDo")}</dt>
            <dd className="leading-relaxed text-foreground">{result.recommendation}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> {t("disease.checkedOn")}
            </dt>
            <dd className="text-foreground">{new Date(result.scannedAt).toLocaleString("en-IN")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
