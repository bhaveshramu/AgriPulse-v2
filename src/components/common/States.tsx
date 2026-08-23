import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/contexts/LanguageContext";

export function LoadingState({ message, rows = 3 }: { message?: string; rows?: number }) {
  const t = useTranslation();
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        {message ?? t("common.loading")}
      </p>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
      </span>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const t = useTranslation();
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-2 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        {message ?? t("common.loading")}
      </p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("common.tryAgain")}
        </Button>
      ) : null}
    </div>
  );
}
