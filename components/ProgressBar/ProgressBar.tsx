"use client";

import { motion } from "framer-motion";
import classnames from "classnames";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  tone?: "primary" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  trackClassName?: string;
}

export const ProgressBar = ({
  value,
  tone = "primary",
  size = "md",
  trackClassName,
}: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={classnames(
        styles.progress_track,
        styles[`progress_track-${size}`],
        trackClassName,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <motion.div
        className={classnames(styles.progress_fill, styles[`progress_fill-${tone}`])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};
