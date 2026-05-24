"use client";

import { useMemo } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { TransactionRow } from "@/components/TransactionRow/TransactionRow";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { FAB } from "@/components/FAB/FAB";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { sortByRecent } from "@/features/selectors";
import { formatDate } from "@/utils/date";
import type { Transaction } from "@/types";
import styles from "./LedgerView.module.css";

const groupByMonth = (txs: Transaction[]): { label: string; items: Transaction[] }[] => {
  const groups = new Map<string, Transaction[]>();
  for (const t of txs) {
    const key = formatDate(t.transactionDate, "LLLL yyyy");
    const arr = groups.get(key) ?? [];
    arr.push(t);
    groups.set(key, arr);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
};

export const LedgerView = () => {
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const currency = usePreferencesStore((s) => s.currency);

  const sorted = useMemo(() => sortByRecent(transactions), [transactions]);
  const grouped = useMemo(() => groupByMonth(sorted), [sorted]);
  const borrowerMap = useMemo(
    () => new Map(borrowers.map((b) => [b.id, b])),
    [borrowers],
  );

  return (
    <div className={styles.ledger_root}>
      <header className={styles.ledger_header}>
        <h1 className={styles.ledger_title}>Ledger</h1>
        <p className={styles.ledger_subtitle}>
          All your transactions in one place
        </p>
      </header>

      {grouped.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Tap the plus button to record your first entry."
        />
      ) : (
        <div className={styles.ledger_groups}>
          {grouped.map((group) => (
            <section key={group.label} className={styles.ledger_group}>
              <h2 className={styles.ledger_groupTitle}>{group.label}</h2>
              <ul className={styles.ledger_list}>
                {group.items.map((tx, idx) => (
                  <li key={tx.id}>
                    <TransactionRow
                      transaction={tx}
                      borrower={borrowerMap.get(tx.borrowerId)}
                      currency={currency}
                      index={idx}
                      variant="flat"
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <FAB href="/add" label="Add transaction" icon={<HiOutlinePlus />} />
    </div>
  );
};
