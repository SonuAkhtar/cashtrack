"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineBell } from "react-icons/hi2";
import classnames from "classnames";
import styles from "./TopBar.module.css";

const titles: Record<string, string> = {
  "/": "Overview",
  "/people": "People",
  "/analytics": "Analytics",
  "/add": "New Entry",
  "/settings": "Settings",
};

export const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isDeep = !titles[pathname];
  const title =
    titles[pathname] ??
    (pathname.startsWith("/people/")
      ? "Borrower"
      : pathname.startsWith("/transactions/")
        ? "Transaction"
        : "CashTrack");

  return (
    <header className={styles.topbar_root}>
      <div className={styles.topbar_inner}>
        <div className={styles.topbar_left}>
          {isDeep ? (
            <motion.button
              type="button"
              aria-label="Go back"
              className={styles.topbar_back}
              onClick={() => router.back()}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
            >
              <HiOutlineArrowLeft aria-hidden />
            </motion.button>
          ) : (
            <div className={styles.topbar_brand}>
              <span className={classnames(styles.topbar_logo)} aria-hidden />
              <span className={styles.topbar_brandName}>CashTrack</span>
            </div>
          )}
        </div>
        <h1 className={styles["topbar_title-deep"]} data-show={isDeep}>
          {title}
        </h1>
        <div className={styles.topbar_right}>
          <motion.button
            type="button"
            aria-label="Notifications"
            className={styles.topbar_iconButton}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
          >
            <HiOutlineBell aria-hidden />
            <span className={styles["topbar_dot-alert"]} aria-hidden />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
