export type Post = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  excerpt: string;
  hero?: string;
  heroCaption?: string;
  body: PostBodyBlock[];
  foot?: string[];
};

export type PostBodyBlock =
  | { kind: "p" | "h" | "pull"; text: string }
  | { kind: "img"; src?: string; color?: string; caption?: string; aspect?: string };

export const POSTS: Post[] = [
  {
    date: "04 / 18 / 26",
    slug: "slow-internet",
    title: "On keeping a slow internet",
    tags: ["notes", "web"],
    excerpt: "The homepage as a room you return to. Why I'm trimming back and writing for an audience of five.",
    body: [
      { kind: "p", text: "I deleted the analytics last Tuesday. Not in a dramatic way - I just unchecked a box and never checked it again. The number had been climbing slowly for a year and the number had stopped meaning anything to me. So now there is no number." },
      { kind: "p", text: "What I keep coming back to is the idea of a slow internet - the kind where you have five sites you visit on purpose and three of them are run by friends. Not a manifesto. Just a preference. I want the homepage to feel like a room I return to, not a feed I pull down." },
      { kind: "h", text: "An audience of five" },
      { kind: "p", text: "If five people read this and one of them emails me about it, the post has done what it needed to do. That's the deal. I think I've been writing for a vague larger audience my whole career and the writing has always been worse for it. The good emails come from the strange specific people, never the median ones." },
      { kind: "pull", text: "The homepage as a room you return to, not a feed you pull down." },
      { kind: "p", text: "I'm going back to RSS. I'm linking out more. I'm letting the dates show. I'm putting a section divider that says SECTION D · BLOG because the small joke of cataloging a personal site like a library card is, to me, the whole point." },
      { kind: "h", text: "What I'm trimming" },
      { kind: "p", text: "Cross-posting to four networks. The newsletter that nobody asked me to start. The OG image generator I built and tweaked for a week. The thing where I track which posts go viral and try to write more of those. None of mine have ever gone viral. The tracking was aspirational and a little embarrassing." },
      { kind: "p", text: "What stays: the writing. The date stamps. The footer that says where the page was last touched. The RSS button I'm putting in next week, in the corner where it belongs." },
      { kind: "p", text: "If you're reading this, you are one of the five. Hello. Write me back." },
    ],
    foot: [
      "I keep the analytics off but the server logs on; I can still see if everything is broken, which is the only number that matters.",
      "I made an RSS button. It is the only thing in the footer.",
    ],
  },
  {
    date: "03 / 02 / 26",
    slug: "reading-small-apartments",
    title: "Reading more in small apartments",
    tags: ["life", "books"],
    excerpt: "Six hundred square feet, two bookshelves, and the decision to stop buying until I've read what I own.",
    body: [
      { kind: "p", text: "We moved in October. The new apartment is six hundred square feet and the old apartment was nine hundred, which sounds small until you realize the old apartment also had a third roommate. So in some way I am rich now. In another way I have nowhere to put my books." },
      { kind: "p", text: "I counted them while unpacking: a hundred and seventy-one. Of those, I have read maybe forty. The rest are wishful, or aspirational, or were bought because somebody I admire mentioned them on a podcast and I needed to feel briefly like that person. I love every one of them and I am also slightly ashamed." },
      { kind: "pull", text: "A hundred and seventy-one books. I have read maybe forty. The rest are aspirational." },
      { kind: "h", text: "The rule" },
      { kind: "p", text: "The rule is: no new books until I read three of the ones I own. Not three short ones. Three real ones. I'm allowing library books because the library is a public good and not subject to my private accounting." },
      { kind: "p", text: "Two weeks in: I read A Little Life, which was a terrible idea, and then I read a Tana French I'd been carrying around since 2021, and I am halfway through Bluets, which I have started three times before and put down because I wasn't ready. I think I am ready this time. Or at least more ready." },
      { kind: "h", text: "What I noticed" },
      { kind: "p", text: "I read faster when there are fewer books. This is the opposite of what I expected. I thought I would feel deprived, the way I feel deprived when there's nothing in the fridge. Instead I feel focused. The books on the shelf become objects, and I find myself reaching for them at night the way I used to reach for my phone." },
      { kind: "p", text: "I have not bought a book in fifty-one days. Last week I almost cracked at City Lights and instead I sat on the floor and read the first chapter of something while my partner browsed. I left without it. I felt like a saint. I felt like a fraud. Both, equally." },
    ],
    foot: [
      "Bluets is by Maggie Nelson and the third time was the charm; I finished it on the bus.",
      "The Tana French was 'In the Woods', which I knew everyone had read except me.",
    ],
  },
  {
    date: "01 / 14 / 26",
    slug: "shipping-in-public",
    title: "A year of shipping in public",
    tags: ["work", "reflection"],
    excerpt: "What I learned from posting progress every friday for fifty-two weeks.",
    body: [
      { kind: "p", text: "I posted a progress update every Friday for a year. Fifty-two posts. Sometimes a screenshot, sometimes a paragraph, sometimes just a single line that said 'this week I broke production and learned about Postgres locks.' Here is what happened." },
      { kind: "h", text: "The forcing function worked" },
      { kind: "p", text: "Knowing I had to post something on Friday meant Wednesday and Thursday got more done. I didn't want to be the person who wrote 'this week I read four blog posts about productivity.' The audience was small but specific and that was enough to make me embarrassed of nothing." },
      { kind: "pull", text: "The audience was small but specific. That was enough to make me embarrassed of nothing." },
      { kind: "p", text: "The other thing the forcing function did, that I didn't expect: it made me notice the weeks. Without the Friday post the weeks blur. With it, each one had a small period at the end of it. A little gravity." },
      { kind: "h", text: "Things I'd do differently" },
      { kind: "p", text: "Post less. I would have done better with biweekly, honestly. Fifty-two is a lot and some weeks I posted things I didn't believe just to have a post. Those posts were always the worst ones. The good posts came from real weeks." },
      { kind: "p", text: "Show numbers later. I shared metrics too early, when they were misleading, and I felt the pull to optimize for the public number rather than the real thing. Next time I'd hold those back until they meant something." },
    ],
    foot: [],
  },
  {
    date: "11 / 22 / 25",
    slug: "kyoto-in-the-rain",
    title: "Kyoto, in the rain",
    tags: ["travel", "kyoto"],
    excerpt: "A temple, a kissaten, and the particular quiet of a city that's seen everything.",
    hero: "/images/travels/japan-24/shibuya-crossing.jpg",
    heroCaption: "Higashiyama, late afternoon. The rain stopped twice all week, both times briefly.",
    body: [
      { kind: "p", text: "It rained the entire week. I want to say that this was disappointing but it wasn't. There is a particular kind of quiet a city has when it rains in autumn - Kyoto especially - and I think I needed it more than I needed sun." },
      { kind: "h", text: "The temple" },
      { kind: "p", text: "I went to a temple I won't name because the small temples are the good ones and I don't want to ruin it. The garden was small and damp and full of moss. A monk swept the same square of stone three times while I watched, not because it needed sweeping but because the sweeping was the thing." },
      { kind: "img", color: "#3d5240", caption: "The garden, after the monk had finished. The leaves came back within the hour." },
      { kind: "pull", text: "The sweeping was the thing." },
      { kind: "h", text: "The kissaten" },
      { kind: "p", text: "Found a kissaten near the river that's been open since 1962. Brown wood, copper kettles, a man behind the counter who has done one thing for sixty-some years and does it well. I ordered the toast set. It came with a hard-boiled egg cut in half and a tiny pat of butter, exactly the way you'd want it. I sat there for an hour. Nobody hurried me." },
      { kind: "img", color: "#a08055", caption: "The toast set. The butter was room temperature. The egg was warm. I don't know how either of these things were arranged.", aspect: "4/5" },
      { kind: "p", text: "On the way out the rain had stopped. I'd hoped it wouldn't." },
      { kind: "img", color: "#5a6680", caption: "Pontocho, walking back to the hotel. I took this photo and then put the phone away for the rest of the night." },
    ],
    foot: [
      "The kissaten is called Smart Coffee. The locals are very tired of being asked about it. I am sorry.",
    ],
  },
  {
    date: "09 / 30 / 25",
    slug: "spreadsheet-for-my-life",
    title: "The spreadsheet for my life",
    tags: ["systems", "tools"],
    excerpt: "One sheet, four tabs, and the small revolution of actually using it.",
    body: [
      { kind: "p", text: "I tried Notion. I tried Obsidian. I tried Apple Notes, three different bullet-journal methods, and a Todoist subscription that cost me $36 and lasted a month. The thing that finally worked is a single Google Sheet with four tabs. I am sheepish about this and also very, very happy." },
      { kind: "h", text: "The four tabs" },
      { kind: "p", text: "One: today. A to-do list, three columns wide, that I rewrite every morning. Two: the week. Things I want to do but not today. Three: the year. A small set of headers - work, health, people, money, learning, fun - under which I write maybe ten lines a quarter. Four: the dump. Everything else." },
      { kind: "pull", text: "The good system is the one you actually open." },
      { kind: "p", text: "There is no magic. The magic is opening it. I open it because it's a tab in a thing I have open anyway, because it doesn't make me feel guilty when I haven't opened it for two days, and because nobody's selling me anything from inside it." },
    ],
    foot: [],
  },
  {
    date: "08 / 07 / 25",
    slug: "collecting-matchbooks",
    title: "Why I started collecting matchbooks",
    tags: ["collecting"],
    excerpt: "On the pleasure of taking home something small that someone else forgot about.",
    body: [
      { kind: "p", text: "I have ninety-four matchbooks in a small wooden box on my desk. The box used to hold cigars. Most of the matchbooks are from places that no longer exist. This is the whole appeal." },
      { kind: "p", text: "A matchbook is a thing a restaurant gives you for free, that the restaurant believes is advertising, but that is in fact a tiny artifact of a specific night. The night you sat at the bar at the place that closed in 2018. The night you proposed and didn't. The night you ate the worst meal of your life and then walked home in the rain laughing about it." },
      { kind: "pull", text: "Most of them are from places that no longer exist. This is the whole appeal." },
      { kind: "p", text: "I started taking them because my dad had a coffee can of them in the garage, from his twenties. He didn't know why he kept them. He kept them anyway. When he died I took the can. Now I take matchbooks. I think it's the same thing, mostly." },
    ],
    foot: [],
  },
];
