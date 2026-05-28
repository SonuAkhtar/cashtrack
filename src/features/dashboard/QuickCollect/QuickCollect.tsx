"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/Icon/Icon";
import { useUIStore } from "@/store/uiStore";
import type { PersonLedger } from "@/types";
import styles from "./QuickCollect.module.scss";

interface QuickCollectProps {
  ledgers: PersonLedger[];
}

const firstName = (name: string): string => name.trim().split(/\s+/)[0] || name;

export const QuickCollect = ({ ledgers }: QuickCollectProps) => {
  const openModal = useUIStore((s) => s.openModal);

  const people = useMemo(
    () =>
      ledgers
        .filter((l) => l.person.status === "active" && l.pending > 0)
        .sort((a, b) => b.pending - a.pending)
        .slice(0, 8),
    [ledgers]
  );

  if (people.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h3 className={styles.title}>Quick collect</h3>
        <Link href="/people" className={styles.viewAll} aria-label="View all people">
          <Icon name="arrow-up" size={16} className={styles.viewAll__icon} />
        </Link>
      </div>

      <div className={`${styles.row} app-scroll`}>
        {people.map((ledger) => (
          <button
            key={ledger.person.id}
            type="button"
            className={styles.person}
            onClick={() =>
              openModal({ type: "transaction", personId: ledger.person.id, defaultType: "repayment" })
            }
          >
            <Avatar
              name={ledger.person.name}
              color={ledger.person.avatarColor}
              size="lg"
              favorite={ledger.person.favorite}
              className={styles.person__avatar}
            />
            <span className={styles.person__name}>{firstName(ledger.person.name)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
