import { createFileRoute } from "@tanstack/react-router";

import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAdminOverview, mockDiseaseSplit, mockMarketSearches } from "@/data/mockAdmin";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — AgriPulse" },
      { name: "description", content: "Usage overview of AgriPulse for agriculture officers and admins." },
      { property: "og:title", content: "Admin Overview — AgriPulse" },
      { property: "og:description", content: "Usage overview for officers and admins." },
    ],
  }),
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const stats = Object.entries(mockAdminOverview);

  return (
    <div>
      <PageHeader title="Admin overview" description="How AgriPulse is being used across districts." />

      <div className="space-y-6">
        <DemoNotice>Demo analytics. Live reporting is connected in a later part of the project.</DemoNotice>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <p className="text-sm capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">{String(value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most reported crop problems</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {mockDiseaseSplit.map((row) => (
                  <li key={row.name} className="flex items-center justify-between py-2.5">
                    <span className="text-muted-foreground">{row.name}</span>
                    <span className="font-semibold">{row.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most searched crops in markets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {mockMarketSearches.map((row) => (
                  <li key={row.crop} className="flex items-center justify-between py-2.5">
                    <span className="text-muted-foreground">{row.crop}</span>
                    <span className="font-semibold">{row.searches}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
