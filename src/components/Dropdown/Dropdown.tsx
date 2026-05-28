"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { cn } from "@/utils/cn";
import type { SelectOption } from "@/types";
import styles from "./Dropdown.module.scss";

interface DropdownProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: IconName;
  align?: "left" | "right";
  label?: string;
  className?: string;
}

export const Dropdown = <T extends string>({
  options,
  value,
  onChange,
  icon = "sort",
  align = "right",
  label,
  className,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={cn(styles.dropdown, className)} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <Icon name={icon} size={17} className={styles.trigger__icon} />
        <span className={styles.trigger__value}>{selected?.label}</span>
        <Icon name="chevron-down" size={16} className={cn(styles.trigger__caret, open && styles["trigger__caret--open"])} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={cn(styles.menu, styles[`menu--${align}`])}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(styles.option, active && styles["option--active"])}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {active && <Icon name="check" size={16} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
