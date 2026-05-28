"use client";

import { useMemo } from "react";
import {
  buildActivityFeed,
  buildDashboardSummary,
  buildLedgers,
  buildMonthlyTrend,
  buildStatusDistribution,
} from "@/utils/ledger";
import { usePeople } from "./usePeople";
import { useTransactions } from "./useTransactions";

export const useLedgers = () => {
  const { data: people = [], isLoading: peopleLoading } = usePeople();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();

  const ledgers = useMemo(
    () => buildLedgers(people, transactions),
    [people, transactions]
  );

  return { ledgers, people, transactions, isLoading: peopleLoading || txLoading };
};

export const usePersonLedger = (personId: string) => {
  const { ledgers, transactions, isLoading } = useLedgers();
  const ledger = useMemo(
    () => ledgers.find((l) => l.person.id === personId) ?? null,
    [ledgers, personId]
  );
  const personTransactions = useMemo(
    () =>
      [...transactions]
        .filter((t) => t.personId === personId)
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [transactions, personId]
  );
  return { ledger, transactions: personTransactions, isLoading };
};

export const useDashboardData = () => {
  const { ledgers, people, transactions, isLoading } = useLedgers();

  const summary = useMemo(() => buildDashboardSummary(ledgers), [ledgers]);
  const trend = useMemo(() => buildMonthlyTrend(transactions, 6), [transactions]);
  const distribution = useMemo(() => buildStatusDistribution(ledgers), [ledgers]);
  const activity = useMemo(() => buildActivityFeed(people, transactions, 8), [people, transactions]);

  return { summary, trend, distribution, activity, ledgers, isLoading };
};
