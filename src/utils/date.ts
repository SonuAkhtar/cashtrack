import {
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  isAfter,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import type { ISODate } from "@/types";

export const nowISO = (): ISODate => new Date().toISOString();

export const toInputDate = (iso: ISODate): string => format(parseISO(iso), "yyyy-MM-dd");

export const fromInputDate = (value: string): ISODate => {
  const date = new Date(`${value}T00:00:00`);
  return date.toISOString();
};

export const formatDate = (iso: ISODate, pattern = "MMM d, yyyy"): string =>
  format(parseISO(iso), pattern);

export const formatRelative = (iso: ISODate): string => {
  const date = parseISO(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

const daysUntil = (iso: ISODate): number =>
  differenceInCalendarDays(parseISO(iso), new Date());

export const isOverdue = (dueDate: ISODate | undefined | null): boolean => {
  if (!dueDate) return false;
  return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
};

export const monthKey = (iso: ISODate): string => format(parseISO(iso), "yyyy-MM");

export const lastNMonths = (n: number): { key: string; label: string; date: Date }[] => {
  const result: { key: string; label: string; date: Date }[] = [];
  const base = startOfMonth(new Date());
  for (let i = n - 1; i >= 0; i -= 1) {
    const date = subMonths(base, i);
    result.push({ key: format(date, "yyyy-MM"), label: format(date, "MMM"), date });
  }
  return result;
};

export const dueLabel = (iso: ISODate): string => {
  const days = daysUntil(iso);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 30) return `Due in ${days}d`;
  return `Due ${formatDate(iso, "MMM d")}`;
};
