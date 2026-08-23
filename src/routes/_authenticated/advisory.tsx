import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AdvisoryCard } from "@/components/cards/AdvisoryCard";
import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/contexts/LanguageContext";
import { listAdvisories } from "@/services/advisoryService";
import type { AdvisoryCategory } from "@/types";

export const Route = createFileRoute("/_authenticated/advisory")({
  head: () => ({
    meta: [
      { title: "Farm Advice — AgriPulse" },
      { name: "description", content: "Practical crop, weather, irrigation and selling guidance for farmers." },
      { property: "og:title", content: "Farm Advice — AgriPulse" },
      { property: "og:description", content: "Practical guidance for your crops." },
    ],
  }),
  component: AdvisoryPage,
});

const categories: { value: AdvisoryCategory | "all"; label: string }[] = [
  { value: "all", label: "All topics" },
  { value: "crop", label: "Crop care" },
  { value: "weather", label: "Weather" },
  { value: "disease", label: "Disease prevention" },
  { value: "irrigation", label: "Irrigation" },
  { value: "sowing", label: "Sowing" },
  { value: "harvest", label: "Harvest" },
  { value: "market", label: "Selling" },
];

const crops = ["all", "Tomato", "Potato"];

function AdvisoryPage() {
  const t = useTranslation();
  const [category, setCategory] = useState<AdvisoryCategory | "all">("all");
  const [cropName, setCropName] = useState<string>("all");

  const query = useQuery({
    queryKey: ["advisories", category, cropName],
    queryFn: () => listAdvisories({ category, cropName }),
  });

  return (
    <div>
      <PageHeader title={t("advisory.title")} description={t("advisory.subtitle")} />

      <div className="space-y-6">
        <DemoNotice>
          Demo advisory content prepared for this version. Content from agriculture departments is added
          later.
        </DemoNotice>

        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <div className="space-y-1.5">
            <Label htmlFor="advisory-crop">Crop</Label>
            <Select value={cropName} onValueChange={setCropName}>
              <SelectTrigger id="advisory-crop" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop === "all" ? "All crops" : crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="advisory-category">Topic</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as AdvisoryCategory | "all")}>
              <SelectTrigger id="advisory-category" className="h-12">
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
        </div>

        {query.isPending ? (
          <LoadingState rows={3} />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : (query.data ?? []).length === 0 ? (
          <EmptyState
            title="No advice for this selection"
            description="Try another crop or topic."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setCategory("all");
                  setCropName("all");
                }}
              >
                Show all advice
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {(query.data ?? []).map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
