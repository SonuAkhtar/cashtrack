"use client";

import { motion } from "framer-motion";
import classnames from "classnames";
import styles from "./SegmentedControl.module.css";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  size = "md",
  ariaLabel,
}: SegmentedControlProps<T>) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className={classnames(styles.segmented_root, styles[`segmented_root-${size}`])}
  >
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={active}
          className={classnames(styles.segmented_option, {
            [styles["segmented_option-active"]]: active,
          })}
          onClick={() => onChange(option.value)}
        >
          {active && (
            <motion.span
              layoutId={`segmented-pill-${ariaLabel ?? "default"}`}
              className={styles["segmented_pill-active"]}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className={styles.segmented_label}>{option.label}</span>
        </button>
      );
    })}
  </div>
);
