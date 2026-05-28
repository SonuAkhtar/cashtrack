import type { FilterKey, NavItem, SelectOption, SortKey } from "@/types";

export const APP_NAME = "CashTrack";
export const APP_DESCRIPTION = "Track money you lend and monitor repayments with elegance.";
export const APP_VERSION = "1.0.0";

export const DB_NAME = "cashtrack-db";
export const DB_VERSION = 1;

export const STORE_PEOPLE = "people";
export const STORE_TRANSACTIONS = "transactions";

export const AVATAR_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#0f9d7a",
  "#2563eb",
  "#d9485f",
  "#c58b11",
  "#0e7490",
  "#9333ea",
  "#475569",
] as const;

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/people", label: "People", icon: "people" },
  { href: "/transactions", label: "Activity", icon: "activity" },
  { href: "/emi", label: "EMI", icon: "emi" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export const SORT_OPTIONS: SelectOption<SortKey>[] = [
  { value: "recent", label: "Latest activity" },
  { value: "pending", label: "Pending amount" },
  { value: "overdue", label: "Overdue first" },
  { value: "percentage", label: "Repayment %" },
  { value: "name", label: "Name" },
];

export const FILTER_OPTIONS: SelectOption<FilterKey>[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Settled" },
  { value: "favorite", label: "Favorites" },
  { value: "archived", label: "History" },
];

export const REPAYMENT_FREQUENCIES: SelectOption<"weekly" | "biweekly" | "monthly">[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

export const QUICK_TAGS = ["Family", "Friend", "Business", "Colleague", "Emergency"];
