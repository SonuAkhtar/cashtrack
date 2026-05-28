"use client";

import { useUIStore } from "@/store/uiStore";
import { Icon } from "@/components/Icon/Icon";
import { Logo } from "@/components/Logo/Logo";
import styles from "./AppBar.module.scss";

export const AppBar = () => {
  const openCommand = useUIStore((s) => s.openCommand);

  return (
    <header className={styles.appbar}>
      <span className={styles.brand}>
        <Logo size="md" />
      </span>
      <button
        type="button"
        className={styles.search}
        onClick={openCommand}
        aria-label="Search"
      >
        <Icon name="search" size={18} className={styles.search__icon} />
        <span className={styles.search__text}>Search</span>
        <kbd className={styles.search__kbd}>⌘K</kbd>
      </button>
    </header>
  );
};
