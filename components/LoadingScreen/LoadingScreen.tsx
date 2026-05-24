"use client";

import { HiOutlineDocumentText, HiOutlineLockClosed } from "react-icons/hi2";
import classnames from "classnames";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  label?: string;
  compact?: boolean;
}

export const LoadingScreen = ({
  label = "Secure Community Ledger",
  compact = false,
}: LoadingScreenProps) => (
  <div
    className={classnames(styles.loading_root, {
      [styles["loading_root-compact"]]: compact,
    })}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className={styles.loading_iconChip} aria-hidden>
      <HiOutlineDocumentText />
    </div>

    <div className={styles.loading_text}>
      <span className={styles.loading_brand}>CashTrack</span>
      <span className={styles.loading_eyebrow}>Community Finance</span>
    </div>

    {!compact ? (
      <div className={styles.loading_footer}>
        <span className={styles.loading_footerRule} aria-hidden />
        <span className={styles.loading_footerText}>
          <HiOutlineLockClosed aria-hidden />
          {label}
        </span>
      </div>
    ) : null}

    <span className={styles.loading_srOnly}>{label}</span>
  </div>
);
