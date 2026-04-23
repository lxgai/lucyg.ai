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

      <div style={{ padding: "32px 56px 0" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.ink60, textTransform: "uppercase",
          padding: "8px 0", borderTop: `1px solid ${T.hairStrong}`, borderBottom: `1px solid ${T.hairStrong}`,
        }}>
          <span>Personal archive · vol. 01</span>
          <span>file: home.idx</span>
          <span>last updated 04 · 22 · 26</span>
        </div>
      </div>

      <div style={{ padding: "72px 56px 80px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 28 }}>
            ENTRY 001 ·····  A COLLECTION
          </div>
          <div style={{ fontFamily: theme.serif, fontSize: 128, lineHeight: 0.92, letterSpacing: -3, fontWeight: 400 }}>
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
        <div style={{ position: "relative", paddingTop: 40, minHeight: 560 }}>
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
        <div key={p.title} style={{
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
function PageProjects({ route, setRoute, theme }) {
  return (
    <PageShell route={route} setRoute={setRoute} theme={theme}
      section="SECTION B · PROJECTS" catNo="file: projects.idx"
      title={<>Things I've <span style={{ fontStyle: "italic" }}>made.</span></>}
      subtitle={`${window.PROJECTS.length} entries · solo + collab`}>

      <div style={{ display: "grid", gridTemplateColumns: "80px 2fr 1.4fr 1fr 0.9fr", gap: 24, padding: "12px 0", borderBottom: `1px solid ${T.hairStrong}`,
        fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: T.ink60, textTransform: "uppercase" }}>
        <span>Year</span><span>Title / role</span><span>Kind</span><span>Stack</span><span>Status</span>
      </div>
      {window.PROJECTS.map((p, i) => (
        <div key={p.name} style={{ display: "grid", gridTemplateColumns: "80px 2fr 1.4fr 1fr 0.9fr", gap: 24, padding: "22px 0", borderBottom: `1px solid ${T.hair}`, alignItems: "baseline", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(31,26,22,0.02)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink60 }}>{p.year}</span>
          <span>
            <div style={{ fontFamily: theme.serif, fontSize: 24, fontStyle: "italic", lineHeight: 1.1 }}>{p.name}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{p.role}</div>
          </span>
          <span style={{ fontFamily: theme.serif, fontSize: 15, color: T.ink }}>{p.kind}</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink60, lineHeight: 1.6 }}>{p.stack.join(" · ")}</span>
          <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: p.status === "live" || p.status === "shipping" ? theme.accent : T.ink60 }}>● {p.status}</span>
        </div>
      ))}
    </PageShell>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 60 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 440, paddingBottom: 30 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, paddingTop: 32 }}>
        <div>
          <div style={{ fontFamily: theme.serif, fontSize: 48, lineHeight: 1.2, letterSpacing: -0.6, fontWeight: 400 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
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
      <div style={{ padding: "32px 56px 0" }}>
        <div style={{
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
      <div style={{ padding: "60px 56px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: theme.accent, textTransform: "uppercase", marginBottom: 12 }}>
              ENTRY C · № {String(window.TRIPS.indexOf(trip) + 1).padStart(3, "0")}
            </div>
            <div style={{ fontFamily: theme.serif, fontSize: 96, lineHeight: 0.95, letterSpacing: -2 }}>
              {trip.place}<span style={{ color: theme.accent }}>.</span>
            </div>
            <div style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: T.ink60, marginTop: 12 }}>{data.entries[0].sub}</div>
          </div>
          {/* Big postage stamp */}
          <div style={{
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
      <div style={{ padding: "40px 56px 80px" }}>
        <div style={{ columnCount: 3, columnGap: 28 }}>
          {data.entries.slice(1).map((e, i) => (
            <ScrapEntry key={i} entry={e} theme={theme} />
          ))}
        </div>
      </div>

      {/* Nav between trips */}
      <div style={{ padding: "0 56px 60px", borderTop: `1px solid ${T.hair}`, marginTop: 20, paddingTop: 32 }}>
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

Object.assign(window, { PageHome, PageBlog, PageProjects, PageFavorites, PageAbout, PageTravels, PageTrip });
