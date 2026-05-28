"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { useCurrency } from "@/hooks/useCurrency";
import { useUIStore } from "@/store/uiStore";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/useToast";
import { formatDate, dueLabel } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { Transaction } from "@/types";
import styles from "./TransactionItem.module.scss";

interface TransactionItemProps {
  transaction: Transaction;
  showTimeline?: boolean;
  isLast?: boolean;
}

export const TransactionItem = ({ transaction, showTimeline = true, isLast = false }: TransactionItemProps) => {
  const { format } = useCurrency();
  const openModal = useUIStore((s) => s.openModal);
  const remove = useDeleteTransaction();
  const toast = useToast();

  const isLend = transaction.type === "lend";

  const confirmDelete = () => {
    openModal({
      type: "confirm",
      title: "Delete transaction",
      message: "This will permanently remove this transaction and update the balance.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        await remove.mutateAsync(transaction.id);
        toast.success("Transaction deleted");
      },
    });
  };

  return (
    <motion.div
      className={styles.row}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      layout
    >
      {showTimeline && (
        <div className={styles.timeline}>
          <span className={cn(styles.dot, isLend ? styles["dot--lend"] : styles["dot--repay"])}>
            <Icon name={isLend ? "arrow-up" : "arrow-down"} size={13} />
          </span>
          {!isLast && <span className={styles.line} />}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.text}>
            <span className={styles.title}>
              {isLend ? "Money lent" : "Repayment"}
              {transaction.mode === "emi" && <span className={styles.badge}>EMI</span>}
              {transaction.mode === "partial" && <span className={styles.badge}>Partial</span>}
            </span>
            <span className={styles.date}>{formatDate(transaction.date)}</span>
          </div>
          <span className={cn(styles.amount, isLend ? styles["amount--lend"] : styles["amount--repay"])}>
            {isLend ? "+" : "−"}
            {format(transaction.amount)}
          </span>
          <div className={styles.actions}>
            <button
              className={styles.action}
              onClick={() => openModal({ type: "transaction", transactionId: transaction.id })}
              aria-label="Edit transaction"
            >
              <Icon name="edit" size={15} />
            </button>
            <button
              className={cn(styles.action, styles["action--danger"])}
              onClick={confirmDelete}
              aria-label="Delete transaction"
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        </div>

        {transaction.note && <p className={styles.note}>{transaction.note}</p>}

        {((transaction.dueDate && isLend) || transaction.schedule?.enabled) && (
          <div className={styles.footer}>
            {transaction.dueDate && isLend && (
              <span className={styles.due}>
                <Icon name="calendar" size={13} />
                {dueLabel(transaction.dueDate)}
              </span>
            )}
            {transaction.schedule?.enabled && (
              <span className={styles.schedule}>
                <Icon name="clock" size={13} />
                {transaction.schedule.installments}× {transaction.schedule.frequency}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
