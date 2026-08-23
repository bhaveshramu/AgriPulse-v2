import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Loader2, RefreshCcw, Upload } from "lucide-react";

import { DiseaseScanCard } from "@/components/cards/DiseaseScanCard";
import { DemoNotice } from "@/components/common/DemoBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/contexts/LanguageContext";
import { analyseCropImage, SUPPORTED_SCAN_CROPS, type ScanCrop } from "@/services/diseaseService";
import type { DiseaseResult } from "@/types";

export const Route = createFileRoute("/_authenticated/disease-detection")({
  head: () => ({
    meta: [
      { title: "Check Crop — AgriPulse" },
      {
        name: "description",
        content: "Upload a crop leaf photo and see how AgriPulse will report possible disease.",
      },
      { property: "og:title", content: "Check Crop — AgriPulse" },
      { property: "og:description", content: "Upload a crop leaf photo to check crop health." },
    ],
  }),
  component: DiseaseDetectionPage,
});

type ScanStatus = "empty" | "selected" | "uploading" | "analyzing" | "result" | "error";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function DiseaseDetectionPage() {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropName, setCropName] = useState<ScanCrop>("Tomato");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>("empty");
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      setStatus("error");
      setErrorMessage("Please choose a photo file smaller than 8 MB.");
      return;
    }

    setStatus("uploading");
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(String(reader.result));
      setStatus("selected");
    };
    reader.onerror = () => {
      setStatus("error");
      setErrorMessage(t("disease.error"));
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyse() {
    if (!imageUrl) return;
    setStatus("analyzing");
    setErrorMessage(null);
    try {
      const nextResult = await analyseCropImage(cropName, imageUrl);
      setResult(nextResult);
      setStatus("result");
    } catch {
      setStatus("error");
      setErrorMessage(t("disease.error"));
    }
  }

  function handleReset() {
    setImageUrl(null);
    setResult(null);
    setErrorMessage(null);
    setStatus("empty");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <PageHeader title={t("disease.title")} description={t("disease.subtitle")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DemoNotice>{t("disease.notReal")}</DemoNotice>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. {t("disease.selectCrop")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="scan-crop">{t("disease.selectCrop")}</Label>
                <Select value={cropName} onValueChange={(value) => setCropName(value as ScanCrop)}>
                  <SelectTrigger id="scan-crop" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_SCAN_CROPS.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Tomato and Potato are supported in this version. More crops are added later.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop-photo">2. {t("disease.upload")}</Label>
                <input
                  ref={fileInputRef}
                  id="crop-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 w-full justify-center text-base"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {imageUrl ? "Choose a different photo" : t("disease.upload")}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Take a close photo of one affected leaf in good daylight.
                </p>
              </div>

              {status === "uploading" ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Adding your photo…
                </p>
              ) : null}

              {imageUrl ? (
                <div className="space-y-3">
                  <img
                    src={imageUrl}
                    alt="The crop photo you selected"
                    className="h-56 w-full rounded-md border border-border object-cover"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="h-12 flex-1 text-base"
                      onClick={handleAnalyse}
                      disabled={status === "analyzing"}
                    >
                      {status === "analyzing" ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t("disease.analyzing")}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          {t("disease.check")}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="h-12" onClick={handleReset}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Start again
                    </Button>
                  </div>
                </div>
              ) : null}

              {status === "error" ? (
                <ErrorState message={errorMessage ?? t("disease.error")} onRetry={handleReset} />
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div>
          {status === "result" && result ? (
            <DiseaseScanCard result={result} />
          ) : status === "analyzing" ? (
            <Card>
              <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                <p className="font-medium text-foreground">{t("disease.analyzing")}</p>
                <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              title="No result yet"
              description="Choose your crop, add a clear leaf photo, then press Check Crop. The result appears here."
              icon={<Camera className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
