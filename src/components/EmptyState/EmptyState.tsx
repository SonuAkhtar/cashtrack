"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    className={styles.empty}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className={styles.empty__icon}>
      <Icon name={icon} size={30} />
    </span>
    <h3 className={styles.empty__title}>{title}</h3>
    {description && <p className={styles.empty__description}>{description}</p>}
    {action && <div className={styles.empty__action}>{action}</div>}
  </motion.div>
);
