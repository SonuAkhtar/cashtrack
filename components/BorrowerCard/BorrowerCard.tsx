"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { formatCurrency, formatPercent } from "@/utils/format";
import { formatRelative } from "@/utils/date";
import { statusLabels } from "@/lib/constants";
import type { BorrowerStats, Currency } from "@/types";
import styles from "./BorrowerCard.module.css";

interface BorrowerCardProps {
  stats: BorrowerStats;
  currency: Currency;
  index?: number;
}

export const BorrowerCard = ({ stats, currency, index = 0 }: BorrowerCardProps) => {
  const { borrower, totalLent, totalRecovered, pending, repaymentPercentage } = stats;
  const tone =
    stats.status === "overdue"
      ? "danger"
      : stats.status === "settled"
        ? "primary"
        : stats.status === "partial"
          ? "warning"
          : "info";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/people/${borrower.id}`} className={styles.borrower_root}>
        <div className={styles.borrower_top}>
          <div className={styles.borrower_identity}>
            <Avatar name={borrower.name} color={borrower.avatarColor} size="lg" />
            <div className={styles.borrower_meta}>
              <span className={styles.borrower_name}>{borrower.name}</span>
              <span className={styles.borrower_sub}>
                {stats.activeTransactions} active
                {stats.lastPaymentDate ? ` · paid ${formatRelative(stats.lastPaymentDate)}` : ""}
              </span>
            </div>
          </div>
          <Badge tone={statusBadgeTone(stats.status)} dot>
            {statusLabels[stats.status]}
          </Badge>
        </div>

        <div className={styles.borrower_grid}>
          <div className={styles.borrower_stat}>
            <span className={styles["borrower_stat-label"]}>Lent</span>
            <span className={styles["borrower_stat-value"]}>
              {formatCurrency(totalLent, currency)}
            </span>
          </div>
          <div className={styles.borrower_stat}>
            <span className={styles["borrower_stat-label"]}>Recovered</span>
            <span className={styles["borrower_stat-value"]}>
              {formatCurrency(totalRecovered, currency)}
            </span>
          </div>
          <div className={styles.borrower_stat}>
            <span className={styles["borrower_stat-label"]}>Pending</span>
            <span className={styles["borrower_stat-pending"]}>
              {formatCurrency(pending, currency)}
            </span>
          </div>
        </div>

        <div className={styles.borrower_progressRow}>
          <ProgressBar value={repaymentPercentage} tone={tone} size="sm" />
          <span className={styles.borrower_pct}>{formatPercent(repaymentPercentage)}</span>
        </div>

        <span className={styles.borrower_chevron} aria-hidden>
          <HiOutlineChevronRight />
        </span>
      </Link>
    </motion.div>
  );
};
