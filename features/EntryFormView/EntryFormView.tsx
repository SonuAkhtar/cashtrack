"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import classnames from "classnames";
import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getCurrencySymbol } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import type { TransactionStatus } from "@/types";
import styles from "./EntryFormView.module.css";

type Direction = "giving" | "receiving";

const toDateInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatAmountDisplay = (raw: string): string => {
  if (!raw) return "0.00";
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const friendlyDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return `Today, ${formatDate(iso, "MMM d")}`;
  if (sameDay(d, yesterday)) return `Yesterday, ${formatDate(iso, "MMM d")}`;
  return formatDate(iso, "EEE, MMM d");
};

interface FormState {
  borrowerId: string;
  borrowerNewName: string;
  amount: string;
  direction: Direction;
  notes: string;
  transactionDate: string;
  status: TransactionStatus;
}

const initial = (): FormState => ({
  borrowerId: "",
  borrowerNewName: "",
  amount: "",
  direction: "giving",
  notes: "",
  transactionDate: toDateInput(new Date().toISOString()),
  status: "active",
});

export const EntryFormView = () => {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get("id");

  const transactions = useLedgerStore((s) => s.transactions);
  const borrowers = useLedgerStore((s) => s.borrowers);
  const upsertBorrowerByName = useLedgerStore((s) => s.upsertBorrowerByName);
  const addTransaction = useLedgerStore((s) => s.addTransaction);
  const updateTransaction = useLedgerStore((s) => s.updateTransaction);
  const deleteTransaction = useLedgerStore((s) => s.deleteTransaction);
  const currency = usePreferencesStore((s) => s.currency);

  const existing = useMemo(
    () => (editId ? transactions.find((t) => t.id === editId) : undefined),
    [editId, transactions],
  );

  const [form, setForm] = useState<FormState>(initial);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPersonOpen, setNewPersonOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (existing) {
      setForm({
        borrowerId: existing.borrowerId,
        borrowerNewName: "",
        amount: String(existing.amount),
        direction: "giving",
        notes: existing.notes ?? "",
        transactionDate: toDateInput(existing.transactionDate),
        status: existing.status,
      });
    } else {
      setForm(initial());
    }
  }, [existing]);

  const recentBorrowers = useMemo(() => borrowers.slice(0, 3), [borrowers]);
  const filteredBorrowers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return borrowers;
    return borrowers.filter((b) => b.name.toLowerCase().includes(q));
  }, [borrowers, searchTerm]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const stepAmount = (delta: number) => {
    const current = parseFloat(form.amount) || 0;
    const next = Math.max(0, current + delta);
    set("amount", next ? String(next) : "");
  };

  const symbol = getCurrencySymbol(currency);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.borrowerId) next.borrowerId = "Pick a recipient";
    const amount = parseFloat(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0)
      next.amount = "Enter an amount";
    if (!form.transactionDate) next.transactionDate = "Pick a date";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const amount = parseFloat(form.amount);
    const payload = {
      borrowerId: form.borrowerId,
      amount,
      recovered: form.direction === "receiving" ? amount : 0,
      transactionDate: new Date(form.transactionDate).toISOString(),
      notes: form.notes || undefined,
      status: form.direction === "receiving" ? ("settled" as const) : form.status,
      category: existing?.category ?? ("personal" as const),
    };

    if (existing) {
      updateTransaction(existing.id, payload);
      router.push(`/transactions/${existing.id}`);
    } else {
      const t = addTransaction(payload);
      router.push(`/transactions/${t.id}`);
    }
  };

  const handleDelete = () => {
    if (existing) {
      deleteTransaction(existing.id);
      setConfirmOpen(false);
      router.push("/transactions");
    }
  };

  const addNewPerson = () => {
    const name = form.borrowerNewName.trim();
    if (!name) return;
    const created = upsertBorrowerByName(name);
    set("borrowerId", created.id);
    set("borrowerNewName", "");
    setNewPersonOpen(false);
  };

  return (
    <div className={styles.entry_root}>
      <header className={styles.entry_header}>
        <h1 className={styles.entry_title}>
          {existing ? "Edit Transaction" : "New Transaction"}
        </h1>
        <button
          type="button"
          aria-label="Close"
          onClick={() => router.back()}
          className={styles.entry_close}
        >
          <HiOutlineXMark aria-hidden />
        </button>
      </header>

      <section className={styles.entry_amountBlock} aria-label="Amount">
        <span className={styles.entry_eyebrow}>AMOUNT</span>
        <div className={styles.entry_amountRow}>
          <span className={styles.entry_amountSymbol}>{symbol}</span>
          <input
            className={classnames(styles.entry_amountInput, {
              [styles["entry_amountInput-empty"]]: !form.amount,
              [styles["entry_amountInput-error"]]: Boolean(errors.amount),
            })}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value.replace(/[^0-9.]/g, ""))}
            aria-invalid={Boolean(errors.amount)}
          />
          <div className={styles.entry_stepper}>
            <button
              type="button"
              aria-label="Increase"
              onClick={() => stepAmount(10)}
            >
              <HiOutlineChevronUp aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Decrease"
              onClick={() => stepAmount(-10)}
            >
              <HiOutlineChevronDown aria-hidden />
            </button>
          </div>
        </div>
        <span
          className={classnames(styles.entry_amountUnderline, {
            [styles["entry_amountUnderline-active"]]: Boolean(form.amount),
          })}
          aria-hidden
        />
        <span className={styles.entry_amountPreview}>
          {symbol}
          {formatAmountDisplay(form.amount)}
        </span>
      </section>

      <div className={styles.entry_segmented} role="radiogroup" aria-label="Direction">
        {(
          [
            { value: "giving", label: "Giving" },
            { value: "receiving", label: "Receiving" },
          ] as { value: Direction; label: string }[]
        ).map((opt) => {
          const active = form.direction === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => set("direction", opt.value)}
              className={classnames(styles.entry_segment, {
                [styles["entry_segment-active"]]: active,
              })}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <section className={styles.entry_section}>
        <header className={styles.entry_rowHead}>
          <span className={styles.entry_rowLabel}>Recipient</span>
          <button
            type="button"
            className={styles.entry_findBtn}
            onClick={() => setSearchOpen((o) => !o)}
          >
            <HiOutlineMagnifyingGlass aria-hidden />
            Find someone
          </button>
        </header>

        {searchOpen ? (
          <div className={styles.entry_searchBox}>
            <input
              className={styles.entry_searchInput}
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <ul className={styles.entry_searchList}>
              {filteredBorrowers.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className={styles.entry_searchItem}
                    onClick={() => {
                      set("borrowerId", b.id);
                      setSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <Avatar name={b.name} color={b.avatarColor} size="sm" />
                    {b.name}
                  </button>
                </li>
              ))}
              {filteredBorrowers.length === 0 ? (
                <li className={styles.entry_searchEmpty}>No matches</li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className={styles.entry_avatarRow}>
          {recentBorrowers.map((b) => {
            const active = form.borrowerId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => set("borrowerId", b.id)}
                className={classnames(styles.entry_avatarBtn, {
                  [styles["entry_avatarBtn-active"]]: active,
                })}
                aria-pressed={active}
              >
                <span className={styles.entry_avatarRing}>
                  <Avatar name={b.name} color={b.avatarColor} size="lg" />
                </span>
                <span className={styles.entry_avatarName}>
                  {b.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setNewPersonOpen(true)}
            className={styles.entry_newBtn}
          >
            <span className={styles.entry_newCircle} aria-hidden>
              <HiOutlinePlus />
            </span>
            <span className={styles.entry_avatarName}>New</span>
          </button>
        </div>

        {newPersonOpen ? (
          <div className={styles.entry_newRow}>
            <input
              className={styles.entry_searchInput}
              placeholder="New person's name"
              value={form.borrowerNewName}
              onChange={(e) => set("borrowerNewName", e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={addNewPerson}
              className={styles.entry_newConfirm}
            >
              Add
            </button>
          </div>
        ) : null}

        {errors.borrowerId ? (
          <span className={styles.entry_error}>{errors.borrowerId}</span>
        ) : null}
      </section>

      <section className={styles.entry_section}>
        <span className={styles.entry_eyebrow}>PURPOSE</span>
        <div className={styles.entry_textField}>
          <HiOutlinePencilSquare aria-hidden className={styles.entry_fieldIcon} />
          <input
            type="text"
            placeholder="What's this for?"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={styles.entry_fieldInput}
          />
        </div>
      </section>

      <section className={styles.entry_section}>
        <span className={styles.entry_eyebrow}>DATE</span>
        <label className={styles.entry_textField}>
          <HiOutlineCalendar aria-hidden className={styles.entry_fieldIcon} />
          <span className={styles.entry_dateDisplay}>
            {friendlyDate(form.transactionDate)}
          </span>
          <HiOutlineChevronDown aria-hidden className={styles.entry_fieldChevron} />
          <input
            type="date"
            value={form.transactionDate}
            onChange={(e) => set("transactionDate", e.target.value)}
            className={styles.entry_dateInput}
            aria-label="Transaction date"
          />
        </label>
      </section>

      <footer className={styles.entry_footer}>
        <button
          type="button"
          onClick={submit}
          className={styles.entry_confirm}
        >
          <span>{existing ? "Save Changes" : "Confirm Transaction"}</span>
          <HiOutlineArrowRight aria-hidden />
        </button>
      </footer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this transaction?"
        description="This will permanently remove the entry."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};
