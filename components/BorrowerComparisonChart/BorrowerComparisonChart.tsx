"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { chartPalette, chartTooltipStyle } from "@/styles/chartTheme";
import { formatCompact } from "@/utils/format";
import type { BorrowerStats, Currency } from "@/types";
import styles from "@/styles/chart.module.css";

interface BorrowerComparisonChartProps {
  data: BorrowerStats[];
  currency: Currency;
  height?: number;
}

export const BorrowerComparisonChart = ({
  data,
  currency,
  height = 260,
}: BorrowerComparisonChartProps) => {
  const chartData = data
    .map((s) => ({
      name: s.borrower.name.split(" ")[0],
      lent: s.totalLent,
      recovered: s.totalRecovered,
    }))
    .slice(0, 6);

  return (
    <motion.div
      className={styles.chart_root}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 14, right: 6, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={chartPalette.gridDark} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={chartPalette.axisDark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={6}
          />
          <YAxis
            stroke={chartPalette.axisDark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCompact(Number(v), currency)}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            cursor={{ fill: "var(--surface-3)", opacity: 0.4 }}
            formatter={(value: number) => formatCompact(value, currency)}
          />
          <Bar dataKey="lent" fill={chartPalette.lent} radius={[6, 6, 0, 0]} maxBarSize={20} />
          <Bar
            dataKey="recovered"
            fill={chartPalette.recovered}
            radius={[6, 6, 0, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
