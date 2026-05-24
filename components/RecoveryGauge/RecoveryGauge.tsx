"use client";

import { motion } from "framer-motion";
import styles from "./RecoveryGauge.module.css";

interface RecoveryGaugeProps {
  value: number;
  label?: string;
  size?: number;
}

export const RecoveryGauge = ({
  value,
  label = "Recovered",
  size = 104,
}: RecoveryGaugeProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 9;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={styles.gauge_root}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={styles.gauge_svg}
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary)" />
            <stop offset="100%" stopColor="var(--brand-primary-strong)" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--glass-border)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
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
