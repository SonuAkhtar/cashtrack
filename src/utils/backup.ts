import { APP_VERSION } from "@/constants";
import type { AppBackup, Person, Transaction } from "@/types";
import { nowISO } from "./date";

export const createBackup = (people: Person[], transactions: Transaction[]): AppBackup => ({
  version: APP_VERSION,
  exportedAt: nowISO(),
  people,
  transactions,
});

const serializeBackup = (backup: AppBackup): string =>
  JSON.stringify(backup, null, 2);

export const parseBackup = (raw: string): AppBackup => {
  const data = JSON.parse(raw) as Partial<AppBackup>;
  if (!data || !Array.isArray(data.people) || !Array.isArray(data.transactions)) {
    throw new Error("Invalid backup file");
  }
  return {
    version: data.version ?? "unknown",
    exportedAt: data.exportedAt ?? nowISO(),
    people: data.people,
    transactions: data.transactions,
  };
};

export const downloadBackup = (backup: AppBackup): void => {
  const blob = new Blob([serializeBackup(backup)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cashtrack-backup-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
