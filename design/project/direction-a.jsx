// Direction A — Memory Archive
// Library card catalog aesthetic: hairline rules, serial numbers, archival labels,
// taxonomy language. Newsreader serif + JetBrains Mono.

const { useState, useEffect, useRef } = React;

// ============================================================
// Theme tokens
// ============================================================
const A = {
  paper: "#f1e9df",
  paperDeep: "#e6dccb",
  ink: "#1f1a16",
  ink60: "#5a4e43",
  ink40: "#8a7e70",
  hair: "rgba(31, 26, 22, 0.2)",
  hairStrong: "rgba(31, 26, 22, 0.55)",
  rust: "oklch(0.52 0.13 40)",
  rustLight: "oklch(0.72 0.09 40)",
  serif: "'Newsreader', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// ============================================================
// Reusable primitives
// ============================================================
function NavA({ active }) {
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
            paddingBottom: 2,
            cursor: "pointer",
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function CardLabel({ cat, no, date }) {
  return (
    <div style={{
      fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase",
      color: A.ink60, display: "flex", gap: 16,
    }}>
      <span>CAT. {cat}</span>
      <span>№ {no}</span>
      {date && <span>{date}</span>}
    </div>
  );
}

function Hair({ color = A.hair, dashed = false, style = {} }) {
  return <div style={{
    height: 1, background: dashed ? "none" : color,
    borderTop: dashed ? `1px dashed ${A.hair}` : "none",
    ...style,
  }} />;
}

// ============================================================
// Home
// ============================================================
function HomeA() {
  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA />

      {/* Archival card header strip */}
      <div style={{ position: "absolute", top: 96, left: 48, right: 48 }}>
        <Hair color={A.hairStrong} />
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60,
          padding: "8px 0", textTransform: "uppercase",
        }}>
          <span>Personal archive · vol. 01</span>
          <span>file: home.idx</span>
          <span>last updated 04 · 22 · 26</span>
        </div>
        <Hair color={A.hairStrong} />
      </div>

      {/* Main composition */}
      <div style={{ position: "absolute", top: 180, left: 48, right: 48, bottom: 80, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48 }}>
        <div style={{ paddingTop: 40 }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, textTransform: "uppercase", marginBottom: 24 }}>
            ENTRY 001 ·····  A COLLECTION
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 108, lineHeight: 0.95, letterSpacing: -2.5, fontWeight: 400 }}>
            Hi,<br />
            <span style={{ fontStyle: "italic" }}>I'm Lucy.</span>
          </div>
          <div style={{ marginTop: 40, maxWidth: 440, fontSize: 18, lineHeight: 1.55, color: A.ink }}>
            A software engineer cataloging the things I love — trips, records, films, and the small projects in between. This site is a room I keep returning to.
          </div>
          <div style={{ marginTop: 48, display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{
              padding: "14px 28px", border: `1px solid ${A.ink}`, borderRadius: 999,
              fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", cursor: "pointer",
              background: A.ink, color: A.paper,
            }}>
              Open the archive →
            </div>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>
              6 sections · 47 entries
            </div>
          </div>
        </div>

        {/* Right: stacked archival cards */}
        <div style={{ position: "relative", paddingTop: 20 }}>
          {/* Background card (rotated) */}
          <div style={{
            position: "absolute", top: 30, left: 40, right: 20, bottom: 40,
            background: A.paperDeep, transform: "rotate(-1.5deg)",
            border: `1px solid ${A.hairStrong}`,
          }}/>
          <div style={{
            position: "absolute", top: 20, left: 10, right: 30, bottom: 60,
            background: "#eae1d2", transform: "rotate(1.2deg)",
            border: `1px solid ${A.hairStrong}`,
          }}/>
          {/* Front photo card */}
          <div style={{
            position: "absolute", top: 0, left: 20, right: 10, bottom: 30,
            background: "#fbf6ee",
            border: `1px solid ${A.hairStrong}`,
            padding: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}>
            <div style={{ width: "100%", height: "calc(100% - 60px)", overflow: "hidden", background: "#e6dccb" }}>
              <img src="images/home/selfie1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.15) saturate(0.9)" }} />
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 15 }}>Self-portrait, spring</div>
              <div style={{ fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>
                CAT. A · № 001
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 32, left: 48, right: 48,
        display: "flex", justifyContent: "space-between",
        fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase",
      }}>
        <span>Fig. 01 — Index</span>
        <span>Cataloged by L. Gai</span>
        <span>▲ to top</span>
      </div>
    </div>
  );
}

// ============================================================
// Travels — postcard grid
// ============================================================
function TravelsA() {
  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA active="Travels" />

      <div style={{ position: "absolute", top: 128, left: 48, right: 48 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, marginBottom: 8, textTransform: "uppercase" }}>
          SECTION C · TRAVELS
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 56, lineHeight: 1, letterSpacing: -1, marginBottom: 4 }}>
          Places, <span style={{ fontStyle: "italic" }}>cataloged.</span>
        </div>
        <div style={{ fontFamily: A.mono, fontSize: 11, color: A.ink60, marginTop: 12, textTransform: "uppercase", letterSpacing: 1.2 }}>
          3 ENTRIES · FILED BY DATE
        </div>
        <Hair color={A.hairStrong} style={{ marginTop: 24 }} />
      </div>

      {/* Postcard grid */}
      <div style={{ position: "absolute", top: 290, left: 48, right: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {window.TRIPS.map((t, i) => (
          <div key={t.id} style={{
            background: "#fbf6ee",
            border: `1px solid ${A.hairStrong}`,
            padding: 16,
            position: "relative",
            cursor: "pointer",
            transform: `rotate(${i === 1 ? 0.8 : i === 0 ? -0.6 : 0.3}deg)`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            {/* Photo */}
            <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: A.paperDeep }}>
              <img src={t.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.1) saturate(0.92)" }} />
            </div>

            {/* Postage stamp */}
            <div style={{
              position: "absolute", top: 8, right: 8,
              width: 54, height: 64,
              background: A.paper,
              border: `1px dashed ${A.ink}`,
              padding: 4,
              fontFamily: A.mono, fontSize: 9, letterSpacing: 1.2,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center",
              transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
              color: A.ink,
            }}>
              <div style={{ fontFamily: A.serif, fontSize: 18, fontStyle: "italic" }}>{t.stamp}</div>
              <div style={{ height: 1, width: "80%", background: A.ink, margin: "3px 0" }} />
              <div style={{ fontSize: 7, letterSpacing: 0.8 }}>POSTED</div>
              <div style={{ fontSize: 7, letterSpacing: 0.8 }}>{t.date.replace(" / ", "·")}</div>
            </div>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ fontFamily: A.serif, fontSize: 26, fontStyle: "italic", lineHeight: 1 }}>{t.place}</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, marginTop: 4, letterSpacing: 0.6 }}>{t.sub}</div>
              </div>
            </div>
            <Hair style={{ margin: "12px 0 10px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>
              <span>{t.duration}</span>
              <span>№ {String(i+1).padStart(3, "0")}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 32, left: 48, right: 48, display: "flex", justifyContent: "space-between",
        fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase" }}>
        <span>Fig. C.01 — Postcards</span>
        <span>3 of 3 shown</span>
      </div>
    </div>
  );
}

// ============================================================
// Favorites — albums (vinyl/ipod/cassette variants) + movies
// ============================================================
function VinylPlayerA({ album, playing, setPlaying, progress }) {
  return (
    <div style={{
      width: 360, height: 360, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Vinyl */}
      <div style={{
        width: 340, height: 340, borderRadius: "50%",
        background: "radial-gradient(circle, #1a1613 0%, #0d0a08 60%, #1a1613 100%)",
        position: "relative",
        animation: playing ? "spin 4s linear infinite" : "none",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        {/* Grooves */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute", inset: 20 + i * 20, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
          }} />
        ))}
        {/* Center label (album art) */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 128, height: 128, borderRadius: "50%", overflow: "hidden",
          border: `3px solid ${A.paper}`,
        }}>
          <img src={album.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Spindle */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 10, height: 10, borderRadius: "50%", background: A.paper, zIndex: 2,
        }} />
      </div>
      {/* Tonearm */}
      <div style={{
        position: "absolute", top: -8, right: -30,
        width: 180, height: 10, background: "#c9bfae", borderRadius: 4,
        transformOrigin: "right center",
        transform: playing ? "rotate(-28deg)" : "rotate(-48deg)",
        transition: "transform 600ms cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ position: "absolute", right: 0, top: -8, width: 26, height: 26, borderRadius: "50%", background: "#8a7e70", border: `2px solid ${A.paper}` }} />
        <div style={{ position: "absolute", left: -4, top: -2, width: 14, height: 14, background: "#1f1a16", borderRadius: 2 }} />
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function IpodPlayerA({ album, playing, setPlaying, progress, setTrackIdx, trackIdx, tracks }) {
  return (
    <div style={{
      width: 260, height: 440, background: "#fbf6ee",
      border: `1px solid ${A.hairStrong}`, borderRadius: 24,
      padding: 18, boxShadow: "0 14px 32px rgba(0,0,0,0.12)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Screen */}
      <div style={{ height: 190, background: "#d4c9b2", borderRadius: 4, border: `1px solid ${A.ink}`, padding: 10, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 8, letterSpacing: 1.4, color: A.ink, textTransform: "uppercase" }}>
          <span>▶ Now Playing</span>
          <span>🔋</span>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
          <img src={album.src} alt="" style={{ width: 68, height: 68, objectFit: "cover", border: `1px solid ${A.ink}` }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: A.serif, fontSize: 13, fontStyle: "italic", color: A.ink, lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</div>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink60, marginTop: 2 }}>{album.artist}</div>
            <div style={{ fontFamily: A.mono, fontSize: 8, color: A.ink60, marginTop: 6 }}>{tracks[trackIdx]?.name}</div>
            <div style={{ height: 2, background: A.ink40, marginTop: 6, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: A.ink }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 8, color: A.ink60, marginTop: 2 }}>
              <span>0:47</span><span>-2:18</span>
            </div>
          </div>
        </div>
      </div>
      {/* Click wheel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 16 }}>
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          background: "#e6dccb", border: `1px solid ${A.hairStrong}`,
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink60 }}>MENU</div>
          <div onClick={() => setTrackIdx(Math.max(0, trackIdx - 1))} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: A.ink60, cursor: "pointer" }}>⏮</div>
          <div onClick={() => setTrackIdx(Math.min(tracks.length - 1, trackIdx + 1))} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: A.ink60, cursor: "pointer" }}>⏭</div>
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: A.ink60 }}>▶▮▮</div>
          <div onClick={() => setPlaying(!playing)} style={{
            width: 62, height: 62, borderRadius: "50%", background: "#fbf6ee",
            border: `1px solid ${A.hairStrong}`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: A.mono, fontSize: 14, color: A.ink,
          }}>{playing ? "❚❚" : "▶"}</div>
        </div>
      </div>
    </div>
  );
}

function CassettePlayerA({ album, playing, setPlaying, progress }) {
  return (
    <div style={{
      width: 420, height: 260,
      background: "#e6dccb", border: `1px solid ${A.hairStrong}`, borderRadius: 6,
      padding: 18, position: "relative", boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
    }}>
      {/* Label */}
      <div style={{ height: 68, background: "#fbf6ee", border: `1px solid ${A.hairStrong}`, padding: 8, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 8, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase" }}>
          <span>SIDE A</span>
          <span>TDK SA-90</span>
          <span>{album.year}</span>
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 20, fontStyle: "italic", color: A.ink, lineHeight: 1 }}>{album.title}</div>
        <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink60, textTransform: "uppercase", letterSpacing: 0.8 }}>{album.artist}</div>
      </div>

      {/* Reels */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "#1f1a16",
            position: "relative",
            animation: playing ? "spin 2.4s linear infinite" : "none",
            animationDelay: `${i * -0.2}s`,
          }}>
            <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.15)" }} />
            {[0,60,120,180,240,300].map(deg => (
              <div key={deg} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 2, height: 30,
                background: "rgba(255,255,255,0.12)",
                transform: `translate(-50%,-50%) rotate(${deg}deg)`,
                transformOrigin: "center",
              }}/>
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: A.paper }} />
          </div>
        ))}
      </div>
      {/* Tape strip */}
      <div style={{ position: "absolute", bottom: 36, left: 24, right: 24, height: 4, background: "#1f1a16", opacity: 0.4 }} />

      {/* Controls */}
      <div style={{ position: "absolute", bottom: 8, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 28, height: 14, background: "#fbf6ee", border: `1px solid ${A.ink60}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>◀◀</div>
          <div onClick={() => setPlaying(!playing)} style={{ width: 28, height: 14, background: A.rust, color: A.paper, border: `1px solid ${A.rust}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, cursor: "pointer" }}>{playing ? "❚❚" : "▶"}</div>
          <div style={{ width: 28, height: 14, background: "#fbf6ee", border: `1px solid ${A.ink60}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>▶▶</div>
        </div>
        <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink60, letterSpacing: 1.2, textTransform: "uppercase" }}>{playing ? "PLAYING" : "STOPPED"} · {String(Math.floor(progress/100*43)).padStart(2,"0")}:{String(Math.floor(progress/100*60) % 60).padStart(2,"0")}</div>
      </div>
    </div>
  );
}

function FavoritesA({ playerVariant, moviesVariant }) {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(12);
  const [trackIdx, setTrackIdx] = useState(0);
  const [tab, setTab] = useState("music");

  const selectedAlbum = window.ALBUMS[selectedIdx];
  const tracks = window.TRACKLISTS[selectedAlbum.title] || window.DEFAULT_TRACKLIST;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p + 0.5) % 100), 200);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => { setTrackIdx(0); setProgress(0); }, [selectedIdx]);

  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA active="Favorites" />

      <div style={{ position: "absolute", top: 116, left: 48, right: 48 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, marginBottom: 6, textTransform: "uppercase" }}>
          SECTION D · FAVORITES
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: A.serif, fontSize: 54, lineHeight: 1, letterSpacing: -1 }}>
            A <span style={{ fontStyle: "italic" }}>listening</span> & <span style={{ fontStyle: "italic" }}>watching</span> log.
          </div>
          <div style={{ display: "flex", gap: 4, fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase" }}>
            {["music", "films"].map(t => (
              <div key={t} onClick={() => setTab(t)} style={{
                padding: "8px 16px",
                border: `1px solid ${tab === t ? A.ink : A.hair}`,
                background: tab === t ? A.ink : "transparent",
                color: tab === t ? A.paper : A.ink,
                cursor: "pointer",
              }}>{t}</div>
            ))}
          </div>
        </div>
        <Hair color={A.hairStrong} style={{ marginTop: 20 }} />
      </div>

      {tab === "music" ? (
        <div style={{ position: "absolute", top: 260, left: 48, right: 48, bottom: 60, display: "grid", gridTemplateColumns: "1fr 420px", gap: 40 }}>
          {/* Left: player + tracklist */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 28, alignItems: "center", minHeight: 380 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: playerVariant === "ipod" ? 280 : playerVariant === "cassette" ? 440 : 380 }}>
                {playerVariant === "vinyl" && <VinylPlayerA album={selectedAlbum} playing={playing} setPlaying={setPlaying} progress={progress} />}
                {playerVariant === "ipod" && <IpodPlayerA album={selectedAlbum} playing={playing} setPlaying={setPlaying} progress={progress} trackIdx={trackIdx} setTrackIdx={setTrackIdx} tracks={tracks} />}
                {playerVariant === "cassette" && <CassettePlayerA album={selectedAlbum} playing={playing} setPlaying={setPlaying} progress={progress} />}
              </div>
            </div>

            {/* Tracklist / metadata card */}
            <div style={{ marginTop: 8, background: "#fbf6ee", border: `1px solid ${A.hairStrong}`, padding: 16, maxWidth: 560 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "baseline" }}>
                <div>
                  <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 20, lineHeight: 1 }}>{selectedAlbum.title}</div>
                  <div style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, textTransform: "uppercase", letterSpacing: 1 }}>{selectedAlbum.artist} · {selectedAlbum.year}</div>
                </div>
                <CardLabel cat="D.M" no={String(selectedIdx + 1).padStart(3, "0")} />
              </div>
              <Hair />
              <div style={{ marginTop: 8 }}>
                {tracks.map((tr, i) => (
                  <div key={tr.n} onClick={() => { setTrackIdx(i); setPlaying(true); }} style={{
                    display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 12, padding: "5px 0",
                    alignItems: "baseline",
                    fontFamily: A.mono, fontSize: 11,
                    color: i === trackIdx ? A.rust : A.ink,
                    cursor: "pointer",
                  }}>
                    <span style={{ color: A.ink40, fontSize: 9 }}>{String(tr.n).padStart(2,"0")}</span>
                    <span style={{ fontFamily: A.serif, fontSize: 14, fontStyle: i === trackIdx ? "italic" : "normal" }}>{tr.name}</span>
                    <span style={{ color: A.ink60, fontSize: 10 }}>{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: album index */}
          <div>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase", marginBottom: 12 }}>
              Index — {window.ALBUMS.length} records
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {window.ALBUMS.map((a, i) => (
                <div key={a.src} onClick={() => setSelectedIdx(i)} style={{
                  cursor: "pointer", position: "relative",
                  padding: 2,
                  background: i === selectedIdx ? A.ink : "transparent",
                }}>
                  <img src={a.src} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", filter: i === selectedIdx ? "none" : "saturate(0.9)" }} />
                  {i === selectedIdx && (
                    <div style={{ position: "absolute", top: -16, right: 0, fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, color: A.rust, textTransform: "uppercase" }}>
                      → now
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MoviesA moviesVariant={moviesVariant} />
      )}

      <div style={{ position: "absolute", bottom: 20, left: 48, right: 48, display: "flex", justifyContent: "space-between",
        fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase" }}>
        <span>Fig. D.{tab === "music" ? "01" : "02"} — {tab}</span>
        <span>Variant: {tab === "music" ? playerVariant : moviesVariant}</span>
      </div>
    </div>
  );
}

function MoviesA({ moviesVariant }) {
  return (
    <div style={{ position: "absolute", top: 260, left: 48, right: 48, bottom: 60, overflow: "hidden" }}>
      {moviesVariant === "tickets" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {window.MOVIES.map((m, i) => (
            <div key={m.title} style={{
              display: "grid", gridTemplateColumns: "80px 1fr auto",
              background: "#fbf6ee", border: `1px dashed ${A.ink60}`,
              transform: `rotate(${i % 2 === 0 ? -0.6 : 0.5}deg)`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ borderRight: `1px dashed ${A.ink60}`, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between", background: A.paperDeep }}>
                <div style={{ fontFamily: A.mono, fontSize: 8, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase" }}>ADMIT ONE</div>
                <div style={{ fontFamily: A.serif, fontSize: 22, fontStyle: "italic" }}>★ {m.rating}</div>
                <div style={{ fontFamily: A.mono, fontSize: 7, color: A.ink60, letterSpacing: 1 }}>{m.date}</div>
              </div>
              <div style={{ padding: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: A.serif, fontSize: 18, fontStyle: "italic", lineHeight: 1.1 }}>{m.title}</div>
                <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink60, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>{m.director} · {m.year}</div>
                <div style={{ fontFamily: A.serif, fontSize: 12, color: A.ink60, marginTop: 8, lineHeight: 1.4, fontStyle: "italic" }}>"{m.note}"</div>
              </div>
              <div style={{ width: 64, background: A.paperDeep, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.15)" }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {window.MOVIES.map(m => (
            <div key={m.title} style={{ background: "#fbf6ee", border: `1px solid ${A.hairStrong}`, padding: 12, display: "flex", gap: 12 }}>
              <div style={{ width: 72, height: 108, overflow: "hidden", flex: "0 0 auto" }}>
                <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: A.serif, fontSize: 15, fontStyle: "italic", lineHeight: 1.1 }}>{m.title}</div>
                <div style={{ fontFamily: A.mono, fontSize: 8, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{m.director} · {m.year}</div>
                <div style={{ marginTop: 8, fontFamily: A.mono, fontSize: 10, color: A.rust, letterSpacing: 1 }}>
                  {"★".repeat(Math.floor(m.rating))}{m.rating % 1 ? "½" : ""}
                </div>
                <Hair style={{ margin: "8px 0" }} />
                <div style={{ fontFamily: A.serif, fontSize: 11, color: A.ink60, fontStyle: "italic", lineHeight: 1.35 }}>"{m.note}"</div>
                <div style={{ fontFamily: A.mono, fontSize: 7, color: A.ink40, marginTop: 6, letterSpacing: 1, textTransform: "uppercase" }}>LOGGED {m.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "reel" && (
        <div>
          <div style={{ background: "#1f1a16", padding: "12px 12px", borderRadius: 2, display: "flex", gap: 2, overflowX: "hidden", position: "relative" }}>
            {/* Sprocket holes */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "#1f1a16", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
              {Array.from({length: 24}).map((_, i) => (
                <div key={i} style={{ width: 10, height: 6, background: A.paper, borderRadius: 1 }}/>
              ))}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: "#1f1a16", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
              {Array.from({length: 24}).map((_, i) => (
                <div key={i} style={{ width: 10, height: 6, background: A.paper, borderRadius: 1 }}/>
              ))}
            </div>
            <div style={{ padding: "16px 4px 16px", display: "flex", gap: 4, width: "100%", justifyContent: "space-between" }}>
              {window.MOVIES.map(m => (
                <div key={m.title} style={{ flex: 1, background: "#000", padding: 2 }}>
                  <img src={m.src} alt="" style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {window.MOVIES.map(m => (
              <div key={m.title}>
                <div style={{ fontFamily: A.serif, fontSize: 14, fontStyle: "italic", lineHeight: 1.1 }}>{m.title}</div>
                <div style={{ fontFamily: A.mono, fontSize: 8, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{m.director} · {m.year} · {"★".repeat(Math.floor(m.rating))}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// About
// ============================================================
function AboutA() {
  const socials = [
    { l: "Instagram", h: "@lucy.gai" },
    { l: "Letterboxd", h: "lucy_gai" },
    { l: "Spotify", h: "charlottefour" },
    { l: "Twitch", h: "88lucie" },
    { l: "Email", h: "hello@lucygai.com" },
  ];
  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA active="About" />

      <div style={{ position: "absolute", top: 128, left: 48, right: 48 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, textTransform: "uppercase", marginBottom: 8 }}>
          SECTION F · ABOUT
        </div>
        <Hair color={A.hairStrong} />
      </div>

      <div style={{ position: "absolute", top: 180, left: 48, right: 48, bottom: 80, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48 }}>
        <div>
          <div style={{ fontFamily: A.serif, fontSize: 48, lineHeight: 1.15, letterSpacing: -0.6 }}>
            Hi! I'm <span style={{ fontStyle: "italic" }}>Lucy</span> — a software engineer in <span style={{ fontStyle: "italic" }}>San Francisco</span>, currently building tools at a small startup and cataloging the things I love here.
          </div>
          <Hair style={{ margin: "36px 0" }} />
          <div style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.2, color: A.ink60, textTransform: "uppercase", marginBottom: 12 }}>Currently</div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "10px 24px", fontSize: 15, lineHeight: 1.5 }}>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>Reading</span>
            <span><em>A Little Life</em> — Hanya Yanagihara</span>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>Listening</span>
            <span>nolimit, — Knock2 (on repeat, regrettably)</span>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>Building</span>
            <span>this site, and a quiet tool for keeping lists</span>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, paddingTop: 3 }}>Planning</span>
            <span>Tokyo in September, Lisbon in November</span>
          </div>
        </div>

        {/* Contact card */}
        <div style={{ background: "#fbf6ee", border: `1px solid ${A.hairStrong}`, padding: 28, position: "relative" }}>
          <div style={{ position: "absolute", top: -14, left: 20, background: A.paper, padding: "2px 12px", fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase", border: `1px solid ${A.hairStrong}` }}>
            Contact index
          </div>
          <CardLabel cat="F" no="001" date="04 · 22 · 26" />
          <div style={{ fontFamily: A.serif, fontSize: 32, fontStyle: "italic", marginTop: 16 }}>Gai, Lucy</div>
          <div style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 4 }}>Engineer / amateur archivist / enjoyer of small rooms</div>

          <Hair style={{ margin: "20px 0" }} />
          {socials.map((s, i) => (
            <div key={s.l} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", padding: "10px 0", borderBottom: i < socials.length - 1 ? `1px dashed ${A.hair}` : "none", alignItems: "baseline" }}>
              <span style={{ fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>{s.l}</span>
              <span style={{ fontFamily: A.serif, fontSize: 15, fontStyle: "italic" }}>{s.h}</span>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: A.rust }}>↗</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 32, left: 48, right: 48, display: "flex", justifyContent: "space-between",
        fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase" }}>
        <span>Fig. F.01 — Card</span>
        <span>File under: Lucy</span>
      </div>
    </div>
  );
}

// ============================================================
// Blog
// ============================================================
function BlogA() {
  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA active="Blog" />

      <div style={{ position: "absolute", top: 128, left: 48, right: 48 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, marginBottom: 8, textTransform: "uppercase" }}>
          SECTION A · BLOG
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: A.serif, fontSize: 56, lineHeight: 1, letterSpacing: -1 }}>
            Notes, filed by <span style={{ fontStyle: "italic" }}>date.</span>
          </div>
          <div style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, letterSpacing: 1.2, textTransform: "uppercase" }}>
            {window.POSTS.length} entries · most recent first
          </div>
        </div>
        <Hair color={A.hairStrong} style={{ marginTop: 24 }} />
      </div>

      <div style={{ position: "absolute", top: 270, left: 48, right: 48, bottom: 60, overflow: "hidden" }}>
        {window.POSTS.map((p, i) => (
          <div key={p.title} style={{ display: "grid", gridTemplateColumns: "110px 1fr 140px", gap: 24, padding: "18px 0", borderBottom: `1px solid ${A.hair}`, alignItems: "baseline" }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase" }}>
              <div>№ {String(window.POSTS.length - i).padStart(3, "0")}</div>
              <div style={{ marginTop: 2 }}>{p.date}</div>
            </div>
            <div>
              <div style={{ fontFamily: A.serif, fontSize: 26, lineHeight: 1.1, fontStyle: "italic" }}>{p.title}</div>
              <div style={{ fontFamily: A.serif, fontSize: 14, color: A.ink60, marginTop: 6, lineHeight: 1.45, maxWidth: 620 }}>{p.excerpt}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {p.tags.map(t => (
                <span key={t} style={{ fontFamily: A.mono, fontSize: 8, letterSpacing: 1.4, color: A.rust, border: `1px solid ${A.rust}`, padding: "2px 8px", textTransform: "uppercase" }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Projects
// ============================================================
function ProjectsA() {
  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavA active="Projects" />

      <div style={{ position: "absolute", top: 128, left: 48, right: 48 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, marginBottom: 8, textTransform: "uppercase" }}>
          SECTION B · PROJECTS
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 56, lineHeight: 1, letterSpacing: -1 }}>
          Things I've <span style={{ fontStyle: "italic" }}>made.</span>
        </div>
        <Hair color={A.hairStrong} style={{ marginTop: 24 }} />
      </div>

      <div style={{ position: "absolute", top: 250, left: 48, right: 48, bottom: 60, overflow: "hidden" }}>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 2fr 1.4fr 1fr 0.9fr", gap: 20, padding: "10px 0", borderBottom: `1px solid ${A.hairStrong}`,
          fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>
          <span>Year</span><span>Title / role</span><span>Kind</span><span>Stack</span><span>Status</span>
        </div>
        {window.PROJECTS.map((p, i) => (
          <div key={p.name} style={{ display: "grid", gridTemplateColumns: "80px 2fr 1.4fr 1fr 0.9fr", gap: 20, padding: "18px 0", borderBottom: `1px solid ${A.hair}`, alignItems: "baseline" }}>
            <span style={{ fontFamily: A.mono, fontSize: 11, color: A.ink60 }}>{p.year}</span>
            <span>
              <div style={{ fontFamily: A.serif, fontSize: 22, fontStyle: "italic", lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink60, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{p.role}</div>
            </span>
            <span style={{ fontFamily: A.serif, fontSize: 14, color: A.ink }}>{p.kind}</span>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: A.ink60, lineHeight: 1.6 }}>{p.stack.join(" · ")}</span>
            <span style={{ fontFamily: A.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: p.status === "live" || p.status === "shipping" ? A.rust : A.ink60 }}>● {p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeA, TravelsA, FavoritesA, AboutA, BlogA, ProjectsA });
