export type SearchField = "q" | "first_name" | "last_name" | "born" | "death" | "description" | "location";
export type SourceFilter = "all" | "archive" | "notices";
export interface Obituary {
  id: string;
  person: string;
  first_name?: string | null;
  last_name?: string | null;
  birth?: string | null;
  death?: string | null;
  maiden_name?: string | null;
  text?: string | null;
  location?: string | null;
  thumbnail?: string | null;
  link?: string | null;
  source: "url" | "db";
}
export interface ObituaryResponse {
  total: number;
  count: number;
  limit: number;
  offset: number;
  results: Obituary[];
  warnings?: string[];
  message?: string;
}
export const SEARCH_FIELDS: { value: SearchField; label: string }[] = [
  { value: "q", label: "All fields" },
  { value: "first_name", label: "First name" },
  { value: "last_name", label: "Last name" },
  { value: "born", label: "Birth date / year" },
  { value: "death", label: "Death date / year" },
  { value: "location", label: "Location" },
  { value: "description", label: "Obituary text" },
];
export const SOURCE_FILTERS: { value: SourceFilter; label: string; description: string }[] = [
  { value: "all", label: "All records", description: "Browse the full collection" },
  { value: "archive", label: "Library archive", description: "Local historical records" },
  { value: "notices", label: "Funeral home notices", description: "Recent community notices" },
];
export function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const selected = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const pageList = [...selected].filter(page => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  pageList.forEach((page, index) => {
    if (index > 0 && page - pageList[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}
export function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
}
