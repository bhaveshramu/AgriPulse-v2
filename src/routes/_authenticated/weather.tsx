import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Leaf } from "lucide-react";

import { AlertCard } from "@/components/cards/AlertCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState, LoadingState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { getWeatherReport } from "@/services/weatherService";

export const Route = createFileRoute("/_authenticated/weather")({
  head: () => ({
    meta: [
      { title: "Weather & Farm Advice — AgriPulse" },
      { name: "description", content: "Local weather, 7 day forecast and crop-specific farm advice." },
      { property: "og:title", content: "Weather & Farm Advice — AgriPulse" },
      { property: "og:description", content: "Local weather with practical farm advice." },
    ],
  }),
  component: WeatherPage,
});

function WeatherPage() {
  const t = useTranslation();
  const { profile } = useAuth();
  const location = { state: profile?.state ?? undefined, district: profile?.district ?? undefined };

  const weatherQuery = useQuery({
    queryKey: ["weather", location.state, location.district],
    queryFn: () => getWeatherReport(location),
  });

  return (
    <div>
      <PageHeader title={t("weather.title")} description={t("weather.subtitle")} />

      <div className="space-y-6">
        <DemoNotice>
          Demo weather data. A live weather service is connected in a later part of the project.
        </DemoNotice>

        {weatherQuery.isPending ? (
          <LoadingState rows={3} />
        ) : weatherQuery.isError || !weatherQuery.data ? (
          <ErrorState
            message="Weather information is temporarily unavailable. Please try again later."
            onRetry={() => weatherQuery.refetch()}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <WeatherCard report={weatherQuery.data} title="Today" forecastDays={5} />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("weather.forecast")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {weatherQuery.data.forecast.map((day) => (
                    <li key={day.date} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{day.label}</p>
                        <p className="text-sm text-muted-foreground">{day.condition}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {day.maxC}° / {day.minC}°
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rain {day.rainProbabilityPercent}%
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("weather.alerts")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weatherQuery.data.alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={{ ...alert, kind: "weather" }} />
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("weather.advisory")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weatherQuery.data.cropAdvice.map((item) => (
                    <li key={item.cropName} className="flex gap-3 rounded-md border border-border p-3">
                      <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-foreground">{item.cropName}</p>
                        <p className="text-sm text-muted-foreground">{item.advice}</p>
                      </div>
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
