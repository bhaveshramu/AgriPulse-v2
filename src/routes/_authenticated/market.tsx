import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MarketPriceCard } from "@/components/cards/MarketPriceCard";
import { DemoBadge, DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState, LoadingState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKET_CROPS, MARKET_PLACES, MARKET_STATES } from "@/data/mockMarket";
import { useTranslation } from "@/contexts/LanguageContext";
import { getMarketReport } from "@/services/marketService";
import { formatInr } from "@/services/serviceUtils";

export const Route = createFileRoute("/_authenticated/market")({
  head: () => ({
    meta: [
      { title: "Market Prices — AgriPulse" },
      { name: "description", content: "Compare crop prices across nearby markets before you sell." },
      { property: "og:title", content: "Market Prices — AgriPulse" },
      { property: "og:description", content: "Compare crop prices across nearby markets." },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const t = useTranslation();
  const [cropName, setCropName] = useState<string>(MARKET_CROPS[0] ?? "");
  const [state, setState] = useState<string>(MARKET_STATES[0] ?? "");
  const [marketName, setMarketName] = useState<string>(MARKET_PLACES["Karnataka"]?.[0] ?? "");

  const query = useQuery({
    queryKey: ["market", cropName, state, marketName],
    queryFn: () => getMarketReport({ cropName, state, marketName }),
  });

  const markets = MARKET_PLACES[state] ?? [];

  return (
    <div>
      <PageHeader title={t("market.title")} description={t("market.subtitle")} />

      <div className="space-y-6">
        <DemoNotice>
          Demo prices. Live market data and the price prediction model are connected in a later part of
          the project.
        </DemoNotice>

        <Card>
          <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="crop">{t("market.crop")}</Label>
              <Select value={cropName} onValueChange={setCropName}>
                <SelectTrigger id="crop" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_CROPS.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">{t("market.state")}</Label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value);
                  setMarketName(MARKET_PLACES[value]?.[0] ?? "");
                }}
              >
                <SelectTrigger id="state" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_STATES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="market">{t("market.market")}</Label>
              <Select value={marketName} onValueChange={setMarketName}>
                <SelectTrigger id="market" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {query.isPending ? (
          <LoadingState rows={3} />
        ) : query.isError || !query.data ? (
          <ErrorState
            message="Market prices are temporarily unavailable. Please try again later."
            onRetry={() => query.refetch()}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <MarketPriceCard report={query.data} title={t("market.current")} />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price range this month</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-secondary p-3">
                  <p className="text-sm text-muted-foreground">{t("market.min")}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{formatInr(query.data.minPrice)}</p>
                </div>
                <div className="rounded-md border border-border bg-secondary p-3">
                  <p className="text-sm text-muted-foreground">{t("market.max")}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{formatInr(query.data.maxPrice)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base">{t("market.history")}</CardTitle>
                <DemoBadge />
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={query.data.history} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={64} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number) => formatInr(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base">{t("market.forecast")}</CardTitle>
                <DemoBadge label="Demo Forecast" />
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="divide-y divide-border">
                  {query.data.forecast.map((point) => (
                    <li key={point.date} className="flex items-center justify-between py-2.5">
                      <span className="text-muted-foreground">{point.date}</span>
                      <span className="font-semibold">{formatInr(point.price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-md border border-border bg-accent p-3">
                  <p className="text-sm font-semibold text-accent-foreground">{t("market.bestTime")}</p>
                  <p className="text-sm text-accent-foreground">{query.data.recommendedSellingPeriod}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  These expected prices are a demonstration only and must not be used as a selling
                  decision.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("market.compare")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {query.data.comparison.map((item) => (
                    <li key={item.marketName} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{item.marketName}</p>
                        <p className="text-sm text-muted-foreground">{item.distanceKm} km away</p>
                      </div>
                      <p className="font-semibold">{formatInr(item.price)}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
