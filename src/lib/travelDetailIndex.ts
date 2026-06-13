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

const MONTH_TOKEN =
  "JANUARY|JAN|FEBRUARY|FEB|MARCH|MAR|APRIL|APR|MAY|JUNE|JUN|JULY|JUL|AUGUST|AUG|SEPTEMBER|SEPT|SEP|OCTOBER|OCT|NOVEMBER|NOV|DECEMBER|DEC";
const MONTH_REGEX = new RegExp(`\\b(${MONTH_TOKEN})\\b`);
const YEAR_REGEX = /\b(19\d{2}|20\d{2})\b/;

export type TravelDetailIndexMeta = {
  date: string;
  duration: string;
  citySummary: string;
  catNo: string;
};

export type TravelDetailStartDate = {
  // Display string in "MM / DD / YYYY" form (or "MM / YYYY" if no day is present).
  display: string;
  // Sortable integer: YYYYMMDD (day 00 when no day is present).
  value: number;
  // True only when day, month, and year were all parsed.
  hasFullDate: boolean;
};

export function normalizeTripMonth(dateRange: string) {
  const normalized = dateRange.toUpperCase();
  const month = normalized.match(MONTH_REGEX)?.[1];
  const year = normalized.match(YEAR_REGEX)?.[1];

  if (!month || !year) return "";

  return `${MONTH_NUMBERS[month]} / ${year}`;
}

// Parses the trip's START date from a detail dateRange such as
// "JUL 10 - JUL 23, 2024". The start day/month come from the segment before the
// first dash; the year from anywhere in the string. Travel index entries must
// resolve to a full day/month/year — reportTravelDetailIndexDrift warns if not.
export function getTravelDetailStartDate(dateRange: string): TravelDetailStartDate {
  const normalized = dateRange.toUpperCase();
  const startSegment = normalized.split("-")[0] ?? normalized;

  const month = startSegment.match(MONTH_REGEX)?.[1];
  const monthNum = month ? MONTH_NUMBERS[month] : "";
  const day = startSegment.match(/\b(\d{1,2})\b/)?.[1];
  const year = normalized.match(YEAR_REGEX)?.[1];

  const hasFullDate = Boolean(monthNum && day && year);

  if (hasFullDate) {
    const paddedDay = day!.padStart(2, "0");
    return {
      display: `${monthNum} / ${paddedDay} / ${year}`,
      value: Number(year) * 10000 + Number(monthNum) * 100 + Number(day),
      hasFullDate: true,
    };
  }

  if (monthNum && year) {
    return {
      display: `${monthNum} / ${year}`,
      value: Number(year) * 10000 + Number(monthNum) * 100,
      hasFullDate: false,
    };
  }

  return { display: "", value: 0, hasFullDate: false };
}

// The duration shown on a detail page is the first hero metadata label
// (e.g. "12 DAYS"), not metadata.duration. The index mirrors that label so the
// two pages can never drift; metadata.duration is only a fallback.
function heroDurationLabel(data: TravelDetailData) {
  return data.hero.metadataFields?.[0]?.label?.trim() ?? "";
}

// Cities come from the section names — each section spread is a city on the
// detail page — so the index city list is the detail's city list by construction.
function sectionCities(data: TravelDetailData) {
  return data.sections.map((section) => section.name.trim()).filter(Boolean);
}

export function getTravelDetailIndexMeta(data: TravelDetailData): TravelDetailIndexMeta {
  const date = getTravelDetailStartDate(data.metadata.dateRange).display;
  const duration = (heroDurationLabel(data) || data.metadata.duration).toLowerCase();
  const citySummary = sectionCities(data).join(" · ");
  const catNo = [date, duration].filter(Boolean).join(" · ");

  return {
    date,
    duration,
    citySummary,
    catNo,
  };
}

// Dev-only guard: the index derives cities/duration from the detail, but a
// detail can still disagree with itself (hero label vs metadata.duration, or
// hero city list vs section names). Surface that drift loudly so it gets fixed.
export function reportTravelDetailIndexDrift(slug: string, data: TravelDetailData) {
  if (process.env.NODE_ENV === "production") return;

  const heroLabel = heroDurationLabel(data);
  const cities = sectionCities(data);
  const heroCities = (data.hero.metadataFields?.[0]?.description ?? "")
    .split("·")
    .map((city) => city.trim())
    .filter(Boolean);

  const startDate = getTravelDetailStartDate(data.metadata.dateRange);
  if (!startDate.hasFullDate) {
    console.warn(
      `[travel-index] ${slug}: dateRange "${data.metadata.dateRange}" is missing a full start day/month/year. Index dates must be DD-level — add a start day (e.g. "JUL 10 - JUL 23, 2024").`,
    );
  }

  if (!heroLabel) {
    console.warn(
      `[travel-index] ${slug}: no hero metadata label; index duration falls back to metadata.duration ("${data.metadata.duration}").`,
    );
  } else if (data.metadata.duration && heroLabel.toLowerCase() !== data.metadata.duration.toLowerCase()) {
    console.warn(
      `[travel-index] ${slug}: duration drift — hero label "${heroLabel}" vs metadata.duration "${data.metadata.duration}". Index shows the hero label.`,
    );
  }

  if (!cities.length) {
    console.warn(`[travel-index] ${slug}: no section names; index city list will be empty.`);
  } else if (
    heroCities.length &&
    heroCities.join(" · ").toLowerCase() !== cities.join(" · ").toLowerCase()
  ) {
    console.warn(
      `[travel-index] ${slug}: city drift — sections [${cities.join(" · ")}] vs hero metadata [${heroCities.join(
        " · ",
      )}].`,
    );
  }
}
