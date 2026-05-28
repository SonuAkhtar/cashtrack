"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { useCurrency } from "@/hooks/useCurrency";
import type { DashboardSummary, MonthlyPoint, PersonLedger } from "@/types";
import styles from "./SmartInsights.module.scss";

interface SmartInsightsProps {
  summary: DashboardSummary;
  trend: MonthlyPoint[];
  ledgers: PersonLedger[];
}

interface Insight {
  icon: IconName;
  tone: "primary" | "success" | "danger";
  text: string;
}

export const SmartInsights = ({ summary, trend, ledgers }: SmartInsightsProps) => {
  const { format } = useCurrency();

  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];
    const current = trend[trend.length - 1];
    const previous = trend[trend.length - 2];

    if (summary.overdueCount > 0) {
      list.push({
        icon: "alert",
        tone: "danger",
        text: `${summary.overdueCount} ${summary.overdueCount === 1 ? "account is" : "accounts are"} overdue, totaling ${format(summary.overdue)}.`,
      });
    }

    if (current && previous && previous.recovered > 0) {
      const change = ((current.recovered - previous.recovered) / previous.recovered) * 100;
      if (Math.abs(change) >= 5) {
        list.push({
          icon: change >= 0 ? "trend-up" : "trend-down",
          tone: change >= 0 ? "success" : "danger",
          text: `Recovery is ${change >= 0 ? "up" : "down"} ${Math.abs(change).toFixed(0)}% versus last month.`,
        });
      }
    }

    const topDebtor = [...ledgers]
      .filter((l) => l.pending > 0)
      .sort((a, b) => b.pending - a.pending)[0];
    if (topDebtor) {
      list.push({
        icon: "people",
        tone: "primary",
        text: `${topDebtor.person.name} holds the largest balance at ${format(topDebtor.pending)}.`,
      });
    }

    if (summary.recoveryRate >= 80 && summary.totalLent > 0) {
      list.push({
        icon: "sparkles",
        tone: "success",
        text: `Strong recovery rate of ${summary.recoveryRate.toFixed(0)}%. Great follow-up.`,
      });
    }

    return list.slice(0, 3);
  }, [summary, trend, ledgers, format]);

  if (insights.length === 0) return null;

  return (
    <div className={styles.insights}>
      {insights.map((insight, index) => (
        <motion.div
          key={insight.text}
          className={styles.insight}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.06 }}
        >
          <span className={`${styles.insight__icon} ${styles[`insight__icon--${insight.tone}`]}`}>
            <Icon name={insight.icon} size={16} />
          </span>
          <p className={styles.insight__text}>{insight.text}</p>
        </motion.div>
      ))}
    </div>
  );
};
