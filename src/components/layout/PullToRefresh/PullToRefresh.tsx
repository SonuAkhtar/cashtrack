"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, type ReactNode } from "react";
import { Icon } from "@/components/Icon/Icon";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import styles from "./PullToRefresh.module.scss";

export const PullToRefresh = ({ children }: { children: ReactNode }) => {
  const client = useQueryClient();
  const isDesktop = useIsDesktop();

  const onRefresh = useCallback(async () => {
    await client.refetchQueries({ type: "active" });
    await new Promise((r) => setTimeout(r, 450));
  }, [client]);

  const { pull, refreshing, progress } = usePullToRefresh({ onRefresh, enabled: !isDesktop });

  return (
    <div className={styles.wrap}>
      <div className={styles.indicator} style={{ height: pull, opacity: progress }}>
        <motion.span
          animate={{ rotate: refreshing ? 360 : progress * 270 }}
          transition={refreshing ? { repeat: Infinity, duration: 0.7, ease: "linear" } : { duration: 0.1 }}
          className={styles.indicator__icon}
        >
          <Icon name="refresh" size={20} />
        </motion.span>
      </div>
      <motion.div animate={{ y: refreshing ? 40 : pull * 0.4 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
        {children}
      </motion.div>
    </div>
  );
};
