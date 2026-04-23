// Direction C — Zine / Risograph
// Cut-and-paste, halftone textures, tape strips, handwritten annotations,
// overlapping blocks with print-registration offset. Instrument Serif + Space Mono + Caveat.

const { useState: useStateC, useEffect: useEffectC } = React;

const C = {
  paper: "#efe6d5",
  paperWarm: "#ebdfc8",
  ink: "#1a1715",
  ink60: "#544e48",
  ink40: "#8b857e",
  hair: "rgba(26,23,21,0.2)",
  red: "oklch(0.62 0.21 25)",
  redDeep: "oklch(0.5 0.2 25)",
  blue: "oklch(0.52 0.17 240)",
  blueDeep: "oklch(0.42 0.16 240)",
  olive: "oklch(0.62 0.11 110)",
  cream: "#f9f2e2",
  display: "'Instrument Serif', 'Newsreader', Georgia, serif",
  mono: "'Space Mono', ui-monospace, monospace",
  hand: "'Caveat', cursive",
};

function NavC({ active }) {
  const links = ["Blog", "Travels", "Projects", "Favorites", "About"];
  return (
    <div style={{ position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 40px", zIndex: 30 }}>
      <div>
        <div style={{ fontFamily: C.display, fontSize: 30, color: C.ink, lineHeight: 1, letterSpacing: -0.5 }}>Lucy Gai</div>
        <div style={{ fontFamily: C.hand, fontSize: 18, color: C.red, marginTop: -2, transform: "rotate(-2deg)", display: "inline-block" }}>a tiny zine, printed here</div>
      </div>
      <div style={{ display: "flex", gap: 6, fontFamily: C.mono, fontSize: 11, textTransform: "uppercase" }}>
        {links.map(l => (
          <span key={l} style={{
            padding: "6px 10px",
            background: active === l ? C.ink : "transparent",
            color: active === l ? C.paper : C.ink,
            border: `1px solid ${C.ink}`,
            cursor: "pointer",
            transform: active === l ? "rotate(-1deg)" : "none",
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Halftone({ color, style }) {
  const c = color === "red" ? C.red : color === "blue" ? C.blue : C.ink;
  return <div style={{ position: "absolute", backgroundImage: `radial-gradient(${c} 1.2px, transparent 1.6px)`, backgroundSize: "5px 5px", ...style }}/>;
}

function TapeStrip({ style, color = "rgba(215, 200, 130, 0.7)" }) {
  return <div style={{ position: "absolute", background: color, width: 80, height: 24, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", ...style }}/>;
}

// Print registration offset — red layer + black layer slightly offset
function RisoText({ children, style, offset = 2, color = C.red }) {
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "absolute", top: offset, left: offset, color, opacity: 0.8, mixBlendMode: "multiply" }}>{children}</span>
      <span style={{ position: "relative", color: C.ink }}>{children}</span>
    </div>
  );
}

// ============================================================
// Home
// ============================================================
function HomeC() {
  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC />

      {/* Big halftone block behind */}
      <Halftone color="red" style={{ top: 180, right: -60, width: 480, height: 480, opacity: 0.45, borderRadius: 999 }}/>
      <Halftone color="blue" style={{ bottom: 40, left: 180, width: 240, height: 240, opacity: 0.35, borderRadius: 8 }}/>

      <div style={{ position: "absolute", top: 150, left: 40, right: 40, bottom: 60, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }}>
        <div style={{ position: "relative", paddingTop: 30 }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            ISSUE №1  ·  SPRING ’26  ·  FREE
          </div>
          <div style={{ fontFamily: C.display, fontSize: 180, lineHeight: 0.86, letterSpacing: -4, fontStyle: "italic", fontWeight: 400 }}>
            hi,
          </div>
          <div style={{ fontFamily: C.display, fontSize: 110, lineHeight: 0.9, letterSpacing: -3, marginTop: -10 }}>
            i'm <span style={{ color: C.red, textDecoration: "underline", textDecorationThickness: 3, textUnderlineOffset: 8 }}>Lucy</span>.
          </div>
          <div style={{ position: "absolute", top: 210, right: 40, transform: "rotate(-8deg)", fontFamily: C.hand, fontSize: 28, color: C.blue, lineHeight: 1 }}>
            (hello, nice<br/>to see you)
          </div>
          <div style={{ marginTop: 30, maxWidth: 480, fontFamily: C.display, fontSize: 20, lineHeight: 1.45, color: C.ink }}>
            Software engineer. Collector of records, films, and small bright moments. This is a zine I keep updating — read around, nothing is in any particular order.
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 18px", background: C.ink, color: C.paper,
              fontFamily: C.mono, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
              transform: "rotate(-1deg)",
            }}>→ start reading</div>
            <div style={{ fontFamily: C.hand, fontSize: 22, color: C.red, transform: "rotate(4deg)" }}>or just click around ✦</div>
          </div>
        </div>

        {/* Right: collaged photo */}
        <div style={{ position: "relative" }}>
          <TapeStrip style={{ top: 10, left: 40, transform: "rotate(-8deg)" }}/>
          <TapeStrip style={{ top: 20, right: 10, transform: "rotate(6deg)", background: "rgba(200, 180, 110, 0.75)" }}/>
          <div style={{ position: "absolute", top: 30, left: 10, right: 10, bottom: 130, background: C.cream, border: `1px solid ${C.ink}`, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", transform: "rotate(2deg)" }}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden", background: C.ink }}>
              <img src="images/home/selfie1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", filter: "contrast(1.1) saturate(0.85)" }}/>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 20, left: 40, fontFamily: C.hand, fontSize: 30, color: C.ink, transform: "rotate(-3deg)" }}>
            ← me, mostly
          </div>
          <div style={{ position: "absolute", bottom: 80, right: 30, background: C.paper, border: `1px solid ${C.ink}`, padding: "6px 12px", fontFamily: C.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", transform: "rotate(4deg)" }}>
            2026 / self
          </div>
          <TapeStrip style={{ bottom: 60, left: 30, transform: "rotate(-8deg)" }}/>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ position: "absolute", bottom: 16, left: 40, right: 40, display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 10, color: C.ink60, letterSpacing: 1.4, textTransform: "uppercase", borderTop: `2px solid ${C.ink}`, paddingTop: 8 }}>
        <span>★ printed in two colors</span>
        <span>est. 2024</span>
        <span>lucygai.com</span>
      </div>
    </div>
  );
}

// ============================================================
// Travels
// ============================================================
function TravelsC() {
  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC active="Travels" />

      <Halftone color="blue" style={{ top: 200, left: -80, width: 360, height: 360, opacity: 0.35, borderRadius: 999 }}/>

      <div style={{ position: "absolute", top: 140, left: 40, right: 40 }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>CHAPTER ③ — ELSEWHERE</div>
        <div style={{ fontFamily: C.display, fontSize: 100, lineHeight: 0.92, letterSpacing: -2 }}>
          <span style={{ fontStyle: "italic" }}>postcards,</span><br/>
          <span style={{ position: "relative" }}>
            <span style={{ position: "absolute", top: 4, left: 3, color: C.red, opacity: 0.7, mixBlendMode: "multiply" }}>stamped home.</span>
            <span>stamped home.</span>
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 370, left: 40, right: 40, bottom: 60, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, paddingTop: 30 }}>
        {window.TRIPS.map((t, i) => (
          <div key={t.id} style={{
            position: "relative", background: C.cream,
            border: `1px solid ${C.ink}`, padding: 8,
            transform: `rotate(${i === 0 ? -1.8 : i === 1 ? 1.2 : -0.6}deg)`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)", cursor: "pointer",
          }}>
            <TapeStrip style={{ top: -14, left: 20, transform: "rotate(-6deg)", width: 70, height: 20 }}/>
            {/* Photo */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: C.ink }}>
              <img src={t.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", filter: "contrast(1.12) saturate(0.85)" }}/>
              {/* Stamp overlay */}
              <div style={{
                position: "absolute", top: 8, right: 8,
                width: 56, height: 68,
                background: C.cream, border: `2px solid ${C.ink}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transform: `rotate(${i % 2 === 0 ? -8 : 6}deg)`,
                boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
              }}>
                <div style={{ fontFamily: C.display, fontSize: 22, fontStyle: "italic", color: C.red, lineHeight: 1 }}>{t.stamp}</div>
                <div style={{ height: 1, width: "70%", background: C.ink, margin: "3px 0" }}/>
                <div style={{ fontFamily: C.mono, fontSize: 7, color: C.ink, letterSpacing: 0.6, textAlign: "center", lineHeight: 1 }}>{t.date.replace(" / ", "\n")}</div>
              </div>
            </div>

            {/* Caption */}
            <div style={{ padding: "10px 4px 4px" }}>
              <div style={{ fontFamily: C.display, fontSize: 32, lineHeight: 1, fontStyle: "italic" }}>{t.place}</div>
              <div style={{ fontFamily: C.hand, fontSize: 20, color: C.blue, marginTop: 2, lineHeight: 1 }}>{t.sub}</div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: C.mono, fontSize: 9, letterSpacing: 1.2, color: C.ink60, textTransform: "uppercase" }}>
                <span>{t.duration}</span>
                <span>№ {String(i + 1).padStart(2, "0")} / 03 →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 16, left: 40, right: 40, borderTop: `2px solid ${C.ink}`, paddingTop: 8, fontFamily: C.hand, fontSize: 20, color: C.ink60 }}>
        more countries coming, i promise.
      </div>
    </div>
  );
}

// ============================================================
// Music players for C
// ============================================================
function VinylPlayerC({ album, playing, progress }) {
  return (
    <div style={{ width: 400, height: 400, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Halftone color="red" style={{ top: 20, left: 20, right: 20, bottom: 20, opacity: 0.35, borderRadius: "50%" }}/>
      <div style={{
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, #1a1715 0%, #0d0b0a 60%, #1a1715 100%)",
        position: "relative",
        animation: playing ? "spinC 3.8s linear infinite" : "none",
        boxShadow: "0 14px 40px rgba(0,0,0,0.3)",
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ position: "absolute", inset: 16 + i*18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }}/>
        ))}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: `4px solid ${C.cream}` }}>
          <img src={album.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: C.red, zIndex: 2 }}/>
      </div>
      <div style={{
        position: "absolute", top: -4, right: -16,
        width: 180, height: 10, background: C.ink, borderRadius: 2,
        transformOrigin: "right center",
        transform: playing ? "rotate(-28deg)" : "rotate(-46deg)",
        transition: "transform 600ms",
      }}>
        <div style={{ position: "absolute", right: 0, top: -10, width: 28, height: 28, background: C.red, borderRadius: 2 }}/>
        <div style={{ position: "absolute", left: -4, top: -2, width: 14, height: 14, background: C.blue }}/>
      </div>
      <style>{`@keyframes spinC { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function IpodPlayerC({ album, playing, setPlaying, progress, trackIdx, setTrackIdx, tracks }) {
  return (
    <div style={{
      width: 270, height: 450, background: C.cream, border: `2px solid ${C.ink}`, borderRadius: 20,
      padding: 16, position: "relative", boxShadow: "8px 8px 0 rgba(0,0,0,0.12)", transform: "rotate(-2deg)",
    }}>
      <TapeStrip style={{ top: -14, left: 80, transform: "rotate(4deg)", width: 70, height: 18 }}/>
      <div style={{ height: 210, background: C.paperWarm, border: `1px solid ${C.ink}`, padding: 10, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 9, color: C.ink, letterSpacing: 1.2 }}>
          <span>▶ NOW PLAYING</span><span>🔋</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
          <img src={album.src} alt="" style={{ width: 72, height: 72, objectFit: "cover", border: `1px solid ${C.ink}` }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: C.display, fontSize: 16, fontStyle: "italic", lineHeight: 1, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</div>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.ink60, marginTop: 2 }}>{album.artist}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 10, color: C.ink }}>{tracks[trackIdx]?.name}</div>
        <div style={{ height: 3, background: C.hair, marginTop: 6, position: "relative" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: C.red }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 9, color: C.ink60, marginTop: 3 }}>
          <span>0:47</span><span>-2:18</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 16 }}>
        <div style={{ width: 180, height: 180, borderRadius: "50%", background: C.paperWarm, border: `2px solid ${C.ink}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", fontFamily: C.mono, fontSize: 10, color: C.ink, letterSpacing: 2 }}>MENU</div>
          <div onClick={() => setTrackIdx(Math.max(0, trackIdx-1))} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: C.mono, fontSize: 14, cursor: "pointer", color: C.ink }}>◀◀</div>
          <div onClick={() => setTrackIdx(Math.min(tracks.length-1, trackIdx+1))} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontFamily: C.mono, fontSize: 14, cursor: "pointer", color: C.ink }}>▶▶</div>
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", fontFamily: C.mono, fontSize: 12, color: C.ink }}>▶/❚❚</div>
          <div onClick={() => setPlaying(!playing)} style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 66, height: 66, borderRadius: "50%", background: C.red, border: `2px solid ${C.ink}`, color: C.cream,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            fontFamily: C.display, fontSize: 18,
          }}>{playing ? "❚❚" : "▶"}</div>
        </div>
      </div>
    </div>
  );
}

function CassettePlayerC({ album, playing, progress }) {
  return (
    <div style={{
      width: 460, height: 260, background: C.cream, border: `2px solid ${C.ink}`, borderRadius: 8,
      padding: 18, position: "relative", boxShadow: "6px 6px 0 rgba(0,0,0,0.12)", transform: "rotate(-1deg)",
    }}>
      <TapeStrip style={{ top: -12, right: 60, transform: "rotate(6deg)", width: 80, height: 20 }}/>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 9, color: C.ink, letterSpacing: 1.6, textTransform: "uppercase", borderBottom: `1px solid ${C.ink}`, paddingBottom: 6 }}>
        <span>★ mixtape vol. {String(window.ALBUMS.indexOf(album) + 1).padStart(2,"0")}</span>
        <span>HIGH BIAS</span>
        <span>side a</span>
      </div>
      <div style={{ fontFamily: C.display, fontSize: 30, fontStyle: "italic", lineHeight: 1, marginTop: 8 }}>
        <RisoText color={C.red}>{album.title}</RisoText>
      </div>
      <div style={{ fontFamily: C.hand, fontSize: 22, color: C.blue, marginTop: 0, lineHeight: 1 }}>— {album.artist}, {album.year}</div>

      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-around", alignItems: "center", background: C.paperWarm, border: `1px solid ${C.ink}`, padding: "14px 40px" }}>
        {[0,1].map(i => (
          <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", background: C.ink, position: "relative", animation: playing ? "spinC 2.4s linear infinite" : "none", animationDelay: `${i * -0.2}s` }}>
            {[0,60,120,180,240,300].map(d => (
              <div key={d} style={{ position: "absolute", top: "50%", left: "50%", width: 2, height: 26, background: C.cream, opacity: 0.4, transform: `translate(-50%,-50%) rotate(${d}deg)` }}/>
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: C.red }}/>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 12, left: 18, right: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["◀◀","▶","■","▶▶"].map((s, i) => (
            <div key={s+i} style={{ width: 30, height: 18, border: `1px solid ${C.ink}`, background: i === 1 ? C.red : C.cream, color: i === 1 ? C.cream : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontSize: 10 }}>{s}</div>
          ))}
        </div>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.ink60, letterSpacing: 1 }}>{String(Math.floor(progress / 100 * 43)).padStart(2,"0")}:{String(Math.floor(progress / 100 * 60) % 60).padStart(2,"0")}</div>
      </div>
    </div>
  );
}

function FavoritesC({ playerVariant, moviesVariant }) {
  const [selectedIdx, setSelectedIdx] = useStateC(1);
  const [playing, setPlaying] = useStateC(false);
  const [progress, setProgress] = useStateC(32);
  const [trackIdx, setTrackIdx] = useStateC(0);
  const [tab, setTab] = useStateC("music");

  const selectedAlbum = window.ALBUMS[selectedIdx];
  const tracks = window.TRACKLISTS[selectedAlbum.title] || window.DEFAULT_TRACKLIST;

  useEffectC(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p + 0.5) % 100), 200);
    return () => clearInterval(id);
  }, [playing]);
  useEffectC(() => { setTrackIdx(0); setProgress(0); }, [selectedIdx]);

  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC active="Favorites" />
      <Halftone color="red" style={{ top: 180, right: -100, width: 420, height: 420, opacity: 0.35, borderRadius: 999 }}/>

      <div style={{ position: "absolute", top: 130, left: 40, right: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>CHAPTER ④ — FAVORITES</div>
            <div style={{ fontFamily: C.display, fontSize: 90, lineHeight: 0.9, letterSpacing: -2 }}>
              <span style={{ fontStyle: "italic" }}>stuff</span> i love,
            </div>
            <div style={{ fontFamily: C.hand, fontSize: 44, color: C.blue, marginTop: -4 }}>on repeat.</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["music", "films"].map(t => (
              <div key={t} onClick={() => setTab(t)} style={{
                padding: "8px 18px",
                background: tab === t ? C.red : C.cream,
                color: tab === t ? C.cream : C.ink,
                border: `2px solid ${C.ink}`,
                fontFamily: C.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase",
                cursor: "pointer",
                transform: tab === t ? "rotate(-2deg)" : "rotate(1deg)",
                boxShadow: tab === t ? "3px 3px 0 rgba(0,0,0,0.15)" : "none",
              }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {tab === "music" ? (
        <div style={{ position: "absolute", top: 320, left: 40, right: 40, bottom: 60, display: "grid", gridTemplateColumns: "1fr 400px", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 380, position: "relative" }}>
              {playerVariant === "vinyl" && <VinylPlayerC album={selectedAlbum} playing={playing} progress={progress}/>}
              {playerVariant === "ipod" && <IpodPlayerC album={selectedAlbum} playing={playing} setPlaying={setPlaying} progress={progress} trackIdx={trackIdx} setTrackIdx={setTrackIdx} tracks={tracks}/>}
              {playerVariant === "cassette" && <CassettePlayerC album={selectedAlbum} playing={playing} progress={progress}/>}
              <div onClick={() => setPlaying(!playing)} style={{
                position: "absolute", bottom: 4, right: 10,
                fontFamily: C.hand, fontSize: 26, color: C.red, transform: "rotate(-6deg)", cursor: "pointer",
              }}>
                {playing ? "pause ↻" : "click to play →"}
              </div>
            </div>
            <div style={{ background: C.cream, border: `2px solid ${C.ink}`, padding: 14, transform: "rotate(-0.5deg)", boxShadow: "4px 4px 0 rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <div style={{ fontFamily: C.display, fontSize: 20, fontStyle: "italic" }}>{selectedAlbum.title}</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.ink60, letterSpacing: 1.4, textTransform: "uppercase" }}>★ TRACKLIST</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px" }}>
                {tracks.map((tr, i) => (
                  <div key={tr.n} onClick={() => { setTrackIdx(i); setPlaying(true); }} style={{
                    display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 8,
                    padding: "4px 0", alignItems: "baseline", cursor: "pointer",
                    fontFamily: C.mono, fontSize: 10,
                    color: i === trackIdx ? C.red : C.ink,
                  }}>
                    <span style={{ color: C.ink40 }}>{String(tr.n).padStart(2,"0")}</span>
                    <span style={{ fontFamily: C.display, fontSize: 14, fontStyle: i === trackIdx ? "italic" : "normal" }}>{tr.name}</span>
                    <span style={{ color: C.ink60 }}>{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: C.hand, fontSize: 26, color: C.blue, marginBottom: 8, transform: "rotate(-2deg)", display: "inline-block" }}>the record rack ↓</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {window.ALBUMS.map((a, i) => (
                <div key={a.src} onClick={() => setSelectedIdx(i)} style={{ cursor: "pointer", position: "relative", transform: `rotate(${(i % 3 - 1) * 0.8}deg)` }}>
                  <img src={a.src} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", border: `2px solid ${i === selectedIdx ? C.red : C.ink}`, boxShadow: i === selectedIdx ? `3px 3px 0 ${C.blue}` : "none" }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MoviesC moviesVariant={moviesVariant}/>
      )}
    </div>
  );
}

function MoviesC({ moviesVariant }) {
  return (
    <div style={{ position: "absolute", top: 320, left: 40, right: 40, bottom: 60, overflow: "hidden" }}>
      {moviesVariant === "tickets" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {window.MOVIES.map((m, i) => (
            <div key={m.title} style={{
              display: "grid", gridTemplateColumns: "84px 1fr 80px",
              background: C.cream, border: `2px solid ${C.ink}`,
              transform: `rotate(${i % 2 === 0 ? -0.8 : 0.6}deg)`,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.1)", position: "relative",
            }}>
              <div style={{ padding: 10, borderRight: `2px dashed ${C.ink}`, display: "flex", flexDirection: "column", justifyContent: "space-between", background: C.paperWarm }}>
                <div style={{ fontFamily: C.mono, fontSize: 8, color: C.red, letterSpacing: 1.6, textTransform: "uppercase" }}>✦ ADMIT</div>
                <div style={{ fontFamily: C.display, fontSize: 32, fontStyle: "italic", color: C.red, lineHeight: 1 }}>{m.rating.toFixed(1)}</div>
                <div style={{ fontFamily: C.mono, fontSize: 7, letterSpacing: 0.8, color: C.ink }}>{m.date}</div>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: C.display, fontSize: 20, fontStyle: "italic", lineHeight: 1 }}>{m.title}</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.ink60, marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>{m.director} · {m.year}</div>
                <div style={{ fontFamily: C.hand, fontSize: 18, color: C.blue, marginTop: 8, lineHeight: 1.15 }}>{m.note}</div>
              </div>
              <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {window.MOVIES.map((m, i) => (
            <div key={m.title} style={{ background: C.cream, border: `2px solid ${C.ink}`, padding: 10, transform: `rotate(${(i % 3 - 1) * 0.5}deg)`, boxShadow: "4px 4px 0 rgba(0,0,0,0.08)" }}>
              <div style={{ position: "relative" }}>
                <img src={m.src} alt="" style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block", filter: "contrast(1.08) saturate(0.9)", mixBlendMode: "multiply" }}/>
                <div style={{ position: "absolute", top: 8, right: 8, background: C.red, color: C.cream, fontFamily: C.display, fontSize: 14, fontStyle: "italic", padding: "2px 8px", transform: "rotate(4deg)" }}>★ {m.rating}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: C.display, fontSize: 16, fontStyle: "italic", lineHeight: 1.05 }}>{m.title}</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.ink60, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{m.director} · {m.year}</div>
                <div style={{ fontFamily: C.hand, fontSize: 16, color: C.blue, marginTop: 6, lineHeight: 1.1 }}>"{m.note}"</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {moviesVariant === "reel" && (
        <div>
          <div style={{ background: C.ink, padding: "14px 10px", display: "flex", gap: 4, position: "relative", transform: "rotate(-1deg)" }}>
            <div style={{ position: "absolute", top: 3, left: 0, right: 0, display: "flex", gap: 14, padding: "0 12px" }}>
              {Array.from({length:30}).map((_,i) => <div key={i} style={{ width: 9, height: 7, background: C.cream, borderRadius: 1 }}/>)}
            </div>
            <div style={{ position: "absolute", bottom: 3, left: 0, right: 0, display: "flex", gap: 14, padding: "0 12px" }}>
              {Array.from({length:30}).map((_,i) => <div key={i} style={{ width: 9, height: 7, background: C.cream, borderRadius: 1 }}/>)}
            </div>
            <div style={{ marginTop: 14, marginBottom: 14, display: "flex", gap: 4, width: "100%" }}>
              {window.MOVIES.map(m => (
                <img key={m.title} src={m.src} alt="" style={{ flex: 1, aspectRatio: "2/3", objectFit: "cover", width: 0 }}/>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {window.MOVIES.map(m => (
              <div key={m.title}>
                <div style={{ fontFamily: C.display, fontSize: 18, fontStyle: "italic", lineHeight: 1.05 }}>{m.title}</div>
                <div style={{ fontFamily: C.hand, fontSize: 18, color: C.blue, lineHeight: 1 }}>★ {m.rating} — {m.director}</div>
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
function AboutC() {
  const socials = [
    { l: "Instagram", h: "@lucy.gai" },
    { l: "Letterboxd", h: "lucy_gai" },
    { l: "Spotify", h: "charlottefour" },
    { l: "Twitch", h: "88lucie" },
    { l: "Email", h: "hello@lucygai.com" },
  ];
  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC active="About" />
      <Halftone color="blue" style={{ top: 200, right: -80, width: 380, height: 380, opacity: 0.3, borderRadius: 999 }}/>

      <div style={{ position: "absolute", top: 130, left: 40, right: 40, bottom: 60, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40 }}>
        <div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>CHAPTER ⑤ — ABOUT</div>
          <div style={{ fontFamily: C.display, fontSize: 72, lineHeight: 0.95, letterSpacing: -1.6 }}>
            a few things<br/><span style={{ fontStyle: "italic" }}>about me</span>
            <span style={{ color: C.red, fontFamily: C.hand, fontSize: 60, marginLeft: 10 }}>↓</span>
          </div>
          <div style={{ marginTop: 24, fontFamily: C.display, fontSize: 20, lineHeight: 1.4, color: C.ink, maxWidth: 480 }}>
            I'm a software engineer in San Francisco. I make tools at a small startup, watch too many movies, travel whenever I can, and keep lists of things I like. This site is for keeping it all together.
          </div>

          <div style={{ marginTop: 32, display: "inline-block", position: "relative", background: C.cream, border: `2px solid ${C.ink}`, padding: 16, transform: "rotate(-1.5deg)", boxShadow: "4px 4px 0 rgba(0,0,0,0.1)" }}>
            <TapeStrip style={{ top: -10, left: 20, transform: "rotate(-6deg)", width: 70, height: 18 }}/>
            <div style={{ fontFamily: C.hand, fontSize: 22, color: C.red, marginBottom: 6 }}>currently —</div>
            <div style={{ fontFamily: C.display, fontSize: 16, lineHeight: 1.7 }}>
              <div>reading <em>A Little Life</em></div>
              <div>listening to Knock2</div>
              <div>planning Tokyo → Sept</div>
              <div>shipping this site</div>
            </div>
          </div>
        </div>

        {/* Contacts as zine cutouts */}
        <div style={{ position: "relative" }}>
          <TapeStrip style={{ top: -14, left: 40, transform: "rotate(-4deg)" }}/>
          <TapeStrip style={{ top: -14, right: 40, transform: "rotate(6deg)" }}/>
          <div style={{ background: C.cream, border: `2px solid ${C.ink}`, padding: 20, transform: "rotate(1.5deg)", boxShadow: "6px 6px 0 rgba(0,0,0,0.12)" }}>
            <div style={{ fontFamily: C.display, fontSize: 28, fontStyle: "italic", color: C.red }}>Say hi! —</div>
            <div style={{ fontFamily: C.hand, fontSize: 22, color: C.blue, marginTop: -4 }}>(I read every note)</div>
            <div style={{ marginTop: 16, borderTop: `2px solid ${C.ink}` }}>
              {socials.map((s, i) => (
                <div key={s.l} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 16,
                  padding: "12px 0", borderBottom: `1px dashed ${C.hair}`,
                  alignItems: "baseline",
                }}>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.ink60, letterSpacing: 1.4, textTransform: "uppercase" }}>{s.l}</span>
                  <span style={{ fontFamily: C.display, fontSize: 18, fontStyle: "italic" }}>{s.h}</span>
                  <span style={{ fontFamily: C.hand, fontSize: 20, color: C.red }}>↗</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", bottom: -20, right: 20, fontFamily: C.hand, fontSize: 26, color: C.ink, transform: "rotate(-4deg)" }}>
            — yours, L.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Blog
// ============================================================
function BlogC() {
  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC active="Blog" />

      <div style={{ position: "absolute", top: 130, left: 40, right: 40 }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>CHAPTER ① — BLOG</div>
        <div style={{ fontFamily: C.display, fontSize: 96, lineHeight: 0.9, letterSpacing: -2 }}>
          <RisoText color={C.red} offset={3}>notes</RisoText>, <span style={{ fontStyle: "italic" }}>slowly.</span>
        </div>
        <div style={{ fontFamily: C.hand, fontSize: 22, color: C.blue, marginTop: 4, transform: "rotate(-1deg)", display: "inline-block" }}>written when I have something to say ✦</div>
      </div>

      <div style={{ position: "absolute", top: 310, left: 40, right: 40, bottom: 60, overflow: "hidden" }}>
        {/* Featured */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ background: C.cream, border: `2px solid ${C.ink}`, padding: 20, transform: "rotate(-0.6deg)", boxShadow: "4px 4px 0 rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 9, color: C.red, letterSpacing: 1.4, textTransform: "uppercase" }}>
              <span>★ FEATURED</span>
              <span>{window.POSTS[0].date}</span>
            </div>
            <div style={{ fontFamily: C.display, fontSize: 40, fontStyle: "italic", lineHeight: 1, marginTop: 10 }}>{window.POSTS[0].title}</div>
            <div style={{ fontFamily: C.display, fontSize: 15, color: C.ink, marginTop: 10, lineHeight: 1.45 }}>{window.POSTS[0].excerpt}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
              {window.POSTS[0].tags.map(t => (
                <span key={t} style={{ fontFamily: C.mono, fontSize: 8, background: C.ink, color: C.cream, padding: "2px 6px", letterSpacing: 1 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", background: C.paperWarm, border: `2px solid ${C.ink}`, padding: 14, transform: "rotate(1deg)" }}>
            <Halftone color="red" style={{ inset: 0, opacity: 0.45 }}/>
            <div style={{ position: "relative", fontFamily: C.display, fontSize: 32, fontStyle: "italic", color: C.ink, lineHeight: 1 }}>latest</div>
            <div style={{ position: "relative", fontFamily: C.hand, fontSize: 24, color: C.blue, marginTop: 6 }}>est. from inside a small room</div>
            <div style={{ position: "absolute", bottom: 14, right: 14, fontFamily: C.display, fontSize: 60, color: C.ink, lineHeight: 1 }}>→</div>
          </div>
        </div>

        {window.POSTS.slice(1).map((p, i) => (
          <div key={p.title} style={{ display: "grid", gridTemplateColumns: "100px 1fr 140px", gap: 20, padding: "12px 0", borderBottom: `1px dashed ${C.ink60}`, alignItems: "baseline" }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.ink60, letterSpacing: 1.2, textTransform: "uppercase" }}>{p.date}</div>
            <div>
              <div style={{ fontFamily: C.display, fontSize: 22, fontStyle: "italic", lineHeight: 1.05 }}>{p.title}</div>
              <div style={{ fontFamily: C.display, fontSize: 13, color: C.ink60, marginTop: 4 }}>{p.excerpt}</div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {p.tags.map(t => <span key={t} style={{ fontFamily: C.mono, fontSize: 8, border: `1px solid ${C.ink}`, padding: "2px 6px", letterSpacing: 1 }}>{t}</span>)}
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
function ProjectsC() {
  return (
    <div className="ab-root paper-c grain" style={{ color: C.ink, fontFamily: C.display }}>
      <NavC active="Projects" />
      <Halftone color="red" style={{ top: 230, right: -80, width: 360, height: 360, opacity: 0.3, borderRadius: 999 }}/>

      <div style={{ position: "absolute", top: 130, left: 40, right: 40 }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>CHAPTER ② — PROJECTS</div>
        <div style={{ fontFamily: C.display, fontSize: 90, lineHeight: 0.9, letterSpacing: -2 }}>
          things <span style={{ fontStyle: "italic" }}>i</span>
          <RisoText color={C.blue} offset={3} style={{ marginLeft: 16 }}>  made.</RisoText>
        </div>
      </div>

      <div style={{ position: "absolute", top: 290, left: 40, right: 40, bottom: 60, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {window.PROJECTS.map((p, i) => (
          <div key={p.name} style={{
            position: "relative", background: C.cream, border: `2px solid ${C.ink}`, padding: 16,
            transform: `rotate(${(i % 3 - 1) * 0.7}deg)`, boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
            display: "flex", flexDirection: "column",
          }}>
            <TapeStrip style={{ top: -12, left: 40, transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`, width: 60, height: 18 }}/>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 9, color: C.ink60, letterSpacing: 1, textTransform: "uppercase" }}>
              <span>{p.year}</span>
              <span>№ {String(i+1).padStart(2,"0")}</span>
            </div>
            <div style={{ fontFamily: C.display, fontSize: 30, fontStyle: "italic", lineHeight: 1, marginTop: 10 }}>
              <RisoText color={i % 2 === 0 ? C.red : C.blue} offset={2}>{p.name}</RisoText>
            </div>
            <div style={{ fontFamily: C.hand, fontSize: 18, color: C.blue, marginTop: 2 }}>{p.role}</div>
            <div style={{ flex: 1 }}/>
            <div style={{ marginTop: 14, borderTop: `1px dashed ${C.ink}`, paddingTop: 10 }}>
              <div style={{ fontFamily: C.display, fontSize: 14 }}>{p.kind}</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.ink60, marginTop: 4 }}>{p.stack.join(" · ")}</div>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.red, letterSpacing: 1.4, textTransform: "uppercase" }}>● {p.status}</span>
              <span style={{ fontFamily: C.hand, fontSize: 22, color: C.ink }}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeC, TravelsC, FavoritesC, AboutC, BlogC, ProjectsC });
