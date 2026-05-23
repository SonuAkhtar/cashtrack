import type { Currency } from "@/types";

const currencyFormatters = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (currency: Currency): Intl.NumberFormat => {
  const key = `${currency}`;
  let formatter = currencyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatters.set(key, formatter);
  }
  return formatter;
};

export const formatCurrency = (
  amount: number,
  currency: Currency = "INR",
): string => getCurrencyFormatter(currency).format(amount);

export const formatCompact = (amount: number, currency: Currency = "INR"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(amount);
};

export const formatPercent = (value: number): string =>
  `${Math.round(Math.max(0, Math.min(100, value)))}%`;

export const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
};
