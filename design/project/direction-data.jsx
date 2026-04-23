// Shared data used across all three aesthetic directions.
// Exposed on window so each direction's JSX file can consume it without import.

const ALBUMS = [
  { src: "images/favorites/albums/nolimit.png",       title: "nolimit,",                         artist: "Knock2",           year: "2024" },
  { src: "images/favorites/albums/smile.png",         title: "SMILE! :D",                        artist: "Porter Robinson",  year: "2024" },
  { src: "images/favorites/albums/killswitch.jpg",    title: "Killswitch Melodies",              artist: "Flawed Mangoes",   year: "2024" },
  { src: "images/favorites/albums/metaego.jpg",       title: "无限意识 Meta Ego",                  artist: "Lexie Liu",        year: "2023" },
  { src: "images/favorites/albums/comfort.jpg",       title: "Comfort in Chaos",                 artist: "John Summit",      year: "2024" },
  { src: "images/favorites/albums/130mood.jpg",       title: "130 Mood: TRBL",                   artist: "Dean",             year: "2016" },
  { src: "images/favorites/albums/demidevil.jpg",     title: "Demidevil",                        artist: "Ashnikko",         year: "2021" },
  { src: "images/favorites/albums/aloneatprom.png",   title: "Alone at Prom",                    artist: "Tory Lanez",       year: "2021" },
  { src: "images/favorites/albums/comeoversober.jpg", title: "Come Over When You're Sober, Pt.1",artist: "Lil Peep",         year: "2017" },
  { src: "images/favorites/albums/carrielowell.jpg",  title: "Carrie & Lowell",                  artist: "Sufjan Stevens",   year: "2015" },
  { src: "images/favorites/albums/wipedout.jpg",      title: "Wiped Out!",                       artist: "The Neighbourhood",year: "2015" },
];

// Mock tracklists for the music player
const TRACKLISTS = {
  "nolimit,": [
    { n: 1, name: "Dashstar*", time: "2:51" },
    { n: 2, name: "Not Ur Friend", time: "3:12" },
    { n: 3, name: "Hunnids & Hunnids", time: "2:43" },
    { n: 4, name: "no limit", time: "3:05" },
    { n: 5, name: "go!", time: "2:38" },
  ],
  "SMILE! :D": [
    { n: 1, name: "Knock Yourself Out XD", time: "2:52" },
    { n: 2, name: "Cheerleader", time: "3:30" },
    { n: 3, name: "Russian Roulette", time: "3:18" },
    { n: 4, name: "Perfect Pinterest Girl", time: "3:02" },
  ],
  "Carrie & Lowell": [
    { n: 1, name: "Death with Dignity", time: "4:01" },
    { n: 2, name: "Should Have Known Better", time: "5:07" },
    { n: 3, name: "Fourth of July", time: "4:37" },
    { n: 4, name: "Eugene", time: "2:30" },
  ],
};
const DEFAULT_TRACKLIST = [
  { n: 1, name: "Track One", time: "3:12" },
  { n: 2, name: "Track Two", time: "2:48" },
  { n: 3, name: "Track Three", time: "4:05" },
  { n: 4, name: "Track Four", time: "3:31" },
];

const MOVIES = [
  { src: "images/favorites/movies/martysupreme.jpg",   title: "Marty Supreme",                         year: "2025", director: "Josh Safdie",       rating: 4.5, date: "03 · 14 · 25", note: "Timothée at full voltage; ping-pong never looked meaner." },
  { src: "images/favorites/movies/anora.jpg",          title: "Anora",                                  year: "2024", director: "Sean Baker",        rating: 4.5, date: "11 · 02 · 24", note: "Sprints without ever tiring. A heartbreak dressed as a party." },
  { src: "images/favorites/movies/bladerunner.jpg",    title: "Blade Runner",                           year: "1982", director: "Ridley Scott",      rating: 5.0, date: "09 · 08 · 24", note: "The rain; the neon; tears in the rain monologue." },
  { src: "images/favorites/movies/traindragon.jpg",    title: "How to Train Your Dragon",               year: "2010", director: "Dean DeBlois",      rating: 4.5, date: "07 · 19 · 24", note: "Comfort movie forever. That soundtrack." },
  { src: "images/favorites/movies/eternalsunshine.jpg",title: "Eternal Sunshine of the Spotless Mind",  year: "2004", director: "Michel Gondry",     rating: 5.0, date: "02 · 14 · 25", note: "You can feel the memory coming apart in your hands." },
  { src: "images/favorites/movies/perks.jpg",          title: "The Perks of Being a Wallflower",        year: "2010", director: "Stephen Chbosky",   rating: 4.0, date: "01 · 05 · 25", note: "Still making me feel infinite." },
];

const TRIPS = [
  {
    id: "china-24",
    place: "China",
    sub: "Chongqing · Hangzhou · Wulong",
    date: "07 / 2024",
    duration: "14 days",
    cover: "images/travels/china.jpg",
    stamp: "CN",
    color: "#c94b62",
  },
  {
    id: "japan-24",
    place: "Japan",
    sub: "Tokyo · Kyoto · Osaka",
    date: "07 / 2024",
    duration: "10 days",
    cover: "images/travels/japan.jpg",
    stamp: "JP",
    color: "#d26aa7",
  },
  {
    id: "netherlands-25",
    place: "Netherlands",
    sub: "Amsterdam · Utrecht",
    date: "03 / 2025",
    duration: "7 days",
    cover: "images/travels/netherlands.jpg",
    stamp: "NL",
    color: "#4a7ba8",
  },
];

const POSTS = [
  { date: "04 / 18 / 26", title: "On keeping a slow internet",      tags: ["notes", "web"],            excerpt: "The homepage as a room you return to. Why I'm trimming back and writing for an audience of five." },
  { date: "03 / 02 / 26", title: "Reading more in small apartments",tags: ["life", "books"],           excerpt: "Six hundred square feet, two bookshelves, and the decision to stop buying until I've read what I own." },
  { date: "01 / 14 / 26", title: "A year of shipping in public",    tags: ["work", "reflection"],      excerpt: "What I learned from posting progress every friday for fifty-two weeks." },
  { date: "11 / 22 / 25", title: "Kyoto, in the rain",              tags: ["travel", "kyoto"],         excerpt: "A temple, a kissaten, and the particular quiet of a city that's seen everything." },
  { date: "09 / 30 / 25", title: "The spreadsheet for my life",     tags: ["systems", "tools"],        excerpt: "One sheet, four tabs, and the small revolution of actually using it." },
  { date: "08 / 07 / 25", title: "Why I started collecting matchbooks", tags: ["collecting"],           excerpt: "On the pleasure of taking home something small that someone else forgot about." },
];

const PROJECTS = [
  { year: "2026", name: "Memory Archive",       role: "Solo · design + build",     kind: "Personal site",    status: "shipping",  stack: ["next.js","mdx","tailwind"], color: "#c94b62" },
  { year: "2025", name: "Fieldnotes",           role: "Co-founder",                 kind: "iOS app",          status: "live",      stack: ["swift","supabase"],         color: "#4a7ba8" },
  { year: "2025", name: "Margin / Gutter",      role: "Design",                      kind: "Indie zine, vol.02",status: "printed",  stack: ["indesign","risograph"],     color: "#d08a3a" },
  { year: "2024", name: "Postcard Service",     role: "Build",                       kind: "Side project",     status: "beta",      stack: ["rails","stripe"],           color: "#4d8a58" },
  { year: "2024", name: "Pantry",               role: "Solo",                        kind: "macOS widget",     status: "archived",  stack: ["swiftui"],                  color: "#7a6aa8" },
  { year: "2023", name: "Letters (the site)",   role: "Solo",                        kind: "Long-form blog",   status: "archived",  stack: ["astro"],                    color: "#a84a7a" },
];

Object.assign(window, { ALBUMS, TRACKLISTS, DEFAULT_TRACKLIST, MOVIES, TRIPS, POSTS, PROJECTS });
