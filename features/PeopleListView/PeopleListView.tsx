"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineUsers,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Button } from "@/components/Button/Button";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { BorrowerCard } from "@/components/BorrowerCard/BorrowerCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getBorrowerStats } from "@/features/selectors";
import type { TransactionStatus } from "@/types";
import styles from "./PeopleListView.module.css";

type FilterValue = "all" | TransactionStatus;

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "partial", label: "Partial" },
  { value: "overdue", label: "Overdue" },
  { value: "settled", label: "Settled" },
];

export const PeopleListView = () => {
  const borrowers = useLedgerStore((s) => s.borrowers);
  const transactions = useLedgerStore((s) => s.transactions);
  const repayments = useLedgerStore((s) => s.repayments);
  const currency = usePreferencesStore((s) => s.currency);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const stats = useMemo(
    () => getBorrowerStats(borrowers, transactions, repayments),
    [borrowers, transactions, repayments],
  );

  const filtered = useMemo(() => {
    return stats
      .filter((s) => (filter === "all" ? true : s.status === filter))
      .filter((s) =>
        s.borrower.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.pending - a.pending);
  }, [stats, filter, search]);

  return (
    <div className={styles.people_root}>
      <header className={styles.people_header}>
        <div className={styles.people_titleRow}>
          <h1 className={styles.people_title}>People</h1>
          <Link href="/add" aria-label="Add borrower">
            <Button size="sm" iconLeft={<HiOutlinePlus aria-hidden />}>
              Add
            </Button>
          </Link>
        </div>
        <div className={styles.people_searchRow}>
          <div className={styles.people_search}>
            <HiOutlineMagnifyingGlass aria-hidden className={styles.people_searchIcon} />
            <input
              type="search"
              className={styles.people_searchInput}
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search borrowers"
            />
            {search && (
              <button
                type="button"
                className={styles.people_searchClear}
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <HiOutlineXMark aria-hidden />
              </button>
            )}
          </div>
        </div>
        <div className={styles.people_filterRow}>
          <SegmentedControl
            options={filters}
            value={filter}
            onChange={setFilter}
            size="sm"
            ariaLabel="Filter by status"
          />
        </div>
      </header>

      <section className={styles.people_list} aria-label="Borrowers">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={<HiOutlineUsers aria-hidden />}
                title="No borrowers found"
                description={
                  search
                    ? "Try a different search or clear the filter."
                    : "Add your first borrower to get started."
                }
                action={
                  <Link href="/add">
                    <Button iconLeft={<HiOutlinePlus aria-hidden />}>Add borrower</Button>
                  </Link>
                }
              />
            </motion.div>
          ) : (
            filtered.map((stat, idx) => (
              <motion.div
                key={stat.borrower.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <BorrowerCard stats={stat} currency={currency} index={idx} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
