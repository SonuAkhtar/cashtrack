"use client";

import { useEffect } from "react";
import { ActivityView } from "@/features/transactions/ActivityView/ActivityView";
import { useUIStore } from "@/store/uiStore";

export default function NewTransactionPage() {
  const openModal = useUIStore((s) => s.openModal);

  useEffect(() => {
    openModal({ type: "transaction" });
  }, [openModal]);

  return <ActivityView />;
}
