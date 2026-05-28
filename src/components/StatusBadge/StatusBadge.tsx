"use client";

import { cn } from "@/utils/cn";
import { getStatusMeta } from "@/utils/ledger";
import type { LedgerStatus } from "@/types";
import styles from "./StatusBadge.module.scss";

interface StatusBadgeProps {
  status: LedgerStatus;
  size?: "sm" | "md";
  withDot?: boolean;
  className?: string;
}

export const StatusBadge = ({ status, size = "sm", withDot = true, className }: StatusBadgeProps) => {
  const meta = getStatusMeta(status);
  return (
    <span
      className={cn(styles.badge, styles[`badge--${status}`], styles[`badge--${size}`], className)}
    >
      {withDot && <span className={styles.badge__dot} />}
      {meta.label}
    </span>
  );
};
