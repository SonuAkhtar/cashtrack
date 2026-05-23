"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import classnames from "classnames";
import { motion, MotionProps } from "framer-motion";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      block,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={classnames(
        styles.button_root,
        styles[`button_root-${variant}`],
        styles[`button_root-${size}`],
        { [styles["button_root-block"]]: block },
        className,
      )}
      {...rest}
    >
      {iconLeft ? <span className={styles.button_icon}>{iconLeft}</span> : null}
      <span className={styles.button_label}>{children}</span>
      {iconRight ? <span className={styles.button_icon}>{iconRight}</span> : null}
    </motion.button>
  ),
);

Button.displayName = "Button";
