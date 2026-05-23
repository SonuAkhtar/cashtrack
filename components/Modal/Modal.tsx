"use client";

import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md";
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.modal_root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden={!open}
        >
          <motion.div
            className={styles.modal_overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`${styles.modal_panel} ${styles[`modal_panel-${size}`]}`}
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.modal_header}>
              <div className={styles.modal_titleGroup}>
                {title ? <h2 className={styles.modal_title}>{title}</h2> : null}
                {description ? (
                  <p className={styles.modal_description}>{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className={styles.modal_close}
                aria-label="Close"
                onClick={onClose}
              >
                <HiOutlineXMark aria-hidden />
              </button>
            </div>
            <div className={styles.modal_body}>{children}</div>
            {footer ? <div className={styles.modal_footer}>{footer}</div> : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
