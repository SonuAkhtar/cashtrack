"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "./Field.module.scss";

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const Field = ({ label, hint, error, required, children, className }: FieldShellProps) => (
  <label className={cn(styles.field, className)}>
    {label && (
      <span className={styles.field__label}>
        {label}
        {required && <span className={styles.field__required}>*</span>}
      </span>
    )}
    {children}
    {error ? (
      <span className={styles.field__error}>{error}</span>
    ) : (
      hint && <span className={styles.field__hint}>{hint}</span>
    )}
  </label>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: IconName;
  prefix?: string;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, prefix, invalid, className, ...rest }, ref) => (
    <span className={cn(styles.control, invalid && styles["control--invalid"], className)}>
      {icon && <Icon name={icon} size={18} className={styles.control__icon} />}
      {prefix && <span className={styles.control__prefix}>{prefix}</span>}
      <input ref={ref} className={styles.control__input} {...rest} />
    </span>
  )
);
Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ invalid, className, ...rest }, ref) => (
    <span className={cn(styles.control, styles["control--area"], invalid && styles["control--invalid"], className)}>
      <textarea ref={ref} className={styles.control__input} rows={3} {...rest} />
    </span>
  )
);
TextArea.displayName = "TextArea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, className, children, ...rest }, ref) => (
    <span className={cn(styles.control, styles["control--select"], invalid && styles["control--invalid"], className)}>
      <select ref={ref} className={styles.control__input} {...rest}>
        {children}
      </select>
      <Icon name="chevron-down" size={18} className={styles.control__chevron} />
    </span>
  )
);
Select.displayName = "Select";
