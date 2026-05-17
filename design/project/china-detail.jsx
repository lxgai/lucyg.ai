// China '24 — chosen detail-page design.
// Hybrid: V2's hero header (title block + tilted lake polaroid + intro + stars cutout)
// stitched to V3's city spreads (large bg numerals, alternating tilted polaroids,
// cutouts, washi tape, handwritten captions). Chongqing flipped right-aligned so
// the city headers read left → right → left across the page.
//
// Wrapped in an IIFE — locals (A, CHINA, primitives) are pulled from the
// CN_-prefixed globals exposed by china-detail-shared.jsx.
(function () {
const {
  CN_A: A, CHINA,
  CN_Hair: Hair, CN_Crumb: Crumb,
  CN_Photo: Photo, CN_Cutout: Cutout,
  CN_useLightbox: useLightbox,
} = window;

function ChinaDetail() {
  const { setOpen, Lightbox } = useLightbox();

  return (
    <div className="paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      {/* ── Top crumb strip ──────────────────────────────────── */}
      <div style={{ padding: "24px 48px 0" }}>
        <Hair color={A.hairStrong} />
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60,
          padding: "8px 0", textTransform: "uppercase",
        }}>
          <Crumb>China '24</Crumb>
          <span>14 days · 3 cities · {CHINA.dates}</span>
        </div>
        <Hair color={A.hairStrong} />
      </div>

      {/* ── Hero (V2-style: tilted polaroid left, title block right) ── */}
      <HeroV2Style onOpen={setOpen} />

      {/* ── City spreads (V3-style with alternating alignment) ─────── */}
      <div style={{ padding: "60px 48px 0" }}>
        {CHINA.cities.map((city, idx) => (
          <CitySpread
            key={city.no}
            city={city}
            idx={idx}
            align={idx === 1 ? "right" : "left"}
            onOpen={setOpen}
          />
        ))}
      </div>

      {/* ── Closing: family polaroid + handwritten note ─────────────── */}
      <Closing onOpen={setOpen} />

      {Lightbox}
    </div>
  );
}

// ============================================================
// Hero — copied straight from V2's first section
// ============================================================
function HeroV2Style({ onOpen }) {
  return (
    <div style={{ padding: "32px 48px 0", position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 36, alignItems: "start" }}>
        {/* Hero photo — tilted, with washi tape */}
        <div style={{ position: "relative", transform: "rotate(-0.6deg)" }}>
          <div style={{
            background: A.paperWarm, border: `1px solid ${A.hairStrong}`,
            padding: 12, boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
          }}>
            <Photo src={CHINA.hero} caption="West Lake, Hangzhou — first morning."
              onOpen={onOpen} style={{ width: "100%", aspectRatio: "3/2" }} />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 14 }}>
                West Lake, Hangzhou — first morning.
              </div>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.ink40, letterSpacing: 1.2, textTransform: "uppercase" }}>
                07.06.24
              </div>
            </div>
          </div>
          {/* Washi tape top-left */}
          <div style={{
            position: "absolute", top: -10, left: 60, width: 140, height: 26,
            background: A.tape, borderTop: "1px dashed rgba(180, 140, 80, 0.4)", borderBottom: "1px dashed rgba(180, 140, 80, 0.4)",
            transform: "rotate(-6deg)",
          }} />
          {/* Washi tape bottom-right */}
          <div style={{
            position: "absolute", bottom: 20, right: -16, width: 120, height: 24,
            background: A.tapeRed, borderTop: "1px dashed rgba(180, 100, 90, 0.4)", borderBottom: "1px dashed rgba(180, 100, 90, 0.4)",
            transform: "rotate(8deg)",
          }} />
        </div>

        {/* Title block */}
        <div style={{ paddingTop: 6 }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase" }}>
            Section B · Travels № {CHINA.no}
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 88, lineHeight: 0.92, letterSpacing: -2, marginTop: 6 }}>
            <span style={{ fontStyle: "italic" }}>China,</span><br />
            <span style={{ color: A.ink60 }}>summer ’24.</span>
          </div>

          {/* Intro paragraph with stars cutout floating */}
          <div style={{ position: "relative", marginTop: 22 }}>
            <div style={{ fontFamily: A.serif, fontSize: 17, lineHeight: 1.55, color: A.ink70, textWrap: "pretty", maxWidth: 420 }}>
              {CHINA.intro}
            </div>
            <img src="images/travels/china-24/stars-purple.png" alt="" style={{
              position: "absolute", top: -34, right: -20, width: 92, height: "auto",
              opacity: 0.85, transform: "rotate(8deg)", pointerEvents: "none",
            }} />
          </div>

          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "auto auto auto", gap: "4px 24px", fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase", maxWidth: 480 }}>
            <span>14 days</span><span>·</span><span>{CHINA.subtitle}</span>
            <span>Weather</span><span>·</span><span>Warm, humid, occasional rain — 32°C avg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// City spread — V3 collage with per-city alignment
// ============================================================
function CitySpread({ city, idx, align, onOpen }) {
  const isRight = align === "right";

  return (
    <div style={{ position: "relative", marginBottom: 48, minHeight: 560 }}>
      {/* Background numeral */}
      <div style={{
        position: "absolute",
        top: -18,
        left: isRight ? "auto" : -8,
        right: isRight ? -8 : "auto",
        fontFamily: A.serif, fontSize: 220, lineHeight: 0.85,
        color: "rgba(31, 26, 22, 0.06)", letterSpacing: -8, fontWeight: 500,
        pointerEvents: "none",
      }}>
        {city.no}
      </div>

      {/* Header — direction-aware */}
      {isRight ? (
        <RightAlignedHeader city={city} />
      ) : (
        <LeftAlignedHeader city={city} />
      )}

      {/* Collage area */}
      {idx === 0 && <CollageHangzhou city={city} onOpen={onOpen} />}
      {idx === 1 && <CollageChongqing city={city} onOpen={onOpen} />}
      {idx === 2 && <CollageWulong city={city} onOpen={onOpen} />}
    </div>
  );
}

function LeftAlignedHeader({ city }) {
  return (
    <>
      <div style={{
        position: "relative", display: "flex", alignItems: "baseline",
        gap: 18, marginBottom: 4, paddingLeft: 110,
      }}>
        <div style={{ fontFamily: A.serif, fontSize: 76, lineHeight: 1, letterSpacing: -1.6, fontStyle: "italic" }}>
          {city.name}
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 42, color: A.ink60, letterSpacing: 2 }}>{city.pinyin}</div>
        <div style={{ fontFamily: A.hand, fontSize: 26, color: A.cinnabar, marginLeft: 8, transform: "rotate(-2deg)" }}>
          {city.days.toLowerCase()}
        </div>
      </div>
      <div style={{
        fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40,
        textTransform: "uppercase", paddingLeft: 110, marginBottom: 20,
      }}>
        {city.coords} · {city.latin}
      </div>
    </>
  );
}

function RightAlignedHeader({ city }) {
  return (
    <>
      <div style={{
        position: "relative", display: "flex", alignItems: "baseline",
        gap: 18, marginBottom: 4, paddingRight: 110, justifyContent: "flex-end",
      }}>
        {/* Order in DOM = visual order from left to right when right-aligned */}
        <div style={{ fontFamily: A.hand, fontSize: 26, color: A.cinnabar, marginRight: 8, transform: "rotate(-2deg)" }}>
          {city.days.toLowerCase()}
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 42, color: A.ink60, letterSpacing: 2 }}>{city.pinyin}</div>
        <div style={{ fontFamily: A.serif, fontSize: 76, lineHeight: 1, letterSpacing: -1.6, fontStyle: "italic" }}>
          {city.name}
        </div>
      </div>
      <div style={{
        fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40,
        textTransform: "uppercase", paddingRight: 110, marginBottom: 20, textAlign: "right",
      }}>
        {city.latin} · {city.coords}
      </div>
    </>
  );
}

// ============================================================
// Collages — copied from V3 (chongqing internals untouched; the
// flipped header is enough to create the L-R-L rhythm)
// ============================================================
function CollageHangzhou({ city, onOpen }) {
  const lake = city.photos[0];
  const dumplings = city.photos[1];

  return (
    <div style={{ position: "relative", height: 420 }}>
      <div style={{
        position: "absolute", top: 0, left: 40, width: 520, transform: "rotate(-1.8deg)",
        background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
      }}>
        <Photo src={lake.src} caption={lake.caption} onOpen={onOpen}
          style={{ width: "100%", aspectRatio: "3/2" }} />
        <div style={{ marginTop: 8, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
          西湖 — lotus the size of dinner plates
        </div>
      </div>
      <div style={{ position: "absolute", top: -8, left: 280, width: 130, height: 24, background: A.tape, transform: "rotate(-6deg)" }} />

      <div style={{ position: "absolute", top: 80, right: 40, width: 320, transform: "rotate(5deg)", cursor: "zoom-in" }}>
        <Cutout src={dumplings.src} caption={dumplings.caption} onOpen={onOpen}
          style={{ width: "100%", height: "auto", aspectRatio: "4/3" }} />
        <div style={{ textAlign: "center", marginTop: 6, fontFamily: A.hand, fontSize: 22, color: A.cinnabar, transform: "rotate(-3deg)" }}>
          crab-roe dumplings !!!
        </div>
      </div>

      <img src="images/travels/china-24/stars-purple.png" alt="" style={{
        position: "absolute", bottom: 30, left: 280, width: 80, transform: "rotate(20deg)", opacity: 0.9, pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: 40, width: 360,
        fontFamily: A.serif, fontSize: 15, lineHeight: 1.5, color: A.ink70, fontStyle: "italic",
      }}>
        {city.blurb}
      </div>
    </div>
  );
}

function CollageChongqing({ city, onOpen }) {
  const [hongyadong, xiaomian, coconut] = city.photos;

  return (
    <div style={{ position: "relative", height: 560 }}>
      <div style={{
        position: "absolute", top: 0, right: 40, width: 320, transform: "rotate(2.4deg)",
        background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
      }}>
        <Photo src={hongyadong.src} caption={hongyadong.caption} onOpen={onOpen}
          style={{ width: "100%", aspectRatio: "3/4" }} />
        <div style={{ marginTop: 8, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
          Hongyadong, 8:42pm
        </div>
      </div>
      <div style={{ position: "absolute", top: -10, right: 200, width: 130, height: 22, background: A.tapeRed, transform: "rotate(-4deg)" }} />

      <div style={{ position: "absolute", top: 20, left: 40, width: 360, transform: "rotate(-3deg)", cursor: "zoom-in" }}>
        <Cutout src={xiaomian.src} caption={xiaomian.caption} onOpen={onOpen}
          style={{ width: "100%", height: "auto", aspectRatio: "5/4" }} />
        <div style={{ textAlign: "left", marginTop: 4, fontFamily: A.hand, fontSize: 22, color: A.cinnabar }}>
          xiaomian — small noodles, very big heat 🔥
        </div>
      </div>

      <div style={{ position: "absolute", top: 240, left: 440, width: 90, transform: "rotate(8deg)", cursor: "zoom-in" }}>
        <Cutout src={coconut.src} caption={coconut.caption} onOpen={onOpen}
          style={{ width: "100%", height: "auto", aspectRatio: "1/2.5" }} />
        <div style={{ textAlign: "center", marginTop: 4, fontFamily: A.hand, fontSize: 16, color: A.ink, lineHeight: 1.1, transform: "rotate(-3deg)" }}>
          coconut tree<br />(245ml)
        </div>
      </div>

      <div style={{
        position: "absolute", top: 340, left: 380, fontFamily: A.hand, fontSize: 20, color: A.cinnabar, transform: "rotate(-6deg)",
      }}>
        ← cried a little
      </div>

      <div style={{
        position: "absolute", bottom: 18, right: 80, width: 360,
        fontFamily: A.serif, fontSize: 15, lineHeight: 1.5, color: A.ink70, fontStyle: "italic", textAlign: "right",
      }}>
        {city.blurb}
      </div>
    </div>
  );
}

function CollageWulong({ city, onOpen }) {
  const [bridges, jiuli] = city.photos;

  return (
    <div style={{ position: "relative", height: 540 }}>
      <div style={{
        position: "absolute", top: 0, left: 60, width: 280, transform: "rotate(-2deg)",
        background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
      }}>
        <Photo src={bridges.src} caption={bridges.caption} onOpen={onOpen}
          style={{ width: "100%", aspectRatio: "3/4" }} />
        <div style={{ marginTop: 8, fontFamily: A.hand, fontSize: 21, color: A.ink, lineHeight: 1 }}>
          Three Natural Bridges → look at the tiny people!
        </div>
      </div>
      <div style={{ position: "absolute", top: -10, left: 180, width: 110, height: 22, background: A.tape, transform: "rotate(-4deg)" }} />

      <div style={{
        position: "absolute", top: 70, right: 40, width: 420, transform: "rotate(2.2deg)",
        background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
      }}>
        <Photo src={jiuli.src} caption={jiuli.caption} onOpen={onOpen}
          style={{ width: "100%", aspectRatio: "4/3" }} />
        <div style={{ marginTop: 8, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
          Jiuli — half real, half theme park
        </div>
      </div>
      <div style={{ position: "absolute", top: 62, right: 180, width: 130, height: 22, background: A.tapeRed, transform: "rotate(6deg)" }} />

      <img src="images/travels/china-24/stars-purple.png" alt="" style={{
        position: "absolute", top: 360, left: 360, width: 70, transform: "rotate(-30deg)", opacity: 0.95, pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", bottom: 8, left: 60, width: 340,
        fontFamily: A.serif, fontSize: 15, lineHeight: 1.5, color: A.ink70, fontStyle: "italic",
      }}>
        {city.blurb}
      </div>
    </div>
  );
}

// ============================================================
// Closing — family polaroid + handwritten note
// ============================================================
function Closing({ onOpen }) {
  return (
    <div style={{ padding: "8px 48px 32px" }}>
      <Hair color={A.hairStrong} />
      <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase", marginTop: 18, textAlign: "center" }}>
        End of file — China '24
      </div>
      <div style={{ fontFamily: A.serif, fontSize: 36, fontStyle: "italic", marginTop: 6, color: A.ink, textAlign: "center" }}>
        See you next summer.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginTop: 32 }}>
        {/* Family polaroid */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", transform: "rotate(-1.6deg)" }}>
            <div style={{
              background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
              boxShadow: "0 14px 30px rgba(0,0,0,0.12)", width: 320,
            }}>
              <div style={{ width: "100%", aspectRatio: "1/1", background: A.paperDeep, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cutout src={CHINA.family.src} caption={CHINA.family.caption} onOpen={onOpen}
                  style={{ width: "92%", height: "92%" }} imgStyle={{ filter: "none" }} />
              </div>
              <div style={{ marginTop: 10, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
                the three of us, somewhere in Wulong ✿
              </div>
            </div>
            <div style={{
              position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(2deg)",
              width: 120, height: 22, background: A.tape,
            }} />
          </div>
        </div>

        {/* Handwritten note */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: "rotate(1.4deg)" }}>
            <div style={{
              width: 380, background: A.washiCream, padding: "20px 24px",
              border: `1px solid rgba(180, 140, 80, 0.4)`,
              boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
            }}>
              <div style={{ fontFamily: A.hand, fontSize: 30, color: A.ink, lineHeight: 1.1 }}>
                note to future me:
              </div>
              <div style={{ fontFamily: A.hand, fontSize: 22, color: A.ink70, lineHeight: 1.3, marginTop: 10 }}>
                you didn't take enough photos of the food. take more next time. also, learn to read the menu — pointing only gets you so far.
              </div>
              <div style={{ marginTop: 14, fontFamily: A.serif, fontStyle: "italic", fontSize: 13, color: A.ink60 }}>
                — Lucy, somewhere over the Pacific
              </div>
            </div>
            <div style={{
              position: "absolute", top: -8, left: 60, width: 100, height: 22,
              background: A.tapeRed, transform: "rotate(-4deg)",
            }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Hair color={A.hairStrong} style={{ marginTop: 40 }} />
      <div style={{
        display: "flex", justifyContent: "space-between", paddingTop: 10,
        fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase",
      }}>
        <span>Fig. C.{CHINA.no} — China '24</span>
        <span>Next: Japan '24 →</span>
        <span>▲ to top</span>
      </div>
    </div>
  );
}

// ============================================================
// PageChinaDetail — prototype-integrated wrapper.
// Renders the prototype's sticky Nav + a back link + the rich
// scrapbook detail. Used for the `travels/china-24` route.
// ============================================================
function PageChinaDetail({ route, setRoute, theme }) {
  const Nav = window.Nav;
  return (
    <div className="page-fade paper-a" style={{ minHeight: "100vh", background: A.paper, color: A.ink, fontFamily: A.serif }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />

      {/* Back link sitting above the archive strip */}
      <div className="m-page-pad" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "20px 48px 0",
      }}>
        <span onClick={() => setRoute("travels")} style={{
          fontFamily: A.mono, fontSize: 10, color: A.ink60, letterSpacing: 1.4,
          textTransform: "uppercase", cursor: "pointer",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = A.ink60}
        >← back to travels</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <ChinaDetail />
      </div>
    </div>
  );
}

Object.assign(window, { ChinaDetail, PageChinaDetail });
})();
