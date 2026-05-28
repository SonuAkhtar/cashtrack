"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Field, Input, TextArea } from "@/components/Field/Field";
import { Chip } from "@/components/Chip/Chip";
import { Avatar } from "@/components/Avatar/Avatar";
import { AVATAR_COLORS, QUICK_TAGS } from "@/constants";
import { useCreatePerson, useUpdatePerson } from "@/hooks/usePeople";
import { usePeople } from "@/hooks/usePeople";
import { useToast } from "@/hooks/useToast";
import { pickAvatarColor } from "@/utils/id";
import type { Person } from "@/types";
import styles from "./PersonForm.module.scss";

interface PersonFormProps {
  personId?: string;
  onDone: () => void;
}

export const PersonForm = ({ personId, onDone }: PersonFormProps) => {
  const { data: people = [] } = usePeople();
  const existing = useMemo(() => people.find((p) => p.id === personId), [people, personId]);
  const create = useCreatePerson();
  const update = useUpdatePerson();
  const toast = useToast();

  const [name, setName] = useState(existing?.name ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [note, setNote] = useState(existing?.note ?? "");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [color, setColor] = useState(existing?.avatarColor ?? pickAvatarColor());
  const [error, setError] = useState("");

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    try {
      if (existing) {
        await update.mutateAsync({
          id: existing.id,
          patch: {
            name: name.trim(),
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            note: note.trim() || undefined,
            tags,
            avatarColor: color,
          } as Partial<Person>,
        });
        toast.success("Borrower updated");
      } else {
        await create.mutateAsync({ name, phone, email, note, tags, avatarColor: color });
        toast.success("Borrower added");
      }
      onDone();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.preview}>
        <Avatar name={name || "?"} color={color} size="xl" />
        <div className={styles.swatches}>
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.swatch} ${c === color ? styles["swatch--active"] : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

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

      <div className={styles.row}>
        <Field label="Phone">
          <Input icon="phone" inputMode="tel" placeholder="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input icon="mail" type="email" placeholder="Optional" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
      </div>

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
        <TextArea placeholder="Add context about this borrower" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>

      <Button type="submit" fullWidth size="lg" loading={pending}>
        {existing ? "Save changes" : "Add borrower"}
      </Button>
    </form>
  );
};
