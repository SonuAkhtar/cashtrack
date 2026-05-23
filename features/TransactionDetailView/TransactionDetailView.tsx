"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { formatCurrency, formatPercent } from "@/utils/format";
import { daysUntil, formatDate, formatRelative } from "@/utils/date";
import { categoryLabels, statusLabels } from "@/lib/constants";
import styles from "./TransactionDetailView.module.css";

interface TransactionDetailViewProps {
  transactionId: string;
}

export const TransactionDetailView = ({ transactionId }: TransactionDetailViewProps) => {
  const router = useRouter();
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const repayments = useLedgerStore((s) => s.repayments);
  const deleteTransaction = useLedgerStore((s) => s.deleteTransaction);
  const currency = usePreferencesStore((s) => s.currency);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const transaction = transactions.find((t) => t.id === transactionId);
  const borrower = borrowers.find((b) => b.id === transaction?.borrowerId);

  const txRepayments = useMemo(
    () =>
      repayments
        .filter((r) => r.transactionId === transactionId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
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

  const pending = Math.max(0, transaction.amount - transaction.recovered);
  const percent =
    transaction.amount === 0 ? 0 : (transaction.recovered / transaction.amount) * 100;
  const overdueDays = transaction.dueDate ? daysUntil(transaction.dueDate) : null;

  const handleDelete = () => {
    deleteTransaction(transactionId);
    setConfirmOpen(false);
    router.push("/");
  };

  return (
    <div className={styles.tx_root}>
      <Card variant="raised" className={styles.tx_summary}>
        <div className={styles.tx_summaryTop}>
          <Link href={`/people/${borrower.id}`} className={styles.tx_personLink}>
            <Avatar name={borrower.name} color={borrower.avatarColor} size="lg" />
            <div className={styles.tx_personMeta}>
              <span className={styles.tx_personName}>{borrower.name}</span>
              <span className={styles.tx_personSub}>
                {categoryLabels[transaction.category]} · Updated {formatRelative(transaction.updatedAt)}
              </span>
            </div>
          </Link>
          <Badge tone={statusBadgeTone(transaction.status)} dot>
            {statusLabels[transaction.status]}
          </Badge>
        </div>

        <div className={styles.tx_amountBlock}>
          <span className={styles.tx_amountLabel}>Outstanding</span>
          <span className={styles.tx_amountValue}>{formatCurrency(pending, currency)}</span>
          <span className={styles.tx_amountSub}>
            of {formatCurrency(transaction.amount, currency)} lent
          </span>
        </div>

        <div className={styles.tx_progressRow}>
          <ProgressBar value={percent} size="md" />
          <span className={styles.tx_progressValue}>
            {formatPercent(percent)} recovered
          </span>
        </div>

        <div className={styles.tx_chipRow}>
          {transaction.dueDate && (
            <span
              className={styles.tx_chip}
              data-tone={overdueDays !== null && overdueDays < 0 ? "danger" : undefined}
            >
              <HiOutlineCalendar aria-hidden />
              {overdueDays !== null && overdueDays < 0
                ? `Overdue by ${Math.abs(overdueDays)}d`
                : overdueDays !== null
                  ? `Due in ${overdueDays}d`
                  : "No due date"}
            </span>
          )}
          {transaction.tags?.map((tag) => (
            <span key={tag} className={styles.tx_chip}>
              <HiOutlineTag aria-hidden />
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <section className={styles.tx_actions}>
        <Link href={`/add?id=${transaction.id}`} style={{ flex: 1 }}>
          <Button variant="secondary" iconLeft={<HiOutlinePencilSquare aria-hidden />} block>
            Edit
          </Button>
        </Link>
        <Link href="/add" style={{ flex: 1 }}>
          <Button variant="primary" iconLeft={<HiOutlinePlus aria-hidden />} block>
            Log payment
          </Button>
        </Link>
      </section>

      <section className={styles.tx_stats}>
        <div className={styles.tx_stat}>
          <span className={styles.tx_statLabel}>Transaction date</span>
          <span className={styles.tx_statValue}>{formatDate(transaction.transactionDate)}</span>
        </div>
        <div className={styles.tx_stat}>
          <span className={styles.tx_statLabel}>Recovered</span>
          <span className={styles.tx_statValue}>
            {formatCurrency(transaction.recovered, currency)}
          </span>
        </div>
        <div className={styles.tx_stat}>
          <span className={styles.tx_statLabel}>Payments</span>
          <span className={styles.tx_statValue}>{txRepayments.length}</span>
        </div>
      </section>

      {transaction.notes && (
        <Card variant="inset" className={styles.tx_notes}>
          <SectionHeader title="Notes" />
          <p className={styles.tx_notesText}>{transaction.notes}</p>
        </Card>
      )}

      <section>
        <SectionHeader title="Repayment timeline" />
        {txRepayments.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="When repayments are logged, they will appear here."
          />
        ) : (
          <ol className={styles.timeline_root}>
            {txRepayments.map((r, idx) => (
              <motion.li
                key={r.id}
                className={styles.timeline_item}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.04 }}
              >
                <span className={styles.timeline_dot} aria-hidden />
                <div className={styles.timeline_content}>
                  <div className={styles.timeline_row}>
                    <span className={styles.timeline_amount}>
                      {formatCurrency(r.amount, currency)}
                    </span>
                    <span className={styles.timeline_date}>{formatDate(r.date)}</span>
                  </div>
                  {r.note ? (
                    <span className={styles.timeline_note}>{r.note}</span>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.tx_dangerZone}>
        <Button
          variant="ghost"
          iconLeft={<HiOutlineTrash aria-hidden />}
          onClick={() => setConfirmOpen(true)}
        >
          Delete transaction
        </Button>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this transaction?"
        description="Removing this entry will also delete linked repayments. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};
