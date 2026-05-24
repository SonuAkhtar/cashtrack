"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import styles from "./TopBar.module.css";

const titles: Record<string, string> = {
  "/transactions": "Ledger",
  "/people": "People",
  "/analytics": "Financial Insights",
  "/add": "New Transaction",
  "/settings": "CashTrack",
};

export const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const profile = usePreferencesStore((s) => s.profile);

  const isHome = pathname === "/";
  const isTopLevel = Object.prototype.hasOwnProperty.call(titles, pathname) || isHome;
  const title =
    pathname === "/"
      ? "CashTrack"
      : (titles[pathname] ??
        (pathname.startsWith("/people/")
          ? "Borrower"
          : pathname.startsWith("/transactions/")
            ? "Transaction Details"
            : "CashTrack"));

  return (
    <header className={styles.topbar_root}>
      <div className={styles.topbar_inner}>
        <div className={styles.topbar_left}>
          {isTopLevel ? (
            <Link href="/settings" aria-label="Profile" className={styles.topbar_avatarLink}>
              <Avatar name={profile.name} color="var(--emerald-900)" size="sm" />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Go back"
              className={styles.topbar_back}
              onClick={() => router.back()}
            >
              <HiOutlineArrowLeft aria-hidden />
            </button>
          )}
        </div>
        <h1 className={styles.topbar_title}>{title}</h1>
        <div className={styles.topbar_right}>
          <button
            type="button"
            aria-label="Search"
            className={styles.topbar_iconButton}
          >
            <HiOutlineMagnifyingGlass aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
};
