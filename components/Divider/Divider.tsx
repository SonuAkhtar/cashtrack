import classnames from "classnames";
import styles from "./Divider.module.css";

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider = ({ label, className }: DividerProps) =>
  label ? (
    <div className={classnames(styles.divider_root, styles["divider_root-labeled"], className)}>
      <span className={styles.divider_line} aria-hidden />
      <span className={styles.divider_label}>{label}</span>
      <span className={styles.divider_line} aria-hidden />
    </div>
  ) : (
    <hr className={classnames(styles.divider_root, className)} />
  );
