import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { DB_NAME, DB_VERSION, STORE_PEOPLE, STORE_TRANSACTIONS } from "@/constants";
import type { Person, Transaction } from "@/types";

interface CashTrackDB extends DBSchema {
  [STORE_PEOPLE]: {
    key: string;
    value: Person;
    indexes: { "by-status": string; "by-updated": string };
  };
  [STORE_TRANSACTIONS]: {
    key: string;
    value: Transaction;
    indexes: { "by-person": string; "by-date": string };
  };
}

let dbPromise: Promise<IDBPDatabase<CashTrackDB>> | null = null;

export const getDB = (): Promise<IDBPDatabase<CashTrackDB>> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable on the server"));
  }
  if (!dbPromise) {
    dbPromise = openDB<CashTrackDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_PEOPLE)) {
          const people = db.createObjectStore(STORE_PEOPLE, { keyPath: "id" });
          people.createIndex("by-status", "status");
          people.createIndex("by-updated", "updatedAt");
        }
        if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
          const tx = db.createObjectStore(STORE_TRANSACTIONS, { keyPath: "id" });
          tx.createIndex("by-person", "personId");
          tx.createIndex("by-date", "date");
        }
      },
    });
  }
  return dbPromise;
};

export const clearDatabase = async (): Promise<void> => {
  const db = await getDB();
  await Promise.all([db.clear(STORE_PEOPLE), db.clear(STORE_TRANSACTIONS)]);
};
