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

const demoAlerts: AlertItem[] = [
  {
    id: "a1",
    title: "Heavy rain expected on Friday",
    message: "Check drainage in low-lying fields and postpone spraying.",
    level: "warning",
    kind: "weather",
  },
  {
    id: "a2",
    title: "Late blight risk is high this week",
    message: "Humidity above 80% for two days. Inspect tomato leaves for dark spots.",
    level: "severe",
    kind: "crop",
  },
  {
    id: "a3",
    title: "Tomato price rose 6% at Hubballi APMC",
    message: "Compare nearby markets before selling this week.",
    level: "info",
    kind: "market",
  },
];

const quickActions = [
  { to: "/disease-detection", label: "Scan Crop", icon: Bug },
  { to: "/market", label: "Check Market Price", icon: IndianRupee },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/equipment", label: "Rent Equipment", icon: Tractor },
  { to: "/advisory", label: "Farm Advisory", icon: Leaf },
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
          {profile?.full_name || "Farmer"}
        </h1>
        {locationName ? <p className="mt-1 text-muted-foreground">{locationName}</p> : null}
      </header>

      <DemoNotice>
        Weather, market and crop-check information on this screen is demo data. Live data services are
        connected in a later part of the project.
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
                  {action.label}
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
              message="Weather information is temporarily unavailable. Please try again later."
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
              message="Market prices are temporarily unavailable. Please try again later."
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
          <ErrorState message="Your crop list could not be loaded." onRetry={() => cropsQuery.refetch()} />
        ) : (cropsQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="No crops added yet"
            description="Add your farm and the crops you are growing so advice can be matched to them."
            icon={<Sprout className="h-5 w-5" />}
            action={
              <Button asChild>
                <Link to="/farm">Add your farm</Link>
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
                      <Link to="/disease-detection">Check</Link>
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
                Example notifications (demo data)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {demoAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
