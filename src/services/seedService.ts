import { subDays, subMonths } from "date-fns";
import type { Person, Transaction } from "@/types";
import { createId, pickAvatarColor } from "@/utils/id";
import { nowISO } from "@/utils/date";
import { bulkPutPeople, getAllPeople } from "./peopleService";
import { bulkPutTransactions } from "./transactionService";

const SEED_FLAG = "cashtrack:seeded";

interface SeedPerson {
  name: string;
  phone?: string;
  tags: string[];
  favorite?: boolean;
  lends: { amount: number; daysAgo: number; dueInDays?: number; note?: string }[];
  repays: { amount: number; daysAgo: number }[];
}

const seedData: SeedPerson[] = [
  {
    name: "Alex Morgan",
    phone: "+1 555 0142",
    tags: ["Friend"],
    favorite: true,
    lends: [{ amount: 1200, daysAgo: 75, dueInDays: -10, note: "Car repair help" }],
    repays: [{ amount: 400, daysAgo: 50 }, { amount: 300, daysAgo: 20 }],
  },
  {
    name: "Priya Sharma",
    phone: "+1 555 0199",
    tags: ["Family"],
    lends: [{ amount: 800, daysAgo: 40, dueInDays: 12 }],
    repays: [{ amount: 800, daysAgo: 8 }],
  },
  {
    name: "Daniel Lee",
    tags: ["Colleague"],
    lends: [{ amount: 500, daysAgo: 95, dueInDays: -30, note: "Conference tickets" }],
    repays: [{ amount: 150, daysAgo: 60 }],
  },
  {
    name: "Sofia Rossi",
    tags: ["Business"],
    favorite: true,
    lends: [{ amount: 2500, daysAgo: 120, dueInDays: 30 }, { amount: 600, daysAgo: 30 }],
    repays: [{ amount: 1000, daysAgo: 80 }, { amount: 500, daysAgo: 15 }],
  },
  {
    name: "James Carter",
    tags: ["Friend", "Emergency"],
    lends: [{ amount: 300, daysAgo: 18, dueInDays: 5 }],
    repays: [],
  },
];

let inFlight: Promise<boolean> | null = null;

export const seedSampleData = (): Promise<boolean> => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!inFlight) inFlight = runSeed();
  return inFlight;
};

const runSeed = async (): Promise<boolean> => {
  if (localStorage.getItem(SEED_FLAG)) return false;
  localStorage.setItem(SEED_FLAG, "1");

  const existing = await getAllPeople();
  if (existing.length > 0) return false;

  const people: Person[] = [];
  const transactions: Transaction[] = [];
  const timestamp = nowISO();

  seedData.forEach((entry) => {
    const id = createId("p");
    people.push({
      id,
      name: entry.name,
      phone: entry.phone,
      tags: entry.tags,
      favorite: entry.favorite ?? false,
      avatarColor: pickAvatarColor(entry.name),
      status: "active",
      createdAt: subMonths(new Date(), 5).toISOString(),
      updatedAt: timestamp,
    });

    entry.lends.forEach((lend) => {
      const date = subDays(new Date(), lend.daysAgo);
      transactions.push({
        id: createId("t"),
        personId: id,
        type: "lend",
        amount: lend.amount,
        date: date.toISOString(),
        dueDate: lend.dueInDays !== undefined ? subDays(new Date(), -lend.dueInDays).toISOString() : undefined,
        note: lend.note,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      });
    });

    entry.repays.forEach((repay) => {
      const date = subDays(new Date(), repay.daysAgo);
      transactions.push({
        id: createId("t"),
        personId: id,
        type: "repayment",
        amount: repay.amount,
        date: date.toISOString(),
        mode: "partial",
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      });
    });
  });

  await bulkPutPeople(people);
  await bulkPutTransactions(transactions);
  return true;
};
