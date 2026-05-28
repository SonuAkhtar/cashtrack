"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { AppBar } from "@/components/layout/AppBar/AppBar";
import { BottomNav } from "@/components/layout/BottomNav/BottomNav";
import { Fab } from "@/components/layout/Fab/Fab";
import { OfflineBanner } from "@/components/layout/OfflineBanner/OfflineBanner";
import { PullToRefresh } from "@/components/layout/PullToRefresh/PullToRefresh";
import { ModalHost } from "@/features/shared/ModalHost/ModalHost";
import { DataBootstrap } from "@/features/shared/DataBootstrap/DataBootstrap";
import { CommandPalette } from "@/features/command/CommandPalette/CommandPalette";
import { InstallPrompt } from "@/features/pwa/InstallPrompt/InstallPrompt";
import styles from "./AppShell.module.scss";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <OfflineBanner />
      <Sidebar />
      <main className={styles.main}>
        <AppBar />
        <PullToRefresh>
          <div className={styles.content}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </PullToRefresh>
      </main>
      <Fab />
      <BottomNav />
      <ModalHost />
      <CommandPalette />
      <InstallPrompt />
      <DataBootstrap />
    </div>
  );
};
