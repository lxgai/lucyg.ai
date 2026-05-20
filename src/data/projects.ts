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
  published?: string;
  updated?: string;
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
];
