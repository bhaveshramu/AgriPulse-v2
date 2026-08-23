import { CloudRain, Droplets, MapPin, Thermometer, Wind } from "lucide-react";

import { DemoBadge } from "@/components/common/DemoBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import type { WeatherReport } from "@/types";

interface WeatherCardProps {
  report: WeatherReport;
  title: string;
  footer?: React.ReactNode;
  forecastDays?: number;
}

export function WeatherCard({ report, title, footer, forecastDays = 5 }: WeatherCardProps) {
  const t = useTranslation();
  const { now, forecast } = report;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {report.isDemo ? <DemoBadge /> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {now.locationName}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-semibold text-foreground">{now.temperatureC}°C</span>
          <span className="text-base text-muted-foreground">{now.condition}</span>
        </div>

        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border border-border bg-secondary p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets className="h-4 w-4" aria-hidden="true" /> {t("weather.humidity")}
            </dt>
            <dd className="mt-1 font-semibold">{now.humidityPercent}%</dd>
          </div>
          <div className="rounded-md border border-border bg-secondary p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <CloudRain className="h-4 w-4" aria-hidden="true" /> {t("weather.rain")}
            </dt>
            <dd className="mt-1 font-semibold">{now.rainProbabilityPercent}%</dd>
          </div>
          <div className="rounded-md border border-border bg-secondary p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Wind className="h-4 w-4" aria-hidden="true" /> {t("weather.wind")}
            </dt>
            <dd className="mt-1 font-semibold">{now.windSpeedKmph} km/h</dd>
          </div>
        </dl>

        <ul className="grid grid-cols-5 gap-2">
          {forecast.slice(0, forecastDays).map((day) => (
            <li key={day.date} className="rounded-md border border-border p-2 text-center">
              <p className="text-xs font-medium text-muted-foreground">{day.label}</p>
              <Thermometer className="mx-auto my-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-semibold">{day.maxC}°</p>
              <p className="text-xs text-muted-foreground">{day.minC}°</p>
            </li>
          ))}
        </ul>

        {footer}
      </CardContent>
    </Card>
  );
}
