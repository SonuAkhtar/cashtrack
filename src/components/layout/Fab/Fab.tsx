"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";
import styles from "./Fab.module.scss";

const HIDDEN_ON = ["/emi"];

export const Fab = () => {
  const openModal = useUIStore((s) => s.openModal);
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return null;

  const isPeople = pathname === "/people";

  return (
    <motion.button
      className={cn(styles.fab, isPeople && styles["fab--people"])}
      onClick={() => openModal(isPeople ? { type: "person" } : { type: "transaction" })}
      aria-label={isPeople ? "Add borrower" : "Add transaction"}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.15 }}
      whileHover={{ y: -4, scale: 1.06 }}
      whileTap={{ scale: 0.86, y: 2, transition: { type: "spring", stiffness: 700, damping: 18 } }}
    >
      <span className={styles.fab__icon}>
        <Icon name="plus" size={26} strokeWidth={2.6} />
      </span>
    </motion.button>
  );
};
