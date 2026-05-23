import { differenceInCalendarDays, format, formatDistanceToNowStrict, parseISO } from "date-fns";

const toDate = (value: string | Date): Date =>
  typeof value === "string" ? parseISO(value) : value;

export const formatDate = (value: string | Date, pattern = "MMM d, yyyy"): string =>
  format(toDate(value), pattern);

export const formatRelative = (value: string | Date): string =>
  formatDistanceToNowStrict(toDate(value), { addSuffix: true });

export const daysUntil = (value: string | Date): number =>
  differenceInCalendarDays(toDate(value), new Date());

export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return daysUntil(dueDate) < 0;
};
