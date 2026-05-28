"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/Button/Button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { APP_NAME } from "@/constants";
import styles from "./InstallPrompt.module.scss";

export const InstallPrompt = () => {
  const { canInstall, isIOS, dismissed, promptInstall, dismiss } = useInstallPrompt();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ((canInstall || isIOS) && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 2600);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [canInstall, isIOS, dismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) setVisible(false);
  };

  const handleDismiss = () => {
    dismiss();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.prompt}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <span className={styles.prompt__mark}>
            <Icon name="wallet" size={24} />
          </span>
          <div className={styles.prompt__text}>
            <strong>Install {APP_NAME}</strong>
            {isIOS ? (
              <span>
                Tap <Icon name="upload" size={13} className={styles.inline} /> then “Add to Home Screen”.
              </span>
            ) : (
              <span>Add to your home screen for a faster, native experience.</span>
            )}
          </div>
          <div className={styles.prompt__actions}>
            {!isIOS && (
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
            )}
            <button className={styles.close} onClick={handleDismiss} aria-label="Dismiss">
              <Icon name="close" size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
