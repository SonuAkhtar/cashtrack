"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/constants";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { cn } from "@/utils/cn";
import styles from "./BottomNav.module.scss";

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.nav__inner}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon as IconName}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: IconName;
  label: string;
  active: boolean;
}) => (
  <Link href={href} className={cn(styles.item, active && styles["item--active"])}>
    <span className={styles.item__icon}>
      {active && (
        <motion.span layoutId="nav-glow" className={styles.item__glow} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
      )}
      <Icon name={icon} size={22} strokeWidth={active ? 2.2 : 1.9} className={styles.item__glyph} />
    </span>
    <span className={styles.item__label}>{label}</span>
  </Link>
);
