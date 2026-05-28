"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Field, Input, TextArea } from "@/components/Field/Field";
import { Chip } from "@/components/Chip/Chip";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE, QUICK_TAGS } from "@/constants";
import { useCreatePerson, useUpdatePerson } from "@/hooks/usePeople";
import { usePeople } from "@/hooks/usePeople";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/useToast";
import type { Person } from "@/types";
import styles from "./PersonForm.module.scss";

interface PersonFormProps {
  personId?: string;
  onDone: () => void;
}

const splitPhone = (raw?: string): { dial: string; local: string } => {
  if (!raw) return { dial: DEFAULT_COUNTRY_CODE, local: "" };
  const match = COUNTRY_CODES.find((c) => raw.startsWith(c.dial));
  if (match) {
    return { dial: match.dial, local: raw.slice(match.dial.length).trim() };
  }
  return { dial: DEFAULT_COUNTRY_CODE, local: raw.trim() };
};

const today = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const PersonForm = ({ personId, onDone }: PersonFormProps) => {
  const { data: people = [] } = usePeople();
  const existing = useMemo(() => people.find((p) => p.id === personId), [people, personId]);
  const create = useCreatePerson();
  const update = useUpdatePerson();
  const createTx = useCreateTransaction();
  const toast = useToast();

  const initialPhone = splitPhone(existing?.phone);

  const [name, setName] = useState(existing?.name ?? "");
  const [dial, setDial] = useState(initialPhone.dial);
  const [phone, setPhone] = useState(initialPhone.local);
  const [email, setEmail] = useState(existing?.email ?? "");
  const [note, setNote] = useState(existing?.note ?? "");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [error, setError] = useState("");

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    const phoneFull = phone.trim() ? `${dial} ${phone.trim()}` : undefined;
    const amountValue = amount.trim() ? Number(amount) : 0;
    if (amount.trim() && (Number.isNaN(amountValue) || amountValue < 0)) {
      setError("Enter a valid amount");
      return;
    }

    try {
      if (existing) {
        await update.mutateAsync({
          id: existing.id,
          patch: {
            name: name.trim(),
            phone: phoneFull,
            email: email.trim() || undefined,
            note: note.trim() || undefined,
            tags,
          } as Partial<Person>,
        });
        toast.success("Borrower updated");
      } else {
        const person = await create.mutateAsync({
          name,
          phone: phoneFull,
          email,
          note,
          tags,
        });
        if (amountValue > 0) {
          await createTx.mutateAsync({
            personId: person.id,
            type: "lend",
            amount: amountValue,
            date: new Date(date).toISOString(),
          });
          toast.success("Borrower added with opening entry");
        } else {
          toast.success("Borrower added");
        }
      }
      onDone();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const pending = create.isPending || update.isPending || createTx.isPending;

  return (
    <form className={styles.form} onSubmit={submit}>
      <Field label="Full name" required error={error}>
        <Input
          icon="people"
          placeholder="e.g. Alex Morgan"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          autoFocus={!existing}
        />
      </Field>

      <Field label="Phone">
        <span className={styles.phoneRow}>
          <span className={styles.dialWrap}>
            <select
              className={styles.dialSelect}
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              aria-label="Country code"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.dial}>
                  {c.code} {c.dial}
                </option>
              ))}
            </select>
          </span>
          <Input
            icon="phone"
            inputMode="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9 -]/g, ""))}
          />
        </span>
      </Field>

      <Field label="Email">
        <Input
          icon="mail"
          type="email"
          placeholder="Optional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      {!existing && (
        <div className={styles.row}>
          <Field label="Opening amount" hint="Optional, money you lent today">
            <Input
              icon="wallet"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
      )}

      <Field label="Tags">
        <div className={styles.tags}>
          {QUICK_TAGS.map((tag) => (
            <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
              {tag}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Note">
        <TextArea
          placeholder="Add context about this borrower"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>

      <Button type="submit" fullWidth size="lg" loading={pending}>
        {existing ? "Save changes" : "Add borrower"}
      </Button>
    </form>
  );
};
