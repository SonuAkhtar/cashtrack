"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlinePlus,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TransactionRow } from "@/components/TransactionRow/TransactionRow";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getBorrowerStats, sortByRecent } from "@/features/selectors";
import { formatCurrency, formatPercent } from "@/utils/format";
import { statusLabels } from "@/lib/constants";
import styles from "./BorrowerDetailView.module.css";

interface BorrowerDetailViewProps {
  borrowerId: string;
}

export const BorrowerDetailView = ({ borrowerId }: BorrowerDetailViewProps) => {
  const router = useRouter();
  const borrowers = useLedgerStore((s) => s.borrowers);
  const transactions = useLedgerStore((s) => s.transactions);
  const repayments = useLedgerStore((s) => s.repayments);
  const currency = usePreferencesStore((s) => s.currency);

  const borrower = borrowers.find((b) => b.id === borrowerId);
  const txs = useMemo(
    () => sortByRecent(transactions.filter((t) => t.borrowerId === borrowerId)),
    [transactions, borrowerId],
  );
  const stats = useMemo(
    () =>
      borrower
        ? getBorrowerStats([borrower], transactions, repayments)[0]
        : undefined,
    [borrower, transactions, repayments],
  );

  if (!borrower || !stats) {
    return (
      <EmptyState
        title="Borrower not found"
        description="This person may have been removed."
        action={
          <Button onClick={() => router.push("/people")}>Back to people</Button>
        }
      />
    );
  }

  return (
    <div className={styles.detail_root}>
      <motion.div
        className={styles["detail_header-sticky"]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card variant="glass" className={styles.detail_summary}>
          <div className={styles.detail_top}>
            <div className={styles.detail_identity}>
              <Avatar name={borrower.name} color={borrower.avatarColor} size="xl" />
              <div className={styles.detail_meta}>
                <h1 className={styles.detail_name}>{borrower.name}</h1>
                <Badge tone={statusBadgeTone(stats.status)} dot>
                  {statusLabels[stats.status]}
                </Badge>
              </div>
            </div>
            <Link href="/add" aria-label="Add transaction">
              <Button size="sm" iconLeft={<HiOutlinePlus aria-hidden />}>
                New
              </Button>
            </Link>
          </div>

          {(borrower.phone || borrower.email) && (
            <div className={styles.detail_contactRow}>
              {borrower.phone && (
                <a href={`tel:${borrower.phone}`} className={styles.detail_contactItem}>
                  <HiOutlinePhone aria-hidden /> {borrower.phone}
                </a>
              )}
              {borrower.email && (
                <a
                  href={`mailto:${borrower.email}`}
                  className={styles.detail_contactItem}
                >
                  <HiOutlineEnvelope aria-hidden /> {borrower.email}
                </a>
              )}
            </div>
          )}

          <div className={styles.detail_amountsRow}>
            <div className={styles.detail_amount}>
              <span className={styles["detail_amount-label"]}>Lent</span>
              <span className={styles["detail_amount-value"]}>
                {formatCurrency(stats.totalLent, currency)}
              </span>
            </div>
            <div className={styles.detail_amount}>
              <span className={styles["detail_amount-label"]}>Recovered</span>
              <span className={styles["detail_amount-value"]}>
                {formatCurrency(stats.totalRecovered, currency)}
              </span>
            </div>
            <div className={styles.detail_amount}>
              <span className={styles["detail_amount-label"]}>Pending</span>
              <span className={styles["detail_amount-pending"]}>
                {formatCurrency(stats.pending, currency)}
              </span>
            </div>
          </div>

          <div className={styles.detail_progressRow}>
            <ProgressBar value={stats.repaymentPercentage} size="md" />
            <span className={styles.detail_progressValue}>
              {formatPercent(stats.repaymentPercentage)} recovered
            </span>
          </div>
        </Card>
      </motion.div>

      <section>
        <SectionHeader title="Transactions" subtitle={`${txs.length} entries`} />
        {txs.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add the first entry for this person."
            action={
              <Link href="/add">
                <Button iconLeft={<HiOutlinePlus aria-hidden />}>Add entry</Button>
              </Link>
            }
          />
        ) : (
          <div className={styles.detail_transactions}>
            {txs.map((tx, idx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                borrower={borrower}
                currency={currency}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Repayment timeline" subtitle="Most recent first" />
        <RepaymentTimeline borrowerId={borrowerId} />
      </section>
    </div>
  );
};

const RepaymentTimeline = ({ borrowerId }: { borrowerId: string }) => {
  const repayments = useLedgerStore((s) => s.repayments);
  const transactions = useLedgerStore((s) => s.transactions);
  const currency = usePreferencesStore((s) => s.currency);

  const items = useMemo(() => {
    const txIds = new Set(
      transactions.filter((t) => t.borrowerId === borrowerId).map((t) => t.id),
    );
    return repayments
      .filter((r) => txIds.has(r.transactionId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [repayments, transactions, borrowerId]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No payments recorded"
        description="Repayments will appear here once logged."
      />
    );
  }

  return (
    <ol className={styles.timeline_root}>
      {items.map((repayment, idx) => (
        <motion.li
          key={repayment.id}
          className={styles.timeline_item}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.04 }}
        >
          <span className={styles.timeline_dot} aria-hidden />
          <div className={styles.timeline_content}>
            <div className={styles.timeline_row}>
              <span className={styles.timeline_amount}>
                {formatCurrency(repayment.amount, currency)}
              </span>
              <span className={styles.timeline_date}>
                {new Date(repayment.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {repayment.note ? (
              <span className={styles.timeline_note}>{repayment.note}</span>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
};
