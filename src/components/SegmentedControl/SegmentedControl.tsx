"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { SelectOption } from "@/types";
import styles from "./SegmentedControl.module.scss";

interface SegmentedControlProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  layoutId?: string;
  tones?: Partial<Record<T, string>>;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  layoutId = "segment",
  tones,
}: SegmentedControlProps<T>) => (
  <div className={cn(styles.control, styles[`control--${size}`], className)} role="tablist">
    {options.map((option) => {
      const active = option.value === value;
      const tone = tones?.[option.value];
      return (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={active}
          className={cn(styles.segment, active && styles["segment--active"])}
          data-tone={active ? tone : undefined}
          onClick={() => onChange(option.value)}
        >
          {active && (
            <motion.span
              layoutId={layoutId}
              className={styles.indicator}
              data-tone={tone}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className={styles.segment__label}>{option.label}</span>
        </button>
      );
    })}
  </div>
);
