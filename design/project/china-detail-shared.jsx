// Shared primitives + data for the China '24 detail-page variations.
// All three variations live in Direction A (Memory Archive): paper + ink + rust,
// Newsreader serif + JetBrains Mono. Caveat is added for hand-written moments.

const { useState, useEffect } = React;

// ============================================================
// Theme tokens
// ============================================================
const A = {
  paper: "#f1e9df",
  paperWarm: "#fbf6ee",
  paperDeep: "#e6dccb",
  paperDeeper: "#d8ccb6",
  ink: "#1f1a16",
  ink70: "#3d342c",
  ink60: "#5a4e43",
  ink40: "#8a7e70",
  ink20: "#bdb3a4",
  hair: "rgba(31, 26, 22, 0.2)",
  hairStrong: "rgba(31, 26, 22, 0.55)",
  rust: "oklch(0.52 0.13 40)",
  rustLight: "oklch(0.72 0.09 40)",
  // China-evoking accent — cinnabar / lacquer red, harmonized with rust
  cinnabar: "oklch(0.55 0.17 25)",
  cinnabarLight: "oklch(0.72 0.13 25)",
  // Soft scrapbook tints
  washiCream: "#f3e6c2",
  washiSage: "#c9d4b8",
  washiBlush: "#e8c4bf",
  tape: "rgba(243, 215, 158, 0.65)",
  tapeRed: "rgba(228, 170, 160, 0.6)",
  // Fonts
  serif: "'Newsreader', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  hand: "'Caveat', cursive",
};

// ============================================================
// Trip data — China '24
// ============================================================
const CHINA = {
  id: "china-24",
  cat: "C",
  no: "001",
  title: "China",
  subtitle: "Chongqing · Hangzhou · Wulong",
  dates: "JUL 06 — JUL 19, 2024",
  duration: "14 days",
  stamp: "中国",
  stampLatin: "CN",
  hero: "images/travels/china-24/hangzhou.jpg",
  intro: "Two summer weeks across three very different Chinas. Hangzhou for lotus ponds and slow lake mornings; Chongqing for hot pots, river lights, and noodles that left me sweating into my soup; Wulong for cliffs that swallowed everything human-sized. I traveled with my parents — first time in a while — and ate constantly.",
  meta: [
    { k: "Length", v: "14 days" },
    { k: "Cities", v: "Hangzhou, Chongqing, Wulong" },
    { k: "Companions", v: "Mom, Dad" },
    { k: "Camera", v: "iPhone 15 Pro" },
    { k: "Weather", v: "Humid — 32°C avg" },
  ],
  cities: [
    {
      no: "01",
      name: "Hangzhou",
      pinyin: "杭州",
      latin: "Hángzhōu",
      coords: "30.27°N · 120.15°E",
      days: "Days 1 — 4",
      blurb: "Mornings on West Lake before the heat. Lotus the size of a dinner plate. Dumplings that disappeared faster than I can describe them. The kind of quiet that makes you talk softer.",
      photos: [
        {
          src: "images/travels/china-24/hangzhou.jpg",
          caption: "West Lake at dusk — lotus blooms beginning to close.",
          tag: "LANDSCAPE",
          aspect: "3/2",
        },
        {
          src: "images/travels/china-24/westlake-dumplings.png",
          caption: "Crab-roe dumplings, served at a stall along the lake path.",
          tag: "FOOD · CUTOUT",
          aspect: "4/5",
          cutout: true,
        },
      ],
      cutouts: [
        { src: "images/travels/china-24/westlake-dumplings.png", label: "Crab-roe dumplings", no: "01-A" },
      ],
    },
    {
      no: "02",
      name: "Chongqing",
      pinyin: "重庆",
      latin: "Chóngqìng",
      coords: "29.56°N · 106.55°E",
      days: "Days 5 — 10",
      blurb: "A vertical city — bridges over bridges, escalators that climb six floors at once. We ate hot pot until we couldn't, then walked it off along the river while Hongyadong lit up gold. My favorite chaos of the trip.",
      photos: [
        {
          src: "images/travels/china-24/hongyadong-heart.png",
          caption: "Hongyadong from across the river — golden hour into night.",
          tag: "LANDSCAPE",
          aspect: "3/4",
        },
        {
          src: "images/travels/china-24/xiaomian.png",
          caption: "Chongqing xiaomian — small noodles, big chili.",
          tag: "FOOD · CUTOUT",
          aspect: "5/4",
          cutout: true,
        },
        {
          src: "images/travels/china-24/coconut-drink.png",
          caption: "Coconut Tree brand — surprisingly hard to find outside Hainan.",
          tag: "OBJECT · CUTOUT",
          aspect: "1/2",
          cutout: true,
        },
      ],
      cutouts: [
        { src: "images/travels/china-24/xiaomian.png", label: "Xiaomian, small noodles", no: "02-A" },
        { src: "images/travels/china-24/coconut-drink.png", label: "Coconut Tree, 245ml", no: "02-B" },
      ],
    },
    {
      no: "03",
      name: "Wulong",
      pinyin: "武隆",
      latin: "Wǔlōng",
      coords: "29.32°N · 107.76°E",
      days: "Days 11 — 14",
      blurb: "The Three Natural Bridges scaled my sense of size all the way back down. Jiuli Ancient City below — half real, half theme park, fully fun. The kind of trip you stop photographing because the phone can't hold it.",
      photos: [
        {
          src: "images/travels/china-24/three-natural-bridges-arrow.png",
          caption: "Looking down into the canyon at Wulong — the buildings are full-size.",
          tag: "LANDSCAPE",
          aspect: "3/4",
        },
        {
          src: "images/travels/china-24/jiuli-city.jpg",
          caption: "Jiuli Ancient City — the giant snow leopard plays its part.",
          tag: "LANDSCAPE",
          aspect: "4/3",
        },
      ],
      cutouts: [],
    },
  ],
  family: {
    src: "images/travels/china-24/family-stickered.png",
    caption: "The three of us — somewhere in Wulong. Stickers on faces by the resident editor.",
  },
};

// ============================================================
// Shared primitives
// ============================================================
function NavBar({ active = "Travels" }) {
  const links = ["Blog", "Travels", "Projects", "Favorites", "About"];
  return (
    <div style={{
      position: "absolute", top: 28, left: 0, right: 0,
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "0 48px", zIndex: 30, fontFamily: A.mono,
    }}>
      <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 22, color: A.ink, letterSpacing: -0.2 }}>
        Lucy Gai <span style={{ fontFamily: A.mono, fontStyle: "normal", fontSize: 10, color: A.ink40, marginLeft: 8 }}>— EST. 2024</span>
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>
        {links.map(l => (
          <span key={l} style={{
            color: active === l ? A.rust : A.ink,
            borderBottom: active === l ? `1px solid ${A.rust}` : "1px solid transparent",
            paddingBottom: 2, cursor: "pointer",
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Hair({ color = A.hair, dashed = false, style = {} }) {
  return <div style={{
    height: 1,
    background: dashed ? "none" : color,
    borderTop: dashed ? `1px dashed ${A.hair}` : "none",
    ...style,
  }} />;
}

function ArchiveStrip({ left = "Personal archive · vol. 01", mid = "section: c · travels", right = "file: china-24.idx" }) {
  return (
    <>
      <Hair color={A.hairStrong} />
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60,
        padding: "8px 0", textTransform: "uppercase",
      }}>
        <span>{left}</span>
        <span>{mid}</span>
        <span>{right}</span>
      </div>
      <Hair color={A.hairStrong} />
    </>
  );
}

function Crumb({ children }) {
  return (
    <div style={{
      fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ color: A.ink40 }}>Travels</span>
      <span style={{ color: A.ink40 }}>→</span>
      <span>{children}</span>
    </div>
  );
}

function CatTag({ cat, no, color = A.ink60 }) {
  return (
    <span style={{
      fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color, textTransform: "uppercase",
    }}>CAT. {cat} · № {no}</span>
  );
}

function SectionFooter({ left, right }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40,
      textTransform: "uppercase", marginTop: 16,
    }}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

// Click-to-enlarge lightbox — shared by all three variations
function useLightbox() {
  const [open, setOpen] = useState(null); // { src, caption } | null
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(null); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const Lightbox = open ? (
    <div onClick={() => setOpen(null)} style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "rgba(31, 26, 22, 0.86)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 48, cursor: "zoom-out",
      animation: "fadeIn 220ms ease both",
    }}>
      <div style={{ position: "relative", maxWidth: "84%", maxHeight: "82%" }}>
        <img src={open.src} alt="" style={{ display: "block", maxWidth: "100%", maxHeight: "78vh", objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
        <div style={{ marginTop: 12, fontFamily: A.serif, fontStyle: "italic", fontSize: 16, color: A.paper, textAlign: "center", maxWidth: 720 }}>
          {open.caption}
        </div>
      </div>
      <div style={{ position: "absolute", top: 24, right: 28, fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.paper, textTransform: "uppercase", opacity: 0.7 }}>
        Click anywhere · esc to close
      </div>
    </div>
  ) : null;
  return { open, setOpen, Lightbox };
}

// Hover-zoomable photo
function Photo({ src, caption, alt = "", style = {}, imgStyle = {}, onOpen, sepia = 0.08 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen && onOpen({ src, caption })}
      style={{ position: "relative", overflow: "hidden", cursor: "zoom-in", background: A.paperDeep, ...style }}>
      <img src={src} alt={alt} style={{
        display: "block", width: "100%", height: "100%", objectFit: "cover",
        filter: `sepia(${sepia}) saturate(0.94)`,
        transform: hover ? "scale(1.03)" : "scale(1)",
        transition: "transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        ...imgStyle,
      }} />
    </div>
  );
}

// Cutout (transparent PNG) — no background, no crop, no sepia
function Cutout({ src, alt = "", style = {}, imgStyle = {}, onOpen, caption }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen && onOpen({ src, caption })}
      style={{ position: "relative", cursor: "zoom-in", ...style }}>
      <img src={src} alt={alt} style={{
        display: "block", width: "100%", height: "100%", objectFit: "contain",
        transform: hover ? "scale(1.04) rotate(-1deg)" : "scale(1) rotate(0deg)",
        transition: "transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        filter: hover ? "drop-shadow(0 14px 22px rgba(0,0,0,0.25))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.15))",
        ...imgStyle,
      }} />
    </div>
  );
}

Object.assign(window, {
  A, CHINA,
  NavBar, Hair, ArchiveStrip, Crumb, CatTag, SectionFooter,
  useLightbox, Photo, Cutout,
});
