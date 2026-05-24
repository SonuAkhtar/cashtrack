"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineBellAlert,
  HiOutlineBriefcase,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineEllipsisHorizontalCircle,
  HiOutlineHome,
  HiOutlineLifebuoy,
  HiOutlineSquares2X2,
  HiOutlineUser,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { Avatar } from "@/components/Avatar/Avatar";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { formatCurrency } from "@/utils/format";
import { formatDate } from "@/utils/date";
import { categoryLabels, statusLabels } from "@/lib/constants";
import type { TransactionCategory, TransactionStatus } from "@/types";
import styles from "./TransactionDetailView.module.css";

interface TransactionDetailViewProps {
  transactionId: string;
}

const categoryIcon: Record<TransactionCategory, IconType> = {
  personal: HiOutlineUser,
  business: HiOutlineBriefcase,
  family: HiOutlineHome,
  emergency: HiOutlineLifebuoy,
  other: HiOutlineSquares2X2,
};

const statusBgClass: Record<TransactionStatus, string> = {
  active: "tx_statusPill-active",
  partial: "tx_statusPill-partial",
  settled: "tx_statusPill-settled",
  overdue: "tx_statusPill-overdue",
};

export const TransactionDetailView = ({ transactionId }: TransactionDetailViewProps) => {
  const router = useRouter();
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const repayments = useLedgerStore((s) => s.repayments);
  const updateTransaction = useLedgerStore((s) => s.updateTransaction);
  const deleteTransaction = useLedgerStore((s) => s.deleteTransaction);
  const currency = usePreferencesStore((s) => s.currency);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const transaction = transactions.find((t) => t.id === transactionId);
  const borrower = borrowers.find((b) => b.id === transaction?.borrowerId);

  const txRepayments = useMemo(
    () =>
      repayments
        .filter((r) => r.transactionId === transactionId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [repayments, transactionId],
  );

  if (!transaction || !borrower) {
    return (
      <EmptyState
        title="Transaction not found"
        description="This entry may have been deleted."
        action={<Button onClick={() => router.push("/")}>Back to dashboard</Button>}
      />
    );
  }

  const handleMarkPaid = () => {
    updateTransaction(transactionId, {
      recovered: transaction.amount,
      status: "settled",
    });
  };

  const handleDelete = () => {
    deleteTransaction(transactionId);
    setConfirmOpen(false);
    router.push("/transactions");
  };

  const isSettled = transaction.status === "settled";

  const timeline: { label: string; date: string; tone: "done" | "active" | "pending" }[] = [
    {
      label: "Request Sent",
      date: formatDate(transaction.transactionDate, "MMM d, h:mm a"),
      tone: "done",
    },
    txRepayments.length > 0
      ? {
          label: "Payment Processing",
          date: formatDate(txRepayments[txRepayments.length - 1].date, "MMM d, h:mm a"),
          tone: isSettled ? "done" : "active",
        }
      : {
          label: "Payment Processing",
          date: "Not yet started",
          tone: "pending",
        },
    {
      label: "Completed",
      date: isSettled ? formatDate(transaction.updatedAt, "MMM d, h:mm a") : "Awaiting confirmation",
      tone: isSettled ? "done" : "pending",
    },
  ];

  return (
    <div className={styles.tx_root}>
      <section className={styles.tx_heroBlock}>
        <span className={`${styles.tx_statusPill} ${styles[statusBgClass[transaction.status]]}`}>
          <HiOutlineEllipsisHorizontalCircle aria-hidden />
          {statusLabels[transaction.status]}
        </span>
        <span className={styles.tx_heroAmount}>
          {formatCurrency(transaction.amount, currency)}
        </span>
        <span className={styles.tx_heroSubtitle}>
          {transaction.dueDate
            ? `Due ${formatDate(transaction.dueDate, "MMM d, yyyy")}`
            : `Recorded ${formatDate(transaction.transactionDate, "MMM d, yyyy")}`}
        </span>
      </section>

      <article className={styles.tx_card}>
        <Avatar name={borrower.name} color={borrower.avatarColor} size="lg" />
        <div className={styles.tx_personMeta}>
          <span className={styles.tx_personName}>{borrower.name}</span>
          <span className={styles.tx_personSub}>{borrower.email ?? borrower.phone ?? ""}</span>
        </div>
        <button type="button" className={styles.tx_iconBtn} aria-label="Message">
          <HiOutlineChatBubbleOvalLeft aria-hidden />
        </button>
      </article>

      <article className={styles.tx_card}>
        <div className={styles.tx_cardHead}>
          <span className={styles.tx_cardLabel}>Purpose</span>
        </div>
        <div className={styles.tx_purposeRow}>
          <span className={styles.tx_purposeIcon} aria-hidden>
            {(() => {
              const Icon = categoryIcon[transaction.category] ?? HiOutlineSquares2X2;
              return <Icon />;
            })()}
          </span>
          <span className={styles.tx_purposeText}>
            {transaction.notes ?? categoryLabels[transaction.category]}
          </span>
        </div>
      </article>

      <article className={styles.tx_card}>
        <div className={styles.tx_cardHead}>
          <span className={styles.tx_cardLabel}>Transaction History</span>
        </div>
        <ol className={styles.timeline_root}>
          {timeline.map((step, idx) => (
            <li
              key={idx}
              className={`${styles.timeline_item} ${styles[`timeline_item-${step.tone}`]}`}
            >
              <span className={styles.timeline_dotWrap}>
                <span className={styles.timeline_dot} aria-hidden>
                  {step.tone === "done" ? <HiOutlineCheck /> : null}
                </span>
                {idx < timeline.length - 1 ? (
                  <span className={styles.timeline_line} aria-hidden />
                ) : null}
              </span>
              <div className={styles.timeline_content}>
                <span className={styles.timeline_label}>{step.label}</span>
                <span className={styles.timeline_date}>{step.date}</span>
              </div>
            </li>
          ))}
        </ol>
      </article>

      <section className={styles.tx_actions}>
        <Button
          variant="secondary"
          iconLeft={<HiOutlineBellAlert aria-hidden />}
          onClick={() => setConfirmOpen(false)}
          block
        >
          Remind
        </Button>
        <Button
          variant="primary"
          iconLeft={<HiOutlineCheckCircle aria-hidden />}
          onClick={handleMarkPaid}
          block
          disabled={isSettled}
        >
          {isSettled ? "Paid" : "Mark as Paid"}
        </Button>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this transaction?"
        description="Removing this entry will also delete linked repayments. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};
