"use client";

import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import { resolveSiteImageSrc } from "@/lib/images";
import type { PostBodyBlock } from "@/data/blog";
import type { BlogEntry } from "@/types/blog";

export function countPostWords(post: BlogEntry) {
  if (post.wordCount) {
    return post.wordCount;
  }

  const text =
    post.text ??
    post.body
      ?.filter((block): block is Extract<PostBodyBlock, { text: string }> => "text" in block)
      .map((block) => block.text)
      .join(" ") ??
    "";

  return text.split(/\s+/).filter(Boolean).length;
}

function compactDate(date: string) {
  return date.replace(/\s*\/\s*/g, "/");
}

export function BlogPostArticle({
  post,
  older,
  newer,
  related,
  subscribeEmbedUrl,
  subscribeUrl,
}: {
  post: BlogEntry;
  older?: BlogEntry;
  newer?: BlogEntry;
  related: BlogEntry[];
  subscribeEmbedUrl?: string;
  subscribeUrl?: string;
}) {
  const words = countPostWords(post);
  const readMin = Math.max(1, Math.round(words / 220));
  const displayDate = compactDate(post.date);

  return (
    <PageShell
      section={`SECTION D · BLOG · ${post.slug}`}
      catNo={`file: ${post.slug}.entry`}
      updatedLabel={displayDate}
      metadataExtra={
        <Box
          component={post.sourceUrl ? "a" : "span"}
          href={post.sourceUrl}
          target={post.sourceUrl ? "_blank" : undefined}
          rel={post.sourceUrl ? "noopener noreferrer" : undefined}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: post.sourceUrl ? tokens.accent : "inherit" },
          }}
        >
          <Box component="span" sx={{ width: 6, height: 6, background: tokens.accent, borderRadius: "50%" }} />
          <Box component="span">{post.source === "substack" ? "Also on Substack ->" : "Filed locally"}</Box>
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
          {displayDate} · {readMin} min read
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

        {post.html ? (
          <SubstackArticleHtml html={post.html} />
        ) : (
          post.body?.map((block, index) => {
            if (index === 0 && block.kind === "p") {
              return <DropCapParagraph key={index} text={block.text} />;
            }

            return <PostBlock key={index} block={block} />;
          })
        )}

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
          - filed {displayDate}, {words.toLocaleString()} words
        </Box>
      </Box>

      {post.foot && post.foot.length > 0 && <Footnotes notes={post.foot} />}
      <SubscribeAndDiscussion post={post} subscribeEmbedUrl={subscribeEmbedUrl} subscribeUrl={subscribeUrl} />
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

function HeroFigure({ post }: { post: BlogEntry }) {
  if (!post.hero) return null;
  const heroSrc = resolveSiteImageSrc(post.hero);

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
          src={heroSrc}
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
  const blockSrc = block.src ? resolveSiteImageSrc(block.src) : "";

  return (
    <Box component="figure" sx={{ my: 6 }}>
      {blockSrc ? (
        <Box sx={{ position: "relative", width: "100%", aspectRatio: aspect }}>
          <Image
            src={blockSrc}
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

function SubstackArticleHtml({ html }: { html: string }) {
  return (
    <Box
      className="substack-entry"
      dangerouslySetInnerHTML={{ __html: html }}
      sx={{
        fontFamily: tokens.serif,
        fontSize: 19,
        lineHeight: 1.65,
        color: tokens.ink,
        overflowWrap: "break-word",
        "& > :first-of-type": { mt: 0 },
        "& p": { m: "0 0 22px" },
        "& h1, & h2, & h3, & h4": {
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontWeight: 400,
          color: tokens.ink,
          lineHeight: 1.15,
          mt: 5.5,
          mb: 2.5,
        },
        "& h1": { fontSize: 36 },
        "& h2": { fontSize: 30 },
        "& h3": { fontSize: 24 },
        "& h4": { fontSize: 20 },
        "& a": {
          color: tokens.accent,
          textDecorationColor: tokens.hairStrong,
          textUnderlineOffset: "3px",
        },
        "& blockquote": {
          my: 5.5,
          mx: 0,
          pl: 2.75,
          borderLeft: `2px solid ${tokens.accent}`,
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: 30,
          lineHeight: 1.25,
          letterSpacing: "-0.4px",
          color: tokens.ink,
        },
        "& blockquote p": { m: 0 },
        "& ul, & ol": { my: 3, pl: 3 },
        "& li": { mb: 1 },
        "& figure": { my: 6, mx: 0 },
        "& img": {
          display: "block",
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          filter: "sepia(0.06) saturate(0.92)",
        },
        "& figcaption": {
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: 14,
          lineHeight: 1.5,
          color: tokens.ink60,
          mt: 1.5,
          pl: 1.75,
          borderLeft: `1px solid ${tokens.hair}`,
        },
        "& pre": {
          overflowX: "auto",
          p: 2,
          border: `1px solid ${tokens.hair}`,
          background: tokens.paperCard,
          fontFamily: tokens.mono,
          fontSize: 13,
          lineHeight: 1.6,
        },
        "& code": {
          fontFamily: tokens.mono,
          fontSize: "0.88em",
        },
        "& hr": {
          border: 0,
          borderTop: `1px dashed ${tokens.hair}`,
          my: 5,
        },
      }}
    />
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

function SubscribeAndDiscussion({
  post,
  subscribeEmbedUrl,
  subscribeUrl,
}: {
  post: BlogEntry;
  subscribeEmbedUrl?: string;
  subscribeUrl?: string;
}) {
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
          <span>Substack delivery</span>
        </Box>
        <Box sx={{ fontFamily: tokens.serif, fontStyle: "italic", fontSize: 32, lineHeight: 1.15, letterSpacing: "-0.6px", mb: 1.25 }}>
          Letters in your inbox, sometimes.
        </Box>
        <Typography sx={{ fontFamily: tokens.serif, fontSize: 16, color: tokens.ink60, lineHeight: 1.5, mb: 2.75, maxWidth: 460 }}>
          A few posts a month, plus the occasional Friday note that does not make it onto the site. No tracking, no schedule, no upsells.
        </Typography>
        {subscribeEmbedUrl ? (
          <Box
            component="iframe"
            src={subscribeEmbedUrl}
            title="Subscribe on Substack"
            sx={{
              display: "block",
              width: "100%",
              height: 150,
              border: `1px solid ${tokens.ink}`,
              background: tokens.paperCard,
              mb: 1.75,
            }}
          />
        ) : (
          <Button
            component="a"
            href={subscribeUrl}
            target={subscribeUrl ? "_blank" : undefined}
            rel={subscribeUrl ? "noopener noreferrer" : undefined}
            disabled={!subscribeUrl}
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              mb: 1.75,
              px: { xs: 1.5, md: 2.75 },
              py: 1.25,
              background: tokens.accent,
              color: tokens.paper,
              border: `1px solid ${tokens.accent}`,
              borderRadius: 0,
              whiteSpace: "nowrap",
              textDecoration: "none",
              "&:hover": { background: tokens.accent },
              "&.Mui-disabled": {
                color: tokens.ink40,
                background: "transparent",
                borderColor: tokens.hair,
              },
            }}
          >
            Subscribe on Substack -&gt;
          </Button>
        )}
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

      {post.sourceUrl && (
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
              Discussion
            </Box>
          </Box>
          <Box sx={{ py: 1.75, borderBottom: `1px solid ${tokens.hair}` }}>
            <Box sx={{ fontFamily: tokens.serif, fontSize: 16, color: tokens.ink60, lineHeight: 1.5, mb: 1.5 }}>
              Comments and reader notes live with the source entry.
            </Box>
            <Button
              component="a"
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                color: tokens.accent,
                border: `1px solid ${tokens.accent}`,
                borderRadius: 0,
                px: 2,
                py: 0.9,
                textDecoration: "none",
              }}
            >
              Discuss on Substack -&gt;
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function RelatedPosts({ related }: { related: BlogEntry[] }) {
  return (
    <Box sx={{ mt: 9, pt: 3, borderTop: `1px solid ${tokens.hairStrong}` }}>
      <Box sx={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase", mb: 2.75 }}>
        Filed alongside
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: `repeat(${related.length}, 1fr)` }, gap: 4 }}>
        {related.map((post) => (
          <Box key={post.slug} component={NextLink} href={`/blog/${post.slug}`} sx={{ color: tokens.ink, textDecoration: "none" }}>
            <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.4px", color: tokens.ink60, textTransform: "uppercase" }}>
              {compactDate(post.date)}
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

function PostPrevNext({ older, newer }: { older?: BlogEntry; newer?: BlogEntry }) {
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
