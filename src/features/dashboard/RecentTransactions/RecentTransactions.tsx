"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { useCurrency } from "@/hooks/useCurrency";
import { formatRelative } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { ActivityItem } from "@/types";
import styles from "./RecentTransactions.module.scss";

interface RecentTransactionsProps {
  items: ActivityItem[];
}

export const RecentTransactions = ({ items }: RecentTransactionsProps) => {
  const { format } = useCurrency();
  const visible = items.slice(0, 6);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h3 className={styles.title}>Transactions</h3>
        <Link href="/transactions" className={styles.filter} aria-label="View all transactions">
          <Icon name="filter" size={18} />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="activity"
          title="No transactions yet"
          description="Money you lend or collect will show up here."
        />
      ) : (
        <ul className={styles.list}>
          {visible.map((item, index) => {
            const isRepaid = item.type === "repayment";
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link href={`/people/${item.personId}`} className={styles.item}>
                  <span className={cn(styles.icon, isRepaid ? styles["icon--in"] : styles["icon--out"])}>
                    <Icon name={isRepaid ? "arrow-down" : "arrow-up"} size={18} strokeWidth={2.2} />
                  </span>
                  <div className={styles.text}>
                    <span className={styles.name}>{item.personName}</span>
                    <span className={styles.meta}>
                      {isRepaid ? "Repaid" : "Lent"} · {formatRelative(item.date)}
                    </span>
                  </div>
                  <span className={cn(styles.amount, isRepaid ? styles["amount--in"] : styles["amount--out"])}>
                    {isRepaid ? "+" : "−"}
                    {format(item.amount)}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}

      {items.length > 0 && (
        <Link href="/transactions" className={styles.viewAll}>
          View all transactions
        </Link>
      )}
    </section>
  );
};
