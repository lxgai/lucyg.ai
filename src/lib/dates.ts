const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type DateParts = { year: number; month: number; day: number };

// Parses the site's loose date strings: "MM / DD / YYYY", "MM/DD/YY" (Substack)
// and "July · 10 · 2026" (projects). Returns null when the string has no full date.
export function parseDateParts(value: string): DateParts | null {
  const tokens = value.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (tokens.length < 3) return null;

  const monthIndex = MONTH_NAMES.findIndex((name) =>
    tokens[0].toLowerCase().startsWith(name.toLowerCase()),
  );
  const month = monthIndex >= 0 ? monthIndex + 1 : Number(tokens[0]);
  const day = Number(tokens[1]);
  const rawYear = Number(tokens[2]);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;

  if (!month || month > 12 || !day || !year) return null;
  return { year, month, day };
}

// "Oct 15, 2025"
export function formatDisplayDate(value: string) {
  const parts = parseDateParts(value);
  if (!parts) return value;
  return `${MONTH_NAMES[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

// Sortable YYYYMMDD integer; 0 for unparseable dates.
export function dateSortValue(value: string) {
  const parts = parseDateParts(value);
  return parts ? parts.year * 10000 + parts.month * 100 + parts.day : 0;
}
