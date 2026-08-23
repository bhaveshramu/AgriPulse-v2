import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { FarmerProfileCard } from "@/components/cards/FarmerProfileCard";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/States";
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
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { DISTRICTS_BY_STATE, INDIAN_STATES } from "@/data/locations";
import { updateProfile } from "@/services/authService";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — AgriPulse" },
      { name: "description", content: "Update your name, mobile number, village and farming experience." },
      { property: "og:title", content: "My Profile — AgriPulse" },
      { property: "og:description", content: "Update your farmer profile details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const t = useTranslation();
  const { user, profile, isLoading, refreshProfile } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    mobile_number: "",
    state: INDIAN_STATES[0],
    district: "",
    village: "",
    farming_experience_years: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      mobile_number: profile.mobile_number ?? "",
      state: profile.state ?? INDIAN_STATES[0],
      district: profile.district ?? "",
      village: profile.village ?? "",
      farming_experience_years:
        profile.farming_experience_years === null ? "" : String(profile.farming_experience_years),
    });
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!form.full_name.trim()) throw new Error("Please enter your name.");
      if (form.mobile_number && !/^[6-9]\d{9}$/.test(form.mobile_number)) {
        throw new Error("Please enter a valid 10 digit mobile number.");
      }
      await updateProfile(user.id, {
        full_name: form.full_name.trim(),
        mobile_number: form.mobile_number.trim() || null,
        state: form.state,
        district: form.district || null,
        village: form.village.trim() || null,
        farming_experience_years: form.farming_experience_years
          ? Number(form.farming_experience_years)
          : null,
      });
      await refreshProfile();
    },
    onSuccess: () => toast.success("Profile saved"),
    onError: (error: Error) => toast.error(error.message || "Your profile could not be saved."),
  });

  const districts = DISTRICTS_BY_STATE[form.state] ?? [];

  return (
    <div>
      <PageHeader title={t("profile.title")} description="Your details help match advice to your area." />

      {isLoading ? (
        <LoadingState rows={3} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {profile ? <FarmerProfileCard profile={profile} /> : null}

          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="text-base">Edit details</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  save.mutate();
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    className="h-12"
                    value={form.full_name}
                    onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                    required
                    maxLength={80}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile">Mobile number</Label>
                  <Input
                    id="mobile"
                    className="h-12"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.mobile_number}
                    onChange={(event) => setForm({ ...form, mobile_number: event.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-state">State</Label>
                    <Select
                      value={form.state}
                      onValueChange={(value) =>
                        setForm({ ...form, state: value, district: (DISTRICTS_BY_STATE[value] ?? [""])[0] })
                      }
                    >
                      <SelectTrigger id="profile-state" className="h-12">
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
                    <Label htmlFor="profile-district">District</Label>
                    <Select
                      value={form.district}
                      onValueChange={(value) => setForm({ ...form, district: value })}
                    >
                      <SelectTrigger id="profile-district" className="h-12">
                        <SelectValue placeholder="Choose district" />
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="village">Village</Label>
                    <Input
                      id="village"
                      className="h-12"
                      value={form.village}
                      onChange={(event) => setForm({ ...form, village: event.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experience-years">Years of farming</Label>
                    <Input
                      id="experience-years"
                      className="h-12"
                      inputMode="numeric"
                      value={form.farming_experience_years}
                      onChange={(event) =>
                        setForm({ ...form, farming_experience_years: event.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full text-base" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Save profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
