"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./IconButton.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  variant?: "surface" | "ghost" | "soft" | "danger";
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = "surface", size = "md", active = false, className, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        active && styles["button--active"],
        className
      )}
      {...rest}
    >
      <Icon name={icon} size={size === "sm" ? 18 : size === "lg" ? 24 : 20} />
    </button>
  )
);

IconButton.displayName = "IconButton";
