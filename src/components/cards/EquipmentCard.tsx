import { Link } from "@tanstack/react-router";
import { MapPin, Star, Tractor } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatInr } from "@/services/serviceUtils";
import type { EquipmentItem } from "@/types";

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  const t = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Tractor className="h-5 w-5" aria-hidden="true" />
          </span>
          <Badge variant={item.isAvailable ? "default" : "secondary"}>
            {item.isAvailable ? t("equipment.available") : t("equipment.booked")}
          </Badge>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {item.district}, {item.state} · {item.distanceKm} {t("equipment.kmAway")}
        </p>

        <p className="text-sm text-muted-foreground">
          {t("equipment.owner")}: <span className="font-medium text-foreground">{item.ownerName}</span>,{" "}
          {item.ownerVillage}
        </p>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-current text-warning" aria-hidden="true" />
          {item.rating.toFixed(1)} {t("equipment.rating")}
        </p>

        <p className="mt-auto font-display text-xl font-semibold text-foreground">
          {formatInr(item.hourlyPrice)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">{t("equipment.perHour")}</span>
        </p>

        <Button asChild className="w-full">
          <Link to="/equipment/$equipmentId" params={{ equipmentId: item.id }}>
            {t("equipment.details")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
