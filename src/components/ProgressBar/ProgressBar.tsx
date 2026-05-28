"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { clampNumber } from "@/utils/format";
import type { LedgerStatus } from "@/types";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value: number;
  status?: LedgerStatus;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar = ({
  value,
  status = "partial",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) => {
  const pct = clampNumber(value, 0, 100);
  return (
    <div className={cn(styles.wrap, className)}>
      <div className={cn(styles.track, styles[`track--${size}`])}>
        <motion.span
          className={cn(styles.fill, styles[`fill--${status}`])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showLabel && <span className={styles.label}>{Math.round(pct)}%</span>}
    </div>
  );
};
