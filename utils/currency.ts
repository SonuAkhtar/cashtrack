import type { Currency } from "@/types";

export const DEFAULT_CURRENCY: Currency = "INR";
export const CURRENCY_SYMBOL = "₹";

export const getCurrencySymbol = (_code?: Currency): string => CURRENCY_SYMBOL;
