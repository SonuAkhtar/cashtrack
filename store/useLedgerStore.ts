"use client";

import { create } from "zustand";
import { mockBorrowers, mockRepayments, mockTransactions } from "@/data/mock";
import type { Borrower, Repayment, Transaction } from "@/types";
import { createId } from "@/utils/id";

interface LedgerState {
  borrowers: Borrower[];
  transactions: Transaction[];
  repayments: Repayment[];

  addBorrower: (input: Omit<Borrower, "id" | "createdAt">) => Borrower;
  upsertBorrowerByName: (name: string, avatarColor?: string) => Borrower;

  addTransaction: (
    input: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => Transaction;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addRepayment: (input: Omit<Repayment, "id">) => Repayment;
}

export const useLedgerStore = create<LedgerState>((set, get) => ({
  borrowers: mockBorrowers,
  transactions: mockTransactions,
  repayments: mockRepayments,

  addBorrower: (input) => {
    const borrower: Borrower = {
      ...input,
      id: createId("b"),
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ borrowers: [...s.borrowers, borrower] }));
    return borrower;
  },

  upsertBorrowerByName: (name, avatarColor) => {
    const existing = get().borrowers.find(
      (b) => b.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (existing) return existing;
    return get().addBorrower({
      name: name.trim(),
      avatarColor: avatarColor ?? "#60a5fa",
    });
  },

  addTransaction: (input) => {
    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...input,
      id: createId("t"),
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ transactions: [transaction, ...s.transactions] }));
    return transaction;
  },

  updateTransaction: (id, patch) => {
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
      ),
    }));
  },

  deleteTransaction: (id) => {
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
      repayments: s.repayments.filter((r) => r.transactionId !== id),
    }));
  },

  addRepayment: (input) => {
    const repayment: Repayment = { ...input, id: createId("r") };
    set((s) => ({ repayments: [repayment, ...s.repayments] }));
    return repayment;
  },
}));
