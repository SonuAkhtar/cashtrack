import classnames from "classnames";
import type { TransactionStatus } from "@/types";
import styles from "./Badge.module.css";

type BadgeTone = "neutral" | "success" | "info" | "warning" | "danger" | "violet";

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const statusToTone: Record<TransactionStatus, BadgeTone> = {
  active: "info",
  partial: "warning",
  settled: "success",
  overdue: "danger",
};

export const Badge = ({ tone = "neutral", children, className, dot = false }: BadgeProps) => (
  <span className={classnames(styles.badge_root, styles[`badge_root-${tone}`], className)}>
    {dot ? <span className={styles.badge_dot} aria-hidden /> : null}
    {children}
  </span>
);

export const statusBadgeTone = (status: TransactionStatus): BadgeTone => statusToTone[status];
