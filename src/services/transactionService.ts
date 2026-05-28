import { STORE_TRANSACTIONS } from "@/constants";
import type { RepaymentMode, RepaymentSchedule, Transaction, TransactionType } from "@/types";
import { nowISO } from "@/utils/date";
import { createId } from "@/utils/id";
import { getDB } from "./db";

export type TransactionDraft = {
  personId: string;
  type: TransactionType;
  amount: number;
  date: string;
  dueDate?: string;
  note?: string;
  mode?: RepaymentMode;
  schedule?: RepaymentSchedule;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  return db.getAll(STORE_TRANSACTIONS);
};

export const createTransaction = async (draft: TransactionDraft): Promise<Transaction> => {
  const db = await getDB();
  const timestamp = nowISO();
  const transaction: Transaction = {
    id: createId("t"),
    personId: draft.personId,
    type: draft.type,
    amount: Math.abs(draft.amount),
    date: draft.date,
    dueDate: draft.dueDate,
    note: draft.note?.trim() || undefined,
    mode: draft.mode,
    schedule: draft.schedule,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.put(STORE_TRANSACTIONS, transaction);
  return transaction;
};

export const updateTransaction = async (
  id: string,
  patch: Partial<Omit<Transaction, "id" | "createdAt" | "personId">>
): Promise<Transaction> => {
  const db = await getDB();
  const existing = await db.get(STORE_TRANSACTIONS, id);
  if (!existing) throw new Error("Transaction not found");
  const updated: Transaction = { ...existing, ...patch, updatedAt: nowISO() };
  await db.put(STORE_TRANSACTIONS, updated);
  return updated;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORE_TRANSACTIONS, id);
};

export const bulkPutTransactions = async (transactions: Transaction[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(STORE_TRANSACTIONS, "readwrite");
  await Promise.all(transactions.map((t) => tx.store.put(t)));
  await tx.done;
};
