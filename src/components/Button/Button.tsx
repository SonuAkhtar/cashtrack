"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./Button.module.scss";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "lend" | "repay";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      iconRight,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles["button--full"],
        loading && styles["button--loading"],
        !children && styles["button--icon-only"],
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.button__spinner} aria-hidden />}
      <span className={styles.button__content}>
        {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
        {children && <span className={styles.button__label}>{children}</span>}
        {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 18} />}
      </span>
    </button>
  )
);

Button.displayName = "Button";
