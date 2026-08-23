import { Languages } from "lucide-react";

import { SUPPORTED_LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LanguageCode } from "@/types";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Language</span>
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
        <SelectTrigger className={compact ? "h-9 w-[110px]" : "h-11 w-[160px]"} aria-label="Choose language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
