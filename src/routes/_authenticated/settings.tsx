import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { LanguageSelector } from "@/components/common/LanguageSelector";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { developmentAuthProvider } from "@/services/authService";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AgriPulse" },
      { name: "description", content: "Change your language, notification choices and sign out." },
      { property: "og:title", content: "Settings — AgriPulse" },
      { property: "og:description", content: "Language, notifications and account options." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await developmentAuthProvider.signOut();
    toast.success("Signed out");
    void navigate({ to: "/login", replace: true });
  }

  return (
    <div>
      <PageHeader title={t("settings.title")} description="Change how AgriPulse works for you." />

      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              AgriPulse is available in English and Kannada. More languages are added later.
            </p>
            <LanguageSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              These choices are saved in a later part of the project. They are shown here so the screen is
              complete.
            </p>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="notify-weather">Weather warnings</Label>
              <Switch id="notify-weather" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="notify-market">Market price changes</Label>
              <Switch id="notify-market" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="notify-advisory">Daily farm advice</Label>
              <Switch id="notify-advisory" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{user?.email}</span>
            </p>
            <Button variant="outline" className="h-12" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
