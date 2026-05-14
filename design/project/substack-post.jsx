// Substack-integrated blog post variations.
// Reuses the existing letter-style layout aesthetic from prototype-pages.jsx
// (cream paper, Newsreader serif, JetBrains mono labels, navy accent).

const SS = {
  paper:  "#f1e9df",
  ink:    "#1f1a16",
  ink60:  "rgba(31,26,22,0.6)",
  ink40:  "rgba(31,26,22,0.4)",
  ink20:  "rgba(31,26,22,0.2)",
  hair:   "rgba(31,26,22,0.18)",
  hairStrong: "rgba(31,26,22,0.4)",
  accent: "oklch(0.38 0.08 250)",   // navy
  serif:  "'Newsreader', Georgia, serif",
  mono:   "'JetBrains Mono', monospace",
};

const POST = {
  date: "04 / 18 / 26",
  slug: "slow-internet",
  title: "On keeping a slow internet",
  excerpt: "The homepage as a room you return to. Why I'm trimming back and writing for an audience of five.",
  tags: ["notes", "web"],
};

// ─────────────────────────────────────────────────────────────
// Re-usable pieces of the existing letter layout
// ─────────────────────────────────────────────────────────────
function StripHeader({ extra }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      fontFamily: SS.mono, fontSize: 10, letterSpacing: 1.6,
      color: SS.ink60, textTransform: "uppercase",
      padding: "12px 40px",
      borderTop: `1px solid ${SS.hairStrong}`,
      borderBottom: `1px solid ${SS.hairStrong}`,
      gap: 16, flexWrap: "wrap",
    }}>
      <span style={{ color: SS.accent }}>SECTION A · BLOG · {POST.slug}</span>
      <span>file: {POST.slug}.entry</span>
      <span>{POST.date}</span>
      {extra}
    </div>
  );
}

function BackLink() {
  return (
    <div style={{ padding: "16px 40px 0" }}>
      <span style={{
        fontFamily: SS.mono, fontSize: 11, letterSpacing: 1.6, color: SS.ink60,
        textTransform: "uppercase",
      }}>← Blog</span>
    </div>
  );
}

function PostHead() {
  return (
    <>
      <div style={{
        textAlign: "center", fontFamily: SS.mono, fontSize: 10,
        letterSpacing: 2, color: SS.ink60, textTransform: "uppercase",
        marginBottom: 18,
      }}>
        {POST.date} &nbsp;·&nbsp; 4 min read
      </div>
      <h1 style={{
        fontFamily: SS.serif, fontStyle: "italic", fontSize: 52,
        lineHeight: 1.05, letterSpacing: -1.2, fontWeight: 400,
        textAlign: "center", margin: "0 0 22px", textWrap: "balance",
      }}>
        {POST.title}.
      </h1>
      <div style={{
        textAlign: "center", fontFamily: SS.serif, fontSize: 18,
        color: SS.ink60, lineHeight: 1.5, fontStyle: "italic",
        marginBottom: 12, textWrap: "balance",
      }}>
        {POST.excerpt}
      </div>
      <div style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginBottom: 36, flexWrap: "wrap",
      }}>
        {POST.tags.map(t => (
          <span key={t} style={{
            fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.4, color: SS.accent,
            border: `1px solid ${SS.accent}`, padding: "2px 8px", textTransform: "uppercase",
          }}>{t}</span>
        ))}
      </div>
    </>
  );
}

function BodyPara({ children, dropCap }) {
  if (dropCap) {
    return (
      <p style={{
        fontFamily: SS.serif, fontSize: 18, lineHeight: 1.65,
        color: SS.ink, margin: "0 0 22px", textWrap: "pretty",
      }}>
        <span style={{
          float: "left", fontFamily: SS.serif, fontStyle: "italic",
          fontSize: 68, lineHeight: 0.85, marginRight: 12, marginTop: 6,
          color: SS.accent,
        }}>{String(children)[0]}</span>
        {String(children).slice(1)}
      </p>
    );
  }
  return (
    <p style={{
      fontFamily: SS.serif, fontSize: 18, lineHeight: 1.65,
      color: SS.ink, margin: "0 0 22px", textWrap: "pretty",
    }}>{children}</p>
  );
}

function PullQuote({ children }) {
  return (
    <blockquote style={{
      fontFamily: SS.serif, fontStyle: "italic", fontSize: 26,
      lineHeight: 1.3, color: SS.ink, margin: "32px 0",
      paddingLeft: 20, borderLeft: `2px solid ${SS.accent}`,
      textWrap: "balance",
    }}>
      "{children}"
    </blockquote>
  );
}

function BodyH({ children }) {
  return (
    <h2 style={{
      fontFamily: SS.serif, fontStyle: "italic", fontSize: 26,
      letterSpacing: -0.4, lineHeight: 1.2, fontWeight: 500,
      margin: "36px 0 14px",
    }}>{children}</h2>
  );
}

// ─────────────────────────────────────────────────────────────
// Substack integration components — original styling, not S brand
// ─────────────────────────────────────────────────────────────

// Tiny mono badge: "ALSO ON SUBSTACK ↗" — sits in the meta strip
function SyndicationBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 6, height: 6, background: SS.accent, borderRadius: "50%",
      }} />
      <span>Also on substack ↗</span>
    </span>
  );
}

// The standard footer subscribe card — paper-textured, no Substack visual brand.
// Powered-by line at the bottom (small mono) makes the wiring transparent.
function SubscribeCard({ headline, blurb, readerCount }) {
  return (
    <div style={{
      marginTop: 56, padding: "36px 36px 30px",
      border: `1px solid ${SS.ink}`,
      background: "transparent",
      position: "relative",
    }}>
      {/* Corner crop marks for the catalog feel */}
      {[[8,8,1,1],[8,8,1,-1],[8,8,-1,1],[8,8,-1,-1]].map((c,i)=>(
        <div key={i} style={{
          position:"absolute", width:10, height:10,
          [c[2]<0?"right":"left"]:-1, [c[3]<0?"bottom":"top"]:-1,
          borderTop:c[3]>0?`1px solid ${SS.ink}`:"none",
          borderBottom:c[3]<0?`1px solid ${SS.ink}`:"none",
          borderLeft:c[2]>0?`1px solid ${SS.ink}`:"none",
          borderRight:c[2]<0?`1px solid ${SS.ink}`:"none",
        }}/>
      ))}
      <div style={{
        fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.8,
        color: SS.ink60, textTransform: "uppercase", marginBottom: 14,
        display: "flex", justifyContent: "space-between",
      }}>
        <span>Form 06 · Inbox subscription</span>
        <span>{readerCount} readers</span>
      </div>
      <div style={{
        fontFamily: SS.serif, fontStyle: "italic", fontSize: 32,
        lineHeight: 1.15, letterSpacing: -0.6, marginBottom: 10,
        textWrap: "balance",
      }}>
        {headline}
      </div>
      <div style={{
        fontFamily: SS.serif, fontSize: 16, color: SS.ink60,
        lineHeight: 1.5, marginBottom: 22, maxWidth: 460,
      }}>
        {blurb}
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 14, alignItems: "stretch" }}>
        <input placeholder="you@somewhere" style={{
          flex: 1, fontFamily: SS.serif, fontSize: 16, fontStyle: "italic",
          padding: "12px 14px", border: `1px solid ${SS.ink}`, borderRight: "none",
          background: "transparent", color: SS.ink, outline: "none",
        }}/>
        <button style={{
          fontFamily: SS.mono, fontSize: 10, letterSpacing: 1.8,
          textTransform: "uppercase", padding: "0 22px",
          background: SS.accent, color: SS.paper, border: `1px solid ${SS.accent}`,
          cursor: "pointer",
        }}>Subscribe →</button>
      </div>
      <div style={{
        fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.4,
        color: SS.ink40, textTransform: "uppercase",
        display: "flex", justifyContent: "space-between",
        paddingTop: 10, borderTop: `1px dashed ${SS.hair}`,
      }}>
        <span>Free · weekly-ish · unsubscribe anytime</span>
        <span>Delivery via substack ↗</span>
      </div>
    </div>
  );
}

// Inline subscribe interrupt mid-post — quieter, single-line, italic voice.
function InlineSubscribe() {
  return (
    <div style={{
      margin: "44px -20px", padding: "26px 24px",
      borderTop: `1px solid ${SS.hair}`,
      borderBottom: `1px solid ${SS.hair}`,
    }}>
      <div style={{
        fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.8,
        color: SS.ink40, textTransform: "uppercase", marginBottom: 8,
      }}>
        ✦ a brief interruption ✦
      </div>
      <div style={{
        fontFamily: SS.serif, fontStyle: "italic", fontSize: 19,
        lineHeight: 1.4, marginBottom: 14, color: SS.ink, textWrap: "balance",
      }}>
        If you've read this far, you might want the next one delivered. Inbox, sometimes, no schedule.
      </div>
      <div style={{ display: "flex", gap: 0 }}>
        <input placeholder="you@somewhere" style={{
          flex: 1, fontFamily: SS.serif, fontSize: 15, fontStyle: "italic",
          padding: "10px 12px", border: `1px solid ${SS.ink}`, borderRight: "none",
          background: "transparent", color: SS.ink, outline: "none",
        }}/>
        <button style={{
          fontFamily: SS.mono, fontSize: 10, letterSpacing: 1.6,
          textTransform: "uppercase", padding: "0 18px",
          background: SS.ink, color: SS.paper, border: `1px solid ${SS.ink}`,
          cursor: "pointer",
        }}>Subscribe</button>
      </div>
    </div>
  );
}

// Substack-powered comments — embedded inline, with attribution.
function CommentsBlock() {
  const comments = [
    { who: "Mara K.", when: "2d", text: "The line about the homepage as a room you return to — that's exactly what I'm trying to do with my own site this year. Bookmarked." },
    { who: "P. Singh", when: "2d", text: "Five readers, one of which is me. I wrote back via email." },
    { who: "Jess", when: "1d", text: "Curious about the RSS button you mentioned — what's the implementation look like?" },
  ];
  return (
    <div style={{ marginTop: 64 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        paddingBottom: 10, borderBottom: `1px solid ${SS.hairStrong}`,
        marginBottom: 22,
      }}>
        <div style={{
          fontFamily: SS.mono, fontSize: 10, letterSpacing: 1.8,
          color: SS.ink, textTransform: "uppercase",
        }}>Comments · 5</div>
        <div style={{
          fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.4,
          color: SS.ink40, textTransform: "uppercase",
        }}>via substack ↗</div>
      </div>

      {comments.map((c, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "36px 1fr", gap: 16,
          padding: "16px 0",
          borderBottom: i < comments.length - 1 ? `1px solid ${SS.hair}` : "none",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: SS.paper, border: `1px solid ${SS.ink}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SS.serif, fontStyle: "italic", fontSize: 16, color: SS.ink,
          }}>{c.who[0]}</div>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontFamily: SS.serif, fontSize: 15, color: SS.ink }}>
                {c.who}
              </span>
              <span style={{
                fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.4,
                color: SS.ink40, textTransform: "uppercase",
              }}>{c.when} ago</span>
            </div>
            <div style={{
              fontFamily: SS.serif, fontSize: 16, lineHeight: 1.55,
              color: SS.ink, textWrap: "pretty",
            }}>{c.text}</div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 22, paddingTop: 18, borderTop: `1px dashed ${SS.hair}`,
        textAlign: "center",
      }}>
        <span style={{
          fontFamily: SS.mono, fontSize: 10, letterSpacing: 1.8,
          color: SS.accent, textTransform: "uppercase", borderBottom: `1px solid ${SS.accent}`,
          paddingBottom: 2,
        }}>Join the discussion ↗</span>
      </div>
    </div>
  );
}

// Paywall: a fade-out + lock card with two tiers.
function Paywall() {
  return (
    <div style={{ position: "relative", marginTop: 8, marginBottom: 16 }}>
      {/* Faded teaser paragraph */}
      <div style={{ position: "relative", maxHeight: 140, overflow: "hidden" }}>
        <p style={{
          fontFamily: SS.serif, fontSize: 18, lineHeight: 1.65,
          color: SS.ink, margin: "0 0 22px",
        }}>
          What stays: the writing. The date stamps. The footer that says where the page was last touched. The RSS button I'm putting in next week, in the corner where it belongs. And if you're reading this, you are one of the five — but the rest of this letter is for the people who keep the lights on…
        </p>
        <div style={{
          position: "absolute", inset: "0 0 0 0",
          background: `linear-gradient(to bottom, transparent 0%, ${SS.paper} 95%)`,
          pointerEvents: "none",
        }}/>
      </div>

      <div style={{
        position: "relative", padding: "32px 30px 28px",
        border: `1px solid ${SS.ink}`,
        background: SS.paper,
        marginTop: -10,
      }}>
        <div style={{
          fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.8,
          color: SS.ink40, textTransform: "uppercase", marginBottom: 14,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>※ paid subscribers only</span>
          <span>preview ends</span>
        </div>
        <div style={{
          fontFamily: SS.serif, fontStyle: "italic", fontSize: 28,
          lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 10, textWrap: "balance",
        }}>
          The rest of this letter, plus the archive.
        </div>
        <div style={{
          fontFamily: SS.serif, fontSize: 15, color: SS.ink60,
          lineHeight: 1.5, marginBottom: 22, maxWidth: 460,
        }}>
          You'll also get the Friday letters and access to every paid post — there are 23 in the archive.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <button style={{
            fontFamily: SS.serif, fontSize: 16, lineHeight: 1.3,
            padding: "16px 14px", background: SS.accent, color: SS.paper,
            border: `1px solid ${SS.accent}`, cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.6, opacity: 0.7, marginBottom: 4 }}>RECOMMENDED</div>
            <div style={{ fontStyle: "italic" }}>$8 / month</div>
            <div style={{ fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.2, opacity: 0.8, marginTop: 4 }}>Cancel anytime</div>
          </button>
          <button style={{
            fontFamily: SS.serif, fontSize: 16, lineHeight: 1.3,
            padding: "16px 14px", background: "transparent", color: SS.ink,
            border: `1px solid ${SS.ink}`, cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.6, opacity: 0.6, marginBottom: 4 }}>BEST VALUE</div>
            <div style={{ fontStyle: "italic" }}>$70 / year</div>
            <div style={{ fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.2, opacity: 0.5, marginTop: 4 }}>Two months free</div>
          </button>
        </div>
        <div style={{
          fontFamily: SS.mono, fontSize: 9, letterSpacing: 1.4,
          color: SS.ink40, textTransform: "uppercase",
          display: "flex", justifyContent: "space-between",
          paddingTop: 10, borderTop: `1px dashed ${SS.hair}`,
        }}>
          <span>Already a subscriber? Sign in ↗</span>
          <span>Powered by substack</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Whole-artboard compositions
// ─────────────────────────────────────────────────────────────

// Final composition: post body → footer subscribe card → Substack-powered comments.
function ArtboardPost() {
  return (
    <div style={{ background: SS.paper, minHeight: "100%", padding: "20px 0 60px" }}>
      <StripHeader extra={<SyndicationBadge />} />
      <BackLink />
      <article style={{ maxWidth: 640, margin: "28px auto 0", padding: "0 32px" }}>
        <PostHead />
        <BodyPara dropCap>I deleted the analytics last Tuesday. Not in a dramatic way — I just unchecked a box and never checked it again. The number had been climbing slowly for a year and the number had stopped meaning anything to me. So now there is no number.</BodyPara>
        <BodyPara>What I keep coming back to is the idea of a slow internet — the kind where you have five sites you visit on purpose and three of them are run by friends. Not a manifesto. Just a preference. I want the homepage to feel like a room I return to, not a feed I pull down.</BodyPara>
        <BodyH>An audience of five</BodyH>
        <BodyPara>If five people read this and one of them emails me about it, the post has done what it needed to do. That's the deal. I think I've been writing for a vague larger audience my whole career and the writing has always been worse for it.</BodyPara>
        <PullQuote>The homepage as a room you return to, not a feed you pull down.</PullQuote>
        <BodyPara>I'm going back to RSS. I'm linking out more. I'm letting the dates show. I'm putting a section divider that says SECTION A · BLOG because the small joke of cataloging a personal site like a library card is, to me, the whole point.</BodyPara>
        <BodyPara>If you're reading this, you are one of the five. Hello. Write me back.</BodyPara>

        <div style={{
          marginTop: 48, textAlign: "center",
          fontFamily: SS.serif, fontStyle: "italic", fontSize: 15, color: SS.ink60,
        }}>
          — filed {POST.date}, 612 words
        </div>

        <SubscribeCard
          headline="Letters in your inbox, sometimes."
          blurb="A few posts a month, plus the occasional Friday note that doesn't make it onto the site. No tracking, no schedule, no upsells."
          readerCount={412}
        />

        <CommentsBlock />
      </article>
    </div>
  );
}

Object.assign(window, {
  ArtboardPost,
});
