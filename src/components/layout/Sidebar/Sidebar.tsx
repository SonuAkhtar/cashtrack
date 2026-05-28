"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/store/uiStore";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
  const pathname = usePathname();
  const openModal = useUIStore((s) => s.openModal);
  const openCommand = useUIStore((s) => s.openCommand);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Logo size="md" />
      </Link>

      <button className={styles.search} onClick={openCommand}>
        <Icon name="search" size={18} />
        <span>Search</span>
        <kbd className={styles.search__kbd}>⌘K</kbd>
      </button>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              styles.link,
              isActive(item.href) && styles["link--active"],
            )}
          >
            <Icon name={item.icon as IconName} size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <Button
          icon="plus"
          fullWidth
          onClick={() => openModal({ type: "transaction" })}
        >
          New transaction
        </Button>
      </div>
    </aside>
  );
};
