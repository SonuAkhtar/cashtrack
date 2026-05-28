"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Field/Field";
import { Chip } from "@/components/Chip/Chip";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { SkeletonCard } from "@/components/Skeleton/Skeleton";
import { FILTER_OPTIONS, SORT_OPTIONS } from "@/constants";
import { useLedgers } from "@/hooks/useLedgers";
import { useCurrency } from "@/hooks/useCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import { useUIStore } from "@/store/uiStore";
import { filterLedgers, sortLedgers } from "@/utils/sort";
import { PersonCard } from "@/features/people/PersonCard/PersonCard";
import type { FilterKey } from "@/types";
import styles from "./PeopleView.module.scss";

export const PeopleView = () => {
  const { ledgers, isLoading } = useLedgers();
  const { format: money } = useCurrency();
  const query = useUIStore((s) => s.peopleQuery);
  const setQuery = useUIStore((s) => s.setPeopleQuery);
  const filter = useUIStore((s) => s.peopleFilter);
  const setFilter = useUIStore((s) => s.setPeopleFilter);
  const sort = useUIStore((s) => s.peopleSort);
  const setSort = useUIStore((s) => s.setPeopleSort);
  const openModal = useUIStore((s) => s.openModal);

  const [localQuery, setLocalQuery] = useState(query);
  const debounced = useDebounce(localQuery, 200);

  useEffect(() => {
    setQuery(debounced);
  }, [debounced, setQuery]);

  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = {
      all: 0,
      active: 0,
      overdue: 0,
      completed: 0,
      favorite: 0,
      archived: 0,
    };
    ledgers.forEach((l) => {
      if (l.person.status === "active") map.all += 1;
      if (l.person.status === "active" && l.pending > 0) map.active += 1;
      if (l.status === "overdue") map.overdue += 1;
      if (l.status === "completed") map.completed += 1;
      if (l.person.favorite && l.person.status === "active") map.favorite += 1;
      if (l.person.status === "archived") map.archived += 1;
    });
    return map;
  }, [ledgers]);

  const totals = useMemo(() => {
    return ledgers.reduce(
      (acc, l) => {
        acc.outstanding += l.pending;
        acc.overdue += l.overdue;
        return acc;
      },
      { outstanding: 0, overdue: 0 }
    );
  }, [ledgers]);

  const visible = useMemo(() => {
    const filtered = filterLedgers(ledgers, filter, debounced);
    return sortLedgers(filtered, sort);
  }, [ledgers, filter, debounced, sort]);

  return (
    <div className={styles.page}>
      <PageHeader
        icon="people"
        tone="primary"
        title="People"
        subtitle={`${counts.all} active ${counts.all === 1 ? "borrower" : "borrowers"} you're tracking`}
        stats={[
          {
            label: "Outstanding",
            value: money(Math.round(totals.outstanding), { compact: true }),
            icon: "wallet",
            tone: "neutral",
          },
          {
            label: "Overdue",
            value: money(Math.round(totals.overdue), { compact: true }),
            icon: "alert",
            tone: "danger",
          },
          {
            label: "Settled",
            value: String(counts.completed),
            icon: "check-circle",
            tone: "success",
          },
        ]}
      />

      <div className={styles.toolbar}>
        <Input
          icon="search"
          placeholder="Search by name, phone, tag"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <Dropdown
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
          icon="sort"
          align="right"
          label="Sort borrowers"
          className={styles.sort}
        />
      </div>

      <div className={`${styles.filters} app-scroll`}>
        {FILTER_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            active={filter === option.value}
            count={counts[option.value]}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : visible.length === 0 ? (
        filter === "archived" ? (
          <EmptyState
            icon="archive"
            title="No completed accounts"
            description="Accounts you mark as complete will appear here. Reopen one anytime to record a new payment."
          />
        ) : (
          <EmptyState
            icon="people"
            title={debounced ? "No matches found" : "No borrowers yet"}
            description={debounced ? "Try a different search or filter." : "Add someone you have lent money to and start tracking."}
            action={
              !debounced && (
                <Button icon="plus" onClick={() => openModal({ type: "person" })}>
                  Add borrower
                </Button>
              )
            }
          />
        )
      ) : (
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {visible.map((ledger, index) => (
              <PersonCard key={ledger.person.id} ledger={ledger} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
