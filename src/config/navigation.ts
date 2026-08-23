import {
  Bug,
  CloudSun,
  Home,
  IndianRupee,
  Landmark,
  Leaf,
  Settings,
  Sprout,
  Tractor,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { TranslationKey } from "@/translations/en";
import type { UserRole } from "@/types";

export interface NavItem {
  to: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  roles?: UserRole[];
}

export const farmerNavItems: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: Home },
  { to: "/disease-detection", labelKey: "nav.disease", icon: Bug },
  { to: "/market", labelKey: "nav.market", icon: IndianRupee },
  { to: "/weather", labelKey: "nav.weather", icon: CloudSun },
  { to: "/equipment", labelKey: "nav.equipment", icon: Tractor },
  { to: "/advisory", labelKey: "nav.advisory", icon: Leaf },
  { to: "/farm", labelKey: "nav.farm", icon: Sprout },
  { to: "/loan-advisor", labelKey: "nav.loan", icon: Landmark },
  { to: "/profile", labelKey: "nav.profile", icon: User },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];

/** Shown in the bottom bar on phones: the five most used actions. */
export const mobileNavItems: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: Home },
  { to: "/disease-detection", labelKey: "nav.disease", icon: Bug },
  { to: "/market", labelKey: "nav.market", icon: IndianRupee },
  { to: "/weather", labelKey: "nav.weather", icon: CloudSun },
  { to: "/equipment", labelKey: "nav.equipment", icon: Tractor },
];

export const adminNavItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/disease", label: "Disease Analytics" },
  { to: "/admin/equipment", label: "Equipment" },
  { to: "/admin/market", label: "Market Analytics" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
];
