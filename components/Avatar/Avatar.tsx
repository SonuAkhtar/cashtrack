import classnames from "classnames";
import { initials } from "@/utils/format";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = ({ name, color, size = "md", className }: AvatarProps) => (
  <span
    className={classnames(styles.avatar_root, styles[`avatar_root-${size}`], className)}
    style={color ? { ["--avatar-color" as never]: color } : undefined}
    aria-hidden
  >
    <span className={styles.avatar_label}>{initials(name) || "?"}</span>
  </span>
);
