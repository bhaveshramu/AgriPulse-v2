import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md";
}

/** AgriPulse wordmark: a sprouting leaf paired with a steady pulse line. */
export function Logo({ className, showTagline = false, size = "md" }: LogoProps) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
          box,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M4 14.5c0-4.4 3.6-8 8-8h4v3.5c0 4.4-3.6 8-8 8H4v-3.5Z" strokeLinejoin="round" />
          <path d="M2 20.5h20" strokeLinecap="round" opacity="0.55" />
          <path d="M6 17.5 14 9" strokeLinecap="round" opacity="0.7" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display font-semibold tracking-tight text-foreground",
            size === "sm" ? "text-lg" : "text-xl",
          )}
        >
          AgriPulse
        </span>
        {showTagline ? (
          <span className="text-xs text-muted-foreground">Smart Farming. Better Decisions.</span>
        ) : null}
      </span>
    </span>
  );
}
