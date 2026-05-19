export type Project = {
  slug: string;
  year: string;
  name: string;
  role: string;
  kind: string;
  status: string;
  stack: string[];
  color: string;
  tagline: string;
  started: string;
  filed: string;
  metrics?: Array<[string, string]>;
  links?: Array<[string, string]>;
  entries?: ProjectEntry[];
};

export type ProjectEntry = {
  date: string;
  h: string;
  b: string;
};

export const PROJECTS: Project[] = [
  {
    year: "2026",
    slug: "memory-archive",
    name: "Memory Archive",
    role: "Solo · design + build",
    kind: "Personal site",
    status: "shipping",
    stack: ["next.js", "mui", "tailwind"],
    color: "#c94b62",
    tagline: "A room I keep returning to - built so I have somewhere to put the things I love.",
    started: "Jan · 2026",
    filed: "ongoing",
    metrics: [["entries", "44"], ["drafts", "12"], ["months", "4"]],
    links: [["live", "lucygai.com"], ["source", "github/lucy/archive"]],
  },
  {
    year: "2025",
    slug: "fieldnotes",
    name: "Fieldnotes",
    role: "Co-founder",
    kind: "iOS app",
    status: "live",
    stack: ["swift", "supabase"],
    color: "#4a7ba8",
    tagline: "A quiet place for the things you notice on walks. Two of us, evenings and Saturdays.",
    started: "Apr · 2024",
    filed: "Mar · 2025",
    metrics: [["users", "2.1k"], ["entries logged", "38k"], ["app store star", "4.8"]],
    links: [["app store", "fieldnotes.app"], ["press", "the verge / 2025"]],
  },
  {
    year: "2025",
    slug: "margin-gutter",
    name: "Margin / Gutter",
    role: "Design",
    kind: "Indie zine, vol. 02",
    status: "printed",
    stack: ["indesign", "risograph"],
    color: "#d08a3a",
    tagline: "A zine about the spaces between things - printed risograph in Oakland, 200 copies.",
    started: "Sep · 2024",
    filed: "Feb · 2025",
    metrics: [["copies", "200"], ["spreads", "48"], ["colors", "3"]],
    links: [["store", "margingutter.zine"], ["mirror", "issuu / 12fp9"]],
  },
  {
    year: "2024",
    slug: "postcard-service",
    name: "Postcard Service",
    role: "Build",
    kind: "Side project",
    status: "beta",
    stack: ["rails", "stripe"],
    color: "#4d8a58",
    tagline: "Type a note from your phone. We print it on a postcard. We mail it for you. $3.",
    started: "Jun · 2024",
    filed: "Sep · 2024",
    metrics: [["cards mailed", "612"], ["countries reached", "14"], ["return rate", "1.8%"]],
    links: [["live", "postcard.fyi"], ["roadmap", "github / issues"]],
  },
  {
    year: "2024",
    slug: "pantry",
    name: "Pantry",
    role: "Solo",
    kind: "macOS widget",
    status: "archived",
    stack: ["swiftui"],
    color: "#7a6aa8",
    tagline: "A menu-bar widget that knew what was in my fridge. It worked for me. That was enough.",
    started: "Feb · 2024",
    filed: "May · 2024",
    metrics: [["lines of swift", "1,847"], ["users", "1"], ["meals saved", "many"]],
    links: [["source", "github / pantry"], ["screenshots", "see below"]],
  },
  {
    year: "2023",
    slug: "letters-the-site",
    name: "Letters (the site)",
    role: "Solo",
    kind: "Long-form blog",
    status: "archived",
    stack: ["astro"],
    color: "#a84a7a",
    tagline: "Three years of long writing, finally folded back into this archive. The good ones survive.",
    started: "Jan · 2021",
    filed: "Dec · 2023",
    metrics: [["posts", "31"], ["years", "3"], ["rewrites", "8"]],
    links: [["archive", "letters.lucygai.com"], ["best of", "Memory Archive / blog"]],
  },
];
