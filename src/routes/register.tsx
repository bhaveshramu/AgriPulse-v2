import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS_BY_STATE, INDIAN_STATES } from "@/data/locations";
import { SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { developmentAuthProvider } from "@/services/authService";
import type { LanguageCode } from "@/types";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your farmer account — AgriPulse" },
      {
        name: "description",
        content: "Register on AgriPulse to manage your farm, check crops and follow market prices.",
      },
      { property: "og:title", content: "Create your farmer account — AgriPulse" },
      { property: "og:description", content: "Register on AgriPulse to manage your farm and crops." },
    ],
  }),
  component: RegisterPage,
});

const registrationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(100),
    mobileNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
    email: z.string().trim().email("Enter a valid email address").max(255),
    state: z.string().min(1, "Please choose your state"),
    district: z.string().min(1, "Please choose your district"),
    preferredLanguage: z.enum(["en", "kn"]),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Both passwords must match",
    path: ["confirmPassword"],
  });

type FormState = z.input<typeof registrationSchema>;

const initialState: FormState = {
  fullName: "",
  mobileNumber: "",
  email: "",
  state: "",
  district: "",
  preferredLanguage: "en",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const { needsEmailConfirmation } = await developmentAuthProvider.signUp({
        fullName: parsed.data.fullName,
        mobileNumber: parsed.data.mobileNumber,
        email: parsed.data.email,
        state: parsed.data.state,
        district: parsed.data.district,
        preferredLanguage: parsed.data.preferredLanguage as LanguageCode,
        password: parsed.data.password,
      });

      if (needsEmailConfirmation) {
        toast.success("Account created. Please check your email to confirm it, then log in.");
        await navigate({ to: "/login" });
        return;
      }

      toast.success("Welcome to AgriPulse");
      await navigate({ to: "/dashboard", replace: true });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not create the account";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const districts = DISTRICTS_BY_STATE[form.state] ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container-page flex h-16 items-center">
          <Link to="/" aria-label="AgriPulse home">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t("auth.registerTitle")}</CardTitle>
            <CardDescription>
              Your details stay private. Only you can see your farm records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
              <Field label={t("auth.fullName")} htmlFor="fullName" error={errors.fullName}>
                <Input
                  id="fullName"
                  className="h-12"
                  value={form.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  autoComplete="name"
                />
              </Field>

              <Field label={t("auth.mobile")} htmlFor="mobileNumber" error={errors.mobileNumber}>
                <Input
                  id="mobileNumber"
                  className="h-12"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobileNumber}
                  onChange={(event) => update("mobileNumber", event.target.value)}
                  autoComplete="tel-national"
                />
              </Field>

              <Field label={t("auth.email")} htmlFor="email" error={errors.email} hint="Used to log in">
                <Input
                  id="email"
                  type="email"
                  className="h-12"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  autoComplete="email"
                />
              </Field>

              <Field label={t("auth.preferredLanguage")} htmlFor="language">
                <Select
                  value={form.preferredLanguage}
                  onValueChange={(value) => update("preferredLanguage", value as LanguageCode)}
                >
                  <SelectTrigger id="language" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label={t("auth.state")} htmlFor="state" error={errors.state}>
                <Select
                  value={form.state}
                  onValueChange={(value) => {
                    update("state", value);
                    update("district", "");
                  }}
                >
                  <SelectTrigger id="state" className="h-12">
                    <SelectValue placeholder="Choose state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label={t("auth.district")} htmlFor="district" error={errors.district}>
                {districts.length > 0 ? (
                  <Select value={form.district} onValueChange={(value) => update("district", value)}>
                    <SelectTrigger id="district" className="h-12">
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
                ) : (
                  <Input
                    id="district"
                    className="h-12"
                    placeholder="Enter your district"
                    value={form.district}
                    onChange={(event) => update("district", event.target.value)}
                  />
                )}
              </Field>

              <Field label={t("auth.password")} htmlFor="password" error={errors.password}>
                <Input
                  id="password"
                  type="password"
                  className="h-12"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  autoComplete="new-password"
                />
              </Field>

              <Field label={t("auth.confirmPassword")} htmlFor="confirmPassword" error={errors.confirmPassword}>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="h-12"
                  value={form.confirmPassword}
                  onChange={(event) => update("confirmPassword", event.target.value)}
                  autoComplete="new-password"
                />
              </Field>

              {errors.form ? (
                <p
                  role="alert"
                  className="sm:col-span-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm"
                >
                  {errors.form}
                </p>
              ) : null}

              <div className="sm:col-span-2">
                <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
                  {isSubmitting ? t("common.loading") : t("auth.register")}
                </Button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {t("auth.haveAccount")}{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                {t("auth.login")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
