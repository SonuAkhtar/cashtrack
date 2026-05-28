import { STORE_PEOPLE } from "@/constants";
import type { Person } from "@/types";
import { nowISO } from "@/utils/date";
import { createId, pickAvatarColor } from "@/utils/id";
import { getDB } from "./db";

export type PersonDraft = {
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  tags?: string[];
  favorite?: boolean;
  avatarColor?: string;
};

export const getAllPeople = async (): Promise<Person[]> => {
  const db = await getDB();
  return db.getAll(STORE_PEOPLE);
};

export const createPerson = async (draft: PersonDraft): Promise<Person> => {
  const db = await getDB();
  const timestamp = nowISO();
  const person: Person = {
    id: createId("p"),
    name: draft.name.trim(),
    phone: draft.phone?.trim() || undefined,
    email: draft.email?.trim() || undefined,
    note: draft.note?.trim() || undefined,
    tags: draft.tags ?? [],
    favorite: draft.favorite ?? false,
    avatarColor: draft.avatarColor ?? pickAvatarColor(draft.name),
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.put(STORE_PEOPLE, person);
  return person;
};

export const updatePerson = async (
  id: string,
  patch: Partial<Omit<Person, "id" | "createdAt">>
): Promise<Person> => {
  const db = await getDB();
  const existing = await db.get(STORE_PEOPLE, id);
  if (!existing) throw new Error("Person not found");
  const updated: Person = { ...existing, ...patch, updatedAt: nowISO() };
  await db.put(STORE_PEOPLE, updated);
  return updated;
};

export const deletePerson = async (id: string): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction([STORE_PEOPLE, "transactions"], "readwrite");
  await tx.objectStore(STORE_PEOPLE).delete(id);
  const txStore = tx.objectStore("transactions");
  const index = txStore.index("by-person");
  let cursor = await index.openCursor(id);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
};

export const bulkPutPeople = async (people: Person[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(STORE_PEOPLE, "readwrite");
  await Promise.all(people.map((p) => tx.store.put(p)));
  await tx.done;
};
