"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Avatar } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/Icon/Icon";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Button } from "@/components/Button/Button";
import { SkeletonCard } from "@/components/Skeleton/Skeleton";
import { useLedgers } from "@/hooks/useLedgers";
import { useCurrency } from "@/hooks/useCurrency";
import { useUIStore } from "@/store/uiStore";
import { formatDate, formatRelative } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { Transaction, TransactionType } from "@/types";
import styles from "./ActivityView.module.scss";

type Filter = "all" | TransactionType;

export const ActivityView = () => {
  const { people, transactions, isLoading } = useLedgers();
  const { format } = useCurrency();
  const openModal = useUIStore((s) => s.openModal);
  const [filter, setFilter] = useState<Filter>("all");

  const personMap = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "lend") acc.lent += t.amount;
        else acc.repaid += t.amount;
        return acc;
      },
      { lent: 0, repaid: 0 }
    );
  }, [transactions]);

  const grouped = useMemo(() => {
    const filtered = transactions
      .filter((t) => filter === "all" || t.type === filter)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

    const groups = new Map<string, Transaction[]>();
    filtered.forEach((t) => {
      const key = t.date.slice(0, 10);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    });
    return Array.from(groups.entries());
  }, [transactions, filter]);

  return (
    <div className={styles.page}>
      <PageHeader
        icon="activity"
        tone="primary"
        title="Activity"
        subtitle={`${transactions.length} ${transactions.length === 1 ? "record" : "records"}, newest first`}
        stats={[
          {
            label: "Lent",
            value: format(totals.lent, { compact: true }),
            icon: "arrow-up",
            tone: "danger",
          },
          {
            label: "Repaid",
            value: format(totals.repaid, { compact: true }),
            icon: "arrow-down",
            tone: "success",
          },
          {
            label: "Entries",
            value: String(transactions.length),
            icon: "activity",
            tone: "neutral",
          },
        ]}
      />

      <SegmentedControl<Filter>
        layoutId="activity-filter"
        options={[
          { value: "all", label: "All" },
          { value: "lend", label: "Lent" },
          { value: "repayment", label: "Repaid" },
        ]}
        value={filter}
        onChange={setFilter}
        tones={{ lend: "lend", repayment: "repay" }}
      />

      {isLoading ? (
        <div className={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          icon="activity"
          title="No transactions yet"
          description="Record money you lend or a repayment to get started."
          action={
            <Button icon="plus" onClick={() => openModal({ type: "transaction" })}>
              New transaction
            </Button>
          }
        />
      ) : (
        <div className={styles.groups}>
          {grouped.map(([date, items]) => (
            <section key={date} className={styles.group}>
              <h2 className={styles.group__date}>{formatRelative(`${date}T12:00:00.000Z`)}</h2>
              <div className={styles.group__items}>
                {items.map((transaction, index) => {
                  const person = personMap.get(transaction.personId);
                  const isLend = transaction.type === "lend";
                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/people/${transaction.personId}`}
                        className={cn(
                          styles.item,
                          isLend ? styles["item--lend"] : styles["item--repay"]
                        )}
                      >
                        <span
                          className={cn(
                            styles.item__direction,
                            isLend
                              ? styles["item__direction--lend"]
                              : styles["item__direction--repay"]
                          )}
                          aria-hidden
                        >
                          <Icon name={isLend ? "arrow-up" : "arrow-down"} size={16} />
                        </span>
                        <Avatar
                          name={person?.name ?? "?"}
                          color={person?.avatarColor ?? "var(--neutral)"}
                          size="md"
                        />
                        <div className={styles.item__text}>
                          <span className={styles.item__name}>{person?.name ?? "Unknown"}</span>
                          <span className={styles.item__meta}>
                            <span
                              className={cn(
                                styles.item__type,
                                isLend
                                  ? styles["item__type--lend"]
                                  : styles["item__type--repay"]
                              )}
                            >
                              {isLend ? "Lent" : "Repaid"}
                            </span>
                            <span className={styles.item__sep} aria-hidden>
                              ,
                            </span>
                            {formatDate(transaction.date, "h:mm a")}
                          </span>
                        </div>
                        <span
                          className={cn(
                            styles.item__amount,
                            isLend ? styles["item__amount--lend"] : styles["item__amount--repay"]
                          )}
                        >
                          {isLend ? "+" : "-"}
                          {format(transaction.amount)}
                        </span>
                        <Icon name="chevron-right" size={16} className={styles.item__chevron} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
