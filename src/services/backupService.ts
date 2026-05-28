import type { AppBackup } from "@/types";
import { clearDatabase } from "./db";
import { bulkPutPeople, getAllPeople } from "./peopleService";
import { bulkPutTransactions, getAllTransactions } from "./transactionService";

export const exportData = async (): Promise<{ people: Awaited<ReturnType<typeof getAllPeople>>; transactions: Awaited<ReturnType<typeof getAllTransactions>> }> => {
  const [people, transactions] = await Promise.all([getAllPeople(), getAllTransactions()]);
  return { people, transactions };
};

export const importData = async (backup: AppBackup, replace = true): Promise<void> => {
  if (replace) await clearDatabase();
  await Promise.all([bulkPutPeople(backup.people), bulkPutTransactions(backup.transactions)]);
};

export const resetData = async (): Promise<void> => {
  await clearDatabase();
};
