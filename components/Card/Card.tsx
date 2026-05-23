"use client";

import { HTMLAttributes, ReactNode, forwardRef } from "react";
import classnames from "classnames";
import styles from "./Card.module.css";

type CardVariant = "default" | "glass" | "raised" | "inset";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padded?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padded = true, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={classnames(
        styles.card_root,
        styles[`card_root-${variant}`],
        { [styles["card_root-padded"]]: padded },
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";
