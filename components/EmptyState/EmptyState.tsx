import { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className={styles.empty_root}>
    {icon ? <div className={styles.empty_icon}>{icon}</div> : null}
    <h3 className={styles.empty_title}>{title}</h3>
    {description ? <p className={styles.empty_description}>{description}</p> : null}
    {action ? <div className={styles.empty_action}>{action}</div> : null}
  </div>
);
