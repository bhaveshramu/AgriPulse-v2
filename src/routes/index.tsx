import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bug,
  CloudSun,
  IndianRupee,
  LifeBuoy,
  Sprout,
  Tractor,
  UserPlus,
} from "lucide-react";

import heroImage from "@/assets/hero-farmer.jpg";
import { Logo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriPulse — Smart Farming. Better Decisions." },
      {
        name: "description",
        content:
          "AI-powered agricultural guidance designed for Indian farmers: crop checks, market prices, weather advice, equipment rental and loan help.",
      },
      { property: "og:title", content: "AgriPulse — Smart Farming. Better Decisions." },
      {
        property: "og:description",
        content: "AI-powered agricultural guidance designed for Indian farmers.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Bug,
    title: "Crop Disease Detection",
    body: "Take a photo of an affected leaf and get guidance on what may be wrong and what to do next.",
  },
  {
    icon: IndianRupee,
    title: "Market Price Intelligence",
    body: "Compare prices across nearby markets and understand the trend before you sell.",
  },
  {
    icon: CloudSun,
    title: "Weather & Advisory",
    body: "Local weather with practical farm advice, so field work can be planned around the rain.",
  },
  {
    icon: Tractor,
    title: "Equipment Rental",
    body: "Find tractors, sprayers and harvesters available near your village and book by the hour.",
  },
  {
    icon: LifeBuoy,
    title: "Farmer Support",
    body: "Simple guidance in your own language, with loan help and government scheme information.",
  },
  {
    icon: Sprout,
    title: "Farm & Crop Records",
    body: "Keep farm details, crops and sowing dates in one place across every season.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create your farmer account",
    body: "Register with your mobile number, state and district. Choose English or Kannada.",
  },
  {
    number: "2",
    title: "Add your farm and crops",
    body: "Enter land area, soil type, irrigation and the crops you are growing this season.",
  },
  {
    number: "3",
    title: "Get advice you can act on",
    body: "Check crops, view market prices, follow weather advice and rent equipment when you need it.",
  },
];

function LandingPage() {
  const t = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="AgriPulse home">
            <Logo size="sm" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Site">
            <a href="#top" className="text-foreground hover:text-primary">
              {t("nav.home")}
            </a>
            <a href="#features" className="text-foreground hover:text-primary">
              {t("nav.features")}
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary">
              {t("nav.howItWorks")}
            </a>
            <a href="#about" className="text-foreground hover:text-primary">
              {t("nav.about")}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSelector compact />
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="border-b border-border bg-surface">
          <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="inline-flex rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                For Indian farmers
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Smart Farming. Better Decisions.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                AI-powered agricultural guidance designed for Indian farmers.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 text-base">
                  <Link to="/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 text-base">
                  <a href="#features">Explore Features</a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Available in English and Kannada. Works on any Android phone browser.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border shadow-card">
              <img
                src={heroImage}
                alt="A farmer checking tomato plants in the field while using a smartphone"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="features" className="container-page py-14 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-foreground">What AgriPulse offers</h2>
            <p className="mt-2 text-muted-foreground">
              One platform for the decisions a farmer makes every week.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="h-full">
                  <CardContent className="p-5">
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {feature.body}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="border-y border-border bg-surface py-14 lg:py-20">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold text-foreground">
              How AgriPulse Helps Farmers
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Three simple steps, in plain language, without any technical setup.
            </p>

            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number} className="rounded-lg border border-border bg-background p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-base font-semibold text-primary-foreground">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="container-page py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold text-foreground">About the project</h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground">
                AgriPulse is being built as an agricultural advisory platform for Indian farmers. The
                web application is the first part of the system; an Android application and a WhatsApp
                assistant are planned for later phases.
              </p>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground">
                This first version focuses on the farmer experience: clear screens, simple words, large
                buttons and one place for farm records. Crop disease detection, price forecasting and
                weather services are shown with clearly labelled demo data until the data services are
                connected.
              </p>
            </div>

            <Card>
              <CardContent className="space-y-3 p-6">
                <h3 className="font-display text-lg font-semibold text-foreground">Built for real fields</h3>
                <ul className="space-y-2 text-[0.95rem] text-muted-foreground">
                  <li>• Works on low-cost Android phones and slow connections</li>
                  <li>• English and Kannada, with more languages planned</li>
                  <li>• Simple words instead of technical terms</li>
                  <li>• Every farmer sees only their own farm records</li>
                </ul>
                <Button asChild className="mt-2 w-full">
                  <Link to="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-10">
        <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo showTagline size="sm" />
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary">
              How It Works
            </a>
            <a href="#about" className="hover:text-primary">
              About
            </a>
            <Link to="/login" className="hover:text-primary">
              Login
            </Link>
          </nav>
        </div>
        <div className="container-page mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
          AgriPulse — academic project, Part 1. Demo data is shown where live services are not yet connected.
        </div>
      </footer>
    </div>
  );
}
