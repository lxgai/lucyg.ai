// Earlier explorations (V1, V2, V3) — kept for record-keeping.
// The chosen design lives in china-detail.jsx.
//
// Wrapped in an IIFE — locals (A, CHINA, primitives) are pulled from the
// CN_-prefixed globals exposed by china-detail-shared.jsx.
(function () {
const {
  CN_A: A, CHINA,
  CN_NavBar: NavBar, CN_Hair: Hair, CN_ArchiveStrip: ArchiveStrip,
  CN_Crumb: Crumb, CN_CatTag: CatTag,
  CN_Photo: Photo, CN_Cutout: Cutout,
  CN_useLightbox: useLightbox,
} = window;

// Variation 1 — "Field Notes" (REJECTED — kept for record-keeping)
// Pure archive aesthetic: catalog header, photos straightened with serial captions,
// cutouts presented as taxonomy plates. The most restrained of the three.

function ChinaV1() {
  const { setOpen, Lightbox } = useLightbox();
  

  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavBar active="Travels" />

      {/* ── Archive header strip ─────────────────────────────── */}
      <div style={{ padding: "96px 48px 0" }}>
        <ArchiveStrip />
      </div>

      {/* ── Hero plate ─────────────────────────────────────── */}
      <div style={{ padding: "24px 48px 0", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <Crumb>China '24</Crumb>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <div style={{ fontFamily: A.serif, fontSize: 96, lineHeight: 0.92, letterSpacing: -2.2 }}>
                <span style={{ fontStyle: "italic" }}>China,</span> 2024
              </div>
              <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60, textTransform: "uppercase" }}>
                Cat. {CHINA.cat} · № {CHINA.no}
              </div>
            </div>
            <div style={{ fontFamily: A.serif, fontSize: 22, fontStyle: "italic", color: A.ink60, marginTop: 10 }}>
              {CHINA.subtitle} · 14 days, three weather systems
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 32, alignSelf: "end" }}>
          <Hair color={A.hairStrong} />
          <div style={{ padding: "10px 0" }}>
            {CHINA.meta.map((m, i) => (
              <div key={m.k} style={{
                display: "grid", gridTemplateColumns: "90px 1fr", gap: 12,
                padding: "5px 0", fontFamily: A.mono, fontSize: 11,
                borderBottom: i < CHINA.meta.length - 1 ? `1px dashed ${A.hair}` : "none",
              }}>
                <span style={{ color: A.ink40, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase" }}>{m.k}</span>
                <span style={{ color: A.ink, fontFamily: A.serif, fontSize: 14 }}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero photograph ────────────────────────────────── */}
      <div style={{ padding: "28px 48px 0" }}>
        <div style={{ position: "relative", border: `1px solid ${A.hairStrong}`, padding: 10, background: A.paperWarm }}>
          <Photo
            src={CHINA.hero}
            caption="West Lake, Hangzhou — first morning, before the heat."
            onOpen={setOpen}
            style={{ width: "100%", aspectRatio: "16/7" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, fontFamily: A.mono, fontSize: 10, letterSpacing: 1.2, color: A.ink60, textTransform: "uppercase" }}>
            <span>Plate I — West Lake, Hangzhou</span>
            <span>30.27°N · 120.15°E · 07.06.24</span>
            <span>NEG. 001</span>
          </div>
        </div>
      </div>

      {/* ── Intro paragraph ────────────────────────────────── */}
      <div style={{ padding: "36px 48px 0", display: "grid", gridTemplateColumns: "120px 1fr 200px", gap: 32 }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.rust, textTransform: "uppercase", paddingTop: 8 }}>
          ENTRY 001 · Summer
        </div>
        <div style={{
          fontFamily: A.serif, fontSize: 21, lineHeight: 1.55, color: A.ink70,
          maxWidth: 640, textWrap: "pretty",
        }}>
          <span style={{ fontFamily: A.serif, fontSize: 36, lineHeight: 1, float: "left", marginRight: 8, marginTop: 6, color: A.ink }}>T</span>
          {CHINA.intro.slice(1)}
        </div>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40, textAlign: "right", textTransform: "uppercase", paddingTop: 8 }}>
          Filed by L. Gai<br/>{CHINA.dates}
        </div>
      </div>

      {/* ── City sections ─────────────────────────────────── */}
      <div style={{ padding: "56px 48px 0" }}>
        {CHINA.cities.map((city, idx) => (
          <CityPlateV1 key={city.no} city={city} idx={idx} onOpen={setOpen} />
        ))}
      </div>

      {/* ── Family portrait closing ───────────────────────── */}
      <div style={{ padding: "8px 48px 32px", display: "grid", gridTemplateColumns: "360px 1fr", gap: 36, alignItems: "center" }}>
        <div style={{ background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 14 }}>
          <div style={{ width: "100%", aspectRatio: "4/5", background: A.paperDeep, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Cutout src={CHINA.family.src} caption={CHINA.family.caption} onOpen={setOpen}
              style={{ width: "90%", height: "92%" }} imgStyle={{ filter: "none" }} />
          </div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 15 }}>Portrait — group</div>
            <CatTag cat="C.fam" no="001" />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.rust, textTransform: "uppercase", marginBottom: 12 }}>
            Plate VII · CLOSING
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 36, lineHeight: 1.15, letterSpacing: -0.5, color: A.ink }}>
            <span style={{ fontStyle: "italic" }}>"</span>The first trip in a long while where I didn't have to be in charge of anything<span style={{ fontStyle: "italic" }}>."</span>
          </div>
          <Hair style={{ margin: "18px 0" }} />
          <div style={{ fontFamily: A.serif, fontSize: 14, color: A.ink60, lineHeight: 1.5, maxWidth: 520, fontStyle: "italic" }}>
            {CHINA.family.caption} I keep this one on the fridge.
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div style={{ padding: "12px 48px 28px" }}>
        <Hair color={A.hairStrong} />
        <div style={{
          display: "flex", justifyContent: "space-between", paddingTop: 10,
          fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase",
        }}>
          <span>Fig. C.{CHINA.no} — China '24</span>
          <span>Next: Japan '24 →</span>
          <span>▲ to top</span>
        </div>
      </div>

      {Lightbox}
    </div>
  );
}

// City plate — Field Notes
function CityPlateV1({ city, idx, onOpen }) {
  

  return (
    <div style={{ marginBottom: 56 }}>
      {/* Section header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase", marginBottom: 4 }}>
            {city.no} · CITY
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div style={{ fontFamily: A.serif, fontSize: 56, lineHeight: 1, letterSpacing: -1 }}>
              <span style={{ fontStyle: "italic" }}>{city.name}</span>
            </div>
            <div style={{ fontFamily: A.serif, fontSize: 28, color: A.ink60, letterSpacing: 2 }}>{city.pinyin}</div>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40, textTransform: "uppercase" }}>
              / {city.latin}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase" }}>
          <div>{city.coords}</div>
          <div style={{ marginTop: 2 }}>{city.days}</div>
        </div>
      </div>
      <Hair color={A.hairStrong} />

      {/* Body: blurb + photo grid */}
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "320px 1fr", gap: 32 }}>
        <div>
          <div style={{ fontFamily: A.serif, fontSize: 17, lineHeight: 1.55, color: A.ink70, fontStyle: "italic", textWrap: "pretty" }}>
            {city.blurb}
          </div>
          {/* Cutouts as taxonomy plates */}
          {city.cutouts && city.cutouts.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, color: A.ink40, textTransform: "uppercase", marginBottom: 8 }}>
                Specimens — collected
              </div>
              <div style={{ display: "grid", gridTemplateColumns: city.cutouts.length > 1 ? "repeat(2, 1fr)" : "1fr", gap: 8 }}>
                {city.cutouts.map(c => (
                  <div key={c.no} style={{
                    background: A.paperWarm, border: `1px solid ${A.hairStrong}`,
                    padding: 10, display: "flex", flexDirection: "column", alignItems: "center",
                  }}>
                    <div style={{
                      width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
                      background: `repeating-linear-gradient(45deg, ${A.paperDeep}, ${A.paperDeep} 2px, ${A.paperWarm} 2px, ${A.paperWarm} 8px)`,
                    }}>
                      <Cutout src={c.src} onOpen={onOpen} caption={c.label}
                        style={{ width: "82%", height: "82%" }} />
                    </div>
                    <div style={{ marginTop: 8, width: "100%", display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 8, letterSpacing: 1.2, color: A.ink60, textTransform: "uppercase" }}>
                      <span style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 11, textTransform: "none", letterSpacing: 0, color: A.ink }}>{c.label}</span>
                      <span>№ {c.no}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridAutoRows: "minmax(180px, auto)", gap: 14 }}>
          {city.photos.filter(p => !p.cutout).map((p, i) => (
            <div key={p.src} style={{
              background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 8,
              gridColumn: city.photos.filter(x => !x.cutout).length === 1 ? "span 2" : "span 1",
            }}>
              <Photo src={p.src} caption={p.caption} onOpen={onOpen}
                style={{ width: "100%", aspectRatio: p.aspect || "4/3" }} />
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 12, color: A.ink, lineHeight: 1.3, maxWidth: "78%" }}>
                  {p.caption}
                </div>
                <span style={{ fontFamily: A.mono, fontSize: 8, letterSpacing: 1.2, color: A.ink40, textTransform: "uppercase" }}>
                  {city.no}.{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




// Variation 2 — "Marginalia" (REJECTED — kept for record-keeping)
// Restrained scrapbook: archive structure preserved, but with selective tape,
// tilted polaroids, hand-drawn marks in margins, and cutouts floating into whitespace.

function ChinaV2() {
  const { setOpen, Lightbox } = useLightbox();
  

  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavBar active="Travels" />

      {/* ── Top strip (lighter than V1) ──────────────────────── */}
      <div style={{ padding: "96px 48px 0" }}>
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

      {/* ── Hero spread with scrapbook moves ─────────────────── */}
      <div style={{ padding: "32px 48px 0", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 36, alignItems: "start" }}>
          {/* Hero photo, slightly tilted, with washi tape */}
          <div style={{ position: "relative", transform: "rotate(-0.6deg)" }}>
            <div style={{
              background: A.paperWarm, border: `1px solid ${A.hairStrong}`,
              padding: 12, boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
            }}>
              <Photo src={CHINA.hero} caption="West Lake, Hangzhou — first morning."
                onOpen={setOpen} style={{ width: "100%", aspectRatio: "3/2" }} />
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
              Section C · Travels № {CHINA.no}
            </div>
            <div style={{ fontFamily: A.serif, fontSize: 88, lineHeight: 0.92, letterSpacing: -2, marginTop: 6 }}>
              <span style={{ fontStyle: "italic" }}>China,</span><br />
              <span style={{ color: A.ink60 }}>summer ’24.</span>
            </div>

            {/* Heart cutout floating into the margin */}
            <div style={{ position: "relative", marginTop: 22 }}>
              <div style={{ fontFamily: A.serif, fontSize: 17, lineHeight: 1.55, color: A.ink70, textWrap: "pretty", maxWidth: 420 }}>
                {CHINA.intro}
              </div>
              {/* Stars cutout in the margin */}
              <img src="images/travels/china-24/stars-purple.png" alt="" style={{
                position: "absolute", top: -34, right: -20, width: 92, height: "auto",
                opacity: 0.85, transform: "rotate(8deg)", pointerEvents: "none",
              }} />
            </div>

            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "auto auto auto", gap: "4px 24px", fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink60, textTransform: "uppercase", maxWidth: 480 }}>
              <span>14 days</span><span>·</span><span>{CHINA.subtitle}</span>
              <span>Companions</span><span>·</span><span>Mom & Dad</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── City sections ───────────────────────────────────── */}
      <div style={{ padding: "56px 48px 0" }}>
        {CHINA.cities.map((city, idx) => (
          <CityPlateV2 key={city.no} city={city} idx={idx} onOpen={setOpen} />
        ))}
      </div>

      {/* ── Family closing — single polaroid centered ───────── */}
      <div style={{ padding: "0 48px 32px", textAlign: "center", position: "relative" }}>
        <Hair color={A.hairStrong} />
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase", marginTop: 18 }}>
          End of file — China '24
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 36, fontStyle: "italic", marginTop: 8, color: A.ink }}>
          See you next summer.
        </div>

        <div style={{ position: "relative", display: "inline-block", marginTop: 18, transform: "rotate(-1.4deg)" }}>
          <div style={{
            background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 12,
            boxShadow: "0 14px 30px rgba(0,0,0,0.12)", width: 320,
          }}>
            <div style={{ width: "100%", aspectRatio: "1/1", background: A.paperDeep, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cutout src={CHINA.family.src} caption={CHINA.family.caption} onOpen={setOpen}
                style={{ width: "92%", height: "92%" }} imgStyle={{ filter: "none" }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
              the three of us, somewhere in Wulong ✿
            </div>
          </div>
          {/* Tape */}
          <div style={{
            position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(2deg)",
            width: 120, height: 22, background: A.tape,
          }} />
        </div>
      </div>

      {Lightbox}
    </div>
  );
}

// City plate — Marginalia
function CityPlateV2({ city, idx, onOpen }) {
  
  const heroPhoto = city.photos.find(p => !p.cutout) || city.photos[0];

  // Each city tilts in a different direction
  const tilts = [-1.5, 1.2, -0.8];
  const tilt = tilts[idx % 3];

  return (
    <div style={{ marginBottom: 64, position: "relative" }}>
      {/* Section header — archive style preserved */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{
            fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase",
            borderLeft: `2px solid ${A.cinnabar}`, paddingLeft: 8,
          }}>
            City {city.no}
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 64, lineHeight: 1, letterSpacing: -1.2, fontStyle: "italic" }}>
            {city.name}
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 32, color: A.ink60, letterSpacing: 2 }}>{city.pinyin}</div>
        </div>
        <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40, textTransform: "uppercase", textAlign: "right" }}>
          <div>{city.coords}</div>
          <div style={{ marginTop: 2 }}>{city.days}</div>
        </div>
      </div>
      <Hair color={A.hair} />

      {/* Body */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, position: "relative" }}>
        {/* Left column: blurb + polaroid */}
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: A.serif, fontSize: 17, lineHeight: 1.55, color: A.ink70, textWrap: "pretty" }}>
            {city.blurb}
          </div>

          {/* Polaroid moment */}
          <div style={{ marginTop: 26, display: "inline-block", transform: `rotate(${tilt}deg)`, position: "relative" }}>
            <div style={{
              background: A.paperWarm, border: `1px solid ${A.hairStrong}`,
              padding: "12px 12px 32px", boxShadow: "0 10px 22px rgba(0,0,0,0.10)", width: 280,
            }}>
              <Photo src={heroPhoto.src} caption={heroPhoto.caption} onOpen={onOpen}
                style={{ width: "100%", aspectRatio: "1/1" }} />
              <div style={{ marginTop: 8, fontFamily: A.hand, fontSize: 22, color: A.ink, lineHeight: 1 }}>
                {idx === 0 && "西湖 — quiet morning."}
                {idx === 1 && "Hongyadong, golden hour."}
                {idx === 2 && "we are very small here."}
              </div>
            </div>
            {/* Stars-purple cutout used as a hand-drawn flair */}
            {idx === 0 && (
              <img src="images/travels/china-24/stars-purple.png" alt="" style={{
                position: "absolute", top: -22, right: -28, width: 64, transform: "rotate(-15deg)", opacity: 0.9, pointerEvents: "none",
              }} />
            )}
          </div>
        </div>

        {/* Right column: secondary photo grid + cutouts in margin */}
        <div style={{ position: "relative" }}>
          {/* Cutouts floating in the margin area, then a photo card below */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-start", minHeight: 200, position: "relative", marginBottom: 8 }}>
            {city.cutouts && city.cutouts.length > 0 && city.cutouts.map((c, i) => (
              <div key={c.no} style={{
                position: "relative", flex: 1, maxWidth: 200, padding: "0 8px",
                transform: `rotate(${i === 0 ? -3 : 4}deg) translateY(${i % 2 === 0 ? 0 : 12}px)`,
              }}>
                <Cutout src={c.src} caption={c.label} onOpen={onOpen}
                  style={{ width: "100%", aspectRatio: "1/1.1" }}
                  imgStyle={{ objectFit: "contain" }} />
                <div style={{ textAlign: "center", marginTop: 6, fontFamily: A.hand, fontSize: 19, color: A.ink, lineHeight: 1 }}>
                  {c.label}
                </div>
                <div style={{ textAlign: "center", fontFamily: A.mono, fontSize: 8, color: A.ink40, letterSpacing: 1.4, textTransform: "uppercase", marginTop: 2 }}>
                  № {c.no}
                </div>
              </div>
            ))}
            {(!city.cutouts || city.cutouts.length === 0) && city.photos[1] && (
              <div style={{ width: "100%", transform: "rotate(0.6deg)" }}>
                <div style={{ background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 8, boxShadow: "0 8px 18px rgba(0,0,0,0.06)" }}>
                  <Photo src={city.photos[1].src} caption={city.photos[1].caption} onOpen={onOpen}
                    style={{ width: "100%", aspectRatio: "4/3" }} />
                </div>
              </div>
            )}
          </div>

          {/* Secondary archive-style photo for non-Wulong; for Wulong, show jiuli */}
          {city.photos.length > 1 && (
            <div style={{ marginTop: 14, background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 8 }}>
              <Photo
                src={city.photos[city.photos.length === 1 ? 0 : 1].cutout
                  ? city.photos.find(p => !p.cutout && p !== heroPhoto)?.src || heroPhoto.src
                  : city.photos[city.photos.length - 1].src}
                caption={city.photos[city.photos.length - 1].caption}
                onOpen={onOpen}
                style={{ width: "100%", aspectRatio: "4/3" }} />
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontFamily: A.mono, fontSize: 9, letterSpacing: 1.2, color: A.ink40, textTransform: "uppercase" }}>
                <span style={{ fontFamily: A.serif, fontStyle: "italic", fontSize: 12, color: A.ink, textTransform: "none", letterSpacing: 0 }}>
                  {city.photos[city.photos.length - 1].caption}
                </span>
                <span>{city.no}.02</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




// Variation 3 — "Open Album" (REJECTED — kept for record-keeping)
// Full scrapbook: loose collage of tilted polaroids, overlapping cutouts,
// washi tape, doodled marks (purple stars), hand-written captions in Caveat.

function ChinaV3() {
  const { setOpen, Lightbox } = useLightbox();
  

  return (
    <div className="ab-root paper-a" style={{ color: A.ink, fontFamily: A.serif }}>
      <NavBar active="Travels" />

      {/* Archive header preserved, slim */}
      <div style={{ padding: "96px 48px 0" }}>
        <Hair color={A.hairStrong} />
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60,
          padding: "8px 0", textTransform: "uppercase",
        }}>
          <span>Travels → China '24</span>
          <span>file: china-24.idx · open album view</span>
          <span>14 days · 3 cities</span>
        </div>
        <Hair color={A.hairStrong} />
      </div>

      {/* ── Hero collage ──────────────────────────────────── */}
      <div style={{ position: "relative", padding: "0 48px", height: 640, marginTop: 8 }}>
        {/* Big tilted hero polaroid */}
        <div style={{
          position: "absolute", top: 28, left: 64, width: 520,
          transform: "rotate(-2.4deg)", boxShadow: "0 16px 36px rgba(0,0,0,0.14)",
          background: A.paperWarm, border: `1px solid ${A.hairStrong}`, padding: 14,
        }}>
          <Photo src={CHINA.hero} caption="West Lake, first morning."
            onOpen={setOpen} style={{ width: "100%", aspectRatio: "3/2" }} sepia={0.06} />
          <div style={{ marginTop: 10, fontFamily: A.hand, fontSize: 26, color: A.ink, lineHeight: 1 }}>
            july 6 — Hangzhou, before the heat ☀
          </div>
        </div>
        {/* Tape on hero */}
        <div style={{ position: "absolute", top: 10, left: 220, width: 140, height: 28, background: A.tape, transform: "rotate(-8deg)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: 18, left: 480, width: 100, height: 22, background: A.tapeRed, transform: "rotate(12deg)", zIndex: 2 }} />

        {/* Title splayed across the right */}
        <div style={{ position: "absolute", top: 56, right: 56, width: 560, textAlign: "right" }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 2, color: A.cinnabar, textTransform: "uppercase" }}>
            Personal archive · vol. 01 · entry C-001
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 132, lineHeight: 0.88, letterSpacing: -3, marginTop: 4 }}>
            <span style={{ fontStyle: "italic" }}>China,</span><br />
            <span style={{ color: A.ink60 }}>summer ’24.</span>
          </div>
          <div style={{ fontFamily: A.hand, fontSize: 34, color: A.cinnabar, lineHeight: 1, marginTop: 14, transform: "rotate(-1.5deg)", transformOrigin: "right" }}>
            mom &amp; dad &amp; me ✿ 14 days
          </div>
        </div>

        {/* Family cutout overlapping bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 380, width: 220, transform: "rotate(4deg)", zIndex: 3, cursor: "zoom-in" }}>
          <Cutout src={CHINA.family.src} caption={CHINA.family.caption} onOpen={setOpen}
            style={{ width: "100%", height: "auto", aspectRatio: "5/6" }}
            imgStyle={{ objectFit: "contain" }} />
        </div>

        {/* Floating stars cutout */}
        <img src="images/travels/china-24/stars-purple.png" alt="" style={{
          position: "absolute", top: 380, right: 580, width: 90, transform: "rotate(-18deg)", opacity: 0.95, pointerEvents: "none",
        }} />

        {/* Tiny coconut drink cutout in the corner */}
        <div style={{ position: "absolute", bottom: 20, right: 80, width: 78, transform: "rotate(-6deg)", cursor: "zoom-in" }}>
          <Cutout src="images/travels/china-24/coconut-drink.png" caption="Coconut Tree, 245ml"
            onOpen={setOpen} style={{ width: "100%", height: "auto", aspectRatio: "1/2.5" }} />
        </div>

        {/* Handwritten intro paragraph */}
        <div style={{
          position: "absolute", bottom: 24, left: 64, width: 280,
          fontFamily: A.serif, fontSize: 14, lineHeight: 1.55, color: A.ink70, fontStyle: "italic",
          background: "rgba(241, 233, 223, 0.85)", padding: "8px 12px", border: `1px dashed ${A.hair}`,
        }}>
          two weeks across three very different Chinas — humid, vertical, and finally vast. ate constantly. talked softer than usual.
        </div>
      </div>

      {/* ── City spreads ──────────────────────────────────── */}
      <div style={{ padding: "20px 48px 0" }}>
        {CHINA.cities.map((city, idx) => (
          <CitySpreadV3 key={city.no} city={city} idx={idx} onOpen={setOpen} />
        ))}
      </div>

      {/* ── Closing — note pinned to page ─────────────────── */}
      <div style={{ position: "relative", padding: "0 48px 48px", height: 240 }}>
        <Hair color={A.hairStrong} />
        <div style={{
          position: "absolute", top: 36, left: "50%", transform: "translateX(-50%) rotate(-1.2deg)",
          width: 460, background: A.washiCream, padding: "20px 24px",
          border: `1px solid rgba(180, 140, 80, 0.4)`,
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontFamily: A.hand, fontSize: 32, color: A.ink, lineHeight: 1.1 }}>
            note to future me:
          </div>
          <div style={{ fontFamily: A.hand, fontSize: 24, color: A.ink70, lineHeight: 1.3, marginTop: 10 }}>
            you didn't take enough photos of the food. take more next time. also, learn to read the menu — pointing only gets you so far.
          </div>
          <div style={{ marginTop: 16, fontFamily: A.serif, fontStyle: "italic", fontSize: 14, color: A.ink60 }}>
            — Lucy, somewhere over the Pacific
          </div>
        </div>
        {/* Tape */}
        <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%) rotate(2deg)", width: 100, height: 22, background: A.tape }} />
      </div>

      {Lightbox}
    </div>
  );
}

// City spread — alternating collage layouts
function CitySpreadV3({ city, idx, onOpen }) {
  

  return (
    <div style={{ position: "relative", marginBottom: 48, minHeight: 560 }}>
      {/* City marker — large numeral overlapping content */}
      <div style={{
        position: "absolute", top: -18, left: idx % 2 === 0 ? -8 : "auto", right: idx % 2 === 1 ? -8 : "auto",
        fontFamily: A.serif, fontSize: 220, lineHeight: 0.85,
        color: "rgba(31, 26, 22, 0.06)", letterSpacing: -8, fontWeight: 500, pointerEvents: "none",
      }}>
        {city.no}
      </div>

      {/* Header band — clean serif title */}
      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 18, marginBottom: 4, paddingLeft: idx % 2 === 0 ? 110 : 0 }}>
        <div style={{ fontFamily: A.serif, fontSize: 76, lineHeight: 1, letterSpacing: -1.6, fontStyle: "italic" }}>
          {city.name}
        </div>
        <div style={{ fontFamily: A.serif, fontSize: 42, color: A.ink60, letterSpacing: 2 }}>{city.pinyin}</div>
        <div style={{ fontFamily: A.hand, fontSize: 26, color: A.cinnabar, marginLeft: 8, transform: "rotate(-2deg)" }}>
          {city.days.toLowerCase()}
        </div>
      </div>
      <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.ink40, textTransform: "uppercase", paddingLeft: idx % 2 === 0 ? 110 : 0, marginBottom: 20 }}>
        {city.coords} · {city.latin}
      </div>

      {/* Collage area */}
      {idx === 0 && <CollageHangzhouV3 city={city} onOpen={onOpen} />}
      {idx === 1 && <CollageChongqingV3 city={city} onOpen={onOpen} />}
      {idx === 2 && <CollageWulongV3 city={city} onOpen={onOpen} />}
    </div>
  );
}

function CollageHangzhouV3({ city, onOpen }) {
  
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

function CollageChongqingV3({ city, onOpen }) {
  
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

function CollageWulongV3({ city, onOpen }) {
  
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





Object.assign(window, { ChinaV1, ChinaV2, ChinaV3 });
})();
