"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineArrowUpTray,
  HiOutlineArrowDownTray,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlinePlus,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { FAB } from "@/components/FAB/FAB";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import {
  getDashboardSummary,
  getMonthlyPoints,
  sortByRecent,
} from "@/features/selectors";
import { formatCurrency } from "@/utils/format";
import { statusLabels } from "@/lib/constants";
import type { Transaction } from "@/types";
import styles from "./DashboardView.module.css";

const signedDelta = (tx: Transaction): { sign: "+" | "-"; amount: number } => {
  if (tx.status === "settled" || tx.recovered >= tx.amount) {
    return { sign: "+", amount: tx.recovered };
  }
  return { sign: "-", amount: tx.amount - tx.recovered };
};

export const DashboardView = () => {
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const currency = usePreferencesStore((s) => s.currency);

  const summary = useMemo(() => getDashboardSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyPoints(transactions, 5), [transactions]);
  const recent = useMemo(() => sortByRecent(transactions).slice(0, 3), [transactions]);
  const borrowerMap = useMemo(
    () => new Map(borrowers.map((b) => [b.id, b])),
    [borrowers],
  );

  const overdueTotal = useMemo(() => {
    return transactions
      .filter((t) => t.status === "overdue")
      .reduce((s, t) => s + Math.max(0, t.amount - t.recovered), 0);
  }, [transactions]);

  const flowMax = Math.max(
    1,
    ...monthly.map((m) => Math.max(m.lent, m.recovered)),
  );

  const flowDelta = useMemo(() => {
    if (monthly.length < 2) return 0;
    const prev = monthly[monthly.length - 2];
    const curr = monthly[monthly.length - 1];
    const prevSum = prev.lent + prev.recovered;
    const currSum = curr.lent + curr.recovered;
    if (prevSum === 0) return 0;
    return ((currSum - prevSum) / prevSum) * 100;
  }, [monthly]);

  return (
    <div className={styles.dashboard_root}>
      <section className={styles.dashboard_netBalance} aria-label="Net balance">
        <span className={styles.dashboard_netLabel}>Net Balance</span>
        <div className={styles.dashboard_netRow}>
          <span className={styles.dashboard_netSymbol}>$</span>
          <span className={styles.dashboard_netAmount}>
            {formatCurrency(summary.totalPending, currency).replace(/^\D+/, "")}
          </span>
        </div>
        <div className={styles.dashboard_netSplit}>
          <div className={styles.dashboard_netCol}>
            <span className={styles.dashboard_netColLabel}>
              <HiOutlineArrowUp aria-hidden />
              Total Given
            </span>
            <span className={styles["dashboard_netColValue-given"]}>
              {formatCurrency(summary.totalLent, currency)}
            </span>
          </div>
          <div className={styles.dashboard_netCol}>
            <span className={styles.dashboard_netColLabel}>
              <HiOutlineArrowDown aria-hidden />
              Total Received
            </span>
            <span className={styles["dashboard_netColValue-received"]}>
              {formatCurrency(summary.totalRecovered, currency)}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.dashboard_statsGrid} aria-label="Categories">
        <article className={`${styles.dashboard_stat} ${styles["dashboard_stat-given"]}`}>
          <span className={styles.dashboard_statIcon} aria-hidden>
            <HiOutlineArrowUpTray />
          </span>
          <span className={styles.dashboard_statLabel}>Money Given</span>
          <span className={styles.dashboard_statValue}>
            {formatCurrency(summary.totalLent, currency)}
          </span>
        </article>
        <article className={`${styles.dashboard_stat} ${styles["dashboard_stat-received"]}`}>
          <span className={styles.dashboard_statIcon} aria-hidden>
            <HiOutlineArrowDownTray />
          </span>
          <span className={styles.dashboard_statLabel}>Money Received</span>
          <span className={styles.dashboard_statValue}>
            {formatCurrency(summary.totalRecovered, currency)}
          </span>
        </article>
        <article className={`${styles.dashboard_stat} ${styles["dashboard_stat-pending"]}`}>
          <span className={styles.dashboard_statIcon} aria-hidden>
            <HiOutlineClock />
          </span>
          <span className={styles.dashboard_statLabel}>Pending</span>
          <span className={styles.dashboard_statValue}>
            {formatCurrency(summary.totalPending, currency)}
          </span>
        </article>
        <article className={`${styles.dashboard_stat} ${styles["dashboard_stat-overdue"]}`}>
          <span className={styles.dashboard_statIcon} aria-hidden>
            <HiOutlineExclamationCircle />
          </span>
          <span className={styles.dashboard_statLabel}>Overdue</span>
          <span className={styles.dashboard_statValue}>
            {formatCurrency(overdueTotal, currency)}
          </span>
        </article>
      </section>

      <section className={styles.dashboard_flow} aria-label="Weekly flow">
        <header className={styles.dashboard_flowHeader}>
          <span className={styles.dashboard_flowTitle}>Weekly Flow</span>
          <span
            className={
              flowDelta >= 0
                ? styles["dashboard_flowDelta-up"]
                : styles["dashboard_flowDelta-down"]
            }
          >
            {flowDelta >= 0 ? "+" : ""}
            {flowDelta.toFixed(0)}%
          </span>
        </header>
        <div className={styles.dashboard_flowChart} aria-hidden>
          {monthly.map((m, i) => {
            const total = m.lent + m.recovered;
            const height = Math.max(8, Math.round((total / (flowMax * 2)) * 100));
            return (
              <span
                key={m.month}
                className={styles.dashboard_flowBar}
                style={
                  {
                    height: `${height}%`,
                    opacity: 0.4 + i * 0.12,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      </section>

      <section className={styles.dashboard_recent} aria-label="Recent activity">
        <header className={styles.dashboard_recentHeader}>
          <h2 className={styles.dashboard_recentTitle}>Recent Activity</h2>
          <Link href="/transactions" className={styles.dashboard_recentLink}>
            View All
          </Link>
        </header>
        <ul className={styles.dashboard_recentList}>
          {recent.map((tx) => {
            const borrower = borrowerMap.get(tx.borrowerId);
            const { sign, amount } = signedDelta(tx);
            return (
              <li key={tx.id}>
                <Link
                  href={`/transactions/${tx.id}`}
                  className={styles.dashboard_recentRow}
                >
                  <Avatar
                    name={borrower?.name ?? "?"}
                    color={borrower?.avatarColor}
                    size="md"
                  />
                  <div className={styles.dashboard_recentBody}>
                    <span className={styles.dashboard_recentName}>
                      {borrower?.name ?? "Unknown"}
                    </span>
                    <span className={styles.dashboard_recentNote}>
                      {tx.notes ?? "Transaction"}
                    </span>
                  </div>
                  <div className={styles.dashboard_recentMeta}>
                    <span
                      className={
                        sign === "+"
                          ? styles["dashboard_recentAmount-pos"]
                          : styles["dashboard_recentAmount-neg"]
                      }
                    >
                      {sign}
                      {formatCurrency(amount, currency)}
                    </span>
                    <Badge tone={statusBadgeTone(tx.status)}>
                      {statusLabels[tx.status]}
                    </Badge>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <FAB href="/add" label="Add transaction" icon={<HiOutlinePlus />} />
    </div>
  );
};
