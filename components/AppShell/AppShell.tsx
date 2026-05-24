"use client";

import { ReactNode } from "react";
import { BottomNavigation } from "@/components/BottomNavigation/BottomNavigation";
import { TopBar } from "@/components/TopBar/TopBar";
import { useThemeSync } from "@/hooks/useThemeSync";
import styles from "./AppShell.module.css";

export const AppShell = ({ children }: { children: ReactNode }) => {
  useThemeSync();

  return (
    <div className={styles.shell_root}>
      <div className={styles.shell_ambient} aria-hidden />
      <TopBar />
      <main className={styles.shell_main} id="main-content">
        <div className={styles.shell_page}>{children}</div>
      </main>
      <BottomNavigation />
    </div>
  );
};
