import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { DemoBadge } from "@/components/common/DemoBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatInr } from "@/services/serviceUtils";
import type { MarketReport } from "@/types";

interface MarketPriceCardProps {
  report: MarketReport;
  title: string;
  footer?: React.ReactNode;
}

export function MarketPriceCard({ report, title, footer }: MarketPriceCardProps) {
  const t = useTranslation();
  const TrendIcon = report.trend === "up" ? ArrowUpRight : report.trend === "down" ? ArrowDownRight : Minus;
  const trendText =
    report.trend === "up"
      ? t("market.trendUp")
      : report.trend === "down"
        ? t("market.trendDown")
        : t("market.trendSteady");

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {report.isDemo ? <DemoBadge /> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {report.cropName} · {report.marketName}
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-foreground">
            {formatInr(report.currentPrice)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{report.unit}</span>
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <TrendIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          {trendText} ({report.trendPercent}% {t("market.thisMonth")})
        </p>
        {footer}
      </CardContent>
    </Card>
  );
}
