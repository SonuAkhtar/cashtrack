"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar } from "@/components/Avatar/Avatar";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Icon } from "@/components/Icon/Icon";
import { useCurrency } from "@/hooks/useCurrency";
import { dueLabel, formatRelative } from "@/utils/date";
import type { PersonLedger } from "@/types";
import styles from "./PersonCard.module.scss";

interface PersonCardProps {
  ledger: PersonLedger;
  index?: number;
}

export const PersonCard = ({ ledger, index = 0 }: PersonCardProps) => {
  const { format } = useCurrency();
  const { person } = ledger;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <Link href={`/people/${person.id}`} className={styles.card}>
        <div className={styles.head}>
          <Avatar name={person.name} color={person.avatarColor} size="md" favorite={person.favorite} />
          <div className={styles.info}>
            <span className={styles.name}>{person.name}</span>
            <span className={styles.meta}>
              {ledger.lastActivity ? formatRelative(ledger.lastActivity) : "No activity"}
            </span>
          </div>
          <StatusBadge status={ledger.status} />
        </div>

        <div className={styles.amounts}>
          <div className={styles.amount}>
            <span className={styles.amount__label}>Pending</span>
            <strong className={styles.amount__value}>{format(ledger.pending)}</strong>
          </div>
          <div className={styles.amount}>
            <span className={styles.amount__label}>Lent</span>
            <span className={styles.amount__muted}>{format(ledger.totalLent)}</span>
          </div>
        </div>

        <ProgressBar value={ledger.repaymentPercentage} status={ledger.status} showLabel />

        {ledger.nextDueDate && ledger.status !== "completed" && (
          <div className={styles.due}>
            <Icon name="calendar" size={14} />
            {dueLabel(ledger.nextDueDate)}
          </div>
        )}
      </Link>
    </motion.div>
  );
};
