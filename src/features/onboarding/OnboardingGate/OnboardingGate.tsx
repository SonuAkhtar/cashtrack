"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { Onboarding } from "@/features/onboarding/Onboarding/Onboarding";

export const OnboardingGate = ({ children }: { children: ReactNode }) => {
  const hydrated = useSettingsStore((s) => s.hydrated);
  const onboarded = useSettingsStore((s) => s.onboarded);

  return (
    <>
      {children}
      <AnimatePresence>{hydrated && !onboarded && <Onboarding key="onboarding" />}</AnimatePresence>
    </>
  );
};
