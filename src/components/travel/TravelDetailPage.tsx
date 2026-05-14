"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import { TravelDetailSectionFrame, TravelDetailSurface, TravelDetailViewportContainer } from "@/components/travel/TravelDetailSectionFrame";
import type {
  TravelDetailBlock,
  TravelDetailBreakpoint,
  TravelDetailData,
  TravelDetailImageBlock,
  TravelDetailSection,
  TravelDetailTapeDecoration,
} from "@/types/travelDetail";

type LightboxImage = {
  src: string;
  caption: string;
  alt: string;
};

const tape = "rgba(243, 215, 158, 0.65)";
const tapeRed = "rgba(228, 170, 160, 0.6)";

function useActiveBreakpoint(): TravelDetailBreakpoint {
  const [breakpoint, setBreakpoint] = useState<TravelDetailBreakpoint>("large");

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setBreakpoint("small");
        return;
      }
      setBreakpoint(window.matchMedia("(max-width: 1180px)").matches ? "medium" : "large");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return breakpoint;
}

function Tape({
  color = tape,
  breakpoint = "large",
  sx = {},
}: {
  color?: string;
  breakpoint?: TravelDetailBreakpoint;
  sx?: SxProps<Theme>;
}) {
  const isSmall = breakpoint === "small";

  return (
    <Box
      aria-hidden
      sx={[
        {
          position: "absolute",
          width: isSmall ? 86 : 126,
          height: isSmall ? 18 : 24,
          background: color,
          borderTop: "1px dashed rgba(180, 140, 80, 0.35)",
          borderBottom: "1px dashed rgba(180, 140, 80, 0.35)",
          pointerEvents: "none",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

function PhotoFrame({
  photo,
  breakpoint,
  priority = false,
  onOpen,
  sx,
  rotation,
}: {
  photo: TravelDetailImageBlock;
  breakpoint: TravelDetailBreakpoint;
  priority?: boolean;
  onOpen: (image: LightboxImage) => void;
  sx?: SxProps<Theme>;
  rotation?: number;
}) {
  const frameRotation = `${rotation ?? photo.layout.large.rotation}deg`;
  const isSmall = breakpoint === "small";

  if (photo.cutout) {
    return (
      <Box
        component="button"
        type="button"
        onClick={() => onOpen({ src: photo.src, caption: photo.caption, alt: photo.alt })}
        sx={[
          {
            display: "block",
            p: 0,
            border: 0,
            background: "transparent",
            width: "100%",
            cursor: "zoom-in",
            transform: isSmall ? "none" : `rotate(${frameRotation})`,
            transition: "transform 240ms ease",
            "&:hover": { transform: isSmall ? "none" : `rotate(${frameRotation}) scale(1.025)` },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        <Box sx={{ position: "relative", aspectRatio: photo.aspect }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 82vw, 360px"
            style={{ objectFit: "contain", filter: "drop-shadow(0 10px 16px rgba(31, 26, 22, 0.18))" }}
          />
        </Box>
        <Typography
          sx={{
            mt: 0.5,
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: isSmall ? 17 : 20,
            lineHeight: 1.1,
            color: tokens.accent,
            textAlign: "center",
          }}
        >
          {photo.caption}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={[
        {
          position: "relative",
          width: "100%",
          background: tokens.paperCard,
          border: `1px solid ${tokens.hairStrong}`,
          p: isSmall ? 1 : 1.5,
          boxShadow: "0 14px 30px rgba(31, 26, 22, 0.12)",
          transform: isSmall ? "none" : `rotate(${frameRotation})`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onOpen({ src: photo.src, caption: photo.caption, alt: photo.alt })}
        sx={{
          display: "block",
          position: "relative",
          width: "100%",
          aspectRatio: photo.aspect,
          overflow: "hidden",
          border: 0,
          p: 0,
          background: tokens.paperDeep,
          cursor: "zoom-in",
          "& img": { transition: "transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)" },
          "&:hover img": { transform: "scale(1.035)" },
        }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 90vw, 620px"
          style={{ objectFit: "cover", filter: "sepia(0.08) saturate(0.94)" }}
        />
      </Box>
      <Box sx={{ mt: 1.1, display: "flex", justifyContent: "space-between", gap: 2, alignItems: "baseline" }}>
        <Typography sx={{ fontFamily: tokens.serif, fontStyle: "italic", fontSize: isSmall ? 14 : 16, lineHeight: 1.2 }}>
          {photo.caption}
        </Typography>
        <Typography
          sx={{
            flex: "0 0 auto",
            fontFamily: tokens.mono,
            fontSize: 9,
            color: tokens.ink40,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
          }}
        >
          Filed
        </Typography>
      </Box>
    </Box>
  );
}

function BlockView({
  block,
  breakpoint,
  onOpen,
}: {
  block: TravelDetailBlock;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
}) {
  const layout = block.layout[breakpoint];

  if (!layout.visible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        left: `${layout.x}%`,
        top: layout.y,
        width: `${layout.width}%`,
        zIndex: layout.zIndex,
        transform: `rotate(${layout.rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {block.type === "image" ? (
        <PhotoFrame photo={block} breakpoint={breakpoint} onOpen={onOpen} rotation={0} />
      ) : (
        <Typography
          sx={{
            fontFamily: tokens.serif,
            fontSize: block.fontSize[breakpoint],
            lineHeight: block.tone === "annotation" ? 1.15 : 1.5,
            color: block.tone === "annotation" ? tokens.accent : tokens.ink60,
            fontStyle: "italic",
          }}
        >
          {block.text}
        </Typography>
      )}
    </Box>
  );
}

function TapeDecoration({ decoration, breakpoint }: { decoration: TravelDetailTapeDecoration; breakpoint: TravelDetailBreakpoint }) {
  const layout = decoration.layout[breakpoint];
  if (!layout.visible) return null;

  return (
    <Tape
      color={decoration.color}
      breakpoint={breakpoint}
      sx={{
        left: `${layout.x}%`,
        top: layout.y,
        width: `${layout.width}%`,
        height: decoration.height[breakpoint],
        opacity: decoration.opacity,
        transform: `rotate(${layout.rotation}deg)`,
        zIndex: layout.zIndex,
      }}
    />
  );
}

export function TravelMetadataStrip({ data, breakpoint }: { data: TravelDetailData; breakpoint: TravelDetailBreakpoint }) {
  return (
    <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pt: breakpoint === "small" ? 3 : 4.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: breakpoint === "small" ? 9 : 10,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          py: 1,
          borderTop: `1px solid ${tokens.hairStrong}`,
          borderBottom: `1px solid ${tokens.hairStrong}`,
          flexWrap: "wrap",
        }}
      >
        <Box component="span" sx={{ color: tokens.accent }}>
          {data.section}
        </Box>
        <Box component="span">{data.catNo}</Box>
        <Box component="span" sx={{ display: breakpoint === "small" ? "none" : "inline" }}>
          {data.updatedLabel}
        </Box>
      </Box>
    </TravelDetailViewportContainer>
  );
}

export function Hero({
  data,
  breakpoint,
  onOpen,
}: {
  data: TravelDetailData;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
}) {
  return (
    <TravelDetailViewportContainer
      breakpoint={breakpoint}
      sx={{
        pt: 4,
        display: "grid",
        gridTemplateColumns: breakpoint === "large" ? "1.35fr 1fr" : "1fr",
        gap: breakpoint === "small" ? 4 : 4.5,
        alignItems: "start",
      }}
    >
      <Box sx={{ position: "relative", maxWidth: breakpoint === "large" ? 760 : "100%" }}>
        <PhotoFrame photo={data.hero.image} breakpoint={breakpoint} priority onOpen={onOpen} />
        <Tape breakpoint={breakpoint} sx={{ top: breakpoint === "small" ? -8 : -10, left: breakpoint === "small" ? 42 : 60, transform: "rotate(-6deg)" }} />
        <Tape color={tapeRed} breakpoint={breakpoint} sx={{ bottom: breakpoint === "small" ? 38 : 30, right: breakpoint === "small" ? -6 : -16, transform: "rotate(8deg)" }} />
      </Box>

      <Box sx={{ pt: breakpoint === "small" ? 0 : 0.75, maxWidth: 540 }}>
        <Typography sx={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "2px", color: tokens.accent, textTransform: "uppercase" }}>
          Section C · Travels No. {data.fileNo}
        </Typography>
        <Typography
          component="h1"
          sx={{
            mt: 0.75,
            fontFamily: tokens.serif,
            fontWeight: 400,
            fontSize: breakpoint === "large" ? 88 : breakpoint === "medium" ? 72 : 56,
            lineHeight: 0.92,
            letterSpacing: breakpoint === "small" ? "-1.2px" : "-2px",
            color: tokens.ink,
          }}
        >
          <Box component="span" sx={{ fontStyle: "italic" }}>
            {data.hero.title}
          </Box>
          <br />
          <Box component="span" sx={{ color: tokens.ink60 }}>
            {data.hero.italicTitle}
          </Box>
        </Typography>

        <Typography sx={{ mt: 2.75, fontFamily: tokens.serif, fontSize: breakpoint === "small" ? 17 : 18, lineHeight: 1.55, color: tokens.ink60 }}>
          {data.hero.intro}
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            gap: "8px 18px",
            flexWrap: "wrap",
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "1.4px",
            color: tokens.ink60,
            textTransform: "uppercase",
          }}
        >
          {data.hero.facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </Box>
      </Box>
    </TravelDetailViewportContainer>
  );
}

function SectionSpread({
  section,
  breakpoint,
  onOpen,
}: {
  section: TravelDetailSection;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
}) {
  const blocks = useMemo(() => [...section.blocks].sort((a, b) => a.layout[breakpoint].zIndex - b.layout[breakpoint].zIndex), [breakpoint, section.blocks]);
  const decorations = useMemo(
    () => [...section.decorations].sort((a, b) => a.layout[breakpoint].zIndex - b.layout[breakpoint].zIndex),
    [breakpoint, section.decorations]
  );

  return (
    <TravelDetailSectionFrame section={section} breakpoint={breakpoint}>
      {decorations.map((decoration) => (
        <TapeDecoration key={decoration.id} decoration={decoration} breakpoint={breakpoint} />
      ))}
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} breakpoint={breakpoint} onOpen={onOpen} />
      ))}
    </TravelDetailSectionFrame>
  );
}

export function Closing({
  data,
  breakpoint,
  onOpen,
}: {
  data: TravelDetailData;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
}) {
  return (
    <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pb: breakpoint === "small" ? 5 : 4 }}>
      <Box sx={{ borderTop: `1px solid ${tokens.hairStrong}` }} />
      <Typography sx={{ mt: 2.25, fontFamily: tokens.mono, fontSize: 10, letterSpacing: "2px", color: tokens.accent, textTransform: "uppercase", textAlign: "center" }}>
        {data.closing.eyebrow}
      </Typography>
      <Typography sx={{ mt: 0.75, fontFamily: tokens.serif, fontStyle: "italic", fontSize: breakpoint === "small" ? 30 : 36, textAlign: "center" }}>
        {data.closing.title}
      </Typography>

      <Box sx={{ mt: 4, display: "grid", gridTemplateColumns: breakpoint === "small" ? "1fr" : "1fr 1fr", gap: breakpoint === "small" ? 4 : 6, alignItems: "center" }}>
        <Box sx={{ display: "flex", justifyContent: breakpoint === "small" ? "center" : "flex-end" }}>
          <Box sx={{ position: "relative", width: 320, maxWidth: "100%" }}>
            <PhotoFrame
              photo={data.closing.image}
              breakpoint={breakpoint}
              onOpen={onOpen}
              sx={{
                background: tokens.paperCard,
                border: `1px solid ${tokens.hairStrong}`,
                p: 1.5,
                boxShadow: "0 14px 30px rgba(31, 26, 22, 0.12)",
              }}
            />
            <Tape breakpoint={breakpoint} sx={{ top: -9, left: "50%", transform: "translateX(-50%) rotate(2deg)", width: 120 }} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: breakpoint === "small" ? "center" : "flex-start" }}>
          <Box
            sx={{
              position: "relative",
              width: 380,
              maxWidth: "100%",
              background: tokens.paperCard,
              border: `1px solid ${tokens.hair}`,
              p: breakpoint === "small" ? 2.5 : 3,
              boxShadow: "0 12px 28px rgba(31, 26, 22, 0.08)",
              transform: breakpoint === "small" ? "none" : "rotate(1.4deg)",
            }}
          >
            <Typography sx={{ fontFamily: tokens.serif, fontStyle: "italic", fontSize: breakpoint === "small" ? 25 : 30, lineHeight: 1.1 }}>
              {data.closing.noteTitle}
            </Typography>
            <Typography sx={{ mt: 1.25, fontFamily: tokens.serif, fontSize: breakpoint === "small" ? 18 : 20, lineHeight: 1.35, color: tokens.ink60 }}>
              {data.closing.note}
            </Typography>
            <Typography sx={{ mt: 1.75, fontFamily: tokens.serif, fontStyle: "italic", fontSize: 13, color: tokens.ink60 }}>
              {data.closing.signature}
            </Typography>
            <Tape color={tapeRed} breakpoint={breakpoint} sx={{ top: -8, left: 60, width: 100, transform: "rotate(-4deg)" }} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 5, borderTop: `1px solid ${tokens.hairStrong}` }} />
      <Box
        sx={{
          pt: 1.25,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.6px",
          color: tokens.ink40,
          textTransform: "uppercase",
        }}
      >
        <span>Fig. C.{data.fileNo} - {data.metadata.place}</span>
        {data.closing.nextHref && (
          <Box component={NextLink} href={data.closing.nextHref} sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: tokens.accent } }}>
            {data.closing.nextLabel ?? "Next"}
          </Box>
        )}
        <Box component="a" href="#top" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: tokens.accent } }}>
          To top
        </Box>
      </Box>
    </TravelDetailViewportContainer>
  );
}

function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  useEffect(() => {
    if (!image) return undefined;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Expanded travel image"
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(31, 26, 22, 0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2.5, md: 6 },
        cursor: "zoom-out",
      }}
    >
      <Box sx={{ width: "min(1100px, 100%)", maxHeight: "86vh" }}>
        <Box sx={{ position: "relative", width: "100%", height: "78vh" }}>
          <Image src={image.src} alt={image.alt} fill sizes="100vw" style={{ objectFit: "contain" }} />
        </Box>
        <Typography sx={{ mt: 1.5, fontFamily: tokens.serif, fontStyle: "italic", fontSize: 16, color: tokens.paper, textAlign: "center" }}>
          {image.caption}
        </Typography>
      </Box>
      <Typography
        sx={{
          position: "absolute",
          top: 24,
          right: 28,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.6px",
          color: tokens.paper,
          textTransform: "uppercase",
          opacity: 0.72,
        }}
      >
        Click anywhere · esc to close
      </Typography>
    </Box>
  );
}

export default function TravelDetailPage({ data }: { data: TravelDetailData }) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const breakpoint = useActiveBreakpoint();

  return (
    <Box id="top">
      <PageShell section={data.section} catNo={data.catNo} updatedLabel={data.updatedLabel} contentPadding={false}>
        <TravelDetailSurface breakpoint={breakpoint} mode="fit-width" scaleMultiplier={0.94}>
          <Hero data={data} breakpoint={breakpoint} onOpen={setLightboxImage} />
          <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pt: breakpoint === "small" ? 7 : 7.5 }}>
            {data.sections.map((section) => (
              <SectionSpread key={section.id} section={section} breakpoint={breakpoint} onOpen={setLightboxImage} />
            ))}
          </TravelDetailViewportContainer>
          <Closing data={data} breakpoint={breakpoint} onOpen={setLightboxImage} />
        </TravelDetailSurface>
      </PageShell>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </Box>
  );
}
