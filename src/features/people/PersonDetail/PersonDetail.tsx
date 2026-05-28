"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar } from "@/components/Avatar/Avatar";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { Card } from "@/components/Card/Card";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Icon } from "@/components/Icon/Icon";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { Chip } from "@/components/Chip/Chip";
import { usePersonLedger } from "@/hooks/useLedgers";
import { useCurrency } from "@/hooks/useCurrency";
import { useUpdatePerson, useDeletePerson } from "@/hooks/usePeople";
import { useUIStore } from "@/store/uiStore";
import { useToast } from "@/hooks/useToast";
import { TransactionItem } from "@/features/transactions/TransactionItem/TransactionItem";
import { formatRelative } from "@/utils/date";
import styles from "./PersonDetail.module.scss";

interface PersonDetailProps {
  personId: string;
}

export const PersonDetail = ({ personId }: PersonDetailProps) => {
  const router = useRouter();
  const { ledger, transactions, isLoading } = usePersonLedger(personId);
  const { format } = useCurrency();
  const update = useUpdatePerson();
  const remove = useDeletePerson();
  const openModal = useUIStore((s) => s.openModal);
  const toast = useToast();

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton height={120} radius={20} />
        <Skeleton height={90} radius={20} />
      </div>
    );
  }

  if (!ledger) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="people"
          title="Borrower not found"
          description="This person may have been deleted."
          action={<Button onClick={() => router.push("/people")}>Back to people</Button>}
        />
      </div>
    );
  }

  const { person } = ledger;
  const isArchived = person.status === "archived";
  const isSettled = ledger.totalLent > 0 && ledger.repaymentPercentage >= 100;

  const toggleFavorite = () =>
    update.mutate({ id: person.id, patch: { favorite: !person.favorite } });

  const markComplete = () => {
    update.mutate({ id: person.id, patch: { status: "archived" } });
    toast.success("Moved to history");
  };

  const reopen = () => {
    update.mutate({ id: person.id, patch: { status: "active" } });
    toast.success("Account reopened");
  };

  const confirmDelete = () =>
    openModal({
      type: "confirm",
      title: `Delete ${person.name}?`,
      message: "This removes the borrower and all their transactions permanently.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        await remove.mutateAsync(person.id);
        toast.success("Borrower deleted");
        router.push("/people");
      },
    });

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <IconButton icon="arrow-left" label="Back" variant="surface" onClick={() => router.back()} />
        <div className={styles.topbar__actions}>
          <IconButton
            icon={person.favorite ? "star-filled" : "star"}
            label="Favorite"
            variant={person.favorite ? "soft" : "surface"}
            onClick={toggleFavorite}
          />
          <IconButton icon="edit" label="Edit" variant="surface" onClick={() => openModal({ type: "person", personId: person.id })} />
          <IconButton icon="trash" label="Delete" variant="danger" onClick={confirmDelete} />
        </div>
      </div>

      <motion.div
        className={styles.profile}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Avatar name={person.name} color={person.avatarColor} size="xl" favorite={person.favorite} />
        <div className={styles.profile__info}>
          <h1 className={styles.profile__name}>{person.name}</h1>
          <div className={styles.profile__meta}>
            <StatusBadge status={ledger.status} size="md" />
            {ledger.lastActivity && <span>Active {formatRelative(ledger.lastActivity)}</span>}
          </div>
          {(person.phone || person.email) && (
            <div className={styles.profile__contact}>
              {person.phone && (
                <a href={`tel:${person.phone}`} className={styles.contact}>
                  <Icon name="phone" size={14} />
                  {person.phone}
                </a>
              )}
              {person.email && (
                <a href={`mailto:${person.email}`} className={styles.contact}>
                  <Icon name="mail" size={14} />
                  {person.email}
                </a>
              )}
            </div>
          )}
          {person.tags.length > 0 && (
            <div className={styles.profile__tags}>
              {person.tags.map((tag) => (
                <Chip key={tag} icon="tag">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Card padding="md" className={styles.summary}>
        <div className={styles.summary__grid}>
          <div className={styles.stat}>
            <span className={styles.stat__label}>Pending</span>
            <strong className={styles.stat__value}>{format(ledger.pending)}</strong>
          </div>
          <div className={styles.stat}>
            <span className={styles.stat__label}>Lent</span>
            <strong className={styles.stat__value}>{format(ledger.totalLent)}</strong>
          </div>
          <div className={styles.stat}>
            <span className={styles.stat__label}>Recovered</span>
            <strong className={styles.stat__value}>{format(ledger.totalRepaid)}</strong>
          </div>
        </div>
        <div className={styles.summary__progress}>
          <div className={styles.summary__progressHead}>
            <span>Repayment progress</span>
            <strong>{Math.round(ledger.repaymentPercentage)}%</strong>
          </div>
          <ProgressBar value={ledger.repaymentPercentage} status={ledger.status} />
        </div>
      </Card>

      {isArchived ? (
        <div className={styles.history}>
          <span className={styles.history__icon}>
            <Icon name="archive" size={18} />
          </span>
          <div className={styles.history__text}>
            <strong>In history</strong>
            <span>This account is settled. Reopen it to record a new payment.</span>
          </div>
          <Button icon="refresh" variant="secondary" onClick={reopen}>
            Reopen
          </Button>
        </div>
      ) : (
        <div className={styles.actionsBlock}>
          {isSettled && (
            <Button fullWidth icon="check-circle" onClick={markComplete}>
              Mark as complete
            </Button>
          )}
          <div className={styles.cta}>
            <Button fullWidth icon="arrow-up" variant="lend" onClick={() => openModal({ type: "transaction", personId: person.id, defaultType: "lend" })}>
              Lend more
            </Button>
            <Button fullWidth icon="arrow-down" variant="repay" onClick={() => openModal({ type: "transaction", personId: person.id, defaultType: "repayment" })}>
              Record repayment
            </Button>
          </div>
        </div>
      )}

      <section className={styles.timeline}>
        <h2 className={styles.timeline__title}>Timeline</h2>
        {transactions.length === 0 ? (
          <EmptyState icon="activity" title="No transactions" description="Record the first transaction for this borrower." />
        ) : (
          <div className={styles.timeline__list}>
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                isLast={index === transactions.length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
