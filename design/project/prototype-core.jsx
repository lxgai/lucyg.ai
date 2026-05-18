// prototype-core.jsx
// Shared tokens, Nav, primitives, VinylPlayer — used by prototype-pages.jsx.

const A = {
  paper: "#f1e9df",
  paperDeep: "#e6dccb",
  paperCard: "#fbf6ee",
  ink: "#1f1a16",
  ink60: "#5a4e43",
  ink40: "#8a7e70",
  ink20: "#c9bfae",
  hair: "rgba(31, 26, 22, 0.2)",
  hairStrong: "rgba(31, 26, 22, 0.55)",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function Nav({ route, setRoute, theme }) {
  const links = [
    ["Projects", "projects"],
    ["Travels", "travels"],
    ["Favorites", "favorites"],
    ["Blog", "blog"],
    ["About", "about"],
  ];
  const activeKey = route.startsWith("travels") ? "travels" : route;
  return (
    <div className="m-nav" style={{
      position: "sticky", top: 0, zIndex: 50,
      background: A.paper,
      borderBottom: `1px solid ${A.hair}`,
      padding: "22px 56px 20px",
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      fontFamily: A.mono,
    }}>
      <div onClick={() => setRoute("home")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 10 }}>
        <span className="m-nav-brand" style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: A.ink, letterSpacing: -0.2 }}>Lucy Gai</span>
        <span className="m-nav-est" style={{ fontSize: 9, color: A.ink40, letterSpacing: 1.6, textTransform: "uppercase" }}>— EST. 2024</span>
      </div>
      <div className="m-nav-links" style={{ display: "flex", gap: 28, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" }}>
        {links.map(([label, key]) => (
          <span key={key}
            onClick={() => setRoute(key)}
            style={{
              color: activeKey === key ? theme.accent : A.ink,
              borderBottom: activeKey === key ? `1px solid ${theme.accent}` : "1px solid transparent",
              paddingBottom: 3, cursor: "pointer",
              transition: "color 180ms, border-color 180ms",
            }}>{label}</span>
        ))}
      </div>
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

function CardLabel({ cat, no, date, accent }) {
  return (
    <div style={{
      fontFamily: A.mono, fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase",
      color: A.ink60, display: "flex", gap: 16,
    }}>
      <span style={{ color: accent }}>CAT. {cat}</span>
      <span>№ {no}</span>
      {date && <span>{date}</span>}
    </div>
  );
}

function Pill({ children, onClick, filled, theme, style = {} }) {
  return (
    <span onClick={onClick} style={{
      display: "inline-block",
      padding: "8px 16px",
      border: `1px solid ${filled ? A.ink : A.hairStrong}`,
      background: filled ? A.ink : "transparent",
      color: filled ? A.paper : A.ink,
      fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase",
      cursor: onClick ? "pointer" : "default",
      transition: "all 180ms",
      ...style,
    }}>{children}</span>
  );
}

function PageShell({ children, route, setRoute, theme, section, catNo, title, subtitle, children2 }) {
  return (
    <div className="page-fade" style={{ color: A.ink, fontFamily: theme.serif, minHeight: "100vh", background: A.paper }}>
      <Nav route={route} setRoute={setRoute} theme={theme} />
      {section && (
        <div className="m-page-pad" style={{ padding: "36px 56px 0" }}>
          <div className="m-strip" style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.ink60,
            padding: "8px 0", textTransform: "uppercase",
            borderTop: `1px solid ${A.hairStrong}`,
            borderBottom: `1px solid ${A.hairStrong}`,
          }}>
            <span style={{ color: theme.accent }}>{section}</span>
            <span>{catNo}</span>
            <span>UPDATED 04 · 22 · 26</span>
          </div>
        </div>
      )}
      {(title || subtitle) && (
        <div className="m-page-pad" style={{ padding: "48px 56px 32px" }}>
          {title && <div className="m-page-title" style={{ fontFamily: theme.serif, fontSize: 84, lineHeight: 0.95, letterSpacing: -2, fontWeight: 400 }}>{title}</div>}
          {subtitle && <div style={{ fontFamily: A.mono, fontSize: 11, color: A.ink60, marginTop: 16, letterSpacing: 1.4, textTransform: "uppercase" }}>{subtitle}</div>}
        </div>
      )}
      <div className="m-page-pad" style={{ padding: `${(title || subtitle) ? 0 : 24}px 56px 80px` }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Vinyl player — the star of the Favorites page
// ============================================================
function VinylPlayer({ album, playing, setPlaying, theme }) {
  return (
    <div style={{
      width: 400, height: 400, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
    }} onClick={() => setPlaying(!playing)}>
      <div style={{
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, #1a1613 0%, #0d0a08 60%, #1a1613 100%)",
        position: "relative",
        animation: playing ? "spin 4s linear infinite" : "none",
        boxShadow: "0 14px 48px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            position: "absolute", inset: 14 + i * 18, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.035)",
          }}/>
        ))}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 136, height: 136, borderRadius: "50%", overflow: "hidden",
          border: `3px solid ${A.paper}`,
          boxShadow: `0 0 0 2px ${theme.accent}`,
        }}>
          <img src={album.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        </div>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 10, height: 10, borderRadius: "50%", background: A.paper, zIndex: 2,
        }}/>
      </div>
      {/* Tonearm */}
      <div style={{
        position: "absolute", top: -8, right: -30,
        width: 200, height: 10, background: A.ink20, borderRadius: 4,
        transformOrigin: "right center",
        transform: playing ? "rotate(-28deg)" : "rotate(-50deg)",
        transition: "transform 700ms cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ position: "absolute", right: -2, top: -10, width: 30, height: 30, borderRadius: "50%", background: A.ink40, border: `2px solid ${A.paper}` }}/>
        <div style={{ position: "absolute", left: -6, top: -3, width: 16, height: 16, background: A.ink, borderRadius: 2 }}/>
      </div>
      {/* Play hint */}
      <div style={{
        position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
        fontFamily: A.mono, fontSize: 9, color: A.ink40, letterSpacing: 1.6, textTransform: "uppercase",
      }}>
        {playing ? "▶ PLAYING" : "CLICK TO PLAY"}
      </div>
    </div>
  );
}

Object.assign(window, { A_TOKENS: A, Nav, Hair, CardLabel, Pill, PageShell, VinylPlayer });
