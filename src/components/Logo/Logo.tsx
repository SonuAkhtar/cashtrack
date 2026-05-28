import { cn } from "@/utils/cn";
import styles from "./Logo.module.scss";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo = ({ size = "md", className }: LogoProps) => (
  <span className={cn(styles.logo, styles[`logo--${size}`], className)} aria-label="CashTrack">
    <span className={styles.logo__cash}>Cash</span>
    <span className={styles.logo__track}>Track</span>
    <span className={styles.logo__dot} aria-hidden />
  </span>
);
