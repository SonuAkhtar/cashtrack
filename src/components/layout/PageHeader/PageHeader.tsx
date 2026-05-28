"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./PageHeader.module.scss";

export type HeaderTone =
  | "primary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface HeaderStat {
  label: string;
  value: string;
  icon?: IconName;
  tone?: HeaderTone;
}

interface PageHeaderProps {
  icon: IconName;
  tone?: HeaderTone;
  title: string;
  subtitle: string;
  stats?: HeaderStat[];
}

export const PageHeader = ({ icon, tone = "primary", title, subtitle, stats }: PageHeaderProps) => (
  <motion.div
    className={styles.header}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className={styles.lead}>
      <span className={styles.icon} data-tone={tone}>
        <Icon name={icon} size={24} strokeWidth={2} />
      </span>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>

    {stats && stats.length > 0 && (
      <div className={`${styles.stats} app-scroll`}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            {stat.icon && (
              <span className={styles.stat__icon} data-tone={stat.tone ?? "neutral"}>
                <Icon name={stat.icon} size={16} />
              </span>
            )}
            <span className={styles.stat__body}>
              <span className={styles.stat__value}>{stat.value}</span>
              <span className={styles.stat__label}>{stat.label}</span>
            </span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);
