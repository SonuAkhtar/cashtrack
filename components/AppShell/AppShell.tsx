"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BottomNavigation } from "@/components/BottomNavigation/BottomNavigation";
import { TopBar } from "@/components/TopBar/TopBar";
import { useThemeSync } from "@/hooks/useThemeSync";
import styles from "./AppShell.module.css";

export const AppShell = ({ children }: { children: ReactNode }) => {
  useThemeSync();
  const pathname = usePathname();

  return (
    <div className={styles.shell_root}>
      <div className={styles.shell_ambient} aria-hidden />
      <TopBar />
      <main className={styles.shell_main} id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            className={styles.shell_page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNavigation />
    </div>
  );
};
