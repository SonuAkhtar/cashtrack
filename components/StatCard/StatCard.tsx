"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import classnames from "classnames";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "primary" | "info" | "warning" | "danger" | "violet" | "neutral";
  trend?: { value: number; label?: string };
  delay?: number;
}

export const StatCard = ({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  trend,
  delay = 0,
}: StatCardProps) => (
  <motion.div
    className={classnames(styles.stat_root, styles[`stat_root-${tone}`])}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
  >
    <div className={styles.stat_header}>
      <span className={styles.stat_label}>{label}</span>
      {icon ? <span className={styles.stat_icon}>{icon}</span> : null}
    </div>
    <div className={styles.stat_value}>{value}</div>
    {(hint || trend) && (
      <div className={styles.stat_footer}>
        {trend ? (
          <span
            className={classnames(styles.stat_trend, {
              [styles["stat_trend-up"]]: trend.value >= 0,
              [styles["stat_trend-down"]]: trend.value < 0,
            })}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className={styles.stat_hint}>{hint}</span> : null}
      </div>
    )}
  </motion.div>
);
