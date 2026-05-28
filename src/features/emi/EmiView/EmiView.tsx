"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Sheet } from "@/components/Sheet/Sheet";
import { Field, Input, Select } from "@/components/Field/Field";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { cn } from "@/utils/cn";
import { formatDate, monthKey, nowISO, toInputDate } from "@/utils/date";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/store/uiStore";
import { useEmiStore, type EmiEntry, type EmiType } from "@/store/emiStore";
import styles from "./EmiView.module.scss";

const EMI_TYPES: { value: EmiType; label: string; icon: IconName; tone: string }[] = [
  { value: "home", label: "Home Loan", icon: "home", tone: "primary" },
  { value: "car", label: "Car Loan", icon: "wallet", tone: "primary" },
  { value: "personal", label: "Personal Loan", icon: "user", tone: "primary" },
  { value: "education", label: "Education", icon: "star", tone: "primary" },
  { value: "credit", label: "Credit Card", icon: "emi", tone: "primary" },
  { value: "other", label: "Other", icon: "tag", tone: "neutral" },
];

const typeMeta = (type: EmiType) => EMI_TYPES.find((t) => t.value === type) ?? EMI_TYPES[5];

export const EmiView = () => {
  const { format: money } = useCurrency();
  const toast = useToast();
  const openModal = useUIStore((s) => s.openModal);
  const emis = useEmiStore((s) => s.emis);
  const addEmi = useEmiStore((s) => s.addEmi);
  const updateEmi = useEmiStore((s) => s.updateEmi);
  const removeEmi = useEmiStore((s) => s.removeEmi);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<EmiType>("home");
  const [date, setDate] = useState(toInputDate(nowISO()));

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([monthKey(nowISO())]));

  const groups = useMemo(() => {
    const map = new Map<string, EmiEntry[]>();
    for (const e of emis) {
      const key = monthKey(e.date);
      const bucket = map.get(key);
      if (bucket) bucket.push(e);
      else map.set(key, [e]);
    }
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, items]) => ({
        key,
        label: formatDate(`${key}-01`, "MMMM yyyy"),
        total: items.reduce((sum, e) => sum + e.amount, 0),
        items: [...items].sort((a, b) => b.date.localeCompare(a.date)),
      }));
  }, [emis]);

  const thisMonth = groups.find((g) => g.key === monthKey(nowISO()));
  const lifetimeTotal = useMemo(() => emis.reduce((sum, e) => sum + e.amount, 0), [emis]);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setAmount("");
    setType("home");
    setDate(toInputDate(nowISO()));
    setSheetOpen(true);
  };

  const openEdit = (emi: EmiEntry) => {
    setEditingId(emi.id);
    setName(emi.name);
    setAmount(String(emi.amount));
    setType(emi.type);
    setDate(emi.date.slice(0, 10));
    setSheetOpen(true);
  };

  const save = () => {
    const value = Number(amount);
    if (!name.trim()) {
      toast.error("Add a name");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const draft = { name: name.trim(), amount: value, type, date };
    if (editingId) {
      updateEmi(editingId, draft);
      toast.success("EMI updated");
    } else {
      addEmi(draft);
      toast.success("EMI added");
      setExpanded((prev) => new Set(prev).add(monthKey(date)));
    }
    setSheetOpen(false);
  };

  const toggleMonth = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className={styles.page}>
      <PageHeader
        icon="emi"
        tone="primary"
        title="EMI"
        subtitle="Track the installments you pay each month"
        stats={[
          {
            label: "Lifetime paid",
            value: money(Math.round(lifetimeTotal), { compact: true }),
            icon: "wallet",
            tone: "neutral",
          },
          {
            label: emis.length === 1 ? "Payment" : "Payments",
            value: String(emis.length),
            icon: "check-circle",
            tone: "neutral",
          },
          {
            label: groups.length === 1 ? "Month" : "Months",
            value: String(groups.length),
            icon: "calendar",
            tone: "neutral",
          },
        ]}
      />

      <div className={styles.hero}>
        <div className={styles.hero__top}>
          <span className={styles.hero__brand}>EMI</span>
          <span className={styles.hero__logo} aria-hidden>
            <span />
            <span />
          </span>
        </div>
        <strong className={styles.hero__number}>{money(Math.round(thisMonth?.total ?? 0))}</strong>
        <div className={styles.hero__bottom}>
          <div className={styles.hero__field}>
            <span className={styles.hero__label}>Paid this month</span>
            <span className={styles.hero__value}>
              {thisMonth?.items.length ?? 0} {(thisMonth?.items.length ?? 0) === 1 ? "payment" : "payments"}
            </span>
          </div>
          <div className={`${styles.hero__field} ${styles["hero__field--right"]}`}>
            <span className={styles.hero__label}>Period</span>
            <span className={styles.hero__value}>{formatDate(nowISO(), "MMM yyyy")}</span>
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <h2 className={styles.bar__title}>Monthly history</h2>
        <Button size="sm" variant="secondary" icon="plus" onClick={openAdd}>
          Add EMI
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon="emi"
          title="No EMIs yet"
          description="Add the installments you pay each month to build your payment history."
        />
      ) : (
        <div className={styles.months}>
          {groups.map((group) => {
            const open = expanded.has(group.key);
            return (
              <Card key={group.key} padding="none" className={styles.month}>
                <button className={styles.month__head} onClick={() => toggleMonth(group.key)} aria-expanded={open}>
                  <span className={styles.month__info}>
                    <strong>{group.label}</strong>
                    <span>
                      {group.items.length} {group.items.length === 1 ? "EMI" : "EMIs"}
                    </span>
                  </span>
                  <strong className={styles.month__total}>{money(group.total)}</strong>
                  <motion.span
                    className={styles.month__chevron}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="chevron-down" size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className={styles.items}>
                        {group.items.map((emi) => {
                          const meta = typeMeta(emi.type);
                          return (
                            <div key={emi.id} className={styles.item}>
                              <span className={cn(styles.item__icon, styles[`item__icon--${meta.tone}`])}>
                                <Icon name={meta.icon} size={18} />
                              </span>
                              <span className={styles.item__text}>
                                <strong>{emi.name}</strong>
                                <span>
                                  {meta.label} · {formatDate(emi.date, "d MMM")}
                                </span>
                              </span>
                              <strong className={styles.item__amount}>{money(emi.amount)}</strong>
                              <span className={styles.item__actions}>
                                <button aria-label={`Edit ${emi.name}`} onClick={() => openEdit(emi)}>
                                  <Icon name="edit" size={16} />
                                </button>
                                <button
                                  className={styles.item__delete}
                                  aria-label={`Delete ${emi.name}`}
                                  onClick={() =>
                                    openModal({
                                      type: "confirm",
                                      title: "Delete EMI",
                                      message: `Remove "${emi.name}" from your payment history? This can't be undone.`,
                                      confirmLabel: "Delete",
                                      onConfirm: () => {
                                        removeEmi(emi.id);
                                        toast.success("EMI removed");
                                      },
                                    })
                                  }
                                >
                                  <Icon name="trash" size={16} />
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        icon="emi"
        tone="accent"
        title={editingId ? "Edit EMI" : "Add EMI"}
        description={editingId ? undefined : "Record an installment you pay."}
        footer={
          <>
            <Button variant="ghost" fullWidth onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth icon="check" onClick={save}>
              {editingId ? "Save changes" : "Add EMI"}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HDFC Home Loan" />
          </Field>
          <div className={styles.form__row}>
            <Field label="Amount">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Date paid">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as EmiType)}>
              {EMI_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Sheet>
    </div>
  );
};
