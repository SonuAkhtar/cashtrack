import type {
  Borrower,
  BorrowerStats,
  CategoryBreakdown,
  DashboardSummary,
  MonthlyPoint,
  Repayment,
  Transaction,
  TransactionStatus,
} from "@/types";

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const calculatePending = (t: Transaction): number =>
  Math.max(0, t.amount - t.recovered);

export const getDashboardSummary = (transactions: Transaction[]): DashboardSummary => {
  const totalLent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalRecovered = transactions.reduce((s, t) => s + t.recovered, 0);
  const totalPending = totalLent - totalRecovered;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthlyRecovery = transactions.reduce((sum, t) => {
    const updated = new Date(t.updatedAt);
    if (updated >= monthStart && t.recovered > 0) {
      return sum + t.recovered;
    }
    return sum;
  }, 0);

  const activeBorrowerIds = new Set(
    transactions.filter((t) => t.status !== "settled").map((t) => t.borrowerId),
  );

  const overdueCount = transactions.filter((t) => t.status === "overdue").length;
  const recoveryRate = totalLent === 0 ? 0 : (totalRecovered / totalLent) * 100;

  return {
    totalLent,
    totalRecovered,
    totalPending,
    monthlyRecovery,
    activeBorrowers: activeBorrowerIds.size,
    overdueCount,
    recoveryRate,
  };
};

export const getBorrowerStats = (
  borrowers: Borrower[],
  transactions: Transaction[],
  repayments: Repayment[],
): BorrowerStats[] => {
  return borrowers.map((borrower) => {
    const txs = transactions.filter((t) => t.borrowerId === borrower.id);
    const totalLent = txs.reduce((s, t) => s + t.amount, 0);
    const totalRecovered = txs.reduce((s, t) => s + t.recovered, 0);
    const pending = Math.max(0, totalLent - totalRecovered);
    const repaymentPercentage =
      totalLent === 0 ? 0 : (totalRecovered / totalLent) * 100;

    const txIds = txs.map((t) => t.id);
    const lastPayment = repayments
      .filter((r) => txIds.includes(r.transactionId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const activeTransactions = txs.filter((t) => t.status !== "settled").length;
    const overall: TransactionStatus = txs.some((t) => t.status === "overdue")
      ? "overdue"
      : txs.every((t) => t.status === "settled") && txs.length > 0
        ? "settled"
        : txs.some((t) => t.status === "partial")
          ? "partial"
          : "active";

    return {
      borrower,
      totalLent,
      totalRecovered,
      pending,
      repaymentPercentage,
      lastPaymentDate: lastPayment?.date,
      activeTransactions,
      status: overall,
    };
  });
};

export const getMonthlyPoints = (
  transactions: Transaction[],
  months = 6,
): MonthlyPoint[] => {
  const now = new Date();
  const points: MonthlyPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthLabel = monthDate.toLocaleString("en-US", { month: "short" });

    const lent = transactions
      .filter((t) => {
        const d = new Date(t.transactionDate);
        return d >= monthDate && d < monthEnd;
      })
      .reduce((s, t) => s + t.amount, 0);

    const recovered = transactions
      .filter((t) => {
        const d = new Date(t.updatedAt);
        return d >= monthDate && d < monthEnd;
      })
      .reduce((s, t) => s + t.recovered, 0);

    points.push({ month: monthLabel, lent, recovered });
  }
  return points;
};

export const getCategoryBreakdown = (
  transactions: Transaction[],
): CategoryBreakdown[] => {
  const map = new Map<string, CategoryBreakdown>();
  for (const t of transactions) {
    const existing = map.get(t.category) ?? {
      category: t.category,
      amount: 0,
      count: 0,
    };
    existing.amount += calculatePending(t);
    existing.count += 1;
    map.set(t.category, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
};

export const sortByRecent = <T extends { updatedAt: string }>(items: T[]): T[] =>
  [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
