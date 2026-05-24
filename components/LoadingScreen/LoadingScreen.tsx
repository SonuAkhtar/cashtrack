"use client";

import { motion } from "framer-motion";
import { HiOutlineBanknotes } from "react-icons/hi2";
import classnames from "classnames";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  label?: string;
  compact?: boolean;
}

export const LoadingScreen = ({
  label = "Loading",
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
    <div className={styles.loading_stage}>
      <motion.div
        className={styles.loading_ring}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
        aria-hidden
      />
      <motion.div
        className={styles.loading_chip}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], repeat: Infinity }}
        aria-hidden
      >
        <HiOutlineBanknotes />
      </motion.div>
    </div>

    <div className={styles.loading_text}>
      <span className={styles.loading_brand}>CashTrack</span>
      <motion.span
        className={styles.loading_label}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
      >
        {label}
      </motion.span>
    </div>

    <span className={styles.loading_srOnly}>{label}</span>
  </div>
);
