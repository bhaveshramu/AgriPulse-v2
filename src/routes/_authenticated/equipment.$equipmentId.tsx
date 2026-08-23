import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Star, Tractor } from "lucide-react";
import { toast } from "sonner";

import { DemoNotice } from "@/components/common/DemoBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/LanguageContext";
import { getEquipmentById, requestBooking } from "@/services/equipmentService";
import { formatInr } from "@/services/serviceUtils";

export const Route = createFileRoute("/_authenticated/equipment/$equipmentId")({
  head: () => ({
    meta: [
      { title: "Equipment Details — AgriPulse" },
      { name: "description", content: "See hire rate, owner details and availability for this farm machine." },
      { property: "og:title", content: "Equipment Details — AgriPulse" },
      { property: "og:description", content: "Hire rate, owner and availability." },
    ],
  }),
  component: EquipmentDetailPage,
});

function EquipmentDetailPage() {
  const { equipmentId } = Route.useParams();
  const t = useTranslation();
  const [hours, setHours] = useState("4");

  const query = useQuery({
    queryKey: ["equipment", equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const book = useMutation({
    mutationFn: () => requestBooking(equipmentId, Number(hours) || 1),
    onSuccess: (booking) =>
      toast.success(
        `Demo booking request created for ${booking.equipmentTitle} — ${formatInr(booking.totalAmount)}. No payment was taken.`,
      ),
    onError: () => toast.error("The booking request could not be sent."),
  });

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-2">
        <Link to="/equipment">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to equipment
        </Link>
      </Button>

      {query.isPending ? (
        <LoadingState rows={3} />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : !query.data ? (
        <EmptyState
          title="Equipment not found"
          description="This listing is no longer available."
          icon={<Tractor className="h-5 w-5" />}
          action={
            <Button asChild>
              <Link to="/equipment">Back to equipment</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="font-display text-xl">{query.data.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground capitalize">{query.data.category}</p>
              </div>
              <Badge variant={query.data.isAvailable ? "default" : "secondary"}>
                {query.data.isAvailable ? "Available" : "Booked"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
                {query.data.description}
              </p>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {query.data.district}, {query.data.state} · {query.data.distanceKm} km away
              </p>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-warning" aria-hidden="true" />
                {query.data.rating.toFixed(1)} rating
              </p>

              <div className="rounded-md border border-border bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-semibold text-foreground">{query.data.ownerName}</p>
                <p className="text-sm text-muted-foreground">{query.data.ownerVillage}</p>
              </div>

              <p className="font-display text-2xl font-semibold text-foreground">
                {formatInr(query.data.hourlyPrice)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">per hour</span>
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <DemoNotice>
              This is a demo booking. No payment is taken and the owner is not contacted.
            </DemoNotice>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("equipment.book")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="hours">How many hours?</Label>
                  <Input
                    id="hours"
                    className="h-12"
                    inputMode="numeric"
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                  />
                </div>

                <div className="rounded-md border border-border bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">Estimated total</p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {formatInr(query.data.hourlyPrice * (Number(hours) || 0))}
                  </p>
                </div>

                <Button
                  className="h-12 w-full text-base"
                  onClick={() => book.mutate()}
                  disabled={book.isPending || !query.data.isAvailable}
                >
                  {book.isPending ? "Sending…" : t("equipment.book")}
                </Button>
                {!query.data.isAvailable ? (
                  <p className="text-sm text-muted-foreground">
                    This machine is already booked. Try another listing.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
