"use client";

import { Sheet } from "@/components/Sheet/Sheet";
import { Button } from "@/components/Button/Button";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Sheet open={open} onClose={onClose} size="sm">
    <div className={styles.dialog}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Sheet>
);
