"use client";

import Link from "next/link";
import { ReactNode } from "react";
import classnames from "classnames";
import styles from "./FAB.module.css";

interface FABProps {
  href: string;
  label: string;
  icon: ReactNode;
  variant?: "primary" | "secondary";
}

export const FAB = ({ href, label, icon, variant = "primary" }: FABProps) => (
  <Link
    href={href}
    aria-label={label}
    className={classnames(styles.fab_root, styles[`fab_root-${variant}`])}
  >
    <span className={styles.fab_icon} aria-hidden>
      {icon}
    </span>
  </Link>
);
