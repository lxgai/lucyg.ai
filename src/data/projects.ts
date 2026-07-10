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
    status: "live",
    stack: ["next.js", "mui", "tailwind"],
    color: "#c94b62",
    image: "/images/projects/memory-archive/homepage.png",
    first_published: "July · 10 · 2026",
    updated: "",
    links: [["live", "lucyg.ai"], ["source", "https://github.com/lxgai/lucyg.ai"]],
  },
];
