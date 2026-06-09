// prototype-pages.jsx — all routable pages for Direction A prototype.
const { useState: uS, useEffect: uE, useMemo: uM } = React;
const T = window.A_TOKENS;

// ============================================================
// HOME
// ============================================================
function PageHome({ route, setRoute, theme }) {
  const quickLinks = [
    { label: "Latest writing", sub: "on keeping a slow internet", to: "blog" },
    { label: "Recently played", sub: "nolimit, — Knock2", to: "favorites" },
    { label: "Where I've been", sub: "Amsterdam, Mar 2025", to: "travels" },
    { label: "What I'm making", sub: "this site, Fieldnotes", to: "projects" },
  ];
  return (
    <div className="page-fade paper-a" style={{ minHeight: "100vh", fontFamily: theme.serif, color: T.ink }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />

      <div className="m-page-pad" style={{ padding: "32px 56px 0" }}>
        <MetaStrip section="Personal archive · vol. 01" catNo="REF. 00" theme={theme} />
      </div>

      <div className="m-intro m-page-pad" style={{ padding: "72px 56px 80px" }}>
        <div className="m-intro-text" style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase" }}>
          ENTRY 001 ·····  A COLLECTION
        </div>
        <div className="m-intro-text m-hero-title" style={{ fontFamily: theme.serif, fontSize: 128, lineHeight: 0.92, letterSpacing: -3, fontWeight: 400, marginTop: 28 }}>
          Hi,<br/>
          <span>I'm Lucy.</span>
        </div>
        <div className="m-intro-text" style={{ marginTop: 16, maxWidth: 480, fontSize: 19, lineHeight: 1.55 }}>
          A software engineer cataloging the things I love — trips, records, films, and the small projects in between. This site is a room I keep returning to.
        </div>

        {/* Frameless photo — direct grid child: sits at right on desktop (spans rows), above the CTA on mobile */}
        <div className="m-home-photo" style={{ position: "relative", paddingTop: 40, alignSelf: "start", maxWidth: 700, justifySelf: "center" }}>
          <div className="m-photo-card" style={{ position: "relative", zIndex: 1, margin: "0 auto" }}>
            <div className="m-photo-imgwrap" style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: T.paperDeep }}>
              <img src="images/home/selfie_dithered.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", imageRendering: "pixelated" }}/>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={window.capStyle(theme, 17)}>Archivist.png, 8x8 Bayer Dither</div>
              <CardLabel cat="A" no="001" accent={theme.accent} />
            </div>
          </div>
        </div>

        <div className="m-intro-text" style={{ marginTop: 40, display: "flex", gap: 20, alignItems: "center" }}>
          <span onClick={() => setRoute("about")} style={{
            padding: "14px 28px", background: T.ink, color: T.paper, cursor: "pointer",
            fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase",
          }}>More about me →</span>
        </div>

        {/* Quick links */}
        <div className="m-intro-text" style={{ marginTop: 56 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 16 }}>
            ━━ Lately
          </div>
          <div style={{ maxWidth: 620 }}>
            {quickLinks.map((q, i) => (
              <div key={q.to} onClick={() => setRoute(q.to)} style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                padding: "14px 0", borderBottom: `1px solid ${T.hair}`,
                cursor: "pointer", alignItems: "baseline",
                transition: "color 180ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(201, 100, 66, 0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic" }}>{q.label}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, marginTop: 3, letterSpacing: 1 }}>{q.sub}</div>
                </div>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: theme.accent }}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BLOG
// ============================================================
function PageBlog({ route, setRoute, theme }) {
  const [activeTag, setActiveTag] = uS(null);
  const allTags = uM(() => {
    const s = new Set();
    window.POSTS.forEach(p => p.tags.forEach(t => s.add(t)));
    return ["all", ...s];
  }, []);
  const filtered = activeTag && activeTag !== "all" ? window.POSTS.filter(p => p.tags.includes(activeTag)) : window.POSTS;

  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION D · BLOG" catNo="REF. D-IDX"
      title={<>Notes, filed by date.</>}
      subtitle={`${window.POSTS.length} entries · most recent first`}>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
        {allTags.map(t => (
          <span key={t} onClick={() => setActiveTag(t === activeTag ? null : t)} style={{
            fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase",
            padding: "5px 12px", cursor: "pointer",
            border: `1px solid ${(t === activeTag || (t === "all" && !activeTag)) ? theme.accent : T.hair}`,
            background: (t === activeTag || (t === "all" && !activeTag)) ? theme.accent : "transparent",
            color: (t === activeTag || (t === "all" && !activeTag)) ? T.paper : T.ink,
            transition: "all 180ms",
          }}>{t}</span>
        ))}
      </div>

      {filtered.map((p, i) => (
        <div key={p.title} className="m-blog-row"
          onClick={() => setRoute(`blog/${p.slug}`)}
          style={{
          display: "grid", gridTemplateColumns: "120px 1fr 160px", gap: 32,
          padding: "22px 0", borderBottom: `1px solid ${T.hair}`, alignItems: "baseline",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(31,26,22,0.02)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>
            <div>№ {String(window.POSTS.length - window.POSTS.indexOf(p)).padStart(3, "0")}</div>
            <div style={{ marginTop: 3 }}>{p.date}</div>
          </div>
          <div>
            <div style={{ fontFamily: theme.serif, fontSize: 28, lineHeight: 1.1, fontStyle: "italic" }}>{p.title}</div>
            <div style={{ fontFamily: theme.serif, fontSize: 15, color: T.ink60, marginTop: 8, lineHeight: 1.5, maxWidth: 660 }}>{p.excerpt}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {p.tags.map(t => (
              <span key={t} onClick={(e) => { e.stopPropagation(); setActiveTag(t); }} style={{
                fontFamily: T.mono, fontSize: 8, letterSpacing: 1.4, color: theme.accent,
                border: `1px solid ${theme.accent}`, padding: "2px 8px", textTransform: "uppercase", cursor: "pointer",
              }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </PageShell>
  );
}

// ============================================================
// PROJECTS
// ============================================================

// Tinted, subtly-striped placeholder thumbnail. Drop a real screenshot
// in by replacing the inner content / adding p.image to PROJECTS.
function ProjectThumb({ project, theme, aspect = "4/3", radius = 0, rotate = 0, captionPos = "bottom" }) {
  const c = project.color;
  // Stack a deep base, soft diagonal stripes, and a vignette on top.
  const bg = {
    background:
      `linear-gradient(135deg, rgba(0,0,0,0.18), rgba(255,255,255,0.08)), ` +
      `repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 10px, rgba(0,0,0,0.04) 10px 22px), ` +
      c,
  };
  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: aspect,
      overflow: "hidden", borderRadius: radius,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      ...bg,
    }}>
      {/* Big tinted initial — feels like a record sleeve in miniature */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: theme.serif, fontStyle: "italic",
        fontSize: "min(38cqw, 180px)",
        color: "rgba(255,255,255,0.92)",
        textShadow: "0 2px 12px rgba(0,0,0,0.18)",
        containerType: "inline-size",
        lineHeight: 1, letterSpacing: -2,
      }}>
        {project.name[0]}
      </div>

      {/* Top corner: year sticker */}
      <div style={{
        position: "absolute", top: 10, left: 10,
        fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase",
        color: "rgba(255,255,255,0.85)",
        padding: "3px 7px",
        background: "rgba(0,0,0,0.18)",
        backdropFilter: "blur(2px)",
      }}>
        {project.year}
      </div>

      {/* Bottom caption: monospace "drop here" hint */}
      <div style={{
        position: "absolute", ...(captionPos === "bottom" ? { bottom: 10, left: 10 } : { top: 10, right: 10 }),
        fontFamily: T.mono, fontSize: 8, letterSpacing: 1.4, textTransform: "uppercase",
        color: "rgba(255,255,255,0.7)",
      }}>
        ⤓ drop: {project.name.toLowerCase().replace(/[^a-z]+/g, "-")}.jpg
      </div>
    </div>
  );
}

function StatusDot({ project, theme }) {
  const isLive = project.status === "live" || project.status === "shipping";
  return (
    <span style={{
      fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase",
      color: isLive ? theme.accent : T.ink60,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: isLive ? theme.accent : T.ink40,
        boxShadow: isLive ? `0 0 0 3px ${theme.accent}22` : "none",
      }}/>
      {project.status}
    </span>
  );
}

function PageProjects({ route, setRoute, theme }) {
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION A · PROJECTS" catNo="REF. A-IDX"
      title={<>Things I've made.</>}
      subtitle={`${window.PROJECTS.length} entries`}>

      <div style={{ height: 24 }}/>

      <ProjectsSpread theme={theme} setRoute={setRoute} />
    </PageShell>
  );
}

// ---- SPREAD: magazine-style alternating image+text rows ----
function ProjectsSpread({ theme, setRoute }) {
  const [sortNewest, setSortNewest] = uS(true);
  // Stable entry numbers: oldest project is always Entry 01, regardless of sort.
  const entryNo = uM(() => {
    const chrono = [...window.PROJECTS].sort((a, b) => Number(a.year) - Number(b.year));
    const m = {};
    chrono.forEach((p, i) => { m[p.slug] = i + 1; });
    return m;
  }, []);
  const projects = uM(() => {
    const arr = [...window.PROJECTS];
    arr.sort((a, b) => sortNewest ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year));
    return arr;
  }, [sortNewest]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Sort toggle above a full-width divider line */}
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <span
            role="button"
            onClick={() => setSortNewest(v => !v)}
            title="Toggle sort order"
            style={{
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase",
              color: T.ink60, transition: "color 160ms",
            }}
            onMouseEnter={e => e.currentTarget.style.color = theme.accent}
            onMouseLeave={e => e.currentTarget.style.color = T.ink60}>
            {sortNewest ? "newest first" : "oldest first"}
            <span aria-hidden="true" style={{ fontSize: 9, opacity: 0.7 }}>⇅</span>
          </span>
        </div>
        <span style={{ display: "block", height: 1, background: T.hair }} />
      </div>

      {projects.map((p, i) => {
        const reverse = i % 2 === 1;
        return (
          <div key={p.name} className="m-proj-row"
            onClick={() => setRoute(`projects/${p.slug}`)}
            style={{
              display: "grid",
              gridTemplateColumns: reverse ? "1fr 1.1fr" : "1.1fr 1fr",
              gap: 56, alignItems: "center",
              padding: "44px 0",
              borderTop: i === 0 ? "none" : `1px solid ${T.hair}`,
              borderBottom: i === projects.length - 1 ? `1px solid ${T.hairStrong}` : "none",
              cursor: "pointer",
              transition: "background 200ms",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(31,26,22,0.02)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ order: reverse ? 2 : 1, width: "100%" }}>
              <ProjectThumb project={p} theme={theme} aspect="16/10" />
            </div>
            <div style={{ order: reverse ? 1 : 2 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: theme.accent, marginBottom: 12 }}>
                Entry {String(entryNo[p.slug]).padStart(2, "0")} · {p.year}
              </div>
              <div style={{ fontFamily: theme.serif, fontSize: 52, lineHeight: 0.98, letterSpacing: -1, fontStyle: "italic" }}>
                {p.name}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 14 }}>
                {p.stack.join(" · ")}
              </div>
              <div style={{ fontFamily: theme.serif, fontSize: 18, color: T.ink, marginTop: 22, lineHeight: 1.5, maxWidth: 420 }}>
                {p.kind}.
              </div>
              <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 28, flexWrap: "wrap" }}>
                <StatusDot project={p} theme={theme} />
                <span style={{ flex: 1 }}/>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: theme.accent, letterSpacing: 1.4, textTransform: "uppercase" }}>
                  open file →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// FAVORITES — albums (vinyl) + movies
// ============================================================
// SortMenu — mono-styled dropdown for the record rack.
const SORT_OPTIONS = [
  ["new",   "new \u2192 old"],
  ["old",   "old \u2192 new"],
  ["title", "title (a\u2013z)"],
];
function SortMenu({ sort, setSort, open, setOpen, theme }) {
  const current = (SORT_OPTIONS.find(([k]) => k === sort) || SORT_OPTIONS[0])[1];
  return (
    <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
      <span onClick={() => setOpen(o => !o)} style={{
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase",
        padding: "2px 0",
      }}>
        <span>sort:</span>
        <span style={{ color: T.ink }}>{current}</span>
        <span style={{ fontSize: 8, color: T.ink60, transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}>▾</span>
      </span>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 10,
          background: T.paperCard, border: `1px solid ${T.hairStrong}`,
          boxShadow: "0 8px 24px rgba(31,26,22,0.12)",
          minWidth: 160,
        }}>
          {SORT_OPTIONS.map(([k, label], i) => (
            <div key={k}
              onClick={() => { setSort(k); setOpen(false); }}
              style={{
                padding: "10px 14px",
                fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase",
                color: k === sort ? theme.accent : T.ink,
                cursor: "pointer",
                borderTop: i > 0 ? `1px solid ${T.hair}` : "none",
                background: k === sort ? "rgba(31,26,22,0.04)" : "transparent",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => { if (k !== sort) e.currentTarget.style.background = "rgba(31,26,22,0.03)"; }}
              onMouseLeave={(e) => { if (k !== sort) e.currentTarget.style.background = "transparent"; }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// PlayGlyph — CSS triangle / paused bars, used in the featured-cut row.
function PlayGlyph({ size = 14, color, playing = false }) {
  if (playing) {
    return (
      <span style={{ display: "inline-flex", gap: 2, width: size, height: size, alignItems: "center" }}>
        <span style={{ width: size * 0.3, height: size, background: color }} />
        <span style={{ width: size * 0.3, height: size, background: color }} />
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-block",
      width: 0, height: 0,
      borderTop: `${size / 2}px solid transparent`,
      borderBottom: `${size / 2}px solid transparent`,
      borderLeft: `${size * 0.85}px solid ${color}`,
    }} />
  );
}

// One audio file per album — the first `fav: true` track is the playable
// "featured cut"; everything else renders as small liner notes for context.
function TracklistView({ tracks, playing, onTogglePlay, progress, theme }) {
  const featuredIdx = (() => {
    const i = tracks.findIndex(t => t.featured);
    if (i >= 0) return i;
    const j = tracks.findIndex(t => t.fav);
    return j >= 0 ? j : 0;
  })();
  const featured = tracks[featuredIdx];

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6,
        color: T.ink60, textTransform: "uppercase", marginBottom: 14,
      }}>
        Featured cut
      </div>

      {/* Featured row — the only playable track. Aligns flush-left with the
          "Featured cut" / "Full tracklist" headers so the accent bar sits
          directly under them. */}
      <div onClick={onTogglePlay} style={{
        display: "grid", gridTemplateColumns: "32px 1fr", gap: 14,
        alignItems: "center", cursor: "pointer",
        padding: "14px 14px 14px 12px",
        background: "rgba(31,26,22,0.04)",
        borderLeft: `2px solid ${theme.accent}`,
        transition: "background 180ms",
      }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PlayGlyph size={16} color={theme.accent} playing={playing} />
        </span>
        <div>
          <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 24, lineHeight: 1.1, color: T.ink }}>
            {featured.name}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, letterSpacing: 1.4, textTransform: "uppercase", marginTop: 4 }}>
            Track {String(featured.n).padStart(2, "0")} · {featured.time} · {playing ? "now playing" : "press to play"}
          </div>
        </div>
      </div>

      {/* Progress — only the filled portion is visible; no empty track. */}
      <div style={{ height: 2, margin: "0 0 18px", position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${playing ? progress : 0}%`, background: theme.accent,
          transition: "width 200ms linear",
        }}/>
      </div>

      {/* Full tracklist — context only, no hover, no cursor */}
      <div style={{
        fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6,
        color: T.ink60, textTransform: "uppercase", marginBottom: 8,
      }}>
        Full tracklist
      </div>
      <div className="m-liner" style={{ columnCount: 2, columnGap: 18 }}>
        {tracks.map(tr => {
          const isFeatured = tr === featured;
          return (
            <div key={tr.n} style={{
              display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 8,
              padding: "3px 0",
              fontFamily: T.mono, fontSize: 10.5, color: isFeatured ? theme.accent : T.ink60,
              breakInside: "avoid",
            }}>
              <span style={{ color: isFeatured ? theme.accent : T.ink40, fontSize: 9 }}>{String(tr.n).padStart(2, "0")}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isFeatured ? theme.accent : (tr.fav ? T.ink : T.ink60) }}>
                {tr.name}
                {tr.fav && <span style={{ marginLeft: 5, color: theme.accent }}>★</span>}
              </span>
              <span style={{ fontSize: 9 }}>{tr.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageFavorites({ route, setRoute, theme }) {
  const [tab, setTab] = uS("music");
  const [sort, setSort] = uS("new"); // "new" | "old" | "title"
  const [sortOpen, setSortOpen] = uS(false);
  const [selectedSrc, setSelectedSrc] = uS(window.ALBUMS[0].src);
  const [playing, setPlaying] = uS(false);
  const [progress, setProgress] = uS(0);

  const sortedAlbums = uM(() => {
    const arr = window.ALBUMS.slice();
    if (sort === "new") arr.sort((a, b) => Number(b.year) - Number(a.year));
    else if (sort === "old") arr.sort((a, b) => Number(a.year) - Number(b.year));
    else if (sort === "title") arr.sort((a, b) => a.title.localeCompare(b.title));
    return arr;
  }, [sort]);

  const selectedAlbum = sortedAlbums.find(a => a.src === selectedSrc) || sortedAlbums[0];
  const selectedIdx = sortedAlbums.indexOf(selectedAlbum);
  const tracks = window.TRACKLISTS[selectedAlbum.title] || window.DEFAULT_TRACKLIST;

  uE(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p + 0.5) % 100), 200);
    return () => clearInterval(id);
  }, [playing]);
  uE(() => { setPlaying(false); setProgress(0); }, [selectedSrc]);

  // Close sort menu on any outside click
  uE(() => {
    if (!sortOpen) return;
    const close = () => setSortOpen(false);
    const t = setTimeout(() => document.addEventListener("click", close), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", close); };
  }, [sortOpen]);

  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION C · FAVORITES" catNo="REF. C-IDX"
      title={<>Personal favorites, <span style={{ fontStyle: "italic" }}>hand-picked</span>.</>}>

      <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
        {["music", "films"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding: "10px 22px",
            border: `1px solid ${tab === t ? T.ink : T.hair}`,
            background: tab === t ? T.ink : "transparent",
            color: tab === t ? T.paper : T.ink,
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase",
            cursor: "pointer", transition: "all 180ms",
          }}>{t}</div>
        ))}
      </div>

      {tab === "music" ? (
        <div className="m-fav-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 60 }}>
          <div>
            <div className="m-vinyl-wrap" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 440, paddingBottom: 30 }}>
              <VinylPlayer album={selectedAlbum} playing={playing} setPlaying={setPlaying} theme={theme} />
            </div>
            <div style={{ background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 18, maxWidth: 580, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, lineHeight: 1 }}>{selectedAlbum.title}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{selectedAlbum.artist} · {selectedAlbum.year}</div>
                </div>
                <CardLabel cat="C.M" no={String(selectedIdx + 1).padStart(3, "0")} accent={theme.accent} />
              </div>
              <Hair />
              <TracklistView
                tracks={tracks}
                playing={playing}
                onTogglePlay={() => setPlaying(p => !p)}
                progress={progress}
                theme={theme}
              />
            </div>
          </div>

          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span>Record rack</span>
              <SortMenu sort={sort} setSort={setSort} open={sortOpen} setOpen={setSortOpen} theme={theme} />
            </div>
            <div className="m-rack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {sortedAlbums.map((a, i) => (
                <div key={a.src} onClick={() => setSelectedSrc(a.src)} style={{
                  cursor: "pointer", position: "relative", padding: 3,
                  background: i === selectedIdx ? T.ink : "transparent",
                  transition: "all 200ms",
                }}>
                  <img src={a.src} alt="" style={{
                    width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block",
                    filter: i === selectedIdx ? "none" : "saturate(0.9)",
                    transition: "filter 200ms",
                  }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MoviesBlock theme={theme} />
      )}
    </PageShell>
  );
}

function MoviesBlock({ theme }) {
  return (
    <div className="m-movies-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {window.MOVIES.map(m => (
        <div key={m.title} style={{ background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 14, display: "flex", gap: 14 }}>
          <div style={{ width: 84, height: 126, overflow: "hidden", flex: "0 0 auto" }}>
            <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: theme.serif, fontSize: 17, fontStyle: "italic", lineHeight: 1.1 }}>{m.title}</div>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{m.director} · {m.year}</div>
            <div style={{ marginTop: 10, fontFamily: T.mono, fontSize: 11, color: theme.accent, letterSpacing: 1 }}>
              {"★".repeat(Math.floor(m.rating))}{m.rating % 1 ? "½" : ""}
            </div>
            <Hair style={{ margin: "10px 0" }}/>
            <div style={{ fontFamily: theme.serif, fontSize: 12, color: T.ink60, fontStyle: "italic", lineHeight: 1.4 }}>"{m.note}"</div>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ink40, marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>LOGGED {m.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ABOUT
// ============================================================
function PageAbout({ route, setRoute, theme }) {
  const [hoverSocial, setHoverSocial] = React.useState(null);
  const socials = [
    { l: "Instagram", url: "instagram.com/lucy.gai", logo: "images/logos/instagram-logo.png" },
    { l: "Letterboxd", url: "letterboxd.com/lucy_gai", logo: "images/logos/letterboxd-logo.png" },
    { l: "Spotify", url: "open.spotify.com/user/charlottefour", logo: "images/logos/spotify-logo.png" },
    { l: "GitHub", url: "github.com/lxgai", logo: "images/logos/github-logo.png" },
    { l: "Email", url: "mailto:hello@lucygai.com", icon: "ph-envelope-simple" },
  ];
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION E · ABOUT" catNo="REF. E-IDX">

      <div className="m-about-grid" style={{ display: "grid", gridTemplateColumns: "3fr minmax(420px, 1fr)", columnGap: 56, rowGap: 40, paddingTop: 32 }}>
        <div className="m-about-left">
          <div className="m-about-intro-block">
            <div className="m-about-intro" style={{ fontFamily: theme.serif, fontSize: 48, lineHeight: 1.2, letterSpacing: -0.6, fontWeight: 400 }}>
              Hi! I'm <span style={{ fontStyle: "italic" }}>Lucy</span> — a software engineer based in the <span style={{ fontStyle: "italic" }}>US</span>.
            </div>
            <div className="m-about-intro-sub" style={{ fontFamily: theme.serif, fontSize: 30, lineHeight: 1.35, letterSpacing: -0.3, fontWeight: 400, marginTop: 24, color: T.ink }}>
              This is my corner of the internet where I share and document the projects I'm building, things I'm learning, and a collection of the media and experiences I enjoy, in an effort to keep track of it all.
            </div>
          </div>

          <div className="m-about-currently">
            <Hair style={{ margin: "40px 0" }}/>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, color: T.ink60, textTransform: "uppercase", marginBottom: 14 }}>Currently</div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px 28px", fontSize: 15, lineHeight: 1.5 }}>
              {[
                ["Reading", <><em>Sample book title</em> — sample author</>],
                ["Dreaming", "moving to New York City"],
                ["Building", "this site, and some other project here"],
                ["Planning", "Place in Time, Place in Time"],
              ].map(([k,v]) => (
                <React.Fragment key={k}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>{k}</span>
                  <span>{v}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="m-about-card" style={{ justifySelf: "center", background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 32, position: "relative", height: "fit-content" }}>
          <div style={{ position: "absolute", top: -12, left: 20, background: T.paper, padding: "2px 12px", fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", border: `1px solid ${T.hairStrong}` }}>
            Contact index
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, display: "flex", gap: 10, textTransform: "uppercase" }}>
            <span style={{ color: T.ink }}>REF. E-001</span>
            <span>Likeness.png</span>
          </div>
          <img src="images/home/selfie2_dithered.png" alt="" style={{ display: "block", width: 350, maxWidth: "100%", marginTop: 18, imageRendering: "pixelated" }}/>

          <Hair style={{ margin: "22px 0" }}/>
          <div style={{ fontFamily: theme.serif, fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>
            Feel free to reach out — I'm also on:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {socials.map((s, i) => {
              const hovered = hoverSocial === i;
              return (
                <span key={s.l}
                  title={s.l}
                  onMouseEnter={() => setHoverSocial(i)}
                  onMouseLeave={() => setHoverSocial(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 13,
                    padding: "7px 0", cursor: "pointer",
                  }}>
                  <span style={{
                    width: 22, height: 22, flex: "0 0 auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {s.icon ? (
                      <svg viewBox="0 0 256 256" width="22" height="22" fill={T.ink} style={{ display: "block" }}>
                        <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                      </svg>
                    ) : (
                      <img src={s.logo} alt={s.l} style={{ width: 22, height: 22, objectFit: "contain", display: "block" }} />
                    )}
                  </span>
                  <span style={{
                    fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase",
                    color: hovered ? theme.accent : T.ink,
                    transition: "color 0.18s ease",
                  }}>{s.l}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ============================================================
// TRAVELS — 3-up triptych. Arrows scroll horizontally when >3 entries.
// ============================================================
const TRAVELS_CUTOUTS = {
  "china-24": "images/travels/china-24/yangtze-river.png",
};

function travelsTitle(trip) {
  const parts = trip.place.split(",").map(s => s.trim()).filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const yy = (trip.date.match(/(\d{4})/) || ["", ""])[1].slice(-2);
  return { country, yy };
}

function PageTravels({ route, setRoute, theme }) {
  const [sortNewest, setSortNewest] = uS(true);
  const trips = React.useMemo(
    () => sortNewest ? window.TRIPS : [...window.TRIPS].reverse(),
    [sortNewest]
  );
  const gap = 36;

  // ── Dynamic column count ───────────────────────────────────────────────
  // Instead of hand-tuned pixel breakpoints, measure the widest title at its
  // real rendered size and the available container width, then pick the most
  // columns (3 → 2 → 1) whose column width still fits that title on one line.
  // This self-adjusts to any title length or font change — no magic numbers.
  const [titleW, setTitleW] = uS(0);
  React.useLayoutEffect(() => {
    const probe = document.createElement("span");
    probe.style.cssText = `position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:nowrap;font-family:${theme.serif};font-size:52px;line-height:0.95;letter-spacing:-1.2px;font-weight:400;`;
    document.body.appendChild(probe);
    let max = 0;
    window.TRIPS.forEach(t => {
      const { country, yy } = travelsTitle(t);
      probe.textContent = `${country} ’${yy}.`;
      max = Math.max(max, probe.getBoundingClientRect().width);
    });
    probe.remove();
    setTitleW(Math.ceil(max) + 8); // small safety buffer
  }, [theme.serif]);

  const viewportRef = React.useRef(null);
  const [containerW, setContainerW] = uS(0);
  React.useLayoutEffect(() => {
    if (!viewportRef.current) return;
    const update = () => setContainerW(viewportRef.current.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const visible = React.useMemo(() => {
    if (!containerW || !titleW) return 1;
    for (const v of [3, 2, 1]) {
      if ((containerW - (v - 1) * gap) / v >= titleW) return v;
    }
    return 1;
  }, [containerW, titleW, gap]);

  const hasCarousel = trips.length > visible;
  const maxStart = Math.max(0, trips.length - visible);

  const [start, setStart] = uS(0);
  // Reset start when responsive switch changes the visible count
  uE(() => { setStart(s => Math.min(s, Math.max(0, trips.length - visible))); }, [visible, trips.length]);
  const canPrev = start > 0;
  const canNext = start < maxStart;

  // Preflight which cutouts exist (transparent PNGs render with contain;
  // missing ones fall back to t.cover transparently).
  const [cutouts, setCutouts] = uS({});
  uE(() => {
    let cancelled = false;
    Promise.all(Object.entries(TRAVELS_CUTOUTS).map(([id, src]) =>
      fetch(src, { method: "HEAD" })
        .then(r => r.ok ? [id, src] : null)
        .catch(() => null)
    )).then(results => {
      if (cancelled) return;
      const next = {};
      results.forEach(r => { if (r) next[r[0]] = r[1]; });
      setCutouts(next);
    });
    return () => { cancelled = true; };
  }, []);

  // Measure rendered column width in design-space px (offsetWidth ignores
  // ancestor transforms) so the translateX shift matches the grid layout.
  const trackRef = React.useRef(null);
  const [colW, setColW] = uS(0);
  uE(() => {
    if (!trackRef.current) return;
    const update = () => {
      const first = trackRef.current.querySelector("[data-trip-col]");
      if (first) setColW(first.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION B · TRAVELS" catNo="REF. B-IDX"
      title={<>Places, <span style={{ fontStyle: "italic" }}>cataloged.</span></>}
      subtitle={`${trips.length} entries · filed by date`}>

      {/* Carousel toolbar — counter + arrows only when there's more than fits */}
      {hasCarousel && (
        <div style={{
          margin: "8px 0 24px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, color: T.ink60, textTransform: "uppercase",
          paddingBottom: 12, borderBottom: `1px solid ${T.hair}`,
        }}>
          <span
            role="button"
            onClick={() => { setSortNewest(v => !v); setStart(0); }}
            style={{
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
              color: T.ink60, transition: "color 160ms",
            }}
            onMouseEnter={e => e.currentTarget.style.color = theme.accent}
            onMouseLeave={e => e.currentTarget.style.color = T.ink60}
            title="Toggle sort order">
            {sortNewest ? "newest first" : "oldest first"}
            <span aria-hidden="true" style={{ fontSize: 9, opacity: 0.7 }}>⇅</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span>{String(start + 1).padStart(2, "0")} — {String(Math.min(start + visible, trips.length)).padStart(2, "0")} / {String(trips.length).padStart(2, "0")}</span>
            <TravelsArrow disabled={!canPrev} dir="prev" theme={theme} onClick={() => canPrev && setStart(start - 1)} />
            <TravelsArrow disabled={!canNext} dir="next" theme={theme} onClick={() => canNext && setStart(start + 1)} />
          </div>
        </div>
      )}

      {/* Viewport — clips off-frame columns */}
      <div ref={viewportRef} style={{ overflow: "hidden", width: "100%" }}>
        <div
          ref={trackRef}
          className="m-trav-track"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${trips.length}, calc((100% - ${(visible - 1) * gap}px) / ${visible}))`,
            gap,
            transform: hasCarousel && colW ? `translateX(${-start * (colW + gap)}px)` : "translateX(0)",
            transition: "transform 480ms cubic-bezier(.2,.7,.2,1)",
            willChange: "transform",
          }}>
          {trips.map((t, i) => (
            <div key={t.id} data-trip-col style={{ height: "100%" }}>
              <TravelsColumn trip={t} idx={i} cutouts={cutouts} setRoute={setRoute} theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function TravelsColumn({ trip, idx, cutouts, setRoute, theme }) {
  const [hover, setHover] = uS(false);
  const isCutout = !!(cutouts && cutouts[trip.id]);
  const src = (cutouts && cutouts[trip.id]) || trip.cover;
  const imgStyle = isCutout
    ? { width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }
    : { width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92)", display: "block" };
  const { country, yy } = travelsTitle(trip);

  return (
    <div onClick={() => setRoute(`travels/${trip.id}`)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", cursor: "pointer", height: "100%" }}>

      {/* Number + stamp + date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: T.mono, fontSize: 9, letterSpacing: 1.8, color: T.ink60, textTransform: "uppercase", marginBottom: 18 }}>
        <span>№ {String(idx + 1).padStart(3, "0")} · {trip.stamp}</span>
        <span style={{ color: theme.accent }}>{trip.date}</span>
      </div>

      {/* Image — no card chrome */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden",
        marginBottom: 22,
        transition: "transform 380ms cubic-bezier(.2,.7,.2,1)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
      }}>
        <img src={src} alt="" style={imgStyle}/>
      </div>

      {/* Title — Country 'YY. — never wrap to a second line */}
      <div className="m-trav-title" style={{ fontFamily: theme.serif, fontSize: 52, lineHeight: 0.95, letterSpacing: -1.2, fontWeight: 400, whiteSpace: "nowrap" }}>
        {country} <span style={{ fontStyle: "italic", color: theme.accent }}>’{yy}.</span>
      </div>

      {/* Subtitle */}
      <div style={{ fontFamily: theme.serif, fontSize: 17, fontStyle: "italic", color: T.ink60, marginTop: 12, lineHeight: 1.45, flex: 1 }}>
        {trip.sub}
      </div>

      {/* Footer meta */}
      <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${T.hair}`, fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
        <span>{trip.duration}</span>
        <span style={{ color: theme.accent }}>read entry →</span>
      </div>
    </div>
  );
}

function TravelsArrow({ dir, onClick, disabled, theme }) {
  const [hover, setHover] = uS(false);
  const active = hover && !disabled;
  return (
    <span onClick={disabled ? undefined : onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 26,
      border: `1px solid ${disabled ? T.hair : (active ? theme.accent : T.hairStrong)}`,
      background: active ? theme.accent : "transparent",
      color: disabled ? T.ink40 : (active ? T.paper : T.ink),
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: T.mono, fontSize: 14,
      transition: "background 180ms, color 180ms, border-color 180ms",
      userSelect: "none",
    }}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    >
      {dir === "prev" ? "←" : "→"}
    </span>
  );
}

// ============================================================
// TRIP — individual scrapbook page (restyled to match A)
// ============================================================
const TRIP_SCRAPBOOKS = {
  "china-24": {
    entries: [
      { kind: "title", text: "Chongqing, at dusk", sub: "The cyberpunk city you only half-believe is real." },
      { kind: "photo", src: "images/travels/china.jpg", caption: "Hongya Cave, lit up.", rot: -1.2, size: "large" },
      { kind: "text", body: "Fourteen days. Three cities. More hot pot than any reasonable person should attempt. The highlight was stepping out of a taxi in Chongqing at 9pm and feeling, for a moment, like I'd walked into a film I hadn't seen yet." },
      { kind: "photo", src: "images/travels/china.jpg", caption: "Noodles, Wulong", rot: 1.4, size: "small" },
      { kind: "photo", src: "images/travels/china.jpg", caption: "Tea with grandma", rot: -0.8, size: "small" },
      { kind: "quote", body: "The best meals are the ones you eat alone, slightly lost, and very full." },
      { kind: "photo", src: "images/travels/china.jpg", caption: "West Lake, Hangzhou", rot: 0.5, size: "medium" },
    ],
  },
  "japan-24": {
    entries: [
      { kind: "title", text: "Ten days in Japan", sub: "Tokyo → Kyoto → Osaka, by train, on foot, mostly full." },
      { kind: "photo", src: "images/travels/japan.jpg", caption: "Shinjuku, 11pm", rot: -1, size: "large" },
      { kind: "text", body: "I filled a notebook. I bought too many pens. I stood in a 7-Eleven at 2am eating onigiri and thought, very seriously, about moving here." },
      { kind: "photo", src: "images/travels/japan.jpg", caption: "Kyoto morning", rot: 1.5, size: "medium" },
      { kind: "quote", body: "Every convenience store feels like a small gift someone left for you." },
      { kind: "photo", src: "images/travels/japan.jpg", caption: "Osaka street food", rot: -0.6, size: "small" },
      { kind: "photo", src: "images/travels/japan.jpg", caption: "Temple, nameless", rot: 0.9, size: "small" },
    ],
  },
  "netherlands-25": {
    entries: [
      { kind: "title", text: "A week of canals", sub: "Amsterdam and Utrecht, by bike, mostly." },
      { kind: "photo", src: "images/travels/netherlands.jpg", caption: "Canal, morning", rot: -1.4, size: "large" },
      { kind: "text", body: "March is the wrong month to visit and also maybe the right one. Empty museums, gray light, no queues anywhere. I rented a bike the first day and never returned it until the last." },
      { kind: "quote", body: "It rained every day. I did not mind." },
      { kind: "photo", src: "images/travels/netherlands.jpg", caption: "Bookshop, Utrecht", rot: 1.1, size: "medium" },
      { kind: "photo", src: "images/travels/netherlands.jpg", caption: "Breakfast spread", rot: -0.7, size: "small" },
    ],
  },
};

function PageTrip({ tripId, route, setRoute, theme }) {
  const trip = window.TRIPS.find(t => t.id === tripId);
  const data = TRIP_SCRAPBOOKS[tripId];
  if (!trip || !data) {
    return (
      <PageShell route={route} setRoute={setRoute} theme={theme} title="Not found">
        <div style={{ fontFamily: theme.serif, fontSize: 18 }}>That trip isn't filed yet.</div>
      </PageShell>
    );
  }

  return (
    <div className="page-fade paper-a" style={{ minHeight: "100vh", fontFamily: theme.serif, color: T.ink }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />

      {/* Archive header strip */}
      <div className="m-page-pad" style={{ padding: "36px 56px 0" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase",
          padding: "8px 0",
        }}>
          <span className="m-strip-tab" style={{ background: theme.accent, color: T.paperCard, padding: "4px 11px", letterSpacing: 1.6 }}>← TRAVELS · {trip.place.toUpperCase()}</span>
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="m-strip-ref">REF. B-{String(window.TRIPS.indexOf(trip) + 1).padStart(2, "0")}</span>
            <span className="m-strip-leader" style={{ width: 11, borderBottom: `1px dotted ${T.hairStrong}`, transform: "translateY(1px)" }} />
            <span className="m-strip-updated">UPDATED 04·22·26</span>
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <span onClick={() => setRoute("travels")} style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, letterSpacing: 1.4, textTransform: "uppercase", cursor: "pointer" }}>
            ← back to travels
          </span>
        </div>
      </div>

      {/* Title card */}
      <div className="m-page-pad" style={{ padding: "60px 56px 40px" }}>
        <div className="m-trip-head" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>
              ENTRY C · № {String(window.TRIPS.indexOf(trip) + 1).padStart(3, "0")}
            </div>
            <div className="m-trip-title" style={{ fontFamily: theme.serif, fontSize: 96, lineHeight: 0.95, letterSpacing: -2 }}>
              {trip.place}<span style={{ color: theme.accent }}>.</span>
            </div>
            <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: T.ink60, marginTop: 12 }}>{data.entries[0].sub}</div>
          </div>
          {/* Big postage stamp */}
          <div className="m-trip-stamp" style={{
            width: 160, height: 200,
            background: T.paperCard, border: `2px dashed ${T.ink}`, padding: 10,
            fontFamily: T.mono,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            transform: "rotate(-4deg)", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            justifySelf: "end",
          }}>
            <div style={{ fontFamily: theme.serif, fontSize: 54, fontStyle: "italic" }}>{trip.stamp}</div>
            <div style={{ height: 1, width: "70%", background: T.ink, margin: "8px 0" }}/>
            <div style={{ fontSize: 9, letterSpacing: 1.2 }}>POSTED</div>
            <div style={{ fontSize: 9, letterSpacing: 1.2 }}>{trip.date}</div>
            <div style={{ fontSize: 9, letterSpacing: 1.2, marginTop: 4 }}>{trip.duration}</div>
          </div>
        </div>
      </div>

      {/* Scrapbook */}
      <div className="m-page-pad" style={{ padding: "40px 56px 80px" }}>
        <div className="m-scrap-cols" style={{ columnCount: 3, columnGap: 28 }}>
          {data.entries.slice(1).map((e, i) => (
            <ScrapEntry key={i} entry={e} theme={theme} />
          ))}
        </div>
      </div>

      {/* Nav between trips */}
      <div className="m-page-pad" style={{ padding: "0 56px 60px", borderTop: `1px solid ${T.hair}`, marginTop: 20, paddingTop: 32 }}>
        <TripNav tripId={tripId} setRoute={setRoute} theme={theme} />
      </div>
    </div>
  );
}

function ScrapEntry({ entry, theme }) {
  const boxStyle = {
    breakInside: "avoid", marginBottom: 24,
    background: T.paperCard, border: `1px solid ${T.hairStrong}`,
    padding: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
    transform: `rotate(${entry.rot || 0}deg)`,
  };

  if (entry.kind === "photo") {
    const aspectRatio = entry.size === "large" ? "4/3" : entry.size === "medium" ? "1/1" : "3/4";
    return (
      <div style={boxStyle}>
        <div style={{ width: "100%", aspectRatio, overflow: "hidden", background: T.paperDeep }}>
          <img src={entry.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.12) saturate(0.92)" }}/>
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={window.capStyle(theme, 15)}>{entry.caption}</div>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ink60, letterSpacing: 1 }}>IMG</div>
        </div>
      </div>
    );
  }
  if (entry.kind === "text") {
    return (
      <div style={{ breakInside: "avoid", marginBottom: 24, padding: "4px 0" }}>
        <div style={{ fontFamily: theme.serif, fontSize: 16, lineHeight: 1.6, color: T.ink }}>{entry.body}</div>
      </div>
    );
  }
  if (entry.kind === "quote") {
    return (
      <div style={{ breakInside: "avoid", marginBottom: 24, padding: "20px 20px", borderLeft: `2px solid ${theme.accent}`, background: "rgba(201, 100, 66, 0.04)" }}>
        <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 19, lineHeight: 1.45, color: T.ink }}>"{entry.body}"</div>
      </div>
    );
  }
  return null;
}

function TripNav({ tripId, setRoute, theme }) {
  const idx = window.TRIPS.findIndex(t => t.id === tripId);
  const prev = window.TRIPS[idx - 1];
  const next = window.TRIPS[idx + 1];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      {prev ? (
        <div onClick={() => setRoute(`travels/${prev.id}`)} style={{ cursor: "pointer", padding: "14px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>← PREVIOUS</div>
          <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic", marginTop: 4 }}>{prev.place}</div>
        </div>
      ) : <div />}
      {next ? (
        <div onClick={() => setRoute(`travels/${next.id}`)} style={{ cursor: "pointer", padding: "14px 0", textAlign: "right" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>NEXT →</div>
          <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic", marginTop: 4 }}>{next.place}</div>
        </div>
      ) : <div />}
    </div>
  );
}

Object.assign(window, { PageHome, PageBlog, PageBlogPost, PageProjects, PageProject, PageFavorites, PageAbout, PageTravels, PageTrip });

// ============================================================
// PROJECT DETAIL
// ============================================================
function PageProject({ slug, route, setRoute, theme }) {
  const p = window.PROJECTS.find(x => x.slug === slug);
  if (!p) {
    return (
      <PageShell route={route} setRoute={setRoute} theme={theme} title="Not filed">
        <div style={{ fontFamily: theme.serif, fontSize: 18 }}>No project at that slug.</div>
      </PageShell>
    );
  }

  const idx = window.PROJECTS.findIndex(x => x.slug === slug);
  const prev = window.PROJECTS[idx - 1];
  const next = window.PROJECTS[idx + 1];

  return (
    <div className="page-fade" style={{ color: T.ink, fontFamily: theme.serif, minHeight: "100vh", background: T.paper }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />

      {/* Strip */}
      <div className="m-page-pad" style={{ padding: "36px 56px 0" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60,
          padding: "8px 0", textTransform: "uppercase",
        }}>
          <span className="m-strip-tab" style={{ background: theme.accent, color: T.paperCard, padding: "4px 11px", letterSpacing: 1.6 }}>SECTION A · PROJECTS · {p.slug}</span>
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="m-strip-ref">REF. A-{String(idx + 1).padStart(2, "0")}</span>
            <span className="m-strip-leader" style={{ width: 11, borderBottom: `1px dotted ${T.hairStrong}`, transform: "translateY(1px)" }} />
            <span className="m-strip-updated">UPDATED 04·22·26</span>
          </span>
        </div>
      </div>

      {/* Back link */}
      <div className="m-page-pad" style={{ padding: "48px 56px 0" }}>
        <span onClick={() => setRoute("projects")} style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.ink60,
          textTransform: "uppercase", cursor: "pointer", display: "inline-flex", gap: 8, alignItems: "center",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = T.ink60}
        >← Projects</span>
      </div>

      {/* Variant-specific body */}
      <div className="m-page-pad" style={{ padding: "12px 56px 80px" }}>
        <DetailReport p={p} theme={theme} />

        {/* Prev / next nav */}
        <div style={{ marginTop: 72,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="m-2col">
          {prev ? (
            <div onClick={() => setRoute(`projects/${prev.slug}`)} style={{ cursor: "pointer" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>← Previous</div>
              <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic", marginTop: 4 }}>{prev.name}</div>
            </div>
          ) : <div />}
          {next ? (
            <div onClick={() => setRoute(`projects/${next.slug}`)} style={{ cursor: "pointer", textAlign: "right" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>Next →</div>
              <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic", marginTop: 4 }}>{next.name}</div>
            </div>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

// ----- Shared hero (header style 1: big image block, title below) -----
function ProjectHero({ p, theme, aspect = "21/9" }) {
  return (
    <div style={{ marginTop: 0 }}>
      <ProjectThumb project={p} theme={theme} aspect={aspect} />

      <div className="m-page-title" style={{
        fontFamily: theme.serif, fontSize: 92, lineHeight: 0.95, letterSpacing: -2.4,
        fontWeight: 400, marginTop: 28,
      }}>
        <span style={{ fontStyle: "italic" }}>{p.name}.</span>
      </div>
    </div>
  );
}

// ----- Shared spec strip (published / updated / stack / status) -----
function ProjectSpecs({ p, theme, layout = "row" }) {
  const isLive = p.status === "live" || p.status === "shipping";
  const fmtDate = (d) => (d || "").replace(/\s*·\s*/g, "·");
  const cells = [
    ["First published", fmtDate(p.published || p.started)],
    ["Updated",         (p.updated && p.updated !== p.published) ? fmtDate(p.updated) : "—"],
    ["Stack",           p.stack.join(" · ")],
    ["Status",          p.status],
  ];
  if (layout === "stack") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {cells.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontFamily: theme.serif, fontSize: 17, marginTop: 4 }}>{v}</div>
          </div>
        ))}
        {p.links && (
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
              {p.links.map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: theme.serif, fontSize: 14, fontStyle: "italic" }}>{k} ↗</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, marginTop: 2, wordBreak: "break-word" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  // ROW — full-width: labeled fields separated by flex-grow slash dividers
  return (
    <div className="m-spec-strip" style={{ display: "flex", alignItems: "stretch", width: "min(100%, max(50%, 620px))", marginRight: "auto" }}>
      {cells.map(([k, v], idx) => {
        const isStatus = k === "Status";
        return (
          <React.Fragment key={k}>
            {idx > 0 && (
              <div className="m-spec-div" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 22px", minWidth: 22 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.ink20, display: "block" }} />
              </div>
            )}
            <div className="m-spec-field" style={{ display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
              <div style={{
                fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6,
                color: T.ink40 || T.ink60, textTransform: "uppercase",
              }}>{k}</div>
              {isStatus ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: isLive ? theme.accent : T.ink40 || T.ink60,
                    boxShadow: isLive ? `0 0 0 3px ${theme.accent}22` : "none",
                  }} />
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.ink, lineHeight: 1, textTransform: "uppercase", letterSpacing: 0.4 }}>{v}</span>
                </span>
              ) : (
                <div style={{ fontFamily: T.mono, fontSize: 12, color: T.ink, lineHeight: 1.4, letterSpacing: 0.3 }}>{v}</div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// =========================================
// VARIATION B — REPORT
// Magazine spread: pull quote, two-column body, outcome numbers
// =========================================
function DetailReport({ p, theme }) {
  return (
    <>
      <ProjectHero p={p} theme={theme} aspect="21/9" />
      <div style={{ marginTop: 40 }}>
        <ProjectSpecs p={p} theme={theme} />
      </div>

      {/* Lede — first entry as Overview */}
      <div style={{ margin: "72px auto 64px", maxWidth: 720 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 18 }}>
          ¶ Overview
        </div>
        <div style={{
          fontFamily: theme.serif, fontSize: 26, lineHeight: 1.4, letterSpacing: -0.3,
          color: T.ink, textWrap: "pretty",
        }}>
          {p.entries[0].b}
        </div>
      </div>

      {/* Sectioned essay body — single readable column, thematic headings, no dates */}
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {p.entries.slice(1).map((e, i) => (
          <section key={i} style={{ marginBottom: 56 }}>
            <h2 style={{
              fontFamily: theme.serif, fontStyle: "italic", fontSize: 34,
              letterSpacing: -0.6, lineHeight: 1.15, fontWeight: 400,
              margin: "0 0 20px",
              textWrap: "balance",
            }}>{e.h}.</h2>
            <p style={{
              fontFamily: theme.serif, fontSize: 19, lineHeight: 1.65, color: T.ink,
              margin: 0, textWrap: "pretty",
            }}>{e.b}</p>

            {/* Drop a figure midway through the essay */}
            {i === Math.floor((p.entries.length - 1) / 2) - 1 && (
              <figure style={{ margin: "48px 0 8px" }}>
                <ProjectThumb project={p} theme={theme} aspect="4/3" />
                <figcaption style={{
                  fontFamily: T.mono, fontSize: 9, color: T.ink60, letterSpacing: 1.4,
                  textTransform: "uppercase", marginTop: 10,
                }}>
                  Fig. 01 — {p.name.toLowerCase()}, in situ
                </figcaption>
              </figure>
            )}
          </section>
        ))}
      </div>

      {/* Outcome numbers */}
      {theme.showMetrics && p.metrics && (
        <div style={{
          marginTop: 72,
          padding: "32px 0",
          borderTop: `1px solid ${T.hairStrong}`,
          borderBottom: `1px solid ${T.hairStrong}`,
          textAlign: "center",
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 24, textAlign: "left" }}>
            By the numbers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.metrics.length}, 1fr)`, gap: "clamp(12px, 3vw, 32px)" }} className="m-metrics">
            {p.metrics.map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: theme.serif, fontSize: "clamp(30px, 7vw, 64px)", lineHeight: 1, letterSpacing: -2, fontStyle: "italic" }}>
                  {v}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase", marginTop: 10 }}>
                  {k}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {p.links && (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 14 }}>
            Where to find it
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {p.links.map(([k, v]) => (
              <div key={k} style={{ cursor: "pointer" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontFamily: theme.serif, fontSize: 16, fontStyle: "italic", marginTop: 4, color: theme.accent }}>{v} ↗</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// BLOG POST DETAIL
// ============================================================
function PageBlogPost({ slug, route, setRoute, theme }) {
  const p = window.POSTS.find(x => x.slug === slug);
  if (!p) {
    return (
      <PageShell route={route} setRoute={setRoute} theme={theme} title="Not filed">
        <div style={{ fontFamily: theme.serif, fontSize: 18 }}>No post at that slug.</div>
      </PageShell>
    );
  }

  const idx = window.POSTS.findIndex(x => x.slug === slug);
  const prev = window.POSTS[idx + 1]; // older (POSTS is most-recent first)
  const next = window.POSTS[idx - 1]; // newer
  const related = window.POSTS.filter(x => x.slug !== slug && x.tags.some(t => p.tags.includes(t))).slice(0, 3);

  // Word count + read time
  const words = p.body.filter(b => b.kind === "p" || b.kind === "h" || b.kind === "pull")
    .map(b => b.text).join(" ").split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.round(words / 220));

  return (
    <div className="page-fade" style={{ color: T.ink, fontFamily: theme.serif, minHeight: "100vh", background: T.paper }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />

      {/* Strip */}
      <div className="m-page-pad" style={{ padding: "36px 56px 0" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60,
          padding: "8px 0", textTransform: "uppercase",
        }}>
          <span className="m-strip-tab" style={{ background: theme.accent, color: T.paperCard, padding: "4px 11px", letterSpacing: 1.6 }}>SECTION D · BLOG · {p.slug}</span>
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="m-strip-ref">REF. D-{String(idx + 1).padStart(2, "0")}</span>
            <span className="m-strip-leader" style={{ width: 11, borderBottom: `1px dotted ${T.hairStrong}`, transform: "translateY(1px)" }} />
            <span className="m-strip-updated">UPDATED 04·22·26</span>
          </span>
        </div>
      </div>

      {/* Back link + syndication — utility row */}
      <div className="m-page-pad" style={{
        padding: "20px 56px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span onClick={() => setRoute("blog")} style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.ink60,
          textTransform: "uppercase", cursor: "pointer",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = T.ink60}
        >← Blog</span>
        <span style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase",
          color: theme.accent, textDecoration: "underline", textUnderlineOffset: 3,
          display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          <span style={{ width: 6, height: 6, background: theme.accent, borderRadius: "50%" }} />
          Also on Substack ↗
        </span>
      </div>

      {/* Body */}
      <div className="m-page-pad" style={{ padding: "28px 56px 80px" }}>
        <PostLetter p={p} theme={theme} readMin={readMin} words={words} />

        {/* Footnotes (if any) */}
        {p.foot && p.foot.length > 0 && (
          <div style={{ marginTop: 56, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.hair}` }}>
              Footnotes
            </div>
            {p.foot.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, marginBottom: 12, fontFamily: theme.serif, fontSize: 14, lineHeight: 1.55, color: T.ink60, fontStyle: "italic" }}>
                <span style={{ fontFamily: T.mono, fontStyle: "normal", fontSize: 10, color: theme.accent, letterSpacing: 1 }}>[{String(i + 1).padStart(2, "0")}]</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Substack: subscribe card + comments */}
        <PostSubscribeAndComments p={p} theme={theme} setRoute={setRoute} />

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 72, paddingTop: 24, borderTop: `1px solid ${T.hairStrong}` }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 22 }}>
              Filed alongside
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${related.length}, 1fr)`, gap: 32 }} className="m-3col">
              {related.map(r => (
                <div key={r.slug} onClick={() => setRoute(`blog/${r.slug}`)} style={{ cursor: "pointer" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{r.date}</div>
                  <div style={{ fontFamily: theme.serif, fontSize: 20, fontStyle: "italic", lineHeight: 1.15, marginTop: 6, letterSpacing: -0.3 }}>{r.title}</div>
                  <div style={{ fontFamily: theme.serif, fontSize: 13, color: T.ink60, marginTop: 8, lineHeight: 1.5 }}>{r.excerpt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prev / next */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.hair}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="m-2col">
          {prev ? (
            <div onClick={() => setRoute(`blog/${prev.slug}`)} style={{ cursor: "pointer" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>← Older</div>
              <div style={{ fontFamily: theme.serif, fontSize: 20, fontStyle: "italic", marginTop: 4, lineHeight: 1.15 }}>{prev.title}</div>
            </div>
          ) : <div />}
          {next ? (
            <div onClick={() => setRoute(`blog/${next.slug}`)} style={{ cursor: "pointer", textAlign: "right" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>Newer →</div>
              <div style={{ fontFamily: theme.serif, fontSize: 20, fontStyle: "italic", marginTop: 4, lineHeight: 1.15 }}>{next.title}</div>
            </div>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

// Render a body block depending on kind. Shared across variants.
function PostBlock({ b, theme, accent, dense = false }) {
  if (b.kind === "h") {
    return (
      <h2 style={{
        fontFamily: theme.serif, fontStyle: "italic", fontSize: dense ? 24 : 30,
        letterSpacing: -0.4, lineHeight: 1.15, fontWeight: 400,
        margin: dense ? "32px 0 16px" : "44px 0 20px",
        color: T.ink,
      }}>{b.text}</h2>
    );
  }
  if (b.kind === "pull") {
    return (
      <div style={{
        margin: dense ? "28px 0" : "44px 0",
        paddingLeft: 22, borderLeft: `2px solid ${accent}`,
        fontFamily: theme.serif, fontStyle: "italic",
        fontSize: dense ? 24 : 30, lineHeight: 1.25, letterSpacing: -0.4,
        color: T.ink, textWrap: "balance",
      }}>
        “{b.text}”
      </div>
    );
  }
  if (b.kind === "img") {
    return <PostFigure b={b} theme={theme} dense={dense} />;
  }
  return (
    <p style={{
      fontFamily: theme.serif, fontSize: dense ? 16 : 19, lineHeight: 1.65,
      color: T.ink, margin: "0 0 22px", textWrap: "pretty",
    }}>{b.text}</p>
  );
}

// A photo or tinted placeholder with a caption beneath.
function PostFigure({ b, theme, dense = false, fullBleed = false }) {
  const aspect = b.aspect || "16/10";
  return (
    <figure style={{
      margin: fullBleed ? "56px 0" : (dense ? "24px 0" : "48px 0"),
      breakInside: "avoid",
    }}>
      {b.src ? (
        <img src={b.src} alt={b.caption || ""} style={{
          width: "100%", aspectRatio: aspect, objectFit: "cover",
          display: "block", filter: "sepia(0.06) saturate(0.92)",
        }}/>
      ) : (
        <div style={{
          width: "100%", aspectRatio: aspect, position: "relative", overflow: "hidden",
          background:
            `linear-gradient(135deg, rgba(0,0,0,0.18), rgba(255,255,255,0.05)), ` +
            `repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 12px, rgba(0,0,0,0.04) 12px 26px), ` +
            (b.color || "#7a6e60"),
          filter: "sepia(0.08) saturate(0.9)",
        }}>
          <div style={{
            position: "absolute", top: 10, right: 10,
            fontFamily: T.mono, fontSize: 8, letterSpacing: 1.4, textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}>photo</div>
        </div>
      )}
      {b.caption && (
        <figcaption style={{
          fontFamily: theme.serif, fontStyle: "italic",
          fontSize: 14, lineHeight: 1.5, color: T.ink60,
          marginTop: 12,
          paddingLeft: 14, borderLeft: `1px solid ${T.hair}`,
        }}>
          {b.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ----- LETTER — narrow centered column -----
function PostLetter({ p, theme, readMin, words }) {
  return (
    <article style={{ maxWidth: 640, margin: "16px auto 0" }}>
      <div style={{
        textAlign: "center",
        fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.ink60,
        textTransform: "uppercase", marginBottom: 18,
      }}>
        {p.date} &nbsp;·&nbsp; {readMin} min read
      </div>

      <h1 style={{
        fontFamily: theme.serif, fontStyle: "italic", fontSize: 56,
        lineHeight: 1.05, letterSpacing: -1.4, fontWeight: 400,
        textAlign: "center", margin: "0 0 22px",
        textWrap: "balance",
      }}>
        {p.title}.
      </h1>

      <div style={{
        textAlign: "center",
        fontFamily: theme.serif, fontSize: 19, color: T.ink60, lineHeight: 1.5,
        fontStyle: "italic", marginBottom: 12, textWrap: "balance",
      }}>
        {p.excerpt}
      </div>

      <div style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginBottom: 16, flexWrap: "wrap",
      }}>
        {p.tags.map(t => (
          <span key={t} style={{
            fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: theme.accent,
            border: `1px solid ${theme.accent}`, padding: "2px 8px", textTransform: "uppercase",
          }}>{t}</span>
        ))}
      </div>

      {/* Hero image breaks out wider than the body column */}
      {p.hero && (
        <figure style={{
          marginLeft: "calc(50% - 50vw + 56px)",
          marginRight: "calc(50% - 50vw + 56px)",
          marginTop: 8, marginBottom: 56,
        }}>
          <img src={p.hero} alt="" style={{
            width: "100%", aspectRatio: "21/9", objectFit: "cover",
            display: "block", filter: "sepia(0.08) saturate(0.9)",
          }}/>
          {p.heroCaption && (
            <figcaption style={{
              maxWidth: 640, margin: "14px auto 0",
              fontFamily: theme.serif, fontStyle: "italic",
              fontSize: 14, lineHeight: 1.5, color: T.ink60, textAlign: "center",
            }}>
              {p.heroCaption}
            </figcaption>
          )}
        </figure>
      )}

      {!p.hero && (
        <div style={{
          textAlign: "center",
          fontFamily: T.mono, fontSize: 14, color: T.ink40, letterSpacing: 4,
          marginBottom: 48,
        }}>
          ✦ ✦ ✦
        </div>
      )}

      {/* Body — first letter drop-cap */}
      {p.body.map((b, i) => {
        if (i === 0 && b.kind === "p") {
          return (
            <p key={i} style={{
              fontFamily: theme.serif, fontSize: 19, lineHeight: 1.65,
              color: T.ink, margin: "0 0 22px", textWrap: "pretty",
            }}>
              <span style={{
                float: "left", fontFamily: theme.serif, fontStyle: "italic",
                fontSize: 72, lineHeight: 0.85, marginRight: 12, marginTop: 6,
                color: theme.accent,
              }}>{b.text[0]}</span>
              {b.text.slice(1)}
            </p>
          );
        }
        return <PostBlock key={i} b={b} theme={theme} accent={theme.accent} />;
      })}

      <div style={{
        marginTop: 56, textAlign: "center",
        fontFamily: theme.serif, fontStyle: "italic", fontSize: 16, color: T.ink60,
      }}>
        — filed {p.date}, {words.toLocaleString()} words
      </div>
    </article>
  );
}

// ============================================================
// SUBSCRIBE CARD + COMMENTS — Substack integration
// ============================================================
function PostSubscribeAndComments({ p, theme, setRoute }) {
  // Sample static comments — in production these'd come from Substack's embed.
  const allComments = [
    { who: "Mara K.",   when: "2d",  text: "The line about the homepage as a room you return to — that's exactly what I'm trying to do with my own site this year. Bookmarked." },
    { who: "P. Singh",  when: "2d",  text: "Five readers, one of which is me. I wrote back via email." },
    { who: "Jess",      when: "1d",  text: "Curious about the RSS button you mentioned — what's the implementation look like?" },
    { who: "Theo",      when: "22h", text: "Deleted my analytics last month and have not missed them once. The server logs really are enough." },
    { who: "Anna L.",   when: "18h", text: "This is making me reconsider my whole publishing setup. The audience-of-five framing is so freeing." },
    { who: "Devon",     when: "12h", text: "What's your stance on webmentions? Feels related to the slow-internet idea." },
    { who: "K. Yamada", when: "6h",  text: "Wrote a response on my own site rather than commenting here, but wanted to say thanks for this one." },
    { who: "Hugo",      when: "3h",  text: "Counterpoint: the dates help me, the reader, more than they help you, the writer. Keep them." },
  ];
  const MAX = 5;
  const visible = allComments.slice(0, MAX);
  const overflow = allComments.length - visible.length;

  return (
    <div style={{ maxWidth: 640, margin: "72px auto 0" }}>

      {/* ----- Subscribe card ----- */}
      <div style={{
        position: "relative", padding: "36px 36px 30px",
        border: `1px solid ${T.ink}`,
        background: "transparent",
      }}>
        {/* Corner crop marks */}
        {[
          { top: -1, left: -1, b: "TL" },
          { top: -1, right: -1, b: "TR" },
          { bottom: -1, left: -1, b: "BL" },
          { bottom: -1, right: -1, b: "BR" },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: 10, height: 10,
            ...c,
            borderTop: c.b.startsWith("T") ? `1px solid ${T.ink}` : "none",
            borderBottom: c.b.startsWith("B") ? `1px solid ${T.ink}` : "none",
            borderLeft: c.b.endsWith("L") ? `1px solid ${T.ink}` : "none",
            borderRight: c.b.endsWith("R") ? `1px solid ${T.ink}` : "none",
          }} />
        ))}

        <div style={{
          fontFamily: T.mono, fontSize: 9, letterSpacing: 1.8,
          color: T.ink60, textTransform: "uppercase", marginBottom: 14,
          display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <span>Form 06 · Inbox subscription</span>
          <span>412 readers</span>
        </div>

        <div style={{
          fontFamily: theme.serif, fontStyle: "italic", fontSize: 32,
          lineHeight: 1.15, letterSpacing: -0.6, marginBottom: 10, textWrap: "balance",
        }}>
          Letters in your inbox, sometimes.
        </div>

        <div style={{
          fontFamily: theme.serif, fontSize: 16, color: T.ink60,
          lineHeight: 1.5, marginBottom: 22, maxWidth: 460,
        }}>
          A few posts a month, plus the occasional Friday note that doesn't make it onto the site. No tracking, no schedule, no upsells.
        </div>

        <div className="m-subscribe-row" style={{ display: "flex", marginBottom: 14, alignItems: "stretch" }}>
          <input placeholder="you@somewhere" style={{
            flex: 1, fontFamily: theme.serif, fontSize: 16, fontStyle: "italic",
            padding: "12px 14px", border: `1px solid ${T.ink}`, borderRight: "none",
            background: "transparent", color: T.ink, outline: "none",
            minWidth: 0,
          }} />
          <button style={{
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
            textTransform: "uppercase", padding: "0 22px",
            background: theme.accent, color: "#f1e9df",
            border: `1px solid ${theme.accent}`, cursor: "pointer",
          }}>Subscribe →</button>
        </div>

        <div style={{
          fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4,
          color: T.ink40, textTransform: "uppercase",
          display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
          paddingTop: 10, borderTop: `1px dashed ${T.hair}`,
        }}>
          <span>Free · weekly-ish · unsubscribe anytime</span>
          <span>Delivery via substack ↗</span>
        </div>
      </div>

      {/* ----- Comments ----- */}
      <div style={{ marginTop: 56 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          paddingBottom: 10, borderBottom: `1px solid ${T.hairStrong}`,
          marginBottom: 22, gap: 12, flexWrap: "wrap",
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
            color: T.ink, textTransform: "uppercase",
          }}>Comments · {allComments.length}</div>
        </div>

        {visible.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "36px 1fr", gap: 16,
            padding: "16px 0",
            borderBottom: i < visible.length - 1 ? `1px solid ${T.hair}` : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent", border: `1px solid ${T.ink}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.serif, fontStyle: "italic", fontSize: 16, color: T.ink,
            }}>{c.who[0]}</div>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: theme.serif, fontSize: 15, color: T.ink }}>
                  {c.who}
                </span>
                <span style={{
                  fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4,
                  color: T.ink40, textTransform: "uppercase",
                }}>{c.when} ago</span>
              </div>
              <div style={{
                fontFamily: theme.serif, fontSize: 16, lineHeight: 1.55,
                color: T.ink, textWrap: "pretty",
              }}>{c.text}</div>
              <div style={{
                marginTop: 8,
                fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4,
                color: T.ink40, textTransform: "uppercase",
                cursor: "pointer",
              }}>↳ Reply ↗</div>
            </div>
          </div>
        ))}

        {/* Overflow link to Substack */}
        {overflow > 0 && (
          <div style={{
            padding: "18px 0",
            borderTop: `1px solid ${T.hair}`,
            borderBottom: `1px solid ${T.hair}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: 12, flexWrap: "wrap",
          }}>
            <span style={{
              fontFamily: theme.serif, fontStyle: "italic", fontSize: 16, color: T.ink60,
            }}>
              + {overflow} more {overflow === 1 ? "comment" : "comments"}
            </span>
            <span style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
              color: theme.accent, textTransform: "uppercase",
              borderBottom: `1px solid ${theme.accent}`,
              paddingBottom: 2, cursor: "pointer",
            }}>Read on substack ↗</span>
          </div>
        )}

        <div style={{
          marginTop: 22, paddingTop: 18,
          borderTop: overflow > 0 ? "none" : `1px dashed ${T.hair}`,
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
            color: theme.accent, textTransform: "uppercase",
            borderBottom: `1px solid ${theme.accent}`,
            paddingBottom: 2, cursor: "pointer",
          }}>Join the discussion ↗</span>
        </div>
      </div>
    </div>
  );
}
