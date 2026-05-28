import type {
  ActivityItem,
  DashboardSummary,
  LedgerStatus,
  MonthlyPoint,
  Person,
  PersonLedger,
  StatusDistribution,
  Transaction,
} from "@/types";
import { isOverdue, lastNMonths, monthKey } from "./date";

const STATUS_META: Record<LedgerStatus, { label: string; color: string }> = {
  completed: { label: "Settled", color: "var(--success)" },
  partial: { label: "Partial", color: "var(--primary)" },
  overdue: { label: "Overdue", color: "var(--danger)" },
  pending: { label: "Pending", color: "var(--accent)" },
  inactive: { label: "Inactive", color: "var(--neutral)" },
};

export const buildPersonLedger = (
  person: Person,
  transactions: Transaction[]
): PersonLedger => {
  const owned = transactions.filter((t) => t.personId === person.id);

  const totalLent = owned
    .filter((t) => t.type === "lend")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRepaid = owned
    .filter((t) => t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);

  const pending = Math.max(totalLent - totalRepaid, 0);

  const overdue = owned
    .filter((t) => t.type === "lend" && isOverdue(t.dueDate))
    .reduce((sum, t) => sum + t.amount, 0);

  const settledOverdue = Math.max(overdue - totalRepaid, 0);

  const repaymentPercentage = totalLent > 0 ? Math.min((totalRepaid / totalLent) * 100, 100) : 0;

  const dates = owned.map((t) => t.date).sort();
  const lastActivity = dates.length ? dates[dates.length - 1] : null;

  const upcomingDue = owned
    .filter((t) => t.type === "lend" && t.dueDate && pending > 0)
    .map((t) => t.dueDate as string)
    .sort();
  const nextDueDate = upcomingDue.length ? upcomingDue[0] : null;

  let status: LedgerStatus;
  if (person.status === "archived" || totalLent === 0) status = "inactive";
  else if (pending <= 0.01) status = "completed";
  else if (settledOverdue > 0) status = "overdue";
  else if (totalRepaid > 0) status = "partial";
  else status = "pending";

  return {
    person,
    totalLent,
    totalRepaid,
    pending,
    overdue: settledOverdue,
    repaymentPercentage,
    status,
    lastActivity,
    nextDueDate,
    transactionCount: owned.length,
  };
};

export const buildLedgers = (people: Person[], transactions: Transaction[]): PersonLedger[] =>
  people.map((person) => buildPersonLedger(person, transactions));

export const buildDashboardSummary = (ledgers: PersonLedger[]): DashboardSummary => {
  const active = ledgers.filter((l) => l.person.status === "active");
  const totalLent = active.reduce((s, l) => s + l.totalLent, 0);
  const totalRecovered = active.reduce((s, l) => s + l.totalRepaid, 0);
  const pending = active.reduce((s, l) => s + l.pending, 0);
  const overdue = active.reduce((s, l) => s + l.overdue, 0);
  const activeBorrowers = active.filter((l) => l.pending > 0).length;
  const recoveryRate = totalLent > 0 ? Math.min((totalRecovered / totalLent) * 100, 100) : 0;
  const overdueCount = active.filter((l) => l.status === "overdue").length;
  const completedCount = active.filter((l) => l.status === "completed").length;

  return {
    totalLent,
    totalRecovered,
    pending,
    overdue,
    activeBorrowers,
    recoveryRate,
    overdueCount,
    completedCount,
  };
};

export const buildMonthlyTrend = (transactions: Transaction[], months = 6): MonthlyPoint[] => {
  const buckets = lastNMonths(months);
  const map = new Map(buckets.map((b) => [b.key, { lent: 0, recovered: 0 }]));

  transactions.forEach((t) => {
    const key = monthKey(t.date);
    const bucket = map.get(key);
    if (!bucket) return;
    if (t.type === "lend") bucket.lent += t.amount;
    else bucket.recovered += t.amount;
  });

  return buckets.map((b) => ({
    month: b.key,
    label: b.label,
    lent: map.get(b.key)?.lent ?? 0,
    recovered: map.get(b.key)?.recovered ?? 0,
  }));
};

export const buildStatusDistribution = (ledgers: PersonLedger[]): StatusDistribution[] => {
  const counts = new Map<LedgerStatus, number>();
  ledgers
    .filter((l) => l.person.status === "active")
    .forEach((l) => counts.set(l.status, (counts.get(l.status) ?? 0) + 1));

  return (Object.keys(STATUS_META) as LedgerStatus[])
    .map((status) => ({
      status,
      label: STATUS_META[status].label,
      color: STATUS_META[status].color,
      value: counts.get(status) ?? 0,
    }))
    .filter((d) => d.value > 0);
};

export const buildActivityFeed = (
  people: Person[],
  transactions: Transaction[],
  limit = 12
): ActivityItem[] => {
  const personMap = new Map(people.map((p) => [p.id, p]));
  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((t) => {
      const person = personMap.get(t.personId);
      return {
        id: t.id,
        personId: t.personId,
        personName: person?.name ?? "Unknown",
        avatarColor: person?.avatarColor ?? "var(--neutral)",
        type: t.type,
        amount: t.amount,
        date: t.date,
        note: t.note,
      };
    });
};

export const getStatusMeta = (status: LedgerStatus) => STATUS_META[status];
