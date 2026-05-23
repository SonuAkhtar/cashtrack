export type TransactionStatus = "active" | "partial" | "settled" | "overdue";

export type TransactionCategory =
  | "personal"
  | "business"
  | "family"
  | "emergency"
  | "other";

export interface Repayment {
  id: string;
  transactionId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Transaction {
  id: string;
  borrowerId: string;
  amount: number;
  recovered: number;
  transactionDate: string;
  dueDate?: string;
  notes?: string;
  status: TransactionStatus;
  category: TransactionCategory;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Borrower {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatarColor: string;
  createdAt: string;
}

export interface BorrowerStats {
  borrower: Borrower;
  totalLent: number;
  totalRecovered: number;
  pending: number;
  repaymentPercentage: number;
  lastPaymentDate?: string;
  activeTransactions: number;
  status: TransactionStatus;
}

export interface DashboardSummary {
  totalLent: number;
  totalRecovered: number;
  totalPending: number;
  monthlyRecovery: number;
  activeBorrowers: number;
  overdueCount: number;
  recoveryRate: number;
}

export interface MonthlyPoint {
  month: string;
  lent: number;
  recovered: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  count: number;
}

export type Currency = "INR";

export interface AppPreferences {
  theme: "light" | "dark";
  currency: Currency;
  notifications: {
    dueReminders: boolean;
    weeklyDigest: boolean;
    paymentReceived: boolean;
  };
  profile: {
    name: string;
    email: string;
  };
}
