"use client";

import { cn } from "@/utils/cn";
import { initialsFromName } from "@/utils/format";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  name: string;
  color: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  favorite?: boolean;
  className?: string;
}

export const Avatar = ({ name, color, src, size = "md", favorite = false, className }: AvatarProps) => (
  <span
    className={cn(styles.avatar, styles[`avatar--${size}`], className)}
    style={{ "--avatar-color": color } as React.CSSProperties}
    aria-hidden
  >
    {src ? (
      <img src={src} alt="" className={styles.avatar__image} />
    ) : (
      <span className={styles.avatar__initials}>{initialsFromName(name)}</span>
    )}
    {favorite && <span className={styles.avatar__badge} />}
  </span>
);
