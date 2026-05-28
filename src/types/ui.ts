export type ThemeMode = "light" | "dark" | "system";

export type SortKey = "pending" | "overdue" | "recent" | "percentage" | "name";

export type FilterKey = "all" | "active" | "overdue" | "completed" | "favorite" | "archived";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface CommandAction {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  group: "navigation" | "actions" | "people" | "settings";
  keywords?: string[];
  perform: () => void;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
}
