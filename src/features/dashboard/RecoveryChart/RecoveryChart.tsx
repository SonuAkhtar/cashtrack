"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/Card/Card";
import type { DashboardSummary, StatusDistribution } from "@/types";
import styles from "./RecoveryChart.module.scss";

interface RecoveryChartProps {
  summary: DashboardSummary;
  distribution: StatusDistribution[];
}

export const RecoveryChart = ({ summary, distribution }: RecoveryChartProps) => {
  const rate = Math.round(summary.recoveryRate);
  const gaugeData = [
    { name: "recovered", value: rate },
    { name: "rest", value: 100 - rate },
  ];

  return (
    <Card padding="md" className={styles.card}>
      <h3 className={styles.title}>Recovery performance</h3>

      <div className={styles.gauge}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius="74%"
              outerRadius="100%"
              stroke="none"
              cornerRadius={20}
            >
              <Cell fill="var(--primary)" />
              <Cell fill="var(--surface-3)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.gauge__center}>
          <strong className={styles.gauge__value}>{rate}%</strong>
          <span className={styles.gauge__label}>recovered</span>
        </div>
      </div>

      <ul className={styles.list}>
        {distribution.map((item) => (
          <li key={item.status} className={styles.list__item}>
            <span className={styles.list__dot} style={{ background: item.color }} />
            <span className={styles.list__label}>{item.label}</span>
            <strong className={styles.list__value}>{item.value}</strong>
          </li>
        ))}
        {distribution.length === 0 && <li className={styles.empty}>No active accounts yet</li>}
      </ul>
    </Card>
  );
};
