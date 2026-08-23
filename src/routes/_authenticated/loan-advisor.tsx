import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Landmark } from "lucide-react";

import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROP_OPTIONS, SOIL_TYPES } from "@/data/locations";
import { useTranslation } from "@/contexts/LanguageContext";
import { assessLoanEligibility } from "@/services/loanService";
import { formatInr } from "@/services/serviceUtils";
import type { LoanAnswers, LoanAssessment } from "@/types";

export const Route = createFileRoute("/_authenticated/loan-advisor")({
  head: () => ({
    meta: [
      { title: "Loan Help — AgriPulse" },
      {
        name: "description",
        content: "Answer a few questions and see an example farm loan readiness assessment.",
      },
      { property: "og:title", content: "Loan Help — AgriPulse" },
      { property: "og:description", content: "Example farm loan readiness assessment." },
    ],
  }),
  component: LoanAdvisorPage,
});

const initialAnswers: LoanAnswers = {
  landArea: "",
  cropType: CROP_OPTIONS[0],
  annualIncome: "",
  existingLoans: "no",
  experienceYears: "",
  irrigation: "yes",
  soilType: SOIL_TYPES[0],
  cropHistory: "good",
};

const bandLabel: Record<LoanAssessment["band"], string> = {
  low: "Needs more preparation",
  moderate: "Moderate readiness",
  strong: "Strong readiness",
};

function LoanAdvisorPage() {
  const t = useTranslation();
  const [answers, setAnswers] = useState<LoanAnswers>(initialAnswers);
  const [result, setResult] = useState<LoanAssessment | null>(null);

  const assess = useMutation({
    mutationFn: () => assessLoanEligibility(answers),
    onSuccess: setResult,
  });

  function update<K extends keyof LoanAnswers>(key: K, value: LoanAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <PageHeader title={t("loan.title")} description={t("loan.subtitle")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DemoNotice>
            This is an example assessment for demonstration. It is not a bank decision and no documents
            are checked. Always confirm with your bank.
          </DemoNotice>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">A few questions about your farm</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  assess.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="land">Land area (acre)</Label>
                    <Input
                      id="land"
                      className="h-12"
                      inputMode="decimal"
                      required
                      value={answers.landArea}
                      onChange={(event) => update("landArea", event.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="loan-crop">Main crop</Label>
                    <Select value={answers.cropType} onValueChange={(value) => update("cropType", value)}>
                      <SelectTrigger id="loan-crop" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CROP_OPTIONS.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="income">Yearly farm income (₹)</Label>
                    <Input
                      id="income"
                      className="h-12"
                      inputMode="numeric"
                      required
                      value={answers.annualIncome}
                      onChange={(event) => update("annualIncome", event.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experience">Years of farming</Label>
                    <Input
                      id="experience"
                      className="h-12"
                      inputMode="numeric"
                      required
                      value={answers.experienceYears}
                      onChange={(event) => update("experienceYears", event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="loans">Do you have a loan now?</Label>
                    <Select
                      value={answers.existingLoans}
                      onValueChange={(value) => update("existingLoans", value)}
                    >
                      <SelectTrigger id="loans" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="irrigation">Irrigation available?</Label>
                    <Select
                      value={answers.irrigation}
                      onValueChange={(value) => update("irrigation", value)}
                    >
                      <SelectTrigger id="irrigation" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="soil">Soil type</Label>
                    <Select value={answers.soilType} onValueChange={(value) => update("soilType", value)}>
                      <SelectTrigger id="soil" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOIL_TYPES.map((soil) => (
                          <SelectItem key={soil} value={soil}>
                            {soil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="history">Last two harvests</Label>
                    <Select
                      value={answers.cropHistory}
                      onValueChange={(value) => update("cropHistory", value)}
                    >
                      <SelectTrigger id="history" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good yield</SelectItem>
                        <SelectItem value="average">Average yield</SelectItem>
                        <SelectItem value="poor">Poor yield</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full text-base" disabled={assess.isPending}>
                  {assess.isPending ? "Checking…" : "See example assessment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("loan.result")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-end justify-between">
                    <p className="font-display text-4xl font-semibold text-foreground">{result.score}</p>
                    <p className="text-sm font-medium text-muted-foreground">{bandLabel[result.band]}</p>
                  </div>
                  <Progress value={result.score} className="mt-2" />
                </div>

                <div className="rounded-md border border-border bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">Example loan amount</p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {formatInr(result.indicativeAmount)}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">What this is based on</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Next steps</h3>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                    {result.nextSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <p className="text-xs text-muted-foreground">
                  Demo assessment only. Your bank makes the final decision.
                </p>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              title="No assessment yet"
              description="Answer the questions and press the button. Your example assessment appears here."
              icon={<Landmark className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
