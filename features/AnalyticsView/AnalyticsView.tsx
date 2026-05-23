"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card } from "@/components/Card/Card";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { Badge, statusBadgeTone } from "@/components/Badge/Badge";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Avatar } from "@/components/Avatar/Avatar";
import { ChartLegend } from "@/components/ChartLegend/ChartLegend";
import { categoryPalette, chartPalette } from "@/styles/chartTheme";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import {
  getBorrowerStats,
  getCategoryBreakdown,
  getDashboardSummary,
  getMonthlyPoints,
} from "@/features/selectors";
import { formatCurrency, formatPercent } from "@/utils/format";
import { categoryLabels, statusLabels } from "@/lib/constants";
import styles from "./AnalyticsView.module.css";

const chartFallback = () => <div className={styles.analytics_chartFallback} />;

const MonthlyTrendChart = dynamic(
  () =>
    import("@/components/MonthlyTrendChart/MonthlyTrendChart").then(
      (m) => m.MonthlyTrendChart,
    ),
  { ssr: false, loading: chartFallback },
);

const CategoryDonutChart = dynamic(
  () =>
    import("@/components/CategoryDonutChart/CategoryDonutChart").then(
      (m) => m.CategoryDonutChart,
    ),
  { ssr: false, loading: chartFallback },
);

const BorrowerComparisonChart = dynamic(
  () =>
    import("@/components/BorrowerComparisonChart/BorrowerComparisonChart").then(
      (m) => m.BorrowerComparisonChart,
    ),
  { ssr: false, loading: chartFallback },
);

type Range = "3m" | "6m" | "12m";

const rangeOptions: { value: Range; label: string }[] = [
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "12m", label: "1Y" },
];

const rangeToMonths: Record<Range, number> = { "3m": 3, "6m": 6, "12m": 12 };

export const AnalyticsView = () => {
  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const repayments = useLedgerStore((s) => s.repayments);
  const currency = usePreferencesStore((s) => s.currency);

  const [range, setRange] = useState<Range>("6m");

  const monthly = useMemo(
    () => getMonthlyPoints(transactions, rangeToMonths[range]),
    [transactions, range],
  );
  const summary = useMemo(() => getDashboardSummary(transactions), [transactions]);
  const stats = useMemo(
    () => getBorrowerStats(borrowers, transactions, repayments),
    [borrowers, transactions, repayments],
  );
  const categories = useMemo(
    () => getCategoryBreakdown(transactions),
    [transactions],
  );

  const topBorrowers = [...stats]
    .sort((a, b) => b.totalLent - a.totalLent)
    .slice(0, 5);

  const totalCategoryPending = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <motion.div
      className={styles.analytics_root}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.analytics_header}>
        <div>
          <h1 className={styles.analytics_title}>Analytics</h1>
          <p className={styles.analytics_subtitle}>
            Insights into your lending portfolio
          </p>
        </div>
        <div className={styles["analytics_range-wrap"]}>
          <SegmentedControl
            options={rangeOptions}
            value={range}
            onChange={setRange}
            ariaLabel="Time range"
            size="sm"
          />
        </div>
      </header>

      <section className={styles.analytics_kpis}>
        <KpiTile
          label="Total lent"
          value={formatCurrency(summary.totalLent, currency)}
          accent="info"
        />
        <KpiTile
          label="Recovered"
          value={formatCurrency(summary.totalRecovered, currency)}
          accent="primary"
        />
        <KpiTile
          label="Recovery rate"
          value={formatPercent(summary.recoveryRate)}
          accent="violet"
        />
      </section>

      <Card variant="raised" className={styles.analytics_chartCard}>
        <SectionHeader
          title="Monthly trend"
          subtitle={`Lent vs recovered, last ${rangeToMonths[range]} months`}
        />
        <MonthlyTrendChart data={monthly} currency={currency} height={240} />
        <ChartLegend
          items={[
            { label: "Lent", color: chartPalette.lent },
            { label: "Recovered", color: chartPalette.recovered },
          ]}
        />
      </Card>

      <div className={styles.analytics_split}>
        <Card variant="raised" className={styles.analytics_chartCard}>
          <SectionHeader
            title="Pending by category"
            subtitle="Where outstanding balances live"
          />
          <CategoryDonutChart data={categories} currency={currency} height={220} />
          <ul className={styles.analytics_categoryLegend}>
            {categories.map((c) => (
              <li key={c.category} className={styles.analytics_categoryItem}>
                <span
                  className={styles.analytics_categoryDot}
                  style={{ background: categoryPalette[c.category] ?? categoryPalette.other }}
                />
                <div className={styles.analytics_categoryText}>
                  <span className={styles.analytics_categoryLabel}>
                    {categoryLabels[c.category]}
                  </span>
                  <span className={styles.analytics_categoryAmount}>
                    {formatCurrency(c.amount, currency)}
                  </span>
                </div>
                <span className={styles.analytics_categoryPct}>
                  {totalCategoryPending === 0
                    ? "0%"
                    : `${Math.round((c.amount / totalCategoryPending) * 100)}%`}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="raised" className={styles.analytics_chartCard}>
          <SectionHeader
            title="Top borrowers"
            subtitle="Lent vs recovered"
          />
          <BorrowerComparisonChart data={topBorrowers} currency={currency} height={240} />
          <ChartLegend
            items={[
              { label: "Lent", color: chartPalette.lent },
              { label: "Recovered", color: chartPalette.recovered },
            ]}
          />
        </Card>
      </div>

      <Card variant="raised" className={styles.analytics_chartCard}>
        <SectionHeader
          title="Borrower performance"
          subtitle="Repayment progress at a glance"
        />
        <ul className={styles.analytics_borrowerList}>
          {topBorrowers.map((b) => (
            <li key={b.borrower.id} className={styles.analytics_borrowerRow}>
              <Avatar name={b.borrower.name} color={b.borrower.avatarColor} size="sm" />
              <div className={styles.analytics_borrowerMain}>
                <div className={styles.analytics_borrowerTop}>
                  <span className={styles.analytics_borrowerName}>
                    {b.borrower.name}
                  </span>
                  <Badge tone={statusBadgeTone(b.status)}>{statusLabels[b.status]}</Badge>
                </div>
                <div className={styles.analytics_borrowerProgress}>
                  <ProgressBar value={b.repaymentPercentage} size="sm" />
                  <span className={styles.analytics_borrowerPct}>
                    {formatPercent(b.repaymentPercentage)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
};

const KpiTile = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "primary" | "info" | "violet";
}) => (
  <div className={`${styles.analytics_kpi} ${styles[`analytics_kpi-${accent}`]}`}>
    <span className={styles.analytics_kpiLabel}>{label}</span>
    <span className={styles.analytics_kpiValue}>{value}</span>
  </div>
);
