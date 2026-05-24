"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlinePlus,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { StatCard } from "@/components/StatCard/StatCard";
import { TransactionRow } from "@/components/TransactionRow/TransactionRow";
import { ChartLegend } from "@/components/ChartLegend/ChartLegend";
import { RecoveryGauge } from "@/components/RecoveryGauge/RecoveryGauge";
import { chartPalette } from "@/styles/chartTheme";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import {
  getBorrowerStats,
  getDashboardSummary,
  getMonthlyPoints,
  sortByRecent,
} from "@/features/selectors";
import { formatCurrency } from "@/utils/format";
import { daysUntil } from "@/utils/date";
import styles from "./DashboardView.module.css";

const MonthlyTrendChart = dynamic(
  () =>
    import("@/components/MonthlyTrendChart/MonthlyTrendChart").then(
      (m) => m.MonthlyTrendChart,
    ),
  { ssr: false, loading: () => <div className={styles.dashboard_chartFallback} /> },
);

const greetingFor = (date: Date): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const DashboardView = () => {
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const repayments = useLedgerStore((s) => s.repayments);
  const currency = usePreferencesStore((s) => s.currency);
  const profile = usePreferencesStore((s) => s.profile);

  const summary = useMemo(() => getDashboardSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyPoints(transactions, 6), [transactions]);
  const recent = useMemo(() => sortByRecent(transactions).slice(0, 5), [transactions]);
  const stats = useMemo(
    () => getBorrowerStats(borrowers, transactions, repayments),
    [borrowers, transactions, repayments],
  );

  const dueSoon = useMemo(
    () =>
      transactions.filter((t) => {
        if (t.status === "settled" || !t.dueDate) return false;
        const days = daysUntil(t.dueDate);
        return days >= 0 && days <= 7;
      }),
    [transactions],
  );

  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    setGreeting(greetingFor(new Date()));
  }, []);
  const firstName = profile.name.split(" ")[0];

  const borrowerMap = useMemo(
    () => new Map(borrowers.map((b) => [b.id, b])),
    [borrowers],
  );
  const pendingStats = useMemo(
    () => stats.filter((s) => s.pending > 0),
    [stats],
  );
  const topBorrowers = useMemo(
    () => [...pendingStats].sort((a, b) => b.pending - a.pending).slice(0, 3),
    [pendingStats],
  );

  return (
    <div className={styles.dashboard_root}>
      <motion.section
        className={styles.dashboard_hero}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.dashboard_heroLeft}>
          <div className={styles.dashboard_heroTop}>
            <span className={styles.dashboard_greeting}>
              {greeting}, <strong>{firstName}</strong>
            </span>
            {dueSoon.length > 0 ? (
              <span className={styles.dashboard_dueChip}>
                <HiOutlineBell aria-hidden />
                {dueSoon.length} due
              </span>
            ) : null}
          </div>
          <div className={styles.dashboard_heroBody}>
            <span className={styles.dashboard_heroLabel}>Pending</span>
            <span className={styles.dashboard_heroAmount}>
              {formatCurrency(summary.totalPending, currency)}
            </span>
            {summary.overdueCount > 0 ? (
              <span className={styles.dashboard_heroOverdue}>
                <HiOutlineExclamationTriangle aria-hidden />
                {summary.overdueCount} overdue
              </span>
            ) : null}
          </div>
        </div>
        <div className={styles.dashboard_heroGauge}>
          <RecoveryGauge value={summary.recoveryRate} />
        </div>
      </motion.section>

      <section className={styles["dashboard_section-actions"]}>
        <Link href="/add" className={styles.dashboard_actionLink}>
          <Button variant="primary" iconLeft={<HiOutlinePlus aria-hidden />} block>
            New entry
          </Button>
        </Link>
        <Link href="/people" className={styles.dashboard_actionLink}>
          <Button variant="secondary" iconLeft={<HiOutlineUserGroup aria-hidden />} block>
            View people
          </Button>
        </Link>
      </section>

      <section className={styles.dashboard_group} aria-label="Received">
        <div className={styles.dashboard_groupHeader}>
          <span
            className={`${styles.dashboard_groupDot} ${styles["dashboard_groupDot-positive"]}`}
            aria-hidden
          />
          <h2 className={styles.dashboard_groupTitle}>Received</h2>
          <span className={styles.dashboard_groupHint}>Money returning to you</span>
        </div>
        <div className={styles.dashboard_statsGrid}>
          <StatCard
            label="Recovered"
            value={formatCurrency(summary.totalRecovered, currency)}
            icon={<HiOutlineCheckCircle />}
            tone="primary"
            trend={{ value: 4.8 }}
            delay={0.05}
          />
          <StatCard
            label="Monthly Recovery"
            value={formatCurrency(summary.monthlyRecovery, currency)}
            icon={<HiOutlineArrowTrendingUp />}
            tone="violet"
            trend={{ value: 12.3 }}
            delay={0.1}
          />
          <StatCard
            label="Active Borrowers"
            value={String(summary.activeBorrowers)}
            icon={<HiOutlineUserGroup />}
            tone="neutral"
            hint={`${borrowers.length} total`}
            delay={0.15}
          />
        </div>
      </section>

      <section className={styles.dashboard_group} aria-label="Lent out">
        <div className={styles.dashboard_groupHeader}>
          <span
            className={`${styles.dashboard_groupDot} ${styles["dashboard_groupDot-negative"]}`}
            aria-hidden
          />
          <h2 className={styles.dashboard_groupTitle}>Lent out</h2>
          <span className={styles.dashboard_groupHint}>Outstanding & at risk</span>
        </div>
        <div className={styles.dashboard_statsGrid}>
          <StatCard
            label="Total Lent"
            value={formatCurrency(summary.totalLent, currency)}
            icon={<HiOutlineBanknotes />}
            tone="info"
            delay={0.05}
          />
          <StatCard
            label="Pending"
            value={formatCurrency(summary.totalPending, currency)}
            icon={<HiOutlineClock />}
            tone="warning"
            delay={0.1}
          />
          <StatCard
            label="Overdue"
            value={String(summary.overdueCount)}
            icon={<HiOutlineExclamationTriangle />}
            tone="danger"
            hint="needs attention"
            delay={0.15}
          />
        </div>
      </section>

      <Card variant="raised" className={styles.dashboard_trendCard}>
        <SectionHeader
          title="Repayment overview"
          subtitle="Lent vs recovered, last 6 months"
        />
        <MonthlyTrendChart data={monthly} currency={currency} />
        <ChartLegend
          items={[
            { label: "Lent", color: chartPalette.lent },
            { label: "Recovered", color: chartPalette.recovered },
          ]}
        />
      </Card>

      <section className={styles.dashboard_section}>
        <SectionHeader
          title="Top pending"
          subtitle={
            pendingStats.length === 1
              ? "1 borrower with outstanding balance"
              : `${pendingStats.length} borrowers with outstanding balance`
          }
          action={
            <Link href="/people" className={styles.dashboard_link}>
              View all
            </Link>
          }
        />
        <div className={styles.dashboard_pendingList}>
          {topBorrowers.map((stat) => (
            <Link
              key={stat.borrower.id}
              href={`/people/${stat.borrower.id}`}
              className={styles.dashboard_pendingRow}
            >
              <div className={styles.dashboard_pendingMain}>
                <span
                  className={styles.dashboard_pendingDot}
                  style={{ background: stat.borrower.avatarColor }}
                  aria-hidden
                />
                <div className={styles.dashboard_pendingText}>
                  <span className={styles.dashboard_pendingName}>{stat.borrower.name}</span>
                  <span className={styles.dashboard_pendingMeta}>
                    {stat.activeTransactions} active
                  </span>
                </div>
              </div>
              <span className={styles.dashboard_pendingAmount}>
                {formatCurrency(stat.pending, currency)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.dashboard_section}>
        <SectionHeader
          title="Recent activity"
          subtitle="Latest transactions across all borrowers"
        />
        <div className={styles.dashboard_recentList}>
          {recent.map((tx, idx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              borrower={borrowerMap.get(tx.borrowerId)}
              currency={currency}
              index={idx}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
