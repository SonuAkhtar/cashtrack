import styles from "@/styles/chart.module.css";

interface ChartLegendProps {
  items: { label: string; color: string }[];
}

export const ChartLegend = ({ items }: ChartLegendProps) => (
  <div className={styles.chart_legend} aria-hidden>
    {items.map((item) => (
      <span key={item.label} className={styles.chart_legendItem}>
        <span
          className={styles.chart_legendSwatch}
          style={{ background: item.color }}
        />
        {item.label}
      </span>
    ))}
  </div>
);
