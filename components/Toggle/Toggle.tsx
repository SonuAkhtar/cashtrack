"use client";

import classnames from "classnames";
import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
}

export const Toggle = ({ checked, onChange, label, description, id }: ToggleProps) => {
  const inputId = id ?? `toggle-${label?.replace(/\s+/g, "-").toLowerCase() ?? "field"}`;
  return (
    <label htmlFor={inputId} className={styles.toggle_root}>
      <div className={styles.toggle_text}>
        {label ? <span className={styles.toggle_label}>{label}</span> : null}
        {description ? <span className={styles.toggle_description}>{description}</span> : null}
      </div>
      <input
        id={inputId}
        type="checkbox"
        className={styles["toggle_input-hidden"]}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={classnames(styles.toggle_track, {
          [styles["toggle_track-on"]]: checked,
        })}
        aria-hidden
      >
        <span className={styles.toggle_thumb} />
      </span>
    </label>
  );
};
