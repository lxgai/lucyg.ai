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
  entries: ProjectEntry[];
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
    entries: [
      { date: "01 · 11 · 26", h: "Why a new site", b: "I had a tumblr, a Notion, a half-finished Astro thing in a folder called 'maybe'. None of them felt like a place. I wanted somewhere with rooms - a record player here, a wall of postcards there, a desk for the things I'm making. Less feed, more apartment." },
      { date: "01 · 24 · 26", h: "The wrong way first", b: "Spent a week on a moodboard before writing any code, which I always pretend I won't do. Newsreader for the body. A paper background I sampled off a 1972 Penguin paperback. The accent color changed every other day until I gave up and made it a knob." },
      { date: "02 · 03 · 26", h: "First post", b: "Wrote about reading more in small apartments. It took two evenings, mostly because I kept reading what I'd written and finding it embarrassing. Hit publish anyway. Refreshed the homepage maybe forty times to look at the date stamp." },
      { date: "03 · 28 · 26", h: "What it became", b: "Not a portfolio, not a blog, not really a journal - something between all three. The thing I keep coming back to is the section dividers. Tiny monospace labels. SECTION A · PROJECTS. They make it feel filed, which is what I wanted." },
    ],
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
    entries: [
      { date: "04 · 14 · 24", h: "An app for a feeling", b: "Maya and I kept texting each other photos of weird signs and small flowers. We wanted somewhere to keep them that wasn't camera roll. We wrote one paragraph in a shared doc: a notebook for things you walk past. That paragraph never really changed." },
      { date: "07 · 02 · 24", h: "The map question", b: "Hardest call: do entries get a map pin, or stay placeless? We tried both. Placed felt like a hiking app. Placeless felt like a diary that happened to know where you were. We went placeless and put the location on a long-press, which nobody finds, which is fine." },
      { date: "11 · 19 · 24", h: "TestFlight", b: "Twelve people. They all used it differently. One person logged what their cat did. One person logged license plates. I learned that the right empty state is a single italic line, not a tutorial." },
      { date: "03 · 04 · 25", h: "Live on the store", b: "Featured the week after launch. We spent the day refreshing the analytics dashboard and eating dumplings. Maya cried a little. So did I. Then we went back to fixing a bug where photos sometimes saved sideways." },
    ],
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
    entries: [
      { date: "09 · 08 · 24", h: "The premise", b: "Sam called it: a zine about gutters. Not the kind on the side of your house - the kind on the page, between columns of text. The unused space. We took it from there. Margins, intermissions, hallways, the long thin park between two highways." },
      { date: "12 · 15 · 24", h: "Riso night", b: "Brought the files to Issue Press, picked fluorescent pink and a navy. The misregistration is the point with riso, you have to make peace with it. The cover came out cleaner than I deserved. The interior is full of happy accidents." },
      { date: "02 · 22 · 25", h: "Folded by hand", b: "Two hundred copies, four of us, a Saturday. Watched three movies. The folds got worse as the day went on and that's fine. I love every uneven one." },
    ],
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
    entries: [
      { date: "06 · 17 · 24", h: "Why", b: "My grandma still writes postcards. I don't. The friction is the post office. I thought: what if I just type the text in an app and someone else does the rest. Turns out a lot of people had this same thought, but the existing ones are corporate and ugly. I wanted one with my friends' handwriting fonts." },
      { date: "08 · 03 · 24", h: "The printer", b: "Found a small print shop in Vallejo that does runs of 50. They were patient with my emails. We did a test batch in their parking lot - they printed five, I addressed them, we drove them to a real mailbox like little children." },
      { date: "09 · 09 · 24", h: "Beta open", b: "Invite-only because Stripe scared me and so did fraud. So far the only abuse has been one person mailing themselves a card every day for two weeks. I think that's allowed." },
    ],
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
    entries: [
      { date: "02 · 28 · 24", h: "A one-person app", b: "I keep buying cilantro and forgetting. The plan was: a tiny menu bar dropdown with what's in the fridge, and what's about to die. I never intended to ship it. I just wanted the thing." },
      { date: "04 · 11 · 24", h: "The shortcut", b: "The fun part was the keyboard shortcut: command-P pops a quick-add. Tab, type, enter. It made me feel like the kind of person who has a clean kitchen." },
      { date: "05 · 30 · 24", h: "Shelved, lovingly", b: "Stopped using it because we moved apartments and my new fridge is tiny enough to see everything in. The repo is still there. Sometimes I open the file just to look at the spacing." },
    ],
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
    entries: [
      { date: "01 · 02 · 21", h: "Started in a kitchen", b: "First post was about my dad's record collection. Wrote it sitting at the kitchen counter at my parents' house, Christmas tree still up. I think I rewrote the first sentence eleven times. I still don't love it." },
      { date: "06 · 14 · 22", h: "Hit a stride", b: "Posted every two weeks for a year. The good ones came out on the long subway rides home. The bad ones came out when I forced it on a Sunday afternoon. There's a lesson there and I keep not learning it." },
      { date: "12 · 18 · 23", h: "Closing time", b: "Decided to fold it. The form - long single-column blog with a dropdown for categories - wasn't where my head was anymore. I wanted rooms. So I'm building rooms. The archive is still up. The best six pieces are coming with me." },
    ],
  },
];
