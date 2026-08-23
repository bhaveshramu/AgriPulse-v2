import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Tractor } from "lucide-react";

import { EquipmentCard } from "@/components/cards/EquipmentCard";
import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/contexts/LanguageContext";
import { listEquipment, listMyBookings } from "@/services/equipmentService";
import { formatInr } from "@/services/serviceUtils";
import type { EquipmentCategory } from "@/types";

export const Route = createFileRoute("/_authenticated/equipment/")({
  head: () => ({
    meta: [
      { title: "Rent Equipment — AgriPulse" },
      { name: "description", content: "Find tractors, sprayers and harvesters available near your village." },
      { property: "og:title", content: "Rent Equipment — AgriPulse" },
      { property: "og:description", content: "Farm machines available near your village." },
    ],
  }),
  component: EquipmentPage,
});

const categories: { value: EquipmentCategory | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "tractor", label: "Tractor" },
  { value: "harvester", label: "Harvester" },
  { value: "drone", label: "Drone" },
  { value: "cultivator", label: "Cultivator" },
  { value: "sprayer", label: "Sprayer" },
  { value: "other", label: "Other" },
];

function EquipmentPage() {
  const t = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EquipmentCategory | "all">("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const query = useQuery({
    queryKey: ["equipment", search, category, onlyAvailable],
    queryFn: () => listEquipment({ search, category, onlyAvailable }),
  });
  const bookingsQuery = useQuery({ queryKey: ["bookings"], queryFn: listMyBookings });

  return (
    <div>
      <PageHeader
        title={t("equipment.title")}
        description={t("equipment.subtitle")}
        actions={
          <Button variant="outline" disabled title="Available in a later version">
            {t("equipment.listYours")}
          </Button>
        }
      />

      <div className="space-y-6">
        <DemoNotice>
          Demo listings. Real owners, bookings and payment are added in a later part of the project.
        </DemoNotice>

        <Card>
          <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="equipment-search">{t("equipment.search")}</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="equipment-search"
                  className="h-12 pl-9"
                  placeholder="Tractor, sprayer…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="equipment-category">{t("equipment.category")}</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as EquipmentCategory | "all")}
              >
                <SelectTrigger id="equipment-category" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-1 sm:pt-6">
              <Switch id="only-available" checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
              <Label htmlFor="only-available">Show available only</Label>
            </div>
          </CardContent>
        </Card>

        {query.isPending ? (
          <LoadingState rows={3} />
        ) : query.isError ? (
          <ErrorState message="Equipment listings could not be loaded." onRetry={() => query.refetch()} />
        ) : (query.data ?? []).length === 0 ? (
          <EmptyState
            title="No equipment matches your search"
            description="Try a different search word or type."
            icon={<Tractor className="h-5 w-5" />}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setOnlyAvailable(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(query.data ?? []).map((item) => (
              <li key={item.id}>
                <EquipmentCard item={item} />
              </li>
            ))}
          </ul>
        )}

        <section aria-labelledby="bookings-heading">
          <h2 id="bookings-heading" className="mb-3 font-display text-lg font-semibold">
            {t("equipment.myBookings")}
          </h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Example bookings (demo data)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsQuery.isPending ? (
                <LoadingState rows={2} />
              ) : (bookingsQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">You have no bookings yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {(bookingsQuery.data ?? []).map((booking) => (
                    <li key={booking.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{booking.equipmentTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.startDate} · {booking.hours} hours
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatInr(booking.totalAmount)}</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                          {booking.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
