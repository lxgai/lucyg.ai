import type { TravelDetailData } from "@/types/travelDetail";

const MONTH_NUMBERS: Record<string, string> = {
  JAN: "01",
  JANUARY: "01",
  FEB: "02",
  FEBRUARY: "02",
  MAR: "03",
  MARCH: "03",
  APR: "04",
  APRIL: "04",
  MAY: "05",
  JUN: "06",
  JUNE: "06",
  JUL: "07",
  JULY: "07",
  AUG: "08",
  AUGUST: "08",
  SEP: "09",
  SEPT: "09",
  SEPTEMBER: "09",
  OCT: "10",
  OCTOBER: "10",
  NOV: "11",
  NOVEMBER: "11",
  DEC: "12",
  DECEMBER: "12",
};

export type TravelDetailIndexMeta = {
  date: string;
  duration: string;
  citySummary: string;
  catNo: string;
};

export function normalizeTripMonth(dateRange: string) {
  const normalized = dateRange.toUpperCase();
  const month = normalized.match(
    /\b(JANUARY|JAN|FEBRUARY|FEB|MARCH|MAR|APRIL|APR|MAY|JUNE|JUN|JULY|JUL|AUGUST|AUG|SEPTEMBER|SEPT|SEP|OCTOBER|OCT|NOVEMBER|NOV|DECEMBER|DEC)\b/,
  )?.[1];
  const year = normalized.match(/\b(19\d{2}|20\d{2})\b/)?.[1];

  if (!month || !year) return "";

  return `${MONTH_NUMBERS[month]} / ${year}`;
}

export function getTravelDetailIndexMeta(data: TravelDetailData): TravelDetailIndexMeta {
  const date = normalizeTripMonth(data.metadata.dateRange);
  const duration = data.metadata.duration;
  const sectionCities = data.sections
    .map((section) => section.name.trim())
    .filter(Boolean);
  const citySummary = sectionCities.join(" · ");
  const catNo = [date, duration].filter(Boolean).join(" · ");

  return {
    date,
    duration,
    citySummary,
    catNo,
  };
}
