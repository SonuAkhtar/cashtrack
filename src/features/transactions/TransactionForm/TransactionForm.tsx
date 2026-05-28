"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Field, Input, Select, TextArea } from "@/components/Field/Field";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { Avatar } from "@/components/Avatar/Avatar";
import { REPAYMENT_FREQUENCIES } from "@/constants";
import { useCurrency } from "@/hooks/useCurrency";
import { usePeople, useCreatePerson } from "@/hooks/usePeople";
import { useLedgers } from "@/hooks/useLedgers";
import { useCreateTransaction, useTransactions, useUpdateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/useToast";
import { fromInputDate, nowISO, toInputDate } from "@/utils/date";
import { parseAmount } from "@/utils/format";
import type { RepaymentMode, RepaymentSchedule, TransactionType } from "@/types";
import styles from "./TransactionForm.module.scss";

interface TransactionFormProps {
  personId?: string;
  transactionId?: string;
  defaultType?: TransactionType;
  onDone: () => void;
}

const NEW_PERSON = "__new__";
const TYPE_TONES: Partial<Record<TransactionType, string>> = { lend: "lend", repayment: "repay" };
const today = () => toInputDate(nowISO());

export const TransactionForm = ({ personId, transactionId, defaultType = "lend", onDone }: TransactionFormProps) => {
  const { data: people = [] } = usePeople();
  const { data: transactions = [] } = useTransactions();
  const { ledgers } = useLedgers();
  const { symbol } = useCurrency();
  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const addPerson = useCreatePerson();
  const toast = useToast();

  const existing = useMemo(
    () => transactions.find((t) => t.id === transactionId),
    [transactions, transactionId]
  );

  const initialPerson =
    existing?.personId ?? personId ?? people.find((p) => p.status === "active")?.id ?? NEW_PERSON;

  const [type, setType] = useState<TransactionType>(existing?.type ?? defaultType);
  const [selectedPerson, setSelectedPerson] = useState(initialPerson);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [date, setDate] = useState(existing ? toInputDate(existing.date) : today());
  const [dueDate, setDueDate] = useState(existing?.dueDate ? toInputDate(existing.dueDate) : "");
  const [note, setNote] = useState(existing?.note ?? "");
  const [mode, setMode] = useState<RepaymentMode>(existing?.mode ?? "full");
  const [installments, setInstallments] = useState(existing?.schedule?.installments ?? 3);
  const [frequency, setFrequency] = useState<RepaymentSchedule["frequency"]>(
    existing?.schedule?.frequency ?? "monthly"
  );
  const [error, setError] = useState("");

  const activePeople = people.filter((p) => p.status === "active");
  const ledger = ledgers.find((l) => l.person.id === selectedPerson);
  const numericAmount = parseAmount(amount);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const isNewPerson = selectedPerson === NEW_PERSON;
    if (isNewPerson && !newName.trim()) {
      setNameError("Enter the borrower's name");
      return;
    }
    if (!isNewPerson && !selectedPerson) {
      setError("Select a borrower first");
      return;
    }
    if (numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    const schedule: RepaymentSchedule | undefined =
      type === "repayment" && mode === "emi"
        ? {
            enabled: true,
            installments,
            amountPerInstallment: Math.round((numericAmount / installments) * 100) / 100,
            startDate: fromInputDate(date),
            frequency,
          }
        : undefined;

    try {
      let resolvedPersonId = selectedPerson;
      if (isNewPerson) {
        const person = await addPerson.mutateAsync({ name: newName });
        resolvedPersonId = person.id;
      }

      const payload = {
        personId: resolvedPersonId,
        type,
        amount: numericAmount,
        date: fromInputDate(date),
        dueDate: type === "lend" && dueDate ? fromInputDate(dueDate) : undefined,
        note,
        mode: type === "repayment" ? mode : undefined,
        schedule,
      };

      if (existing) {
        await update.mutateAsync({ id: existing.id, patch: payload });
        toast.success("Transaction updated");
      } else {
        await create.mutateAsync(payload);
        toast.success(type === "lend" ? "Lending recorded" : "Repayment recorded");
      }
      onDone();
    } catch {
      toast.error("Could not save transaction");
    }
  };

  const pending = create.isPending || update.isPending || addPerson.isPending;

  return (
    <form className={styles.form} onSubmit={submit}>
      <SegmentedControl<TransactionType>
        layoutId="tx-type"
        options={[
          { value: "lend", label: "Money lent" },
          { value: "repayment", label: "Repayment" },
        ]}
        value={type}
        onChange={setType}
        tones={TYPE_TONES}
      />

      <Field label="Borrower" required>
        <Select value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)}>
          {activePeople.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
          <option value={NEW_PERSON}>+ Add new borrower</option>
        </Select>
      </Field>

      {selectedPerson === NEW_PERSON && (
        <Field label="New borrower name" required error={nameError}>
          <Input
            placeholder="e.g. Priya Sharma"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setNameError("");
            }}
            autoFocus
          />
        </Field>
      )}

      {ledger && ledger.pending > 0 && (
        <div className={styles.context}>
          <Avatar name={ledger.person.name} color={ledger.person.avatarColor} size="sm" />
          <div>
            <span className={styles.context__label}>Outstanding balance</span>
            <strong className={styles.context__value}>
              {symbol}
              {ledger.pending.toLocaleString()}
            </strong>
          </div>
        </div>
      )}

      <Field label="Amount" required error={error}>
        <Input
          prefix={symbol}
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          autoFocus={selectedPerson !== NEW_PERSON}
        />
      </Field>

      <div className={styles.row}>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today()} />
        </Field>
        {type === "lend" && (
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        )}
      </div>

      {type === "repayment" && (
        <Field label="Repayment type">
          <SegmentedControl<RepaymentMode>
            layoutId="tx-mode"
            size="sm"
            options={[
              { value: "full", label: "Full" },
              { value: "partial", label: "Partial" },
              { value: "emi", label: "EMI" },
            ]}
            value={mode}
            onChange={setMode}
          />
        </Field>
      )}

      {type === "repayment" && mode === "emi" && (
        <div className={styles.row}>
          <Field label="Installments">
            <Input
              inputMode="numeric"
              value={String(installments)}
              onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value || "1", 10)))}
            />
          </Field>
          <Field label="Frequency">
            <Select value={frequency} onChange={(e) => setFrequency(e.target.value as RepaymentSchedule["frequency"])}>
              {REPAYMENT_FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}

      <Field label="Note">
        <TextArea placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>

      <Button type="submit" fullWidth size="lg" loading={pending}>
        {existing ? "Save changes" : type === "lend" ? "Record lending" : "Record repayment"}
      </Button>
    </form>
  );
};
