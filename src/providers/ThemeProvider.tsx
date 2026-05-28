"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import type { ThemeMode } from "@/types";

interface ThemeContextValue {
  theme: ThemeMode;
  resolved: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "system") {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
};

const applyTheme = (resolved: "light" | "dark") => {
  const root = document.documentElement;
  root.dataset.theme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "dark" ? "#0b1020" : "#f5f7fa");
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useSettingsStore((s) => s.theme);
  const setStoreTheme = useSettingsStore((s) => s.setTheme);
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const next = resolveTheme(theme);
    setResolved(next);
    applyTheme(next);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const next = resolveTheme("system");
      setResolved(next);
      applyTheme(next);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => setStoreTheme(mode), [setStoreTheme]);

  const toggle = useCallback(() => {
    setStoreTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setStoreTheme]);

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
