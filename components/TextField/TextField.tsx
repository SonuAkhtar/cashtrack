"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import classnames from "classnames";
import styles from "./TextField.module.css";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, prefix, suffix, hint, error, className, id, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id ?? `textfield-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const hasValue = Boolean(rest.value && String(rest.value).length > 0);
    const isFloating = focused || hasValue || Boolean(rest.placeholder);

    return (
      <div className={classnames(styles.field_root, className)}>
        <div
          className={classnames(styles.field_inputWrap, {
            [styles["field_inputWrap-focused"]]: focused,
            [styles["field_inputWrap-error"]]: Boolean(error),
            [styles["field_inputWrap-filled"]]: hasValue,
          })}
        >
          {prefix ? <span className={styles.field_prefix}>{prefix}</span> : null}
          <div className={styles.field_inputArea}>
            <label
              htmlFor={inputId}
              className={classnames(styles.field_label, {
                [styles["field_label-floating"]]: isFloating,
              })}
            >
              {label}
            </label>
            <input
              ref={ref}
              id={inputId}
              {...rest}
              onFocus={(e) => {
                setFocused(true);
                rest.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                rest.onBlur?.(e);
              }}
              className={styles.field_input}
            />
          </div>
          {suffix ? <span className={styles.field_suffix}>{suffix}</span> : null}
        </div>
        {(hint || error) && (
          <span
            className={classnames(styles.field_hint, {
              [styles["field_hint-error"]]: Boolean(error),
            })}
          >
            {error ?? hint}
          </span>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
