import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/DashboardView/DashboardView";

export const metadata: Metadata = { title: "Overview" };

export default function HomePage() {
  return <DashboardView />;
}
