export type Project = {
  slug: string;
  year: string;
  name: string;
  kind: string;
  status: string;
  stack: string[];
  color: string;
  image: string;
  first_published: string;
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
    kind: "Personal site",
    status: "shipping",
    stack: ["next.js", "mui", "tailwind"],
    color: "#c94b62",
    image: "/images/projects/memory-archive/homepage.png",
    first_published: "June · 13 · 2026",
    updated: "June · 13 · 2026",
    metrics: [["entries", "44"], ["drafts", "12"], ["months", "4"]],
    links: [["live", "lucyg.ai"], ["source", "github/lucy/archive"]],
  },
];
