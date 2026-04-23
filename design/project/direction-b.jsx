// Direction B — Japanese Stationery
// Grid paper, fine hairlines, precise small-caps labels, restrained accents.
// Fraunces + IBM Plex Sans + IBM Plex Mono.

const { useState: useStateB, useEffect: useEffectB } = React;

const B = {
  paper: "#f6f1e8",
  paperCool: "#f1ece3",
  ink: "#1c1d1f",
  ink60: "#56564d",
  ink40: "#8a8a80",
  hair: "rgba(28, 29, 31, 0.18)",
  hairStrong: "rgba(28, 29, 31, 0.5)",
  tomato: "oklch(0.6 0.18 28)",
  tomatoDeep: "oklch(0.5 0.18 28)",
  sumi: "#18181a",
  display: "'Fraunces', 'Shippori Mincho', serif",
  sans: "'IBM Plex Sans', -apple-system, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
};

function NavB({ active }) {
  const links = ["Blog", "Travels", "Projects", "Favorites", "About"];
  return (
    <div style={{
      position: "absolute", top: 24, left: 0, right: 0,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "20px 44px 0", zIndex: 30, fontFamily: B.sans,
      borderBottom: `1px solid ${B.hair}`, paddingBottom: 18,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontFamily: B.display, fontSize: 26, color: B.ink, letterSpacing: -0.4, fontWeight: 400 }}>Lucy Gai</div>
        <div style={{ width: 8, height: 8, background: B.tomato, marginLeft: 2, marginBottom: 2 }}/>
      </div>
      <div style={{ display: "flex", gap: 32, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>
        {links.map(l => (
          <span key={l} style={{
            color: active === l ? B.tomato : B.ink,
            cursor: "pointer",
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function GridBG({ style = {} }) {
  return <div style={{
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(${B.hair} 1px, transparent 1px), linear-gradient(90deg, ${B.hair} 1px, transparent 1px)`,
    backgroundSize: "32px 32px",
    opacity: 0.5, pointerEvents: "none",
    ...style,
  }}/>;
}

function DotBG({ style = {} }) {
  return <div style={{
    position: "absolute", inset: 0,
    backgroundImage: `radial-gradient(${B.hair} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
    opacity: 0.8, pointerEvents: "none",
    ...style,
  }}/>;
}

function Tag({ children, variant = "line" }) {
  return <span style={{
    display: "inline-block", padding: "2px 10px",
    fontFamily: B.mono, fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase",
    border: variant === "line" ? `1px solid ${B.ink}` : "none",
    background: variant === "solid" ? B.ink : variant === "accent" ? B.tomato : "transparent",
    color: variant === "solid" || variant === "accent" ? B.paper : B.ink,
  }}>{children}</span>;
}

// ============================================================
// Home
// ============================================================
function HomeB() {
  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <GridBG />
      <NavB />

      <div style={{ position: "absolute", top: 120, left: 44, right: 44 }}>
        {/* Top meta bar */}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: B.mono, fontSize: 10, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase" }}>
          <span>N° 001 · INDEX</span>
          <span>2026 SPRING</span>
          <span>EAST · SF · 37.77° N</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 190, left: 44, right: 44, bottom: 80, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 18 }}>
            ━━ a personal index
          </div>
          <div style={{ fontFamily: B.display, fontSize: 96, lineHeight: 0.95, letterSpacing: -3, fontWeight: 400 }}>
            Hi, I'm<br/>
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>Lucy.</span>
            <span style={{ color: B.tomato, fontSize: 48, verticalAlign: "super", marginLeft: 8 }}>✳</span>
          </div>
          <div style={{ marginTop: 36, maxWidth: 460, fontFamily: B.sans, fontSize: 16, lineHeight: 1.6, color: B.ink }}>
            Software engineer. Amateur archivist. I keep this site as a small room for the things I'm making, the places I've been, and the records I won't stop playing.
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 10 }}>
            <Tag variant="solid">Enter ↓</Tag>
            <Tag>Blog</Tag>
            <Tag>Projects</Tag>
          </div>
        </div>

        {/* Right — photo with precise offset */}
        <div style={{ position: "relative", paddingTop: 20 }}>
          {/* Thin frame */}
          <div style={{ position: "absolute", top: 30, left: 30, right: 30, bottom: 30, border: `1px solid ${B.ink}` }}/>
          <div style={{ position: "absolute", top: 14, left: 14, right: 46, bottom: 46, background: B.paperCool, padding: 16 }}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden", background: B.ink }}>
              <img src="images/home/selfie1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }}/>
            </div>
          </div>
          {/* Label sticker */}
          <div style={{
            position: "absolute", bottom: 54, right: 54,
            background: B.paper, border: `1px solid ${B.ink}`, padding: "10px 14px",
            maxWidth: 220,
          }}>
            <div style={{ fontFamily: B.mono, fontSize: 9, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase" }}>FIG. 01</div>
            <div style={{ fontFamily: B.display, fontSize: 18, fontStyle: "italic", lineHeight: 1.05, marginTop: 4 }}>Self-portrait, spring 2026</div>
            <div style={{ width: 24, height: 3, background: B.tomato, marginTop: 8 }}/>
          </div>
        </div>
      </div>

      {/* Footer rule */}
      <div style={{ position: "absolute", bottom: 32, left: 44, right: 44, display: "flex", justifyContent: "space-between",
        fontFamily: B.mono, fontSize: 10, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase", borderTop: `1px solid ${B.hair}`, paddingTop: 14 }}>
        <span>LUCYGAI.COM</span>
        <span>✎ written from San Francisco</span>
        <span>↑ scroll</span>
      </div>
    </div>
  );
}

// ============================================================
// Travels — stamp postcards
// ============================================================
function TravelsB() {
  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <DotBG />
      <NavB active="Travels" />

      <div style={{ position: "absolute", top: 128, left: 44, right: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 10 }}>━━ 03 · Travels</div>
            <div style={{ fontFamily: B.display, fontSize: 64, lineHeight: 1, letterSpacing: -1.5, fontWeight: 400 }}>
              Postcards <span style={{ fontStyle: "italic", fontWeight: 300 }}>home.</span>
            </div>
          </div>
          <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, letterSpacing: 1.4, textTransform: "uppercase", textAlign: "right" }}>
            Stamps, dates,<br/>small notes.
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 290, left: 44, right: 44, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {window.TRIPS.map((t, i) => (
          <div key={t.id} style={{ background: B.paper, border: `1px solid ${B.ink}`, padding: 0, position: "relative", cursor: "pointer" }}>
            {/* Postcard header with stamp area */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", borderBottom: `1px solid ${B.ink}` }}>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontFamily: B.mono, fontSize: 9, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase" }}>POSTCARD · {String(i+1).padStart(2,"0")} / 03</div>
                <div style={{ fontFamily: B.display, fontSize: 30, fontStyle: "italic", lineHeight: 1, marginTop: 4 }}>{t.place}</div>
              </div>
              {/* Stamp */}
              <div style={{ borderLeft: `1px dashed ${B.ink}`, padding: 8, position: "relative", background: B.paperCool }}>
                <div style={{ border: `1px solid ${B.ink}`, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 2 }}>
                  <div style={{ fontFamily: B.display, fontSize: 20, color: B.tomato, fontStyle: "italic", fontWeight: 500 }}>¥{i === 0 ? 110 : i === 1 ? 80 : 160}</div>
                  <div style={{ fontFamily: B.mono, fontSize: 7, letterSpacing: 0.8 }}>NIPPON</div>
                </div>
                {/* Cancellation mark */}
                <div style={{ position: "absolute", top: -6, right: -6, width: 50, height: 50, border: `1px solid ${B.ink60}`, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-12deg)", opacity: 0.55 }}>
                  <div style={{ fontFamily: B.mono, fontSize: 7, letterSpacing: 0.4 }}>{t.date.replace(" / ", ".")}</div>
                  <div style={{ width: 30, borderTop: `1px solid ${B.ink60}`, margin: "2px 0" }}/>
                  <div style={{ fontFamily: B.mono, fontSize: 7, letterSpacing: 1 }}>POSTED</div>
                </div>
              </div>
            </div>
            {/* Photo */}
            <div style={{ padding: 0 }}>
              <img src={t.cover} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}/>
            </div>
            {/* Caption */}
            <div style={{ padding: "14px 16px", borderTop: `1px solid ${B.ink}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ fontFamily: B.sans, fontSize: 12, color: B.ink }}>{t.sub}</div>
                <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{t.duration}</div>
              </div>
              <div style={{ fontFamily: B.display, fontSize: 18, fontStyle: "italic", color: B.tomato }}>→</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 32, left: 44, right: 44, display: "flex", justifyContent: "space-between",
        fontFamily: B.mono, fontSize: 10, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase", borderTop: `1px solid ${B.hair}`, paddingTop: 14 }}>
        <span>SHOWING 3</span>
        <span>SORT ↓ DATE DESC</span>
      </div>
    </div>
  );
}

// ============================================================
// Music players for B
// ============================================================
function VinylPlayerB({ album, playing, progress }) {
  return (
    <div style={{ width: 380, height: 380, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 360, height: 360, borderRadius: "50%",
        background: `repeating-radial-gradient(circle, ${B.sumi} 0, ${B.sumi} 2px, #0a0a0a 3px, ${B.sumi} 4px)`,
        position: "relative",
        animation: playing ? "spinB 4.5s linear infinite" : "none",
        boxShadow: `0 14px 40px rgba(0,0,0,0.25), inset 0 0 0 2px ${B.tomato}`,
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 136, height: 136, borderRadius: "50%", overflow: "hidden", border: `4px solid ${B.paper}` }}>
          <img src={album.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: B.paper, zIndex: 2 }}/>
      </div>
      {/* Tonearm */}
      <div style={{
        position: "absolute", top: 10, right: -10,
        width: 160, height: 8, background: B.ink, borderRadius: 0,
        transformOrigin: "right center",
        transform: playing ? "rotate(-26deg)" : "rotate(-46deg)",
        transition: "transform 600ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ position: "absolute", right: 0, top: -10, width: 28, height: 28, background: B.tomato }}/>
        <div style={{ position: "absolute", left: -2, top: 0, width: 12, height: 12, background: B.ink }}/>
      </div>
      <style>{`@keyframes spinB { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function IpodPlayerB({ album, playing, setPlaying, progress, setTrackIdx, trackIdx, tracks }) {
  return (
    <div style={{
      width: 280, height: 460, background: B.paper, border: `1px solid ${B.ink}`, borderRadius: 26,
      padding: 18, display: "flex", flexDirection: "column", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 40, height: 3, background: B.ink, borderRadius: 2 }}/>
      <div style={{ height: 220, background: B.paperCool, border: `1px solid ${B.ink}`, padding: 12, display: "flex", flexDirection: "column", fontFamily: B.mono }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: B.ink }}>
          <span>⏵ Playing</span><span>23:14</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
          <img src={album.src} alt="" style={{ width: 74, height: 74, objectFit: "cover", border: `1px solid ${B.ink}` }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: B.display, fontSize: 15, fontStyle: "italic", lineHeight: 1.05, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</div>
            <div style={{ fontSize: 9, color: B.ink60, marginTop: 2, letterSpacing: 0.6 }}>{album.artist}</div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 10, color: B.ink }}>{tracks[trackIdx]?.name}</div>
        <div style={{ height: 2, background: B.hair, marginTop: 8, position: "relative" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: B.tomato }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: B.ink60, marginTop: 4 }}>
          <span>0:47</span><span>-2:18</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 18 }}>
        <div style={{ width: 180, height: 180, borderRadius: "50%", background: B.paperCool, border: `1px solid ${B.ink}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", fontFamily: B.mono, fontSize: 10, letterSpacing: 2, color: B.ink }}>MENU</div>
          <div onClick={() => setTrackIdx(Math.max(0, trackIdx-1))} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: B.mono, fontSize: 12, cursor: "pointer", color: B.ink }}>◀◀</div>
          <div onClick={() => setTrackIdx(Math.min(tracks.length-1, trackIdx+1))} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontFamily: B.mono, fontSize: 12, cursor: "pointer", color: B.ink }}>▶▶</div>
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", fontFamily: B.mono, fontSize: 12, color: B.ink }}>▶/❚❚</div>
          <div onClick={() => setPlaying(!playing)} style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 64, height: 64, borderRadius: "50%", background: B.paper, border: `1px solid ${B.ink}`,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            fontFamily: B.display, fontSize: 16, color: B.tomato,
          }}>{playing ? "❚❚" : "▶"}</div>
        </div>
      </div>
    </div>
  );
}

function CassettePlayerB({ album, playing, progress }) {
  return (
    <div style={{
      width: 440, height: 260, background: B.paper, border: `1px solid ${B.ink}`, borderRadius: 4,
      padding: 16, position: "relative",
    }}>
      {/* Top strip */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: B.mono, fontSize: 9, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase", borderBottom: `1px solid ${B.ink}`, paddingBottom: 8 }}>
        <span>MIXTAPE N° {String(window.ALBUMS.indexOf(album) + 1).padStart(3, "0")}</span>
        <span>HIGH-BIAS CrO₂</span>
        <span>SIDE A · 45min</span>
      </div>
      <div style={{ fontFamily: B.display, fontSize: 28, fontStyle: "italic", lineHeight: 1, marginTop: 10 }}>{album.title}</div>
      <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, letterSpacing: 1, textTransform: "uppercase" }}>{album.artist} · {album.year}</div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: B.paperCool, border: `1px solid ${B.ink}`, padding: "14px 28px" }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width: 64, height: 64, borderRadius: "50%",
            background: B.ink,
            animation: playing ? "spinB 2.4s linear infinite" : "none",
            animationDelay: `${i * -0.2}s`,
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1px dashed ${B.paper}`, opacity: 0.5 }}/>
            {[0,72,144,216,288].map(d => (
              <div key={d} style={{ position: "absolute", top: "50%", left: "50%", width: 2, height: 24, background: B.paper, opacity: 0.3, transform: `translate(-50%,-50%) rotate(${d}deg)` }}/>
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: B.tomato }}/>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["◀◀","▶","■","▶▶"].map(s => (
            <div key={s} style={{ width: 30, height: 18, border: `1px solid ${B.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: B.mono, fontSize: 10 }}>{s}</div>
          ))}
        </div>
        <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, letterSpacing: 1 }}>{String(Math.floor(progress / 100 * 43)).padStart(2,"0")}:{String(Math.floor(progress / 100 * 60) % 60).padStart(2,"0")}</div>
      </div>
    </div>
  );
}

function FavoritesB({ playerVariant, moviesVariant }) {
  const [selectedIdx, setSelectedIdx] = useStateB(1);
  const [playing, setPlaying] = useStateB(false);
  const [progress, setProgress] = useStateB(24);
  const [trackIdx, setTrackIdx] = useStateB(0);
  const [tab, setTab] = useStateB("music");

  const selectedAlbum = window.ALBUMS[selectedIdx];
  const tracks = window.TRACKLISTS[selectedAlbum.title] || window.DEFAULT_TRACKLIST;

  useEffectB(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p + 0.5) % 100), 200);
    return () => clearInterval(id);
  }, [playing]);
  useEffectB(() => { setTrackIdx(0); setProgress(0); }, [selectedIdx]);

  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <GridBG />
      <NavB active="Favorites" />

      <div style={{ position: "absolute", top: 120, left: 44, right: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 8 }}>━━ 04 · Favorites</div>
            <div style={{ fontFamily: B.display, fontSize: 60, lineHeight: 1, letterSpacing: -1.2, fontWeight: 400 }}>
              Quiet <span style={{ fontStyle: "italic", fontWeight: 300 }}>obsessions.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["music", "films"].map(t => (
              <div key={t} onClick={() => setTab(t)} style={{
                padding: "8px 20px",
                background: tab === t ? B.ink : "transparent",
                color: tab === t ? B.paper : B.ink,
                border: `1px solid ${B.ink}`,
                fontFamily: B.mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer",
              }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {tab === "music" ? (
        <div style={{ position: "absolute", top: 260, left: 44, right: 44, bottom: 60, display: "grid", gridTemplateColumns: "1fr 400px", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 380, padding: 10 }}>
              {playerVariant === "vinyl" && <VinylPlayerB album={selectedAlbum} playing={playing} progress={progress} />}
              {playerVariant === "ipod" && <IpodPlayerB album={selectedAlbum} playing={playing} setPlaying={setPlaying} progress={progress} trackIdx={trackIdx} setTrackIdx={setTrackIdx} tracks={tracks} />}
              {playerVariant === "cassette" && <CassettePlayerB album={selectedAlbum} playing={playing} progress={progress} />}
            </div>
            <div style={{ background: B.paperCool, border: `1px solid ${B.ink}`, padding: 14, maxWidth: 560 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontFamily: B.display, fontSize: 18, fontStyle: "italic", lineHeight: 1 }}>{selectedAlbum.title}</div>
                <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, letterSpacing: 1.4, textTransform: "uppercase" }}>TRACKLIST · {tracks.length}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                {tracks.map((tr, i) => (
                  <div key={tr.n} onClick={() => { setTrackIdx(i); setPlaying(true); }} style={{
                    display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 10,
                    padding: "4px 0", alignItems: "baseline",
                    fontFamily: B.mono, fontSize: 10, cursor: "pointer",
                    color: i === trackIdx ? B.tomato : B.ink,
                  }}>
                    <span style={{ color: B.ink40 }}>{String(tr.n).padStart(2,"0")}</span>
                    <span style={{ fontFamily: B.sans, fontSize: 12 }}>{tr.name}</span>
                    <span style={{ color: B.ink60 }}>{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: B.mono, fontSize: 10, letterSpacing: 2, color: B.ink60, textTransform: "uppercase", marginBottom: 14, borderBottom: `1px solid ${B.ink}`, paddingBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>INDEX / ALBUMS</span>
              <span>{window.ALBUMS.length}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {window.ALBUMS.map((a, i) => (
                <div key={a.src} onClick={() => setSelectedIdx(i)} style={{ cursor: "pointer", position: "relative" }}>
                  <img src={a.src} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", border: i === selectedIdx ? `2px solid ${B.tomato}` : `1px solid ${B.hair}` }}/>
                  {i === selectedIdx && (
                    <div style={{ position: "absolute", top: 4, right: 4, background: B.tomato, color: B.paper, fontFamily: B.mono, fontSize: 8, padding: "1px 4px", letterSpacing: 0.8 }}>NOW</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MoviesB moviesVariant={moviesVariant}/>
      )}
    </div>
  );
}

function MoviesB({ moviesVariant }) {
  return (
    <div style={{ position: "absolute", top: 260, left: 44, right: 44, bottom: 60, overflow: "hidden" }}>
      {moviesVariant === "tickets" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {window.MOVIES.map((m, i) => (
            <div key={m.title} style={{ display: "grid", gridTemplateColumns: "80px 1fr 84px", background: B.paperCool, border: `1px solid ${B.ink}`, position: "relative" }}>
              <div style={{ padding: 10, borderRight: `1px dashed ${B.ink60}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ fontFamily: B.mono, fontSize: 8, letterSpacing: 1.6, color: B.tomato, textTransform: "uppercase" }}>ADMIT ONE</div>
                <div style={{ fontFamily: B.display, fontSize: 28, fontStyle: "italic", color: B.tomato, fontWeight: 500 }}>{m.rating.toFixed(1)}</div>
                <div style={{ fontFamily: B.mono, fontSize: 7, letterSpacing: 1 }}>{m.date}</div>
              </div>
              <div style={{ padding: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: B.display, fontSize: 18, fontStyle: "italic", lineHeight: 1.05 }}>{m.title}</div>
                <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{m.director} · {m.year}</div>
                <div style={{ fontFamily: B.sans, fontSize: 11, color: B.ink, marginTop: 8, lineHeight: 1.35, fontStyle: "italic" }}>"{m.note}"</div>
              </div>
              <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {window.MOVIES.map(m => (
            <div key={m.title} style={{ background: B.paper, border: `1px solid ${B.ink}`, padding: 12 }}>
              <div style={{ fontFamily: B.mono, fontSize: 9, letterSpacing: 1.6, color: B.ink60, textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>№ {window.MOVIES.indexOf(m) + 1}</span>
                <span>{m.date}</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <img src={m.src} alt="" style={{ width: 66, height: 99, objectFit: "cover", border: `1px solid ${B.ink}` }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: B.display, fontSize: 15, fontStyle: "italic", lineHeight: 1.05 }}>{m.title}</div>
                  <div style={{ fontFamily: B.sans, fontSize: 10, color: B.ink60, marginTop: 2 }}>{m.director} · {m.year}</div>
                  <div style={{ fontFamily: B.mono, fontSize: 10, color: B.tomato, marginTop: 8, letterSpacing: 2 }}>
                    {"●".repeat(Math.floor(m.rating))}{m.rating % 1 ? "◐" : ""}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: B.sans, fontSize: 11, color: B.ink, fontStyle: "italic", marginTop: 10, lineHeight: 1.4, borderTop: `1px solid ${B.hair}`, paddingTop: 8 }}>"{m.note}"</div>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "reel" && (
        <div>
          <div style={{ background: B.sumi, padding: "16px 12px", display: "flex", gap: 6, position: "relative" }}>
            <div style={{ position: "absolute", top: 4, left: 0, right: 0, display: "flex", gap: 12, padding: "0 14px" }}>
              {Array.from({length:30}).map((_,i) => <div key={i} style={{ width: 8, height: 8, background: B.paper, borderRadius: 1 }}/>)}
            </div>
            <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, display: "flex", gap: 12, padding: "0 14px" }}>
              {Array.from({length:30}).map((_,i) => <div key={i} style={{ width: 8, height: 8, background: B.paper, borderRadius: 1 }}/>)}
            </div>
            <div style={{ marginTop: 14, marginBottom: 14, display: "flex", gap: 4, width: "100%" }}>
              {window.MOVIES.map(m => (
                <img key={m.title} src={m.src} alt="" style={{ flex: 1, aspectRatio: "2/3", objectFit: "cover", width: 0 }}/>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {window.MOVIES.map(m => (
              <div key={m.title}>
                <div style={{ fontFamily: B.display, fontSize: 16, fontStyle: "italic", lineHeight: 1.05 }}>{m.title}</div>
                <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{m.director} · {m.year}</div>
                <div style={{ fontFamily: B.mono, fontSize: 10, color: B.tomato, marginTop: 4 }}>{"★".repeat(Math.floor(m.rating))}</div>
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
function AboutB() {
  const socials = [
    { l: "Instagram", h: "@lucy.gai", url: "instagram.com/lucy.gai" },
    { l: "Letterboxd", h: "lucy_gai", url: "letterboxd.com/lucy_gai" },
    { l: "Spotify", h: "charlottefour", url: "open.spotify.com/user/..." },
    { l: "Twitch", h: "88lucie", url: "twitch.tv/88lucie" },
    { l: "Email", h: "hello@lucygai.com", url: "mailto:hello@lucygai.com" },
  ];
  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <GridBG />
      <NavB active="About" />

      <div style={{ position: "absolute", top: 128, left: 44, right: 44, bottom: 60, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 44 }}>
        <div>
          <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 10 }}>━━ 05 · About</div>
          <div style={{ fontFamily: B.display, fontSize: 40, lineHeight: 1.2, letterSpacing: -0.5, fontWeight: 300 }}>
            Hi — I'm <span style={{ fontStyle: "italic" }}>Lucy</span>, a software engineer in San Francisco.
          </div>
          <Hair style={{ margin: "24px 0" }}/>
          <div style={{ fontFamily: B.sans, fontSize: 14, color: B.ink, lineHeight: 1.6, maxWidth: 460 }}>
            I work on tools at a small startup. Outside of that I travel a lot, watch a lot of movies, and keep this site as a little room for everything I'd otherwise forget. The blog is slow. The favorites page is honest.
          </div>

          <div style={{ fontFamily: B.mono, fontSize: 10, letterSpacing: 2, color: B.ink60, textTransform: "uppercase", marginTop: 40, marginBottom: 14 }}>CURRENTLY</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 24, rowGap: 10, fontSize: 13, lineHeight: 1.4 }}>
            {[
              ["Reading", "A Little Life — Hanya Yanagihara"],
              ["Listening", "nolimit, by Knock2"],
              ["Watching", "The Bear, S4"],
              ["Building", "this site"],
              ["Planning", "Tokyo → Sept · Lisbon → Nov"],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <span style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, letterSpacing: 1.4, textTransform: "uppercase", paddingTop: 3 }}>{k}</span>
                <span>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contact panel */}
        <div style={{ background: B.paperCool, border: `1px solid ${B.ink}`, padding: 24, position: "relative" }}>
          <div style={{ position: "absolute", top: -12, right: 20, background: B.tomato, color: B.paper, fontFamily: B.mono, fontSize: 9, letterSpacing: 1.8, padding: "3px 10px", textTransform: "uppercase" }}>
            Say hello
          </div>
          <div style={{ fontFamily: B.display, fontSize: 26, fontStyle: "italic" }}>Contact.</div>
          <Hair style={{ margin: "16px 0" }}/>
          {socials.map((s, i) => (
            <div key={s.l} style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", padding: "12px 0", borderBottom: i < socials.length - 1 ? `1px dashed ${B.hair}` : "none", alignItems: "baseline" }}>
              <span style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, letterSpacing: 1.4, textTransform: "uppercase" }}>{s.l}</span>
              <div>
                <div style={{ fontFamily: B.display, fontSize: 16, fontStyle: "italic", lineHeight: 1 }}>{s.h}</div>
                <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink40, marginTop: 2 }}>{s.url}</div>
              </div>
              <span style={{ fontFamily: B.mono, color: B.tomato, fontSize: 12 }}>↗</span>
            </div>
          ))}

          <div style={{ position: "absolute", bottom: 16, right: 20, fontFamily: B.display, fontSize: 12, fontStyle: "italic", color: B.ink60 }}>
            — 敬具
          </div>
        </div>
      </div>
    </div>
  );
}

function Hair({ style = {} }) {
  return <div style={{ height: 1, background: B.hair, ...style }}/>;
}

// ============================================================
// Blog
// ============================================================
function BlogB() {
  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <GridBG />
      <NavB active="Blog" />
      <div style={{ position: "absolute", top: 120, left: 44, right: 44 }}>
        <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 8 }}>━━ 01 · Blog</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: B.display, fontSize: 72, lineHeight: 1, letterSpacing: -1.8, fontWeight: 400 }}>
            Writing, <span style={{ fontStyle: "italic", fontWeight: 300 }}>mostly slow.</span>
          </div>
          <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, letterSpacing: 1.4, textTransform: "uppercase", textAlign: "right" }}>
            {window.POSTS.length} entries<br/>rss ·  archive
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 270, left: 44, right: 44, bottom: 60, overflow: "hidden" }}>
        {/* Featured */}
        <div style={{ background: B.paperCool, border: `1px solid ${B.ink}`, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: B.mono, fontSize: 9, color: B.tomato, letterSpacing: 2, textTransform: "uppercase" }}>FEATURED</div>
            <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, marginTop: 4 }}>{window.POSTS[0].date}</div>
          </div>
          <div>
            <div style={{ fontFamily: B.display, fontSize: 32, fontStyle: "italic", lineHeight: 1.05 }}>{window.POSTS[0].title}</div>
            <div style={{ fontFamily: B.sans, fontSize: 13, color: B.ink60, marginTop: 6, lineHeight: 1.5 }}>{window.POSTS[0].excerpt}</div>
          </div>
          <div style={{ fontFamily: B.display, fontSize: 30, color: B.tomato }}>→</div>
        </div>

        {/* Rest */}
        {window.POSTS.slice(1).map((p, i) => (
          <div key={p.title} style={{ display: "grid", gridTemplateColumns: "110px 1fr 140px", gap: 24, padding: "14px 0", borderBottom: `1px solid ${B.hair}`, alignItems: "baseline" }}>
            <div style={{ fontFamily: B.mono, fontSize: 10, color: B.ink60, letterSpacing: 1.2, textTransform: "uppercase" }}>{p.date}</div>
            <div>
              <div style={{ fontFamily: B.display, fontSize: 20, fontStyle: "italic", lineHeight: 1.1 }}>{p.title}</div>
              <div style={{ fontFamily: B.sans, fontSize: 12, color: B.ink60, marginTop: 4, lineHeight: 1.45 }}>{p.excerpt}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
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
function ProjectsB() {
  return (
    <div className="ab-root" style={{ background: B.paper, color: B.ink, fontFamily: B.sans }}>
      <DotBG />
      <NavB active="Projects" />

      <div style={{ position: "absolute", top: 120, left: 44, right: 44 }}>
        <div style={{ fontFamily: B.mono, fontSize: 11, letterSpacing: 3, color: B.tomato, textTransform: "uppercase", marginBottom: 8 }}>━━ 02 · Projects</div>
        <div style={{ fontFamily: B.display, fontSize: 60, lineHeight: 1, letterSpacing: -1.5, fontWeight: 400 }}>
          Made <span style={{ fontStyle: "italic", fontWeight: 300 }}>lately.</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 230, left: 44, right: 44, bottom: 60, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {window.PROJECTS.map((p, i) => (
          <div key={p.name} style={{ background: B.paperCool, border: `1px solid ${B.ink}`, padding: 16, position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: B.mono, fontSize: 9, letterSpacing: 1.4, color: B.ink60, textTransform: "uppercase" }}>
              <span>{p.year}</span>
              <span>№ {String(i + 1).padStart(2, "0")}</span>
            </div>
            <div style={{ fontFamily: B.display, fontSize: 28, fontStyle: "italic", lineHeight: 1.05, marginTop: 12 }}>{p.name}</div>
            <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{p.role}</div>
            <div style={{ flex: 1 }}/>
            <Hair style={{ margin: "12px 0" }}/>
            <div style={{ fontFamily: B.sans, fontSize: 12, color: B.ink }}>{p.kind}</div>
            <div style={{ fontFamily: B.mono, fontSize: 9, color: B.ink60, marginTop: 6 }}>{p.stack.join(" · ")}</div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tag variant={p.status === "live" || p.status === "shipping" ? "accent" : "line"}>{p.status}</Tag>
              <div style={{ width: 10, height: 10, background: p.color }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeB, TravelsB, FavoritesB, AboutB, BlogB, ProjectsB });
