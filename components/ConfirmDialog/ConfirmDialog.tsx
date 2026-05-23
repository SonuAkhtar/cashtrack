"use client";

import { Modal } from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={tone} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  />
);
