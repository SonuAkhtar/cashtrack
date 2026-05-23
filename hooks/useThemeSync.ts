"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export const useThemeSync = (): void => {
  const theme = usePreferencesStore((s) => s.theme);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
};
