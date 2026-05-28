export type ISODate = string;

export type PersonStatus = "active" | "archived";

export interface Person {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  avatarColor: string;
  tags: string[];
  favorite: boolean;
  status: PersonStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type TransactionType = "lend" | "repayment";

export type RepaymentMode = "full" | "partial" | "emi";

export interface RepaymentSchedule {
  enabled: boolean;
  installments: number;
  amountPerInstallment: number;
  startDate: ISODate;
  frequency: "weekly" | "biweekly" | "monthly";
}

export interface Transaction {
  id: string;
  personId: string;
  type: TransactionType;
  amount: number;
  date: ISODate;
  dueDate?: ISODate;
  note?: string;
  mode?: RepaymentMode;
  schedule?: RepaymentSchedule;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type LedgerStatus = "completed" | "partial" | "overdue" | "pending" | "inactive";

export interface PersonLedger {
  person: Person;
  totalLent: number;
  totalRepaid: number;
  pending: number;
  overdue: number;
  repaymentPercentage: number;
  status: LedgerStatus;
  lastActivity: ISODate | null;
  nextDueDate: ISODate | null;
  transactionCount: number;
}

export interface DashboardSummary {
  totalLent: number;
  totalRecovered: number;
  pending: number;
  overdue: number;
  activeBorrowers: number;
  recoveryRate: number;
  overdueCount: number;
  completedCount: number;
}

export interface MonthlyPoint {
  month: string;
  label: string;
  lent: number;
  recovered: number;
}

export interface StatusDistribution {
  status: LedgerStatus;
  label: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  personId: string;
  personName: string;
  avatarColor: string;
  type: TransactionType;
  amount: number;
  date: ISODate;
  note?: string;
}

export interface AppBackup {
  version: string;
  exportedAt: ISODate;
  people: Person[];
  transactions: Transaction[];
}
