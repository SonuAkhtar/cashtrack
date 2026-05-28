"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./Chip.module.scss";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: IconName;
  count?: number;
  children: ReactNode;
}

export const Chip = ({ active = false, icon, count, className, children, ...rest }: ChipProps) => (
  <button
    type="button"
    className={cn(styles.chip, active && styles["chip--active"], className)}
    aria-pressed={active}
    {...rest}
  >
    {icon && <Icon name={icon} size={15} />}
    <span>{children}</span>
    {count !== undefined && count > 0 && <span className={styles.chip__count}>{count}</span>}
  </button>
);
