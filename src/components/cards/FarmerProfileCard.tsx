import { MapPin, Phone, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types";

export function FarmerProfileCard({ profile }: { profile: Profile }) {
  const location = [profile.village, profile.district, profile.state].filter(Boolean).join(", ");

  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <User className="h-7 w-7" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {profile.full_name || "Farmer"}
          </h2>
          {profile.mobile_number ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {profile.mobile_number}
            </p>
          ) : null}
          {location ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {location}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
