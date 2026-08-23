import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bug, CloudSun, IndianRupee, Leaf, Sprout, Tractor } from "lucide-react";

import { AlertCard, type AlertItem } from "@/components/cards/AlertCard";
import { AdvisoryCard } from "@/components/cards/AdvisoryCard";
import { CropCard } from "@/components/cards/CropCard";
import { MarketPriceCard } from "@/components/cards/MarketPriceCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { DemoNotice } from "@/components/common/DemoBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { getDailyAdvisory } from "@/services/advisoryService";
import { listCrops } from "@/services/farmService";
import { getMarketReport } from "@/services/marketService";
import { getWeatherReport } from "@/services/weatherService";
import type { TranslationKey } from "@/translations/en";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Home — AgriPulse" },
      { name: "description", content: "Your weather, crops, market prices and farm advice in one place." },
      { property: "og:title", content: "Farmer Home — AgriPulse" },
      { property: "og:description", content: "Weather, crops, market prices and farm advice." },
    ],
  }),
  component: DashboardPage,
});

const demoAlerts: (Omit<AlertItem, "title" | "message"> & {
  titleKey: TranslationKey;
  messageKey: TranslationKey;
})[] = [
  {
    id: "a1",
    titleKey: "dashboard.alert1.title",
    messageKey: "dashboard.alert1.message",
    level: "warning",
    kind: "weather",
  },
  {
    id: "a2",
    titleKey: "dashboard.alert2.title",
    messageKey: "dashboard.alert2.message",
    level: "severe",
    kind: "crop",
  },
  {
    id: "a3",
    titleKey: "dashboard.alert3.title",
    messageKey: "dashboard.alert3.message",
    level: "info",
    kind: "market",
  },
];

const quickActions: { to: string; labelKey: TranslationKey; icon: typeof Bug }[] = [
  { to: "/disease-detection", labelKey: "dashboard.scanCrop", icon: Bug },
  { to: "/market", labelKey: "dashboard.checkMarketPrice", icon: IndianRupee },
  { to: "/weather", labelKey: "weather.title", icon: CloudSun },
  { to: "/equipment", labelKey: "dashboard.rentEquipment", icon: Tractor },
  { to: "/advisory", labelKey: "dashboard.farmAdvisory", icon: Leaf },
];

function DashboardPage() {
  const t = useTranslation();
  const { profile } = useAuth();

  const locationName = [profile?.district, profile?.state].filter(Boolean).join(", ") || undefined;

  const weatherQuery = useQuery({
    queryKey: ["weather", locationName],
    queryFn: () => getWeatherReport(locationName),
  });
  const marketQuery = useQuery({
    queryKey: ["market", "dashboard"],
    queryFn: () =>
      getMarketReport({ cropName: "Tomato", state: "Karnataka", marketName: "Hubballi APMC" }),
  });
  const cropsQuery = useQuery({ queryKey: ["crops"], queryFn: listCrops });
  const advisoryQuery = useQuery({ queryKey: ["advisory", "daily"], queryFn: getDailyAdvisory });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">{t("dashboard.welcome")}</p>
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {profile?.full_name || t("profile.farmer")}
        </h1>
        {locationName ? <p className="mt-1 text-muted-foreground">{locationName}</p> : null}
      </header>

      <DemoNotice>
{t("dashboard.demoNotice")}
      </DemoNotice>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-3 font-display text-lg font-semibold">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.to}
                asChild
                variant="outline"
                className="h-auto min-h-24 flex-col gap-2 whitespace-normal p-4 text-center text-sm font-semibold"
              >
                <Link to={action.to}>
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  {t(action.labelKey)}
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="weather-heading">
          <h2 id="weather-heading" className="sr-only">
            {t("dashboard.weather")}
          </h2>
          {weatherQuery.isPending ? (
            <LoadingState message={t("common.loading")} rows={2} />
          ) : weatherQuery.isError || !weatherQuery.data ? (
            <ErrorState
              message={t("dashboard.weatherUnavailable")}
              onRetry={() => weatherQuery.refetch()}
            />
          ) : (
            <WeatherCard
              report={weatherQuery.data}
              title={t("dashboard.weather")}
              footer={
                <Button asChild variant="outline" className="w-full">
                  <Link to="/weather">{t("dashboard.viewWeatherAdvisory")}</Link>
                </Button>
              }
            />
          )}
        </section>

        <section aria-labelledby="market-heading">
          <h2 id="market-heading" className="sr-only">
            {t("dashboard.market")}
          </h2>
          {marketQuery.isPending ? (
            <LoadingState rows={2} />
          ) : marketQuery.isError || !marketQuery.data ? (
            <ErrorState
              message={t("dashboard.marketUnavailable")}
              onRetry={() => marketQuery.refetch()}
            />
          ) : (
            <MarketPriceCard
              report={marketQuery.data}
              title={t("dashboard.market")}
              footer={
                <Button asChild variant="outline" className="w-full">
                  <Link to="/market">{t("dashboard.viewMarket")}</Link>
                </Button>
              }
            />
          )}
        </section>
      </div>

      <section aria-labelledby="crops-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="crops-heading" className="font-display text-lg font-semibold">
            {t("dashboard.cropHealth")}
          </h2>
          <Button asChild size="sm">
            <Link to="/disease-detection">{t("dashboard.scanCrop")}</Link>
          </Button>
        </div>

        {cropsQuery.isPending ? (
          <LoadingState rows={2} />
        ) : cropsQuery.isError ? (
          <ErrorState message={t("dashboard.cropsUnavailable")} onRetry={() => cropsQuery.refetch()} />
        ) : (cropsQuery.data ?? []).length === 0 ? (
          <EmptyState
            title={t("dashboard.noCropsTitle")}
            description={t("dashboard.noCropsDescription")}
            icon={<Sprout className="h-5 w-5" />}
            action={
              <Button asChild>
                <Link to="/farm">{t("dashboard.addFarm")}</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {(cropsQuery.data ?? []).map((crop) => (
              <li key={crop.id}>
                <CropCard
                  crop={crop}
                  action={
                    <Button asChild size="sm" variant="outline">
                      <Link to="/disease-detection">{t("card.check")}</Link>
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="advisory-heading">
          <h2 id="advisory-heading" className="mb-3 font-display text-lg font-semibold">
            {t("dashboard.advisory")}
          </h2>
          {advisoryQuery.isPending ? (
            <LoadingState rows={1} />
          ) : advisoryQuery.isError || !advisoryQuery.data ? (
            <ErrorState onRetry={() => advisoryQuery.refetch()} />
          ) : (
            <div className="space-y-3">
              <AdvisoryCard advisory={advisoryQuery.data} />
              <Button asChild variant="outline" className="w-full">
                <Link to="/advisory">{t("common.viewAll")}</Link>
              </Button>
            </div>
          )}
        </section>

        <section aria-labelledby="alerts-heading">
          <h2 id="alerts-heading" className="mb-3 font-display text-lg font-semibold">
            {t("dashboard.alerts")}
          </h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.exampleNotifications")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {demoAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={{
                      id: alert.id,
                      level: alert.level,
                      kind: alert.kind,
                      title: t(alert.titleKey),
                      message: t(alert.messageKey),
                    }}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
