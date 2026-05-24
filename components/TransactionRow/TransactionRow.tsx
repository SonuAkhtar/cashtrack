"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import classnames from "classnames";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { formatCurrency } from "@/utils/format";
import { formatDate } from "@/utils/date";
import { statusLabels } from "@/lib/constants";
import type { Borrower, Currency, Transaction } from "@/types";
import styles from "./TransactionRow.module.css";

interface TransactionRowProps {
  transaction: Transaction;
  borrower?: Borrower;
  currency: Currency;
  index?: number;
  variant?: "default" | "flat";
}

export const TransactionRow = ({
  transaction,
  borrower,
  currency,
  index = 0,
  variant = "default",
}: TransactionRowProps) => {
  const pending = Math.max(0, transaction.amount - transaction.recovered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/transactions/${transaction.id}`}
        className={classnames(styles.transaction_root, {
          [styles["transaction_root-flat"]]: variant === "flat",
        })}
      >
        <Avatar
          name={borrower?.name ?? "?"}
          color={borrower?.avatarColor}
          size="md"
          className={styles.transaction_avatar}
        />
        <div className={styles.transaction_main}>
          <div className={styles.transaction_topRow}>
            <span className={styles.transaction_name}>
              {borrower?.name ?? "Unknown"}
            </span>
            <span className={styles.transaction_amount}>
              {formatCurrency(transaction.amount, currency)}
            </span>
          </div>
          <div className={styles.transaction_bottomRow}>
            <Badge tone={statusBadgeTone(transaction.status)}>
              {statusLabels[transaction.status]}
            </Badge>
            <span className={styles.transaction_date}>
              {formatDate(transaction.transactionDate, "MMM d")},{" "}
              {pending > 0
                ? `${formatCurrency(pending, currency)} pending`
                : "Fully recovered"}
            </span>
          </div>
        </div>
        <HiOutlineChevronRight aria-hidden className={styles.transaction_chevron} />
      </Link>
    </motion.div>
  );
};
