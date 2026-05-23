"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import classnames from "classnames";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlinePlus,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import styles from "./BottomNavigation.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
  prominent?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: HiOutlineHome },
  { href: "/people", label: "People", icon: HiOutlineUsers },
  { href: "/add", label: "Add", icon: HiOutlinePlus, prominent: true },
  { href: "/analytics", label: "Analytics", icon: HiOutlineChartBar },
  { href: "/settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

export const BottomNavigation = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className={styles.nav_root} aria-label="Primary">
      <div className={styles.nav_bar}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={classnames(styles.nav_item, {
                [styles["nav_item-active"]]: active,
                [styles["nav_item-prominent"]]: item.prominent,
              })}
            >
              <span className={styles.nav_iconWrap}>
                {active && !item.prominent && (
                  <motion.span
                    layoutId="nav-pill-active"
                    className={styles["nav_pill-active"]}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon aria-hidden />
              </span>
              <span className={styles.nav_label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
