"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { seedSampleData } from "@/services/seedService";
import { queryKeys } from "@/services/queryKeys";

export const DataBootstrap = () => {
  const client = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    seedSampleData().then((seeded) => {
      if (seeded && !cancelled) {
        client.invalidateQueries({ queryKey: queryKeys.people });
        client.invalidateQueries({ queryKey: queryKeys.transactions });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [client]);

  return null;
};
