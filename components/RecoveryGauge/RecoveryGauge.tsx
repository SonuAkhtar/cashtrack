"use client";

import { motion } from "framer-motion";
import styles from "./RecoveryGauge.module.css";

interface RecoveryGaugeProps {
  value: number;
  label?: string;
}

export const RecoveryGauge = ({ value, label = "Recovery Rate" }: RecoveryGaugeProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={styles.gauge_root}>
      <svg viewBox="0 0 140 140" width="140" height="140" className={styles.gauge_svg}>
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="var(--surface-3)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#gauge-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className={styles.gauge_center}>
        <span className={styles.gauge_value}>{Math.round(clamped)}%</span>
        <span className={styles.gauge_label}>{label}</span>
      </div>
    </div>
  );
};
