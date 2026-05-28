"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/Card/Card";
import { useCurrency } from "@/hooks/useCurrency";
import type { MonthlyPoint } from "@/types";
import { formatCompact } from "@/utils/format";
import styles from "./TrendChart.module.scss";

interface TrendChartProps {
  data: MonthlyPoint[];
}

interface TooltipPayload {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const { format } = useCurrency();

  const ChartTooltip = ({ active, payload, label }: TooltipPayload) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltip__label}>{label}</span>
        {payload.map((entry) => (
          <div key={entry.name} className={styles.tooltip__row}>
            <span className={styles.tooltip__dot} style={{ background: entry.color }} />
            <span className={styles.tooltip__name}>{entry.name}</span>
            <strong>{format(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>Monthly trend</h3>
          <p className={styles.subtitle}>Lent vs recovered over 6 months</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.legend__item}>
            <span className={styles.legend__dot} style={{ background: "var(--primary)" }} />
            Lent
          </span>
          <span className={styles.legend__item}>
            <span className={styles.legend__dot} style={{ background: "var(--success)" }} />
            Recovered
          </span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="recoveredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--success)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
              tickFormatter={(value) => formatCompact(Number(value))}
              width={48}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="lent"
              name="Lent"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#lentGradient)"
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="recovered"
              name="Recovered"
              stroke="var(--success)"
              strokeWidth={2.5}
              fill="url(#recoveredGradient)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
