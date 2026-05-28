import type { Metadata } from "next";
import { EmiView } from "@/features/emi/EmiView/EmiView";

export const metadata: Metadata = { title: "EMI" };

export default function EmiPage() {
  return <EmiView />;
}
