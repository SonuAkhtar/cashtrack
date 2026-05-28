"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./Card.module.scss";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "flat" | "gradient";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", interactive = false, padding = "md", className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        styles.card,
        styles[`card--${variant}`],
        styles[`card--pad-${padding}`],
        interactive && styles["card--interactive"],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
