import type { Metadata } from "next";
import { ActivityView } from "@/features/transactions/ActivityView/ActivityView";

export const metadata: Metadata = { title: "Activity" };

export default function TransactionsPage() {
  return <ActivityView />;
}
