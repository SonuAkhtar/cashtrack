const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
};

export const getCurrencySymbol = (currency: string): string =>
  currencySymbols[currency] ?? currency;

export const formatCurrency = (
  amount: number,
  currency = "USD",
  options: { compact?: boolean; showSymbol?: boolean } = {}
): string => {
  const { compact = false, showSymbol = true } = options;
  const formatter = new Intl.NumberFormat("en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const formatCompact = (value: number): string =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const initialsFromName = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const parseAmount = (input: string): number => {
  const cleaned = input.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
};
