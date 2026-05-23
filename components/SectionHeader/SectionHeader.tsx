import { ReactNode } from "react";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className={styles.section_root}>
    <div className={styles.section_text}>
      <h2 className={styles.section_title}>{title}</h2>
      {subtitle ? <p className={styles.section_subtitle}>{subtitle}</p> : null}
    </div>
    {action ? <div className={styles.section_action}>{action}</div> : null}
  </div>
);
