"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineUser,
} from "react-icons/hi2";
import styles from "./BottomNavigation.module.css";

interface NavItem {
  href: string;
  label: string;
  match?: (pathname: string) => boolean;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: HiOutlineHome, match: (p) => p === "/" },
  {
    href: "/transactions",
    label: "Ledger",
    icon: HiOutlineDocumentText,
    match: (p) => p.startsWith("/transactions"),
  },
  { href: "/analytics", label: "Stats", icon: HiOutlineChartBar },
  { href: "/people", label: "People", icon: HiOutlineUsers },
  { href: "/settings", label: "Me", icon: HiOutlineUser },
];

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav_root} aria-label="Primary">
      <div className={styles.nav_bar}>
        {navItems.map((item) => {
          const active = item.match
            ? item.match(pathname)
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={classnames(styles.nav_item, {
                [styles["nav_item-active"]]: active,
              })}
            >
              <span className={styles.nav_iconWrap}>
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
