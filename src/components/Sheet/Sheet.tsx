"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import styles from "./Sheet.module.scss";

type SheetTone = "primary" | "accent" | "success" | "danger" | "warning" | "info";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: IconName;
  tone?: SheetTone;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Sheet = ({ open, onClose, title, description, icon, tone = "primary", children, footer, size = "md" }: SheetProps) => {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const panelVariants = isDesktop
    ? { hidden: { opacity: 0, scale: 0.96, y: 12 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 12 } }
    : { hidden: { y: "100%" }, visible: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.root}>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={`${styles.panel} ${styles[`panel--${size}`]}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 32, stiffness: 360 }}
            drag={isDesktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
          >
            <div className={styles.grabber} />
            {(title || description || icon) && (
              <header className={styles.header}>
                {icon && (
                  <span className={styles.headerIcon} data-tone={tone}>
                    <Icon name={icon} size={22} strokeWidth={2} />
                  </span>
                )}
                <div className={styles.header__text}>
                  {title && <h2 className={styles.title}>{title}</h2>}
                  {description && <p className={styles.description}>{description}</p>}
                </div>
                <button className={styles.close} onClick={onClose} aria-label="Close">
                  <Icon name="close" size={20} />
                </button>
              </header>
            )}
            <div className={`${styles.body} app-scroll`}>{children}</div>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
