"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineUser,
} from "react-icons/hi2";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { TextField } from "@/components/TextField/TextField";
import { TextArea } from "@/components/TextArea/TextArea";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { getCurrencySymbol } from "@/utils/currency";
import { useLedgerStore } from "@/store/useLedgerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { categoryLabels, statusLabels } from "@/lib/constants";
import type { TransactionCategory, TransactionStatus } from "@/types";
import styles from "./EntryFormView.module.css";

const statusOptions: { value: TransactionStatus; label: string }[] = [
  { value: "active", label: statusLabels.active },
  { value: "partial", label: statusLabels.partial },
  { value: "overdue", label: statusLabels.overdue },
  { value: "settled", label: statusLabels.settled },
];

const categoryOptions: { value: TransactionCategory; label: string }[] = [
  { value: "personal", label: categoryLabels.personal },
  { value: "business", label: categoryLabels.business },
  { value: "family", label: categoryLabels.family },
  { value: "emergency", label: categoryLabels.emergency },
  { value: "other", label: categoryLabels.other },
];

const toDateInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface FormState {
  name: string;
  amount: string;
  recovered: string;
  transactionDate: string;
  dueDate: string;
  notes: string;
  status: TransactionStatus;
  category: TransactionCategory;
  tags: string;
}

const emptyState: FormState = {
  name: "",
  amount: "",
  recovered: "",
  transactionDate: toDateInput(new Date().toISOString()),
  dueDate: "",
  notes: "",
  status: "active",
  category: "personal",
  tags: "",
};

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
  const existingBorrower = useMemo(
    () => (existing ? borrowers.find((b) => b.id === existing.borrowerId) : undefined),
    [existing, borrowers],
  );

  const [form, setForm] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existingBorrower?.name ?? "",
        amount: String(existing.amount),
        recovered: String(existing.recovered),
        transactionDate: toDateInput(existing.transactionDate),
        dueDate: toDateInput(existing.dueDate),
        notes: existing.notes ?? "",
        status: existing.status,
        category: existing.category,
        tags: (existing.tags ?? []).join(", "),
      });
    } else {
      setForm(emptyState);
    }
  }, [existing, existingBorrower]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Borrower name is required";
    const amount = parseFloat(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0)
      next.amount = "Enter a valid amount";
    const recovered = form.recovered ? parseFloat(form.recovered) : 0;
    if (Number.isNaN(recovered) || recovered < 0)
      next.recovered = "Enter a valid amount";
    if (!Number.isNaN(amount) && recovered > amount)
      next.recovered = "Cannot exceed amount lent";
    if (!form.transactionDate) next.transactionDate = "Pick a transaction date";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const amount = parseFloat(form.amount);
    const recovered = form.recovered ? parseFloat(form.recovered) : 0;
    const borrower = upsertBorrowerByName(form.name);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      borrowerId: borrower.id,
      amount,
      recovered,
      transactionDate: new Date(form.transactionDate).toISOString(),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      notes: form.notes || undefined,
      status: form.status,
      category: form.category,
      tags: tags.length ? tags : undefined,
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
      router.push("/");
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <motion.div
      className={styles.entry_root}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.entry_header}>
        <h1 className={styles.entry_title}>
          {existing ? "Edit entry" : "New entry"}
        </h1>
        <p className={styles.entry_subtitle}>
          {existing
            ? "Update the details of this transaction."
            : "Record a new amount you lent to someone."}
        </p>
      </header>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Borrower</h2>
        <TextField
          label="Borrower name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          prefix={<HiOutlineUser aria-hidden />}
          error={errors.name}
          autoComplete="off"
        />
      </Card>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Amounts</h2>
        <div className={styles.entry_grid}>
          <TextField
            label="Amount lent"
            inputMode="decimal"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            prefix={<span className={styles.entry_symbol}>{symbol}</span>}
            error={errors.amount}
          />
          <TextField
            label="Recovered so far"
            inputMode="decimal"
            value={form.recovered}
            onChange={(e) => set("recovered", e.target.value)}
            prefix={<span className={styles.entry_symbol}>{symbol}</span>}
            error={errors.recovered}
          />
        </div>
      </Card>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Dates</h2>
        <div className={styles.entry_grid}>
          <TextField
            label="Transaction date"
            type="date"
            value={form.transactionDate}
            onChange={(e) => set("transactionDate", e.target.value)}
            prefix={<HiOutlineCalendar aria-hidden />}
            error={errors.transactionDate}
          />
          <TextField
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            prefix={<HiOutlineCalendar aria-hidden />}
            hint="Optional"
          />
        </div>
      </Card>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Status</h2>
        <SegmentedControl
          options={statusOptions}
          value={form.status}
          onChange={(v) => set("status", v)}
          ariaLabel="Status"
          size="sm"
        />
      </Card>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Category</h2>
        <SegmentedControl
          options={categoryOptions}
          value={form.category}
          onChange={(v) => set("category", v)}
          ariaLabel="Category"
          size="sm"
        />
        <TextField
          label="Tags"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          hint="Separate with commas"
        />
      </Card>

      <Card variant="raised" className={styles.entry_section}>
        <h2 className={styles.entry_sectionTitle}>Notes</h2>
        <TextArea
          label="Payment notes"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          hint="Optional context, agreement terms, or reminders"
        />
      </Card>

      <div className={styles.entry_actions}>
        <Button variant="ghost" onClick={() => router.back()} block>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={submit}
          iconLeft={<HiOutlineCheck aria-hidden />}
          block
        >
          {existing ? "Save changes" : "Add entry"}
        </Button>
      </div>

      {existing && (
        <div className={styles.entry_dangerZone}>
          <Button
            variant="ghost"
            iconLeft={<HiOutlineTrash aria-hidden />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete entry
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this entry?"
        description="This will permanently remove the transaction and its repayment history."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </motion.div>
  );
};
