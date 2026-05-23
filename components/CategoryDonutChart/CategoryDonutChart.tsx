"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import type { CategoryBreakdown, Currency } from "@/types";
import { categoryLabels } from "@/lib/constants";
import { categoryPalette, chartTooltipStyle } from "@/styles/chartTheme";
import { formatCurrency } from "@/utils/format";
import styles from "@/styles/chart.module.css";

interface CategoryDonutChartProps {
  data: CategoryBreakdown[];
  currency: Currency;
  height?: number;
}

export const CategoryDonutChart = ({
  data,
  currency,
  height = 220,
}: CategoryDonutChartProps) => {
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div
      className={styles.chart_root}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={86}
            paddingAngle={2}
            stroke="var(--surface-1)"
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={categoryPalette[entry.category] ?? categoryPalette.other}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value: number, _name, payload) => [
              formatCurrency(value, currency),
              categoryLabels[payload.payload.category as keyof typeof categoryLabels],
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      {total === 0 ? null : (
        <div className={styles.chart_root} style={{ marginTop: -height, height, pointerEvents: "none" }}>
          <DonutCenter total={total} currency={currency} />
        </div>
      )}
    </motion.div>
  );
};

const DonutCenter = ({ total, currency }: { total: number; currency: Currency }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 2,
    }}
  >
    <span style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
      Pending
    </span>
    <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
      {formatCurrency(total, currency)}
    </span>
  </div>
);
