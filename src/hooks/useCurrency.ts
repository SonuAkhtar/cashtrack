"use client";

import { useCallback } from "react";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";

const CURRENCY = "INR";

export const useCurrency = () => {
  const format = useCallback(
    (amount: number, options?: { compact?: boolean; showSymbol?: boolean }) =>
      formatCurrency(amount, CURRENCY, options),
    []
  );

  return { currency: CURRENCY, symbol: getCurrencySymbol(CURRENCY), format };
};
