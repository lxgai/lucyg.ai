"use client";

import { Box, Button, InputBase, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import type { Post, PostBodyBlock } from "@/data/content";

export function countPostWords(post: Post) {
  const text = post.body
    .filter((block): block is Extract<PostBodyBlock, { text: string }> => "text" in block)
    .map((block) => block.text)
    .join(" ");

  return text.split(/\s+/).filter(Boolean).length;
}

export function BlogPostArticle({
  post,
  older,
  newer,
  related,
}: {
  post: Post;
  older?: Post;
  newer?: Post;
  related: Post[];
}) {
  const words = countPostWords(post);
  const readMin = Math.max(1, Math.round(words / 220));

  return (
    <PageShell
      section={`SECTION A · BLOG · ${post.slug}`}
      catNo={`file: ${post.slug}.entry`}
      updatedLabel={post.date}
      metadataExtra={
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box component="span" sx={{ width: 6, height: 6, background: tokens.accent, borderRadius: "50%" }} />
          <Box component="span">Also on Substack -&gt;</Box>
        </Box>
      }
    >
      <Box
        component={NextLink}
        href="/blog"
        sx={{
          fontFamily: tokens.mono,
          fontSize: 11,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-flex",
          mb: 2,
          "&:hover": { color: tokens.accent },
        }}
      >
        &lt;- Blog
      </Box>

      <Box component="article" sx={{ maxWidth: 640, mx: "auto", mt: 2 }}>
        <Box
          sx={{
            textAlign: "center",
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "2px",
            color: tokens.ink60,
            textTransform: "uppercase",
            mb: 2.25,
          }}
        >
          {post.date} · {readMin} min read
        </Box>

        <Typography
          component="h1"
          sx={{
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: { xs: 44, md: 56 },
            lineHeight: 1.05,
            letterSpacing: { xs: "-0.9px", md: "-1.4px" },
            fontWeight: 400,
            textAlign: "center",
            m: "0 0 22px",
          }}
        >
          {post.title}.
        </Typography>

        <Typography
          component="div"
          sx={{
            textAlign: "center",
            fontFamily: tokens.serif,
            fontSize: 19,
            color: tokens.ink60,
            lineHeight: 1.5,
            fontStyle: "italic",
            mb: 1.5,
          }}
        >
          {post.excerpt}
        </Typography>

        <TagRow tags={post.tags} centered />

        {post.hero ? (
          <HeroFigure post={post} />
        ) : (
          <Box
            sx={{
              textAlign: "center",
              fontFamily: tokens.mono,
              fontSize: 14,
              color: tokens.ink40,
              letterSpacing: "4px",
              my: 6,
            }}
          >
            * * *
          </Box>
        )}

        {post.body.map((block, index) => {
          if (index === 0 && block.kind === "p") {
            return <DropCapParagraph key={index} text={block.text} />;
          }

          return <PostBlock key={index} block={block} />;
        })}

        <Box
          sx={{
            mt: 7,
            textAlign: "center",
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: 16,
            color: tokens.ink60,
          }}
        >
          - filed {post.date}, {words.toLocaleString()} words
        </Box>
      </Box>

      {post.foot && post.foot.length > 0 && <Footnotes notes={post.foot} />}
      <SubscribeAndComments />
      {related.length > 0 && <RelatedPosts related={related} />}
      <PostPrevNext older={older} newer={newer} />
    </PageShell>
  );
}

function TagRow({ tags, centered = false }: { tags: string[]; centered?: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: centered ? "center" : "flex-start",
        gap: 1,
        mb: 5,
        flexWrap: "wrap",
      }}
    >
      {tags.map((tag) => (
        <Box
          key={tag}
          component="span"
          sx={{
            fontFamily: tokens.mono,
            fontSize: 9,
            letterSpacing: "1.4px",
            color: tokens.accent,
            border: `1px solid ${tokens.accent}`,
            px: 1,
            py: 0.25,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </Box>
      ))}
    </Box>
  );
}

function HeroFigure({ post }: { post: Post }) {
  if (!post.hero) return null;

  return (
    <Box
      component="figure"
      sx={{
        mx: { xs: 0, md: "calc(50% - 50vw + 56px)" },
        mt: 1,
        mb: 7,
      }}
    >
      <Box sx={{ position: "relative", width: "100%", aspectRatio: "21 / 9" }}>
        <Image
          src={post.hero}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, calc(100vw - 112px)"
          style={{ objectFit: "cover", filter: "sepia(0.08) saturate(0.9)" }}
        />
      </Box>
      {post.heroCaption && (
        <Box
          component="figcaption"
          sx={{
            maxWidth: 640,
            mx: "auto",
            mt: 1.75,
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: 14,
            lineHeight: 1.5,
            color: tokens.ink60,
            textAlign: "center",
          }}
        >
          {post.heroCaption}
        </Box>
      )}
    </Box>
  );
}

function DropCapParagraph({ text }: { text: string }) {
  return (
    <Typography
      component="p"
      sx={{
        fontFamily: tokens.serif,
        fontSize: 19,
        lineHeight: 1.65,
        color: tokens.ink,
        m: "0 0 22px",
      }}
    >
      <Box
        component="span"
        sx={{
          float: "left",
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: 72,
          lineHeight: 0.85,
          mr: 1.5,
          mt: 0.75,
          color: tokens.accent,
        }}
      >
        {text[0]}
      </Box>
      {text.slice(1)}
    </Typography>
  );
}

function PostBlock({ block }: { block: PostBodyBlock }) {
  if (block.kind === "h") {
    return (
      <Typography
        component="h2"
        sx={{
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: 30,
          letterSpacing: "-0.4px",
          lineHeight: 1.15,
          fontWeight: 400,
          mt: 5.5,
          mb: 2.5,
          color: tokens.ink,
        }}
      >
        {block.text}
      </Typography>
    );
  }

  if (block.kind === "pull") {
    return (
      <Box
        sx={{
          my: 5.5,
          pl: 2.75,
          borderLeft: `2px solid ${tokens.accent}`,
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: 30,
          lineHeight: 1.25,
          letterSpacing: "-0.4px",
          color: tokens.ink,
        }}
      >
        &ldquo;{block.text}&rdquo;
      </Box>
    );
  }

  if (block.kind === "img") {
    return <PostFigure block={block} />;
  }

  return (
    <Typography
      component="p"
      sx={{
        fontFamily: tokens.serif,
        fontSize: 19,
        lineHeight: 1.65,
        color: tokens.ink,
        m: "0 0 22px",
      }}
    >
      {block.text}
    </Typography>
  );
}

function PostFigure({ block }: { block: Extract<PostBodyBlock, { kind: "img" }> }) {
  const aspect = block.aspect ?? "16 / 10";

  return (
    <Box component="figure" sx={{ my: 6 }}>
      {block.src ? (
        <Box sx={{ position: "relative", width: "100%", aspectRatio: aspect }}>
          <Image
            src={block.src}
            alt={block.caption ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            style={{ objectFit: "cover", filter: "sepia(0.06) saturate(0.92)" }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            aspectRatio: aspect,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.18), rgba(255,255,255,0.05)), " +
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 12px, rgba(0,0,0,0.04) 12px 26px), " +
              (block.color ?? tokens.ink40),
            filter: "sepia(0.08) saturate(0.9)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontFamily: tokens.mono,
              fontSize: 8,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            photo
          </Box>
        </Box>
      )}
      {block.caption && (
        <Box
          component="figcaption"
          sx={{
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: 14,
            lineHeight: 1.5,
            color: tokens.ink60,
            mt: 1.5,
            pl: 1.75,
            borderLeft: `1px solid ${tokens.hair}`,
          }}
        >
          {block.caption}
        </Box>
      )}
    </Box>
  );
}

function Footnotes({ notes }: { notes: string[] }) {
  return (
    <Box sx={{ mt: 7, maxWidth: 640, mx: "auto" }}>
      <Box
        sx={{
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          mb: 1.75,
          pb: 1,
          borderBottom: `1px solid ${tokens.hair}`,
        }}
      >
        Footnotes
      </Box>
      {notes.map((note, index) => (
        <Box
          key={note}
          sx={{
            display: "grid",
            gridTemplateColumns: "32px 1fr",
            gap: 1.5,
            mb: 1.5,
            fontFamily: tokens.serif,
            fontSize: 14,
            lineHeight: 1.55,
            color: tokens.ink60,
            fontStyle: "italic",
          }}
        >
          <Box sx={{ fontFamily: tokens.mono, fontStyle: "normal", fontSize: 10, color: tokens.accent, letterSpacing: "1px" }}>
            [{String(index + 1).padStart(2, "0")}]
          </Box>
          <Box>{note}</Box>
        </Box>
      ))}
    </Box>
  );
}

function SubscribeAndComments() {
  const comments = [
    { who: "Mara K.", when: "2d", text: "The line about the homepage as a room you return to is exactly what I'm trying to do with my own site this year." },
    { who: "P. Singh", when: "2d", text: "Five readers, one of which is me. I wrote back via email." },
    { who: "Jess", when: "1d", text: "Curious about the RSS button you mentioned - what does the implementation look like?" },
    { who: "Theo", when: "22h", text: "Deleted my analytics last month and have not missed them once." },
    { who: "Anna L.", when: "18h", text: "This is making me reconsider my whole publishing setup." },
  ];

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", mt: 9 }}>
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.5, md: 4.5 },
          py: { xs: 3, md: 4 },
          border: `1px solid ${tokens.ink}`,
          background: "transparent",
        }}
      >
        <Box
          sx={{
            fontFamily: tokens.mono,
            fontSize: 9,
            letterSpacing: "1.8px",
            color: tokens.ink60,
            textTransform: "uppercase",
            mb: 1.75,
            display: "flex",
            justifyContent: "space-between",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <span>Form 06 · Inbox subscription</span>
          <span>412 readers</span>
        </Box>
        <Box sx={{ fontFamily: tokens.serif, fontStyle: "italic", fontSize: 32, lineHeight: 1.15, letterSpacing: "-0.6px", mb: 1.25 }}>
          Letters in your inbox, sometimes.
        </Box>
        <Typography sx={{ fontFamily: tokens.serif, fontSize: 16, color: tokens.ink60, lineHeight: 1.5, mb: 2.75, maxWidth: 460 }}>
          A few posts a month, plus the occasional Friday note that does not make it onto the site. No tracking, no schedule, no upsells.
        </Typography>
        <Box sx={{ display: "flex", mb: 1.75, alignItems: "stretch" }}>
          <InputBase
            placeholder="you@somewhere"
            sx={{
              flex: 1,
              fontFamily: tokens.serif,
              fontSize: 16,
              fontStyle: "italic",
              px: 1.75,
              py: 1.25,
              border: `1px solid ${tokens.ink}`,
              borderRight: "none",
              color: tokens.ink,
              minWidth: 0,
            }}
          />
          <Button
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              px: { xs: 1.5, md: 2.75 },
              background: tokens.accent,
              color: tokens.paper,
              border: `1px solid ${tokens.accent}`,
              borderRadius: 0,
              whiteSpace: "nowrap",
              "&:hover": { background: tokens.accent },
            }}
          >
            Subscribe -&gt;
          </Button>
        </Box>
        <Box
          sx={{
            fontFamily: tokens.mono,
            fontSize: 9,
            letterSpacing: "1.4px",
            color: tokens.ink40,
            textTransform: "uppercase",
            display: "flex",
            justifyContent: "space-between",
            gap: 1.5,
            flexWrap: "wrap",
            pt: 1.25,
            borderTop: `1px dashed ${tokens.hair}`,
          }}
        >
          <span>Free · weekly-ish · unsubscribe anytime</span>
          <span>Delivery via Substack -&gt;</span>
        </Box>
      </Box>

      <Box sx={{ mt: 7 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `1px solid ${tokens.hairStrong}`,
            pb: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            Notes from readers
          </Box>
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.4px", color: tokens.ink40, textTransform: "uppercase" }}>
            static preview
          </Box>
        </Box>
        {comments.map((comment) => (
          <Box key={`${comment.who}-${comment.when}`} sx={{ py: 1.75, borderBottom: `1px solid ${tokens.hair}` }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "baseline", mb: 0.75 }}>
              <Box sx={{ fontFamily: tokens.serif, fontSize: 16, fontStyle: "italic" }}>{comment.who}</Box>
              <Box sx={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.ink40, letterSpacing: "1px", textTransform: "uppercase" }}>
                {comment.when}
              </Box>
            </Box>
            <Box sx={{ fontFamily: tokens.serif, fontSize: 14, color: tokens.ink60, lineHeight: 1.5 }}>{comment.text}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function RelatedPosts({ related }: { related: Post[] }) {
  return (
    <Box sx={{ mt: 9, pt: 3, borderTop: `1px solid ${tokens.hairStrong}` }}>
      <Box sx={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase", mb: 2.75 }}>
        Filed alongside
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: `repeat(${related.length}, 1fr)` }, gap: 4 }}>
        {related.map((post) => (
          <Box key={post.slug} component={NextLink} href={`/blog/${post.slug}`} sx={{ color: tokens.ink, textDecoration: "none" }}>
            <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.4px", color: tokens.ink60, textTransform: "uppercase" }}>
              {post.date}
            </Box>
            <Box sx={{ fontFamily: tokens.serif, fontSize: 20, fontStyle: "italic", lineHeight: 1.15, mt: 0.75, letterSpacing: "-0.3px" }}>
              {post.title}
            </Box>
            <Box sx={{ fontFamily: tokens.serif, fontSize: 13, color: tokens.ink60, mt: 1, lineHeight: 1.5 }}>{post.excerpt}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function PostPrevNext({ older, newer }: { older?: Post; newer?: Post }) {
  return (
    <Box
      sx={{
        mt: 7,
        pt: 3,
        borderTop: `1px solid ${tokens.hair}`,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
      }}
    >
      {older ? (
        <Box component={NextLink} href={`/blog/${older.slug}`} sx={{ color: tokens.ink, textDecoration: "none" }}>
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            &lt;- Older
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 20, fontStyle: "italic", mt: 0.5, lineHeight: 1.15 }}>{older.title}</Box>
        </Box>
      ) : (
        <Box />
      )}
      {newer ? (
        <Box
          component={NextLink}
          href={`/blog/${newer.slug}`}
          sx={{ color: tokens.ink, textDecoration: "none", textAlign: { xs: "left", md: "right" } }}
        >
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            Newer -&gt;
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 20, fontStyle: "italic", mt: 0.5, lineHeight: 1.15 }}>{newer.title}</Box>
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  );
}
