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
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase",
          padding: "8px 0", borderTop: `1px solid ${T.hairStrong}`, borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <span>Personal archive · vol. 01</span>
          <span>file: home.idx</span>
          <span>last updated 04 · 22 · 26</span>
        </div>
      </div>

      <div className="m-2col m-page-pad" style={{ padding: "72px 56px 80px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 28 }}>
            ENTRY 001 ·····  A COLLECTION
          </div>
          <div className="m-hero-title" style={{ fontFamily: theme.serif, fontSize: 128, lineHeight: 0.92, letterSpacing: -3, fontWeight: 400 }}>
            Hi,<br/>
            <span style={{ fontStyle: "italic" }}>I'm Lucy.</span>
          </div>
          <div style={{ marginTop: 40, maxWidth: 480, fontSize: 19, lineHeight: 1.55 }}>
            A software engineer cataloging the things I love — trips, records, films, and the small projects in between. This site is a room I keep returning to.
          </div>
          <div style={{ marginTop: 44, display: "flex", gap: 20, alignItems: "center" }}>
            <span onClick={() => setRoute("about")} style={{
              padding: "14px 28px", background: T.ink, color: T.paper, cursor: "pointer",
              fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase",
            }}>More about me →</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, letterSpacing: 1.4, textTransform: "uppercase" }}>
              5 sections · updated weekly
            </span>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 64 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 16 }}>
              ━━ Lately
            </div>
            <div>
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

        {/* Stacked photo */}
        <div className="m-home-photo" style={{ position: "relative", paddingTop: 40, minHeight: 560 }}>
          <div style={{ position: "absolute", top: 40, left: 50, right: 20, bottom: 60, background: T.paperDeep, transform: "rotate(-1.8deg)", border: `1px solid ${T.hairStrong}` }}/>
          <div style={{ position: "absolute", top: 30, left: 20, right: 40, bottom: 80, background: "#eae1d2", transform: "rotate(1.4deg)", border: `1px solid ${T.hairStrong}` }}/>
          <div style={{
            position: "absolute", top: 10, left: 30, right: 10, bottom: 40,
            background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}>
            <div style={{ width: "100%", height: "calc(100% - 56px)", overflow: "hidden", background: T.paperDeep }}>
              <img src="images/home/selfie1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.15) saturate(0.9)" }}/>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 17 }}>Self-portrait, spring</div>
              <CardLabel cat="A" no="001" accent={theme.accent} />
            </div>
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
      section="SECTION A · BLOG" catNo="file: blog.idx"
      title={<>Notes, filed by <span style={{ fontStyle: "italic" }}>date.</span></>}
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

function PageProjects({ route, setRoute, theme, projectsView = "polaroids" }) {
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION B · PROJECTS" catNo="file: projects.idx"
      title={<>Things I've <span style={{ fontStyle: "italic" }}>made.</span></>}
      subtitle={`${window.PROJECTS.length} entries · solo + collab · view: ${projectsView}`}>

      <div style={{ height: 24 }}/>

      {projectsView === "index"     && <ProjectsIndex theme={theme} setRoute={setRoute} />}
      {projectsView === "polaroids" && <ProjectsPolaroids theme={theme} setRoute={setRoute} />}
      {projectsView === "spread"    && <ProjectsSpread theme={theme} setRoute={setRoute} />}
    </PageShell>
  );
}

// ---- INDEX: the original catalog table, now with a thumbnail column ----
function ProjectsIndex({ theme, setRoute }) {
  return (
    <>
      <div className="m-proj-head m-proj-row" style={{ display: "grid", gridTemplateColumns: "92px 80px 2fr 1.4fr 1fr 0.9fr", gap: 24, padding: "12px 0", borderBottom: `1px solid ${T.hairStrong}`,
        fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>
        <span>Plate</span><span>Year</span><span>Title / role</span><span>Kind</span><span>Stack</span><span>Status</span>
      </div>
      {window.PROJECTS.map((p) => (
        <div key={p.name} className="m-proj-row"
          onClick={() => setRoute(`projects/${p.slug}`)}
          style={{ display: "grid", gridTemplateColumns: "92px 80px 2fr 1.4fr 1fr 0.9fr", gap: 24, padding: "20px 0", borderBottom: `1px solid ${T.hair}`, alignItems: "center", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(31,26,22,0.02)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 92 }}>
            <ProjectThumb project={p} theme={theme} aspect="4/3" />
          </div>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink60 }}>{p.year}</span>
          <span>
            <div style={{ fontFamily: theme.serif, fontSize: 24, fontStyle: "italic", lineHeight: 1.1 }}>{p.name}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{p.role}</div>
          </span>
          <span style={{ fontFamily: theme.serif, fontSize: 15, color: T.ink }}>{p.kind}</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, lineHeight: 1.6 }}>{p.stack.join(" · ")}</span>
          <StatusDot project={p} theme={theme} />
        </div>
      ))}
    </>
  );
}

// ---- POLAROIDS: scrapbook grid, each entry is a tilted card on paper ----
function ProjectsPolaroids({ theme, setRoute }) {
  // Stable per-card rotation based on index
  const tilts = [-1.4, 0.8, -0.6, 1.2, -1.0, 0.5];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "44px 32px",
      paddingTop: 8,
    }}>
      {window.PROJECTS.map((p, i) => {
        const rot = tilts[i % tilts.length];
        return (
          <div key={p.name}
            onClick={() => setRoute(`projects/${p.slug}`)}
            style={{
            transform: `rotate(${rot}deg)`,
            transition: "transform 220ms cubic-bezier(0.2,0.7,0.2,1)",
            cursor: "pointer",
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(0deg) translateY(-3px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = `rotate(${rot}deg)`}
          >
            {/* Polaroid card */}
            <div style={{
              background: "#fbf6ee",
              padding: "12px 12px 18px",
              boxShadow: "0 14px 28px rgba(60,40,20,0.14), 0 2px 4px rgba(60,40,20,0.08)",
              border: "1px solid rgba(31,26,22,0.06)",
            }}>
              <ProjectThumb project={p} theme={theme} aspect="5/4" />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, gap: 12 }}>
                <div style={{ fontFamily: theme.serif, fontSize: 22, fontStyle: "italic", lineHeight: 1.05, letterSpacing: -0.3 }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, letterSpacing: 1.2, whiteSpace: "nowrap" }}>
                  №{String(i + 1).padStart(2, "0")}
                </div>
              </div>

              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 4 }}>
                {p.role}
              </div>

              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.hair}`,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: theme.serif, fontSize: 13, color: T.ink }}>{p.kind}</span>
                <StatusDot project={p} theme={theme} />
              </div>

              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink40, letterSpacing: 1, marginTop: 6, lineHeight: 1.5 }}>
                {p.stack.join(" · ")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- SPREAD: magazine-style alternating image+text rows ----
function ProjectsSpread({ theme, setRoute }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {window.PROJECTS.map((p, i) => {
        const reverse = i % 2 === 1;
        return (
          <div key={p.name} className="m-proj-row"
            onClick={() => setRoute(`projects/${p.slug}`)}
            style={{
              display: "grid",
              gridTemplateColumns: reverse ? "1fr 1.1fr" : "1.1fr 1fr",
              gap: 56, alignItems: "center",
              padding: "44px 0",
              borderTop: i === 0 ? `1px solid ${T.hairStrong}` : `1px solid ${T.hair}`,
              borderBottom: i === window.PROJECTS.length - 1 ? `1px solid ${T.hairStrong}` : "none",
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
                Entry {String(i + 1).padStart(2, "0")} · {p.year}
              </div>
              <div style={{ fontFamily: theme.serif, fontSize: 52, lineHeight: 0.98, letterSpacing: -1, fontStyle: "italic" }}>
                {p.name}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 14 }}>
                {p.role}
              </div>
              <div style={{ fontFamily: theme.serif, fontSize: 18, color: T.ink, marginTop: 22, lineHeight: 1.5, maxWidth: 420 }}>
                {p.kind}.
              </div>
              <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 28, flexWrap: "wrap" }}>
                <StatusDot project={p} theme={theme} />
                <span style={{ width: 1, height: 14, background: T.hair }}/>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, letterSpacing: 1.2 }}>
                  {p.stack.join(" · ")}
                </span>
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
function PageFavorites({ route, setRoute, theme, moviesView }) {
  const [tab, setTab] = uS("music");
  const [selectedIdx, setSelectedIdx] = uS(0);
  const [playing, setPlaying] = uS(false);
  const [trackIdx, setTrackIdx] = uS(0);
  const [progress, setProgress] = uS(0);

  const selectedAlbum = window.ALBUMS[selectedIdx];
  const tracks = window.TRACKLISTS[selectedAlbum.title] || window.DEFAULT_TRACKLIST;

  uE(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p + 0.5) % 100), 200);
    return () => clearInterval(id);
  }, [playing]);
  uE(() => { setTrackIdx(0); setProgress(0); }, [selectedIdx]);

  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION D · FAVORITES" catNo="file: favorites.idx"
      title={<>A <span style={{ fontStyle: "italic" }}>listening</span> & <span style={{ fontStyle: "italic" }}>watching</span> log.</>}>

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
            <div style={{ background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 18, maxWidth: 580 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, lineHeight: 1 }}>{selectedAlbum.title}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{selectedAlbum.artist} · {selectedAlbum.year}</div>
                </div>
                <CardLabel cat="D.M" no={String(selectedIdx + 1).padStart(3, "0")} accent={theme.accent} />
              </div>
              <Hair />
              <div style={{ marginTop: 10 }}>
                {tracks.map((tr, i) => (
                  <div key={tr.n} onClick={() => { setTrackIdx(i); setPlaying(true); }} style={{
                    display: "grid", gridTemplateColumns: "26px 1fr auto", gap: 14, padding: "6px 0",
                    alignItems: "baseline", cursor: "pointer",
                    fontFamily: T.mono, fontSize: 11,
                    color: i === trackIdx ? theme.accent : T.ink,
                    borderLeft: i === trackIdx ? `2px solid ${theme.accent}` : "2px solid transparent",
                    paddingLeft: 10, marginLeft: -12,
                    transition: "all 180ms",
                  }}>
                    <span style={{ color: T.ink40, fontSize: 9 }}>{String(tr.n).padStart(2, "0")}</span>
                    <span style={{ fontFamily: theme.serif, fontSize: 15, fontStyle: i === trackIdx ? "italic" : "normal" }}>
                      {i === trackIdx && playing && <span style={{ marginRight: 6, color: theme.accent }}>♪</span>}
                      {tr.name}
                    </span>
                    <span style={{ color: T.ink60, fontSize: 10 }}>{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
              <span>Record rack</span>
              <span>{window.ALBUMS.length} records</span>
            </div>
            <div className="m-rack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {window.ALBUMS.map((a, i) => (
                <div key={a.src} onClick={() => setSelectedIdx(i)} style={{
                  cursor: "pointer", position: "relative", padding: 3,
                  background: i === selectedIdx ? T.ink : "transparent",
                  transition: "all 200ms",
                }}>
                  <img src={a.src} alt="" style={{
                    width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block",
                    filter: i === selectedIdx ? "none" : "saturate(0.9)",
                    transition: "filter 200ms",
                  }}/>
                  {i === selectedIdx && (
                    <div style={{ position: "absolute", top: -18, right: 0, fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: theme.accent, textTransform: "uppercase" }}>
                      → now
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MoviesBlock moviesView={moviesView} theme={theme} />
      )}
    </PageShell>
  );
}

function MoviesBlock({ moviesView, theme }) {
  if (moviesView === "cards") {
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
  if (moviesView === "tickets") {
    return (
      <div className="m-movies-tickets" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
        {window.MOVIES.map((m, i) => (
          <div key={m.title} style={{ display: "grid", gridTemplateColumns: "90px 1fr 80px", background: T.paperCard, border: `1px dashed ${T.ink60}`, transform: `rotate(${i%2?0.4:-0.5}deg)` }}>
            <div style={{ borderRight: `1px dashed ${T.ink60}`, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between", background: T.paperDeep }}>
              <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase" }}>ADMIT ONE</div>
              <div style={{ fontFamily: theme.serif, fontSize: 24, fontStyle: "italic" }}>★ {m.rating}</div>
              <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ink60, letterSpacing: 1 }}>{m.date}</div>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily: theme.serif, fontSize: 19, fontStyle: "italic", lineHeight: 1.1 }}>{m.title}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{m.director} · {m.year}</div>
              <div style={{ fontFamily: theme.serif, fontSize: 12, color: T.ink60, marginTop: 8, lineHeight: 1.4, fontStyle: "italic" }}>"{m.note}"</div>
            </div>
            <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
        ))}
      </div>
    );
  }
  // reel
  return (
    <div>
      <div style={{ background: T.ink, padding: "14px 12px", display: "flex", gap: 4, position: "relative" }}>
        <div style={{ position: "absolute", top: 3, left: 0, right: 0, display: "flex", gap: 14, padding: "0 14px" }}>
          {Array.from({length:28}).map((_,i) => <div key={i} style={{ width: 9, height: 6, background: T.paper, borderRadius: 1 }}/>)}
        </div>
        <div style={{ position: "absolute", bottom: 3, left: 0, right: 0, display: "flex", gap: 14, padding: "0 14px" }}>
          {Array.from({length:28}).map((_,i) => <div key={i} style={{ width: 9, height: 6, background: T.paper, borderRadius: 1 }}/>)}
        </div>
        <div style={{ marginTop: 14, marginBottom: 14, display: "flex", gap: 4, width: "100%" }}>
          {window.MOVIES.map(m => (
            <img key={m.title} src={m.src} alt="" style={{ flex: 1, aspectRatio: "2/3", objectFit: "cover", width: 0 }}/>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {window.MOVIES.map(m => (
          <div key={m.title}>
            <div style={{ fontFamily: theme.serif, fontSize: 16, fontStyle: "italic" }}>{m.title}</div>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{m.director} · {m.year} · {"★".repeat(Math.floor(m.rating))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ABOUT
// ============================================================
function PageAbout({ route, setRoute, theme }) {
  const socials = [
    { l: "Instagram", h: "@lucy.gai", url: "instagram.com/lucy.gai" },
    { l: "Letterboxd", h: "lucy_gai", url: "letterboxd.com/lucy_gai" },
    { l: "Spotify", h: "charlottefour", url: "open.spotify.com/user/charlottefour" },
    { l: "Twitch", h: "88lucie", url: "twitch.tv/88lucie" },
    { l: "Email", h: "hello@lucygai.com", url: "mailto:hello@lucygai.com" },
  ];
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION F · ABOUT" catNo="file: about.idx">

      <div className="m-about-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, paddingTop: 32 }}>
        <div>
          <div className="m-about-intro" style={{ fontFamily: theme.serif, fontSize: 48, lineHeight: 1.2, letterSpacing: -0.6, fontWeight: 400 }}>
            Hi! I'm <span style={{ fontStyle: "italic" }}>Lucy</span> — a software engineer in <span style={{ fontStyle: "italic" }}>San Francisco</span>, currently building tools at a small startup and cataloging the things I love here.
          </div>
          <Hair style={{ margin: "40px 0" }}/>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, color: T.ink60, textTransform: "uppercase", marginBottom: 14 }}>Currently</div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px 28px", fontSize: 15, lineHeight: 1.5 }}>
            {[
              ["Reading", <><em>A Little Life</em> — Hanya Yanagihara</>],
              ["Listening", "nolimit, — Knock2 (on repeat, regrettably)"],
              ["Building", "this site, and a quiet tool for keeping lists"],
              ["Planning", "Tokyo in September, Lisbon in November"],
            ].map(([k,v]) => (
              <React.Fragment key={k}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>{k}</span>
                <span>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 32, position: "relative", height: "fit-content" }}>
          <div style={{ position: "absolute", top: -12, left: 20, background: T.paper, padding: "2px 12px", fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase", border: `1px solid ${T.hairStrong}` }}>
            Contact index
          </div>
          <CardLabel cat="F" no="001" date="04 · 22 · 26" accent={theme.accent} />
          <div style={{ fontFamily: theme.serif, fontSize: 34, fontStyle: "italic", marginTop: 18 }}>Gai, Lucy</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 4 }}>Engineer / amateur archivist</div>

          <Hair style={{ margin: "22px 0" }}/>
          {socials.map((s, i) => (
            <div key={s.l} style={{ display: "grid", gridTemplateColumns: "110px 1fr auto", padding: "12px 0", borderBottom: i < socials.length - 1 ? `1px dashed ${T.hair}` : "none", alignItems: "baseline", cursor: "pointer" }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{s.l}</span>
              <div>
                <div style={{ fontFamily: theme.serif, fontSize: 16, fontStyle: "italic" }}>{s.h}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink40, marginTop: 2 }}>{s.url}</div>
              </div>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: theme.accent }}>↗</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ============================================================
// TRAVELS — postcards grid
// ============================================================
function PageTravels({ route, setRoute, theme }) {
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION C · TRAVELS" catNo="file: travels.idx"
      title={<>Places, <span style={{ fontStyle: "italic" }}>cataloged.</span></>}
      subtitle={`${window.TRIPS.length} entries · filed by date`}>

      <div className="m-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
        {window.TRIPS.map((t, i) => (
          <div key={t.id} onClick={() => setRoute(`travels/${t.id}`)} style={{
            background: T.paperCard, border: `1px solid ${T.hairStrong}`, padding: 18, cursor: "pointer",
            transform: `rotate(${i === 1 ? 0.8 : i === 0 ? -0.6 : 0.3}deg)`,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            position: "relative", transition: "transform 260ms, box-shadow 260ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0) translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${i === 1 ? 0.8 : i === 0 ? -0.6 : 0.3}deg)`; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: T.paperDeep }}>
              <img src={t.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.1) saturate(0.92)" }}/>
            </div>
            <div style={{
              position: "absolute", top: 10, right: 10,
              width: 60, height: 72, background: T.paper, border: `1px dashed ${T.ink}`, padding: 4,
              fontFamily: T.mono,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
            }}>
              <div style={{ fontFamily: theme.serif, fontSize: 20, fontStyle: "italic" }}>{t.stamp}</div>
              <div style={{ height: 1, width: "80%", background: T.ink, margin: "3px 0" }}/>
              <div style={{ fontSize: 7, letterSpacing: 0.8 }}>POSTED</div>
              <div style={{ fontSize: 7, letterSpacing: 0.8 }}>{t.date.replace(" / ", "·")}</div>
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ fontFamily: theme.serif, fontSize: 28, fontStyle: "italic", lineHeight: 1 }}>{t.place}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, marginTop: 5, letterSpacing: 0.6 }}>{t.sub}</div>
              </div>
            </div>
            <Hair style={{ margin: "14px 0 10px" }}/>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>
              <span>{t.duration}</span>
              <span style={{ color: theme.accent }}>№ {String(i+1).padStart(3, "0")} →</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
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
      <div className="m-page-pad" style={{ padding: "32px 56px 0" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase",
          padding: "8px 0", borderTop: `1px solid ${T.hairStrong}`, borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <span style={{ color: theme.accent }}>← TRAVELS · {trip.place.toUpperCase()}</span>
          <span>{trip.date}</span>
          <span>{trip.duration}</span>
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
          <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 13 }}>{entry.caption}</div>
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
// PROJECT DETAIL — three variations of the same template
// ============================================================
function PageProject({ slug, route, setRoute, theme, projectDetailView = "letter" }) {
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
      <div className="m-page-pad" style={{ padding: "0 56px" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60,
          padding: "8px 0", textTransform: "uppercase",
          borderTop: `1px solid ${T.hairStrong}`,
          borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <span style={{ color: theme.accent }}>SECTION B · PROJECTS · {p.slug}</span>
          <span>file: {p.slug}.entry</span>
          <span>{p.year}</span>
        </div>
      </div>

      {/* Back link */}
      <div className="m-page-pad" style={{ padding: "20px 56px 0" }}>
        <span onClick={() => setRoute("projects")} style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.ink60,
          textTransform: "uppercase", cursor: "pointer", display: "inline-flex", gap: 8, alignItems: "center",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = T.ink60}
        >← Projects</span>
      </div>

      {/* Variant-specific body */}
      <div className="m-page-pad" style={{ padding: "28px 56px 80px" }}>
        {projectDetailView === "letter"     && <DetailLetter     p={p} theme={theme} />}
        {projectDetailView === "report"     && <DetailReport     p={p} theme={theme} />}
        {projectDetailView === "sketchbook" && <DetailSketchbook p={p} theme={theme} />}

        {/* Prev / next nav */}
        <div style={{ marginTop: 72, paddingTop: 24, borderTop: `1px solid ${T.hairStrong}`,
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
    <div style={{ marginTop: 24 }}>
      <ProjectThumb project={p} theme={theme} aspect={aspect} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 28, gap: 32, flexWrap: "wrap" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, color: theme.accent, textTransform: "uppercase" }}>
          {p.kind} · {p.role}
        </div>
        <StatusDot project={p} theme={theme} />
      </div>

      <div className="m-page-title" style={{
        fontFamily: theme.serif, fontSize: 92, lineHeight: 0.95, letterSpacing: -2.4,
        fontWeight: 400, marginTop: 14,
      }}>
        <span style={{ fontStyle: "italic" }}>{p.name}.</span>
      </div>

      <div style={{ fontFamily: theme.serif, fontSize: 22, lineHeight: 1.45, marginTop: 22, maxWidth: 680, color: T.ink }}>
        {p.tagline}
      </div>
    </div>
  );
}

// ----- Shared spec strip (year / role / stack / links) -----
function ProjectSpecs({ p, theme, layout = "row" }) {
  const cells = [
    ["Started",  p.started],
    ["Filed",    p.filed],
    ["Stack",    p.stack.join(" · ")],
    ["Status",   p.status],
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
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
      gap: 24,
      padding: "20px 0",
      borderTop: `1px solid ${T.hairStrong}`,
      borderBottom: `1px solid ${T.hair}`,
    }}>
      {cells.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{k}</div>
          <div style={{ fontFamily: theme.serif, fontSize: 16, marginTop: 4 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// =========================================
// VARIATION A — LETTER
// Dated diary entries, drop-cap on first, single inline image break
// =========================================
function DetailLetter({ p, theme }) {
  return (
    <>
      <ProjectHero p={p} theme={theme} aspect="21/9" />

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 240px", gap: 64 }} className="m-2col">
        <div>
          {p.entries.map((e, i) => (
            <div key={i} style={{
              borderTop: i === 0 ? "none" : `1px solid ${T.hair}`,
              paddingTop: i === 0 ? 0 : 36,
              marginTop: i === 0 ? 0 : 36,
            }}>
              <div style={{
                fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
                color: theme.accent, textTransform: "uppercase",
                marginBottom: 12,
              }}>
                Entry {String(i + 1).padStart(2, "0")} · {e.date}
              </div>
              <div style={{
                fontFamily: theme.serif, fontSize: 28, fontStyle: "italic",
                lineHeight: 1.15, letterSpacing: -0.4, marginBottom: 18,
              }}>
                {e.h}
              </div>
              <div style={{
                fontFamily: theme.serif, fontSize: 18, lineHeight: 1.65, color: T.ink,
                textWrap: "pretty",
              }}>
                {i === 0 ? (
                  <>
                    <span style={{
                      float: "left", fontFamily: theme.serif, fontStyle: "italic",
                      fontSize: 72, lineHeight: 0.85, marginRight: 12, marginTop: 6, color: theme.accent,
                    }}>{e.b[0]}</span>
                    {e.b.slice(1)}
                  </>
                ) : e.b}
              </div>
            </div>
          ))}

          {/* Sign-off */}
          <div style={{ marginTop: 56, fontFamily: theme.serif, fontStyle: "italic", fontSize: 17, color: T.ink60 }}>
            — filed {p.filed}
          </div>
        </div>

        <aside style={{
          position: "sticky", top: 32, alignSelf: "start",
          borderLeft: `1px solid ${T.hairStrong}`, paddingLeft: 24,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 2, color: T.ink60, textTransform: "uppercase", marginBottom: 18 }}>
            Card · file
          </div>
          <ProjectSpecs p={p} theme={theme} layout="stack" />
        </aside>
      </div>
    </>
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
      <div style={{ marginTop: 48 }}>
        <ProjectSpecs p={p} theme={theme} />
      </div>

      {/* Pull quote */}
      <div style={{ margin: "72px 0 56px", maxWidth: 900 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 14 }}>
          ¶ Opening
        </div>
        <div style={{
          fontFamily: theme.serif, fontSize: 42, lineHeight: 1.18, letterSpacing: -0.8,
          fontStyle: "italic", color: T.ink, textWrap: "balance",
        }}>
          “{p.entries[0].b.split(".")[0]}.”
        </div>
      </div>

      {/* Two-column body with images interspersed */}
      <div style={{ columnCount: 2, columnGap: 56, fontFamily: theme.serif, fontSize: 17, lineHeight: 1.65, color: T.ink }} className="m-scrap-cols">
        {p.entries.map((e, i) => (
          <div key={i} style={{ breakInside: "avoid", marginBottom: 28 }}>
            <div style={{
              fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60,
              textTransform: "uppercase", marginBottom: 6,
            }}>
              {e.date} · {e.h}
            </div>
            <div style={{ textWrap: "pretty" }}>{e.b}</div>
          </div>
        ))}

        {/* An inline figure */}
        <div style={{ breakInside: "avoid", marginBottom: 28 }}>
          <ProjectThumb project={p} theme={theme} aspect="4/3" />
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, letterSpacing: 1.4, textTransform: "uppercase", marginTop: 8 }}>
            Fig. 01 — {p.name.toLowerCase()}, in situ
          </div>
        </div>
      </div>

      {/* Outcome numbers */}
      {p.metrics && (
        <div style={{
          marginTop: 72,
          padding: "32px 0",
          borderTop: `1px solid ${T.hairStrong}`,
          borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 24 }}>
            By the numbers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.metrics.length}, 1fr)`, gap: 32 }} className="m-3col">
            {p.metrics.map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: theme.serif, fontSize: 64, lineHeight: 1, letterSpacing: -2, fontStyle: "italic" }}>
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
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {p.links.map(([k, v]) => (
              <div key={k} style={{
                padding: "12px 18px",
                border: `1px solid ${T.hairStrong}`,
                cursor: "pointer",
              }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontFamily: theme.serif, fontSize: 16, fontStyle: "italic", marginTop: 4 }}>{v} ↗</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// =========================================
// VARIATION C — SKETCHBOOK
// Taped-photo collage on paper, margin notes in monospace
// =========================================
function DetailSketchbook({ p, theme }) {
  // Each entry gets a "scrap" — a small image scrap and a handwritten-style note.
  return (
    <>
      <ProjectHero p={p} theme={theme} aspect="21/9" />

      {/* Margin-note metadata */}
      <div style={{
        marginTop: 32,
        display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end",
        paddingBottom: 18, borderBottom: `1px dashed ${T.ink60}`,
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.ink60, lineHeight: 1.8 }}>
          STARTED <span style={{ color: T.ink }}>{p.started}</span> &nbsp;·&nbsp;
          FILED <span style={{ color: T.ink }}>{p.filed}</span> &nbsp;·&nbsp;
          STACK <span style={{ color: T.ink }}>{p.stack.join(" / ")}</span>
        </div>
        <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 18, color: T.ink60 }}>
          ※ from the sketchbook
        </div>
      </div>

      {/* Scrap collage — each entry is a tilted card with a small thumb + handwritten note */}
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 64 }}>
        {p.entries.map((e, i) => {
          const tilts = [-1.6, 1.2, -0.8, 0.9, -1.1];
          const rot = tilts[i % tilts.length];
          const reverse = i % 2 === 1;
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: reverse ? "1fr 360px" : "360px 1fr",
              gap: 52, alignItems: "start",
            }} className="m-2col">
              {/* Photo scrap */}
              <div style={{ order: reverse ? 2 : 1, position: "relative", padding: "0 8px" }}>
                <div style={{
                  transform: `rotate(${rot}deg)`,
                  background: "#fbf6ee",
                  padding: "10px 10px 14px",
                  boxShadow: "0 16px 32px rgba(60,40,20,0.14), 0 2px 4px rgba(60,40,20,0.08)",
                  border: "1px solid rgba(31,26,22,0.05)",
                  position: "relative",
                }}>
                  {/* Tape strip */}
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-2deg)",
                    width: 80, height: 18,
                    background: "rgba(212, 180, 130, 0.55)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  }}/>
                  <ProjectThumb project={p} theme={theme} aspect="4/3" />
                  <div style={{
                    fontFamily: T.mono, fontSize: 9, color: T.ink60, letterSpacing: 1.2,
                    textTransform: "uppercase", marginTop: 8, textAlign: "center",
                  }}>
                    plate · {String(i + 1).padStart(2, "0")} / {String(p.entries.length).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div style={{ order: reverse ? 1 : 2, paddingTop: 12 }}>
                <div style={{
                  fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, color: theme.accent,
                  textTransform: "uppercase", marginBottom: 10,
                }}>
                  ↪ {e.date}
                </div>
                <div style={{
                  fontFamily: theme.serif, fontSize: 32, fontStyle: "italic", lineHeight: 1.1,
                  letterSpacing: -0.5, marginBottom: 14, color: T.ink,
                }}>
                  {e.h}
                </div>
                <div style={{
                  fontFamily: theme.serif, fontSize: 17, lineHeight: 1.6, color: T.ink,
                  textWrap: "pretty",
                  paddingLeft: 18, borderLeft: `2px solid ${theme.accent}`,
                }}>
                  {e.b}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer scrap — links + tagline as if scribbled */}
      <div style={{
        marginTop: 80, padding: "32px 36px", background: T.paperCard,
        border: `1px dashed ${T.ink60}`, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -12, left: 24, background: T.paper,
          padding: "2px 12px", fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6,
          color: T.ink60, textTransform: "uppercase", border: `1px solid ${T.hairStrong}`,
        }}>
          Endnote
        </div>
        <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, lineHeight: 1.45, color: T.ink, maxWidth: 640 }}>
          {p.tagline}
        </div>
        {p.links && (
          <div style={{ marginTop: 18, display: "flex", gap: 18, flexWrap: "wrap" }}>
            {p.links.map(([k, v]) => (
              <span key={k} style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: theme.accent, textTransform: "uppercase" }}>
                {k}: <span style={{ color: T.ink }}>{v}</span> ↗
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================
// BLOG POST DETAIL — three variations
// ============================================================
function PageBlogPost({ slug, route, setRoute, theme, blogPostView = "letter" }) {
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
      <div className="m-page-pad" style={{ padding: "0 56px" }}>
        <div className="m-strip" style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60,
          padding: "8px 0", textTransform: "uppercase",
          borderTop: `1px solid ${T.hairStrong}`,
          borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <span style={{ color: theme.accent }}>SECTION A · BLOG · {p.slug}</span>
          <span>file: {p.slug}.entry</span>
          <span>{p.date}</span>
          <span className="m-strip-syndication" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, background: theme.accent, borderRadius: "50%" }} />
            <span>Also on substack ↗</span>
          </span>
        </div>
      </div>

      {/* Back link */}
      <div className="m-page-pad" style={{ padding: "20px 56px 0" }}>
        <span onClick={() => setRoute("blog")} style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.ink60,
          textTransform: "uppercase", cursor: "pointer",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = T.ink60}
        >← Blog</span>
      </div>

      {/* Body */}
      <div className="m-page-pad" style={{ padding: "28px 56px 80px" }}>
        {blogPostView === "letter" && <PostLetter p={p} theme={theme} readMin={readMin} words={words} />}
        {blogPostView === "report" && <PostReport p={p} theme={theme} readMin={readMin} words={words} />}
        {blogPostView === "card"   && <PostCard   p={p} theme={theme} readMin={readMin} words={words} setRoute={setRoute} />}

        {/* Footnotes (if any) */}
        {p.foot && p.foot.length > 0 && blogPostView !== "card" && (
          <div style={{ marginTop: 56, maxWidth: blogPostView === "letter" ? 640 : "100%", marginLeft: blogPostView === "letter" ? "auto" : 0, marginRight: blogPostView === "letter" ? "auto" : 0 }}>
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

        {/* Substack: subscribe card + comments (letter view only — fits the centered column) */}
        {blogPostView === "letter" && (
          <PostSubscribeAndComments p={p} theme={theme} setRoute={setRoute} />
        )}

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

// ----- Variation A: LETTER — narrow centered column -----
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
        marginBottom: p.hero ? 36 : 56, flexWrap: "wrap",
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

// ----- Variation B: REPORT — magazine spread, 2-col body -----
function PostReport({ p, theme, readMin, words }) {
  // Split body into a lede paragraph and the rest for two-column flow
  const firstParaIdx = p.body.findIndex(b => b.kind === "p");
  const lede = p.body[firstParaIdx];
  const rest = p.body.filter((_, i) => i !== firstParaIdx);

  return (
    <article>
      {/* Header: title left, lede + meta right */}
      <div style={{
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56,
        alignItems: "end",
        paddingBottom: 32, borderBottom: `1px solid ${T.hairStrong}`,
        marginTop: 16,
      }} className="m-2col">
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8, color: theme.accent, textTransform: "uppercase", marginBottom: 18 }}>
            Vol. 26 · {p.date} · {readMin} min
          </div>
          <h1 style={{
            fontFamily: theme.serif, fontStyle: "italic",
            fontSize: 88, lineHeight: 0.96, letterSpacing: -2.2, fontWeight: 400,
            margin: 0, textWrap: "balance",
          }}>
            {p.title}.
          </h1>
        </div>
        <div>
          <div style={{ fontFamily: theme.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, textWrap: "pretty" }}>
            {p.excerpt}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {p.tags.map(t => (
              <span key={t} style={{
                fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: theme.accent,
                border: `1px solid ${theme.accent}`, padding: "2px 8px", textTransform: "uppercase",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Lede in big serif */}
      {lede && (
        <p style={{
          fontFamily: theme.serif, fontSize: 24, lineHeight: 1.45, color: T.ink,
          margin: "44px 0 36px", textWrap: "pretty",
          maxWidth: 900,
        }}>
          <span style={{
            float: "left", fontFamily: theme.serif, fontStyle: "italic",
            fontSize: 84, lineHeight: 0.85, marginRight: 14, marginTop: 6,
            color: theme.accent,
          }}>{lede.text[0]}</span>
          {lede.text.slice(1)}
        </p>
      )}

      {/* 2-column body */}
      <div style={{
        columnCount: 2, columnGap: 56,
        fontFamily: theme.serif, fontSize: 17, lineHeight: 1.65, color: T.ink,
      }} className="m-scrap-cols">
        {rest.map((b, i) => (
          <div key={i} style={{ breakInside: "avoid" }}>
            <PostBlock b={b} theme={theme} accent={theme.accent} dense />
          </div>
        ))}
      </div>

      {/* Sign-off bar */}
      <div style={{
        marginTop: 56, padding: "18px 0",
        borderTop: `1px solid ${T.hair}`, borderBottom: `1px solid ${T.hair}`,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase",
      }}>
        <span>— Lucy Gai</span>
        <span>{words.toLocaleString()} words · {readMin} min</span>
        <span>filed {p.date}</span>
      </div>
    </article>
  );
}

// ----- Variation C: CARD — sidebar metadata, wide prose, footnotes inline -----
function PostCard({ p, theme, readMin, words, setRoute }) {
  return (
    <article style={{
      display: "grid", gridTemplateColumns: "220px 1fr", gap: 56,
      marginTop: 20,
    }} className="m-2col">
      <aside style={{
        position: "sticky", top: 32, alignSelf: "start",
      }}>
        {/* Index card */}
        <div style={{
          background: T.paperCard, border: `1px solid ${T.hairStrong}`,
          padding: 22, position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -10, left: 18,
            background: T.paper, padding: "2px 10px",
            fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, color: T.ink60,
            textTransform: "uppercase", border: `1px solid ${T.hairStrong}`,
          }}>
            Entry card
          </div>

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase", marginTop: 10 }}>
            Filed
          </div>
          <div style={{ fontFamily: theme.serif, fontSize: 17, fontStyle: "italic", marginTop: 2 }}>
            {p.date}
          </div>

          <div style={{ height: 1, background: T.hair, margin: "16px 0" }} />

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>Length</div>
          <div style={{ fontFamily: theme.serif, fontSize: 17, marginTop: 2 }}>
            {readMin} min &nbsp;<span style={{ fontSize: 12, color: T.ink60 }}>({words.toLocaleString()} words)</span>
          </div>

          <div style={{ height: 1, background: T.hair, margin: "16px 0" }} />

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>Tags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {p.tags.map(t => (
              <span key={t} style={{
                fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: theme.accent,
                border: `1px solid ${theme.accent}`, padding: "2px 8px", textTransform: "uppercase",
              }}>{t}</span>
            ))}
          </div>

          {p.foot && p.foot.length > 0 && (
            <>
              <div style={{ height: 1, background: T.hair, margin: "16px 0" }} />
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>Footnotes</div>
              <div style={{ fontFamily: theme.serif, fontSize: 13, marginTop: 6, color: T.ink60, fontStyle: "italic" }}>
                {p.foot.length} {p.foot.length === 1 ? "note" : "notes"} at end
              </div>
            </>
          )}
        </div>

        {/* Stamp */}
        <div style={{
          marginTop: 18, padding: "12px 14px",
          border: `1px dashed ${T.ink60}`,
          fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>● live</span>
          <span>№ {String(window.POSTS.length - window.POSTS.findIndex(x => x.slug === p.slug)).padStart(3, "0")}</span>
        </div>
      </aside>

      <div style={{ minWidth: 0 }}>
        <h1 style={{
          fontFamily: theme.serif, fontStyle: "italic",
          fontSize: 72, lineHeight: 1.0, letterSpacing: -1.8, fontWeight: 400,
          margin: 0, textWrap: "balance",
        }}>
          {p.title}.
        </h1>
        <div style={{ fontFamily: theme.serif, fontSize: 22, lineHeight: 1.45, color: T.ink60, fontStyle: "italic", marginTop: 18, maxWidth: 660, textWrap: "pretty" }}>
          {p.excerpt}
        </div>

        <div style={{ height: 1, background: T.hairStrong, margin: "36px 0" }} />

        <div style={{ maxWidth: 720 }}>
          {p.body.map((b, i) => <PostBlock key={i} b={b} theme={theme} accent={theme.accent} />)}
        </div>

        {p.foot && p.foot.length > 0 && (
          <div style={{ marginTop: 48, maxWidth: 720 }}>
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
      </div>
    </article>
  );
}


// ============================================================
// SUBSCRIBE CARD + COMMENTS — Substack integration on the letter view
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
