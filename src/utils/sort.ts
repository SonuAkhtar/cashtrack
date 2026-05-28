import type { FilterKey, PersonLedger, SortKey } from "@/types";

export const sortLedgers = (ledgers: PersonLedger[], key: SortKey): PersonLedger[] => {
  const sorted = [...ledgers];
  switch (key) {
    case "pending":
      return sorted.sort((a, b) => b.pending - a.pending);
    case "overdue":
      return sorted.sort((a, b) => b.overdue - a.overdue || b.pending - a.pending);
    case "percentage":
      return sorted.sort((a, b) => b.repaymentPercentage - a.repaymentPercentage);
    case "name":
      return sorted.sort((a, b) => a.person.name.localeCompare(b.person.name));
    case "recent":
    default:
      return sorted.sort((a, b) =>
        (b.lastActivity ?? "").localeCompare(a.lastActivity ?? "")
      );
  }
};

export const filterLedgers = (
  ledgers: PersonLedger[],
  filter: FilterKey,
  query: string
): PersonLedger[] => {
  const q = query.trim().toLowerCase();
  return ledgers.filter((l) => {
    const matchesQuery =
      !q ||
      l.person.name.toLowerCase().includes(q) ||
      l.person.phone?.toLowerCase().includes(q) ||
      l.person.tags.some((t) => t.toLowerCase().includes(q));
    if (!matchesQuery) return false;

    switch (filter) {
      case "active":
        return l.person.status === "active" && l.pending > 0;
      case "overdue":
        return l.status === "overdue";
      case "completed":
        return l.status === "completed";
      case "favorite":
        return l.person.favorite && l.person.status === "active";
      case "archived":
        return l.person.status === "archived";
      case "all":
      default:
        return l.person.status === "active";
    }
  });
};
