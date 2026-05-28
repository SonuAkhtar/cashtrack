"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { useNetwork } from "@/providers/NetworkProvider";
import styles from "./OfflineBanner.module.scss";

export const OfflineBanner = () => {
  const online = useNetwork();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          className={styles.banner}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <Icon name="offline" size={16} />
          <span>You are offline. Changes are saved locally.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
