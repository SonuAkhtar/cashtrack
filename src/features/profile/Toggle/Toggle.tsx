"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./Toggle.module.scss";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  iconOn?: IconName;
  iconOff?: IconName;
}

export const Toggle = ({ checked, onChange, label, iconOn, iconOff }: ToggleProps) => {
  const icon = checked ? iconOn ?? iconOff : iconOff ?? iconOn;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(styles.toggle, checked && styles["toggle--on"])}
      onClick={() => onChange(!checked)}
    >
      <motion.span className={styles.thumb} layout transition={{ type: "spring", stiffness: 520, damping: 32 }}>
        {icon && <Icon name={icon} size={13} strokeWidth={2.2} />}
      </motion.span>
    </button>
  );
};
