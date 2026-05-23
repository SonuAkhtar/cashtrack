"use client";

import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import classnames from "classnames";
import styles from "@/components/TextField/TextField.module.css";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, error, className, id, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id ?? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const hasValue = Boolean(rest.value && String(rest.value).length > 0);

    return (
      <div className={classnames(styles.field_root, className)}>
        <div
          className={classnames(styles.field_inputWrap, {
            [styles["field_inputWrap-focused"]]: focused,
            [styles["field_inputWrap-error"]]: Boolean(error),
            [styles["field_inputWrap-filled"]]: hasValue,
          })}
          style={{ minHeight: 110, alignItems: "flex-start" }}
        >
          <div className={styles.field_inputArea} style={{ paddingTop: 22 }}>
            <label
              htmlFor={inputId}
              className={classnames(styles.field_label, styles["field_label-floating"])}
              style={{ top: 18 }}
            >
              {label}
            </label>
            <textarea
              ref={ref}
              id={inputId}
              {...rest}
              rows={rest.rows ?? 4}
              onFocus={(e) => {
                setFocused(true);
                rest.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                rest.onBlur?.(e);
              }}
              className={styles.field_input}
              style={{ resize: "vertical", minHeight: 70 }}
            />
          </div>
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

TextArea.displayName = "TextArea";
