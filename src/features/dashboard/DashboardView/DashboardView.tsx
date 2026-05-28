"use client";

import { format } from "date-fns";
import { SkeletonCard } from "@/components/Skeleton/Skeleton";
import { useDashboardData } from "@/hooks/useLedgers";
import { Greeting } from "@/features/dashboard/Greeting/Greeting";
import { BalanceHero } from "@/features/dashboard/BalanceHero/BalanceHero";
import { QuickCollect } from "@/features/dashboard/QuickCollect/QuickCollect";
import { RecentTransactions } from "@/features/dashboard/RecentTransactions/RecentTransactions";
import { TrendChart } from "@/features/dashboard/TrendChart/TrendChart";
import { RecoveryChart } from "@/features/dashboard/RecoveryChart/RecoveryChart";
import { SmartInsights } from "@/features/dashboard/SmartInsights/SmartInsights";
import styles from "./DashboardView.module.scss";

const percentChange = (current: number, previous: number): number => {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const DashboardView = () => {
  const { summary, trend, distribution, activity, ledgers, isLoading } = useDashboardData();
  const greeting = format(new Date(), "MMM d");

  const [prev, curr] = trend.slice(-2);
  const recoveredDelta = percentChange(curr?.recovered ?? 0, prev?.recovered ?? 0);
  const lentDelta = percentChange(curr?.lent ?? 0, prev?.lent ?? 0);

  return (
    <div className={styles.page}>
      <Greeting date={greeting} />

      {isLoading ? (
        <div className={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <BalanceHero
            balance={summary.pending}
            recovered={summary.totalRecovered}
            lent={summary.totalLent}
            recoveredDelta={recoveredDelta}
            lentDelta={lentDelta}
          />

          <div className={styles.sheet}>
            <QuickCollect ledgers={ledgers} />
            <RecentTransactions items={activity} />
          </div>

          <SmartInsights summary={summary} trend={trend} ledgers={ledgers} />

          <div className={styles.charts}>
            <TrendChart data={trend} />
            <RecoveryChart summary={summary} distribution={distribution} />
          </div>
        </>
      )}
    </div>
  );
};
