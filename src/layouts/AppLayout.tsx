import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, MapPin, ShieldCheck, User, X } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { farmerNavItems, mobileNavItems } from "@/config/navigation";
import { developmentAuthProvider } from "@/services/authService";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {farmerNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-[0.95rem] font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const t = useTranslation();
  const navigate = useNavigate();
  const { profile, hasRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const location = [profile?.district, profile?.state].filter(Boolean).join(", ");

  async function handleSignOut() {
    await developmentAuthProvider.signOut();
    await navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t("nav.menu")}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link to="/dashboard" className="shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {location ? (
              <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {location}
              </span>
            ) : null}
            <LanguageSelector compact />
            {hasRole("admin") ? (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/admin">
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  {t("nav.admin")}
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="icon" aria-label={t("nav.profile")}>
              <Link to="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[90rem]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar p-3 lg:block">
          <NavList />
          <Button variant="ghost" className="mt-3 w-full justify-start gap-3" onClick={handleSignOut}>
            <LogOut className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            {t("nav.logout")}
          </Button>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col overflow-y-auto bg-surface p-3 shadow-raised">
            <div className="mb-2 flex items-center justify-between px-1">
              <Logo size="sm" />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <NavList onNavigate={() => setIsMenuOpen(false)} />
            {hasRole("admin") ? (
              <Button asChild variant="outline" className="mt-3 justify-start">
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {t("nav.admin")}
                </Link>
              </Button>
            ) : null}
            <Button variant="ghost" className="mt-2 justify-start gap-3" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface lg:hidden"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[0.7rem] font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-center leading-tight">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
