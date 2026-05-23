import type { TransactionCategory, TransactionStatus } from "@/types";

export const statusLabels: Record<TransactionStatus, string> = {
  active: "Active",
  partial: "Partial",
  settled: "Settled",
  overdue: "Overdue",
};

export const categoryLabels: Record<TransactionCategory, string> = {
  personal: "Personal",
  business: "Business",
  family: "Family",
  emergency: "Emergency",
  other: "Other",
};

export const statusOrder: TransactionStatus[] = ["active", "partial", "overdue", "settled"];
export const categoryOrder: TransactionCategory[] = [
  "personal",
  "business",
  "family",
  "emergency",
  "other",
];
