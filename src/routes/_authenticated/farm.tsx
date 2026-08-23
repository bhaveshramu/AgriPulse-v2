import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sprout, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CropCard } from "@/components/cards/CropCard";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  CROP_OPTIONS,
  DISTRICTS_BY_STATE,
  GROWTH_STAGES,
  INDIAN_STATES,
  IRRIGATION_TYPES,
  LAND_UNITS,
  SOIL_TYPES,
} from "@/data/locations";
import {
  createCrop,
  createFarm,
  deleteCrop,
  deleteFarm,
  listCrops,
  listFarms,
} from "@/services/farmService";

export const Route = createFileRoute("/_authenticated/farm")({
  head: () => ({
    meta: [
      { title: "My Farm — AgriPulse" },
      { name: "description", content: "Record your farm land, soil, irrigation and the crops you grow." },
      { property: "og:title", content: "My Farm — AgriPulse" },
      { property: "og:description", content: "Record your farm land and crops." },
    ],
  }),
  component: FarmPage,
});

function FarmPage() {
  const t = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [farmOpen, setFarmOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  const farmsQuery = useQuery({ queryKey: ["farms"], queryFn: listFarms });
  const cropsQuery = useQuery({ queryKey: ["crops"], queryFn: listCrops });

  const [farmForm, setFarmForm] = useState({
    name: "",
    state: INDIAN_STATES[0],
    district: (DISTRICTS_BY_STATE[INDIAN_STATES[0]] ?? [""])[0],
    village: "",
    land_area: "",
    land_unit: LAND_UNITS[0],
    soil_type: SOIL_TYPES[0],
    irrigation_type: IRRIGATION_TYPES[0],
  });

  const [cropForm, setCropForm] = useState({
    farm_id: "",
    name: CROP_OPTIONS[0],
    variety: "",
    sowing_date: "",
    expected_harvest_date: "",
    area: "",
    growth_stage: GROWTH_STAGES[0],
  });

  const addFarm = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!farmForm.name.trim()) throw new Error("Please enter a name for your farm.");
      await createFarm(user.id, {
        name: farmForm.name.trim(),
        state: farmForm.state,
        district: farmForm.district,
        village: farmForm.village.trim() || null,
        land_area: farmForm.land_area ? Number(farmForm.land_area) : null,
        land_unit: farmForm.land_unit,
        soil_type: farmForm.soil_type,
        irrigation_type: farmForm.irrigation_type,
      });
    },
    onSuccess: () => {
      toast.success("Farm saved");
      setFarmOpen(false);
      setFarmForm((prev) => ({ ...prev, name: "", village: "", land_area: "" }));
      void queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
    onError: (error: Error) => toast.error(error.message || "Your farm could not be saved."),
  });

  const removeFarm = useMutation({
    mutationFn: (id: string) => deleteFarm(id),
    onSuccess: () => {
      toast.success("Farm removed");
      void queryClient.invalidateQueries({ queryKey: ["farms"] });
      void queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: () => toast.error("The farm could not be removed."),
  });

  const addCrop = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!cropForm.farm_id) throw new Error("Please choose which farm this crop is on.");
      await createCrop(user.id, {
        farm_id: cropForm.farm_id,
        name: cropForm.name,
        variety: cropForm.variety.trim() || null,
        sowing_date: cropForm.sowing_date || null,
        expected_harvest_date: cropForm.expected_harvest_date || null,
        area: cropForm.area ? Number(cropForm.area) : null,
        growth_stage: cropForm.growth_stage,
        health_status: "healthy",
      });
    },
    onSuccess: () => {
      toast.success("Crop added");
      setCropOpen(false);
      setCropForm((prev) => ({ ...prev, variety: "", sowing_date: "", expected_harvest_date: "", area: "" }));
      void queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: (error: Error) => toast.error(error.message || "The crop could not be added."),
  });

  const removeCrop = useMutation({
    mutationFn: (id: string) => deleteCrop(id),
    onSuccess: () => {
      toast.success("Crop removed");
      void queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: () => toast.error("The crop could not be removed."),
  });

  const farms = farmsQuery.data ?? [];
  const districts = DISTRICTS_BY_STATE[farmForm.state] ?? [];

  return (
    <div>
      <PageHeader
        title={t("farm.title")}
        description={t("farm.subtitle")}
        actions={
          <Dialog open={farmOpen} onOpenChange={setFarmOpen}>
            <DialogTrigger asChild>
              <Button>{t("farm.addFarm")}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("farm.addFarm")}</DialogTitle>
                <DialogDescription>
                  These details help match weather and crop advice to your land.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="farm-name">Farm name</Label>
                  <Input
                    id="farm-name"
                    className="h-12"
                    value={farmForm.name}
                    onChange={(event) => setFarmForm({ ...farmForm, name: event.target.value })}
                    placeholder="For example: Home field"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="farm-state">State</Label>
                    <Select
                      value={farmForm.state}
                      onValueChange={(value) =>
                        setFarmForm({
                          ...farmForm,
                          state: value,
                          district: (DISTRICTS_BY_STATE[value] ?? [""])[0],
                        })
                      }
                    >
                      <SelectTrigger id="farm-state" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="farm-district">District</Label>
                    <Select
                      value={farmForm.district}
                      onValueChange={(value) => setFarmForm({ ...farmForm, district: value })}
                    >
                      <SelectTrigger id="farm-district" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="farm-village">Village</Label>
                  <Input
                    id="farm-village"
                    className="h-12"
                    value={farmForm.village}
                    onChange={(event) => setFarmForm({ ...farmForm, village: event.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="farm-area">Land area</Label>
                    <Input
                      id="farm-area"
                      className="h-12"
                      inputMode="decimal"
                      value={farmForm.land_area}
                      onChange={(event) => setFarmForm({ ...farmForm, land_area: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="farm-unit">Unit</Label>
                    <Select
                      value={farmForm.land_unit}
                      onValueChange={(value) => setFarmForm({ ...farmForm, land_unit: value })}
                    >
                      <SelectTrigger id="farm-unit" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAND_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="farm-soil">Soil type</Label>
                    <Select
                      value={farmForm.soil_type}
                      onValueChange={(value) => setFarmForm({ ...farmForm, soil_type: value })}
                    >
                      <SelectTrigger id="farm-soil" className="h-12">
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
                    <Label htmlFor="farm-irrigation">Irrigation</Label>
                    <Select
                      value={farmForm.irrigation_type}
                      onValueChange={(value) => setFarmForm({ ...farmForm, irrigation_type: value })}
                    >
                      <SelectTrigger id="farm-irrigation" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IRRIGATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="h-12 w-full text-base"
                  onClick={() => addFarm.mutate()}
                  disabled={addFarm.isPending}
                >
                  {addFarm.isPending ? "Saving…" : "Save farm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-8">
        <section aria-labelledby="farms-heading">
          <h2 id="farms-heading" className="mb-3 font-display text-lg font-semibold">
            Farms
          </h2>

          {farmsQuery.isPending ? (
            <LoadingState rows={2} />
          ) : farmsQuery.isError ? (
            <ErrorState message="Your farms could not be loaded." onRetry={() => farmsQuery.refetch()} />
          ) : farms.length === 0 ? (
            <EmptyState
              title="No farm added yet"
              description="Add your farm so weather and crop advice can match your land."
              icon={<Sprout className="h-5 w-5" />}
              action={<Button onClick={() => setFarmOpen(true)}>{t("farm.addFarm")}</Button>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {farms.map((farm) => (
                <Card key={farm.id}>
                  <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                    <div>
                      <CardTitle className="text-base">{farm.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[farm.village, farm.district, farm.state].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${farm.name}`}
                      onClick={() => removeFarm.mutate(farm.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Land area</p>
                      <p className="font-medium text-foreground">
                        {farm.land_area ?? "—"} {farm.land_unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Soil</p>
                      <p className="font-medium text-foreground">{farm.soil_type ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Irrigation</p>
                      <p className="font-medium text-foreground">{farm.irrigation_type ?? "—"}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="crops-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="crops-heading" className="font-display text-lg font-semibold">
              Crops
            </h2>

            <Dialog open={cropOpen} onOpenChange={setCropOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={farms.length === 0}>
                  {t("farm.addCrop")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("farm.addCrop")}</DialogTitle>
                  <DialogDescription>Tell us what you are growing and when you sowed it.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="crop-farm">Farm</Label>
                    <Select
                      value={cropForm.farm_id}
                      onValueChange={(value) => setCropForm({ ...cropForm, farm_id: value })}
                    >
                      <SelectTrigger id="crop-farm" className="h-12">
                        <SelectValue placeholder="Choose a farm" />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.id}>
                            {farm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-name">Crop</Label>
                      <Select
                        value={cropForm.name}
                        onValueChange={(value) => setCropForm({ ...cropForm, name: value })}
                      >
                        <SelectTrigger id="crop-name" className="h-12">
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

                    <div className="space-y-1.5">
                      <Label htmlFor="crop-variety">Variety</Label>
                      <Input
                        id="crop-variety"
                        className="h-12"
                        value={cropForm.variety}
                        onChange={(event) => setCropForm({ ...cropForm, variety: event.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-sowing">Sowing date</Label>
                      <Input
                        id="crop-sowing"
                        type="date"
                        className="h-12"
                        value={cropForm.sowing_date}
                        onChange={(event) => setCropForm({ ...cropForm, sowing_date: event.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-harvest">Expected harvest</Label>
                      <Input
                        id="crop-harvest"
                        type="date"
                        className="h-12"
                        value={cropForm.expected_harvest_date}
                        onChange={(event) =>
                          setCropForm({ ...cropForm, expected_harvest_date: event.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-area">Area (acre)</Label>
                      <Input
                        id="crop-area"
                        className="h-12"
                        inputMode="decimal"
                        value={cropForm.area}
                        onChange={(event) => setCropForm({ ...cropForm, area: event.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-stage">Growth stage</Label>
                      <Select
                        value={cropForm.growth_stage}
                        onValueChange={(value) => setCropForm({ ...cropForm, growth_stage: value })}
                      >
                        <SelectTrigger id="crop-stage" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GROWTH_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    className="h-12 w-full text-base"
                    onClick={() => addCrop.mutate()}
                    disabled={addCrop.isPending}
                  >
                    {addCrop.isPending ? "Saving…" : "Save crop"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {cropsQuery.isPending ? (
            <LoadingState rows={2} />
          ) : cropsQuery.isError ? (
            <ErrorState message="Your crops could not be loaded." onRetry={() => cropsQuery.refetch()} />
          ) : (cropsQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="No crops added yet"
              description={
                farms.length === 0
                  ? "Add a farm first, then add the crops growing on it."
                  : "Add the crops you are growing to get matching advice."
              }
              icon={<Sprout className="h-5 w-5" />}
            />
          ) : (
            <ul className="space-y-3">
              {(cropsQuery.data ?? []).map((crop) => (
                <li key={crop.id}>
                  <CropCard
                    crop={crop}
                    action={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${crop.name}`}
                        onClick={() => removeCrop.mutate(crop.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
