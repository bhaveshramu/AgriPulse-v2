import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/LanguageContext";
import { developmentAuthProvider } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — AgriPulse" },
      { name: "description", content: "Log in to your AgriPulse farmer account." },
      { property: "og:title", content: "Log in — AgriPulse" },
      { property: "og:description", content: "Log in to your AgriPulse farmer account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await developmentAuthProvider.signIn(email.trim(), password);
      toast.success("Logged in");
      await navigate({ to: "/dashboard", replace: true });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not log in";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container-page flex h-16 items-center">
          <Link to="/" aria-label="AgriPulse home">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t("auth.loginTitle")}</CardTitle>
            <CardDescription>Use the email and password you registered with.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error ? (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
                {isSubmitting ? t("common.loading") : t("auth.login")}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
