export const themeTokens = {
  brand: {
    primary: "#34d399",
    primaryStrong: "#10b981",
    secondary: "#60a5fa",
    warning: "#fbbf24",
    danger: "#f87171",
    violet: "#a78bfa",
  },
  chart: {
    lent: "#60a5fa",
    recovered: "#34d399",
    pending: "#fbbf24",
    overdue: "#f87171",
    neutral: "#94a3b8",
    accent: "#a78bfa",
    gridDark: "rgba(255, 255, 255, 0.06)",
    gridLight: "rgba(15, 23, 42, 0.06)",
    axisDark: "#6e7689",
    axisLight: "#7e879b",
  },
  status: {
    active: "#60a5fa",
    partial: "#fbbf24",
    settled: "#34d399",
    overdue: "#f87171",
  },
  category: {
    personal: "#a78bfa",
    business: "#60a5fa",
    family: "#34d399",
    emergency: "#f87171",
    other: "#94a3b8",
  },
} as const;

export const fonts = {
  display: '"Sora", "Manrope", "Inter", system-ui, sans-serif',
  body: '"Inter", "Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const motion = {
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeSoft: [0.4, 0, 0.2, 1] as const,
  durationFast: 0.14,
  durationBase: 0.24,
  durationSlow: 0.42,
} as const;

export type ThemeMode = "light" | "dark";
