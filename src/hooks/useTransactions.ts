"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
  type TransactionDraft,
} from "@/services/transactionService";
import { queryKeys } from "@/services/queryKeys";
import type { Transaction } from "@/types";

export const useTransactions = () =>
  useQuery({
    queryKey: queryKeys.transactions,
    queryFn: getAllTransactions,
  });

export const useCreateTransaction = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (draft: TransactionDraft) => createTransaction(draft),
    onSuccess: (transaction) => {
      client.setQueryData<Transaction[]>(queryKeys.transactions, (prev = []) => [
        ...prev,
        transaction,
      ]);
      client.invalidateQueries({ queryKey: queryKeys.people });
    },
  });
};

export const useUpdateTransaction = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Transaction> }) =>
      updateTransaction(id, patch),
    onSuccess: (transaction) => {
      client.setQueryData<Transaction[]>(queryKeys.transactions, (prev = []) =>
        prev.map((t) => (t.id === transaction.id ? transaction : t))
      );
    },
  });
};

export const useDeleteTransaction = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: queryKeys.transactions });
      const previous = client.getQueryData<Transaction[]>(queryKeys.transactions);
      client.setQueryData<Transaction[]>(queryKeys.transactions, (prev = []) =>
        prev.filter((t) => t.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) client.setQueryData(queryKeys.transactions, context.previous);
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};
