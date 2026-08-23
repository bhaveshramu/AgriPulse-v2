import { CalendarDays } from "lucide-react";

import { DemoBadge } from "@/components/common/DemoBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiseaseResult } from "@/types";

const severityLabel: Record<DiseaseResult["severity"], { text: string; variant: "default" | "secondary" | "destructive" }> = {
  low: { text: "Low severity", variant: "secondary" },
  medium: { text: "Medium severity", variant: "default" },
  high: { text: "High severity", variant: "destructive" },
};

export function DiseaseScanCard({ result }: { result: DiseaseResult }) {
  const severity = severityLabel[result.severity];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Result</CardTitle>
        {result.isDemo ? <DemoBadge label="Example Result" /> : null}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <img
          src={result.imageUrl}
          alt={`Photo of the ${result.cropName} leaf that was checked`}
          className="h-44 w-full rounded-md border border-border object-cover sm:h-full"
        />
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Crop</dt>
            <dd className="font-semibold text-foreground">{result.cropName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Possible disease</dt>
            <dd className="font-display text-lg font-semibold text-foreground">{result.diseaseName}</dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Confidence {result.confidencePercent}%</Badge>
            <Badge variant={severity.variant}>{severity.text}</Badge>
          </div>
          <div>
            <dt className="text-muted-foreground">What you can do</dt>
            <dd className="leading-relaxed text-foreground">{result.recommendation}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> Checked on
            </dt>
            <dd className="text-foreground">{new Date(result.scannedAt).toLocaleString("en-IN")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
