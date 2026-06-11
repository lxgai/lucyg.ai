"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import NextLink from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import PageShell from "@/components/design/PageShell";
import { PageContainer } from "@/components/design/layout";
import { LAST_UPDATED, tokens } from "@/components/design/tokens";
import { TravelDetailSectionFrame, TravelDetailSurface, TravelDetailViewportContainer } from "@/components/travel/TravelDetailSectionFrame";
import { resolveSiteImageSrc } from "@/lib/images";
import type {
  TravelDetailBlock,
  TravelDetailBreakpoint,
  TravelDetailData,
  TravelDetailFreeformLayout,
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
type HeroEditMode = "move" | "resize";
type HeroEditableItem = "image" | "copy" | `decoration:${string}`;

type HeroEditableProps = {
  selectedItem?: HeroEditableItem;
  onSelect: (item: HeroEditableItem) => void;
  onPointerDown: (item: HeroEditableItem, event: React.PointerEvent<HTMLElement>, mode: HeroEditMode) => void;
};

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
  const imageSrc = resolveSiteImageSrc(photo.src);

  if (photo.cutout) {
    return (
      <Box
        component="button"
        type="button"
        onClick={() => onOpen({ src: imageSrc, caption: photo.caption, alt: photo.alt })}
        sx={[
          {
            display: "block",
            p: 0,
            border: 0,
            background: "transparent",
            width: "100%",
            cursor: "zoom-in",
            transform: isSmall ? "none" : `rotate(${frameRotation})`,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        <Box sx={{ position: "relative", aspectRatio: photo.aspect }}>
          <Image
            src={imageSrc}
            alt={photo.alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 82vw, 360px"
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Typography
          sx={{
            mt: 0.5,
            fontFamily: tokens.hand,
            fontWeight: 500,
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
        onClick={() => onOpen({ src: imageSrc, caption: photo.caption, alt: photo.alt })}
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
        }}
      >
        <Image
          src={imageSrc}
          alt={photo.alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 90vw, 620px"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ mt: 1.1, display: "flex", justifyContent: "space-between", gap: 2, alignItems: "baseline" }}>
        <Typography sx={{ fontFamily: tokens.hand, fontWeight: 500, fontSize: isSmall ? 18 : 21, lineHeight: 1.05 }}>
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

function HeroEditableFrame({
  id,
  layout,
  editable,
  children,
}: {
  id: HeroEditableItem;
  layout: TravelDetailFreeformLayout;
  editable?: HeroEditableProps;
  children: ReactNode;
}) {
  if (!layout.visible) return null;
  const selected = editable?.selectedItem === id;

  return (
    <Box
      onPointerDown={(event) => editable?.onPointerDown(id, event, "move")}
      onClick={(event) => {
        if (!editable) return;
        event.stopPropagation();
        editable.onSelect(id);
      }}
      sx={{
        position: "absolute",
        left: `${layout.x}%`,
        top: layout.y,
        width: `${layout.width}%`,
        zIndex: layout.zIndex,
        transform: `rotate(${layout.rotation}deg)`,
        transformOrigin: "center center",
        outline: selected ? "2px solid #1c1917" : "none",
        outlineOffset: 4,
        cursor: editable ? "move" : "inherit",
      }}
    >
      {children}
      {editable && (
        <Box
          component="button"
          type="button"
          aria-label="Resize hero item"
          onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
            event.stopPropagation();
            editable.onPointerDown(id, event, "resize");
          }}
          sx={{
            position: "absolute",
            right: -8,
            bottom: -8,
            width: 16,
            height: 16,
            border: "1px solid #1c1917",
            background: "#e6dccb",
            p: 0,
            cursor: "nwse-resize",
          }}
        />
      )}
    </Box>
  );
}

function HeroTape({
  decoration,
  breakpoint,
}: {
  decoration: TravelDetailTapeDecoration;
  breakpoint: TravelDetailBreakpoint;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        width: "100%",
        height: decoration.height[breakpoint],
        background: decoration.color,
        borderTop: "1px dashed rgba(180, 140, 80, 0.35)",
        borderBottom: "1px dashed rgba(180, 140, 80, 0.35)",
        opacity: decoration.opacity,
        pointerEvents: "none",
      }}
    />
  );
}

// Mirrors the live MetadataStrip (components/design/layout) so the editor preview
// matches site chrome: filled accent tab, REF catalog number, dotted leader, updated date.
export function TravelMetadataStrip({ data, breakpoint }: { data: TravelDetailData; breakpoint: TravelDetailBreakpoint }) {
  const catNo = `REF. B-${String(Number(data.fileNo)).padStart(2, "0")}`;
  const updatedLabel = `UPDATED ${LAST_UPDATED}`.replace(/\s*·\s*/g, "·");
  const showDetails = breakpoint !== "small";

  return (
    <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pt: breakpoint === "small" ? 3 : 4.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          py: 1,
          flexWrap: "nowrap",
        }}
      >
        <Box
          component="span"
          sx={{
            background: tokens.accent,
            color: tokens.paperCard,
            px: "11px",
            py: "4px",
            letterSpacing: "1.6px",
            alignSelf: "center",
            whiteSpace: "nowrap",
          }}
        >
          {data.section}
        </Box>
        {showDetails && (
          <Box component="span" sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "flex-end", minWidth: 0 }}>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>{catNo}</Box>
            <Box
              component="span"
              aria-hidden
              sx={{ width: 11, borderBottom: `1px dotted ${tokens.hairStrong}`, transform: "translateY(1px)", flex: "0 0 auto" }}
            />
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>{updatedLabel}</Box>
          </Box>
        )}
      </Box>
    </TravelDetailViewportContainer>
  );
}

export function Hero({
  data,
  breakpoint,
  onOpen,
  editable,
}: {
  data: TravelDetailData;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
  editable?: HeroEditableProps;
}) {
  const imageLayout = data.hero.image.layout[breakpoint];
  const copyLayout = data.hero.copyLayout[breakpoint];
  const decorations = useMemo(
    () => [...data.hero.decorations].sort((a, b) => a.layout[breakpoint].zIndex - b.layout[breakpoint].zIndex),
    [breakpoint, data.hero.decorations]
  );

  const heroMetadataFields = data.hero.metadataFields?.filter((field) => field.label.trim() || field.description.trim()) ?? [];
  const heroTitleTopMargin = data.hero.titleTopMargin?.[breakpoint] ?? 11.6;

  return (
    <TravelDetailViewportContainer
      breakpoint={breakpoint}
      sx={{
        pt: 4,
      }}
    >
      <Box
        onClick={() => editable?.onSelect("copy")}
        sx={{
          position: "relative",
          height: data.hero.canvasHeight[breakpoint],
          overflow: "visible",
        }}
      >
        <HeroEditableFrame id="image" layout={imageLayout} editable={editable}>
          <PhotoFrame photo={data.hero.image} breakpoint={breakpoint} priority onOpen={onOpen} rotation={0} />
        </HeroEditableFrame>

        <HeroEditableFrame id="copy" layout={copyLayout} editable={editable}>
          <Box>
            <Typography sx={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "2px", color: tokens.accent, textTransform: "uppercase" }}>
              Section B · Travels No. {data.fileNo}
            </Typography>
            <Typography
              component="h1"
              sx={{
                mt: `${heroTitleTopMargin}px`,
                fontFamily: tokens.serif,
                fontWeight: 400,
                fontSize: breakpoint === "large" ? 88 : breakpoint === "medium" ? 72 : 56,
                lineHeight: 0.86,
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
                mt: 4,
                alignItems: "baseline",
                fontFamily: tokens.mono,
                fontSize: 10,
                letterSpacing: "2.4px",
                color: tokens.ink60,
                textTransform: "uppercase",
                ...(heroMetadataFields.length === 0
                  ? {
                      display: "flex",
                      gap: "8px 18px",
                      flexWrap: "wrap",
                    }
                  : breakpoint === "small"
                  ? {
                      // Small: enforce description stacked under its label.
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }
                  : {
                      display: "grid",
                      gridTemplateColumns: "minmax(116px, auto) 18px minmax(0, 1fr)",
                      gap: "8px 12px",
                    }),
              }}
            >
              {breakpoint === "small"
                ? heroMetadataFields.map((field, index) => (
                    <Box key={`${field.label}-${field.description}-${index}`} sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <Box component="span">{field.label}</Box>
                      <Box component="span" sx={{ minWidth: 0, overflowWrap: "anywhere", color: tokens.ink }}>
                        {field.description}
                      </Box>
                    </Box>
                  ))
                : heroMetadataFields.map((field, index) => (
                    <Fragment key={`${field.label}-${field.description}-${index}`}>
                      <Box component="span">{field.label}</Box>
                      <Box component="span" sx={{ color: tokens.ink }}>
                        ·
                      </Box>
                      <Box component="span" sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                        {field.description}
                      </Box>
                    </Fragment>
                  ))}
            </Box>
          </Box>
        </HeroEditableFrame>

        {decorations.map((decoration) => (
          <HeroEditableFrame key={decoration.id} id={`decoration:${decoration.id}`} layout={decoration.layout[breakpoint]} editable={editable}>
            <HeroTape decoration={decoration} breakpoint={breakpoint} />
          </HeroEditableFrame>
        ))}
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
}: {
  data: TravelDetailData;
  breakpoint: TravelDetailBreakpoint;
  onOpen: (image: LightboxImage) => void;
}) {
  return (
    <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pb: breakpoint === "small" ? 5 : 4, textAlign: "center" }}>
      <Box sx={{ borderTop: `1px solid ${tokens.hairStrong}` }} />
      <Typography sx={{ mt: 2.25, fontFamily: tokens.mono, fontSize: 10, letterSpacing: "2px", color: tokens.accent, textTransform: "uppercase", textAlign: "center" }}>
        {data.closing.eyebrow}
      </Typography>
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
          <Image src={resolveSiteImageSrc(image.src)} alt={image.alt} fill unoptimized sizes="100vw" style={{ objectFit: "contain" }} />
        </Box>
        <Typography sx={{ mt: 1.5, fontFamily: tokens.hand, fontWeight: 500, fontSize: 21, lineHeight: 1.05, color: tokens.paper, textAlign: "center" }}>
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
      <PageShell
        section={data.section}
        catNo={`REF. B-${String(Number(data.fileNo)).padStart(2, "0")}`}
        contentPadding={false}
      >
        <PageContainer sx={{ pt: { xs: 2, md: 2.25 }, pb: { xs: 2, md: 1 } }}>
          <Box
            component={NextLink}
            href="/travels"
            sx={{
              fontFamily: tokens.mono,
              fontSize: 11,
              letterSpacing: "1.6px",
              color: tokens.ink60,
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              "&:hover": { color: tokens.accent },
            }}
          >
            ← Travels
          </Box>
        </PageContainer>
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
