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
import { motion } from "framer-motion";
import type { Currency, MonthlyPoint } from "@/types";
import { chartPalette, chartTooltipStyle } from "@/styles/chartTheme";
import { formatCompact } from "@/utils/format";
import styles from "@/styles/chart.module.css";

interface MonthlyTrendChartProps {
  data: MonthlyPoint[];
  currency: Currency;
  height?: number;
}

export const MonthlyTrendChart = ({
  data,
  currency,
  height = 220,
}: MonthlyTrendChartProps) => (
  <motion.div
    className={styles.chart_root}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ height }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 16, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-lent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartPalette.lent} stopOpacity={0.4} />
            <stop offset="100%" stopColor={chartPalette.lent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-recovered" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartPalette.recovered} stopOpacity={0.5} />
            <stop offset="100%" stopColor={chartPalette.recovered} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartPalette.gridDark} vertical={false} />
        <XAxis
          dataKey="month"
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
          cursor={{ stroke: "var(--border-strong)" }}
          formatter={(value: number) => formatCompact(value, currency)}
        />
        <Area
          type="monotone"
          dataKey="lent"
          stroke={chartPalette.lent}
          strokeWidth={2}
          fill="url(#grad-lent)"
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="recovered"
          stroke={chartPalette.recovered}
          strokeWidth={2.4}
          fill="url(#grad-recovered)"
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
);
