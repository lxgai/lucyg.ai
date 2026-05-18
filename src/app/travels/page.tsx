"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import china24 from "@/data/travel-details/china-24.json";
import { tokens } from "@/components/design/tokens";
import { TRIPS, type Trip } from "@/data/travels";
import { getTravelDetailIndexMeta } from "@/lib/travelDetailIndex";
import type { TravelDetailData } from "@/types/travelDetail";

const TRAVEL_DETAILS: Partial<Record<string, TravelDetailData>> = {
  "china-24": china24 as TravelDetailData,
};

type TravelIndexEntry = Trip & {
  detail?: TravelDetailData;
};

const TRAVEL_INDEX_ENTRIES: TravelIndexEntry[] = TRIPS.map((trip) => {
  const detail = TRAVEL_DETAILS[trip.id];
  if (!detail) return trip;

  const detailMeta = getTravelDetailIndexMeta(detail);

  return {
    ...trip,
    place: detail.metadata.place || trip.place,
    sub: detailMeta.citySummary || trip.sub,
    date: detailMeta.date || trip.date,
    duration: detailMeta.duration || trip.duration,
    detail,
  };
});

function travelTitle(trip: TravelIndexEntry) {
  const parts = trip.place
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const yy = (trip.date.match(/(\d{4})/)?.[1] ?? "").slice(-2);

  return { country, yy };
}

export default function TravelsPage() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768,
  );
  const visible = isMobile ? 1 : 3;
  const hasCarousel = TRAVEL_INDEX_ENTRIES.length > visible;
  const maxStart = Math.max(0, TRAVEL_INDEX_ENTRIES.length - visible);
  const [start, setStart] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [colW, setColW] = useState(0);
  const gap = 36;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setStart((current) => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (!trackRef.current) return;

    const update = () => {
      const first = trackRef.current?.querySelector<HTMLElement>("[data-trip-col]");
      if (first) setColW(first.offsetWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  const canPrev = start > 0;
  const canNext = start < maxStart;

  return (
    <PageShell
      section="SECTION B · TRAVELS"
      catNo="file: travels.idx"
      title={
        <>
          Places, <Box component="span" sx={{ fontStyle: "italic" }}>cataloged.</Box>
        </>
      }
      subtitle={`${TRAVEL_INDEX_ENTRIES.length} entries · filed by date`}
    >
      {hasCarousel && (
        <Box
          sx={{
            mt: 1,
            mb: 3,
            pb: 1.75,
            borderBottom: `1px solid ${tokens.hair}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "1.8px",
            color: tokens.ink60,
            textTransform: "uppercase",
          }}
        >
          <Box component="span">filed by date · newest first</Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.25 }}>
            <Box component="span">
              {String(start + 1).padStart(2, "0")} -{" "}
              {String(Math.min(start + visible, TRAVEL_INDEX_ENTRIES.length)).padStart(2, "0")} /{" "}
              {String(TRAVEL_INDEX_ENTRIES.length).padStart(2, "0")}
            </Box>
            <TravelsArrow
              disabled={!canPrev}
              dir="prev"
              onClick={() => {
                if (canPrev) setStart((current) => current - 1);
              }}
            />
            <TravelsArrow
              disabled={!canNext}
              dir="next"
              onClick={() => {
                if (canNext) setStart((current) => current + 1);
              }}
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          ref={trackRef}
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${TRAVEL_INDEX_ENTRIES.length}, calc((100% - ${
              (visible - 1) * gap
            }px) / ${visible}))`,
            gap: `${gap}px`,
            transform:
              hasCarousel && colW
                ? `translateX(${-start * (colW + gap)}px)`
                : "translateX(0)",
            transition: "transform 480ms cubic-bezier(.2,.7,.2,1)",
            willChange: "transform",
          }}
        >
          {TRAVEL_INDEX_ENTRIES.map((trip, i) => (
            <Box key={trip.id} data-trip-col>
              <TravelsColumn trip={trip} idx={i} />
            </Box>
          ))}
        </Box>
      </Box>
    </PageShell>
  );
}

function TravelsColumn({ trip, idx }: { trip: TravelIndexEntry; idx: number }) {
  const { country, yy } = travelTitle(trip);

  return (
    <MuiLink
      component={NextLink}
      href={`/travels/${trip.id}`}
      underline="none"
      sx={{
        display: "flex",
        flexDirection: "column",
        color: tokens.ink,
        cursor: "pointer",
        minHeight: "100%",
        "&:hover .travel-image": {
          transform: "translateY(-6px)",
        },
        "&:hover .travel-cta": {
          color: tokens.ink,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.8px",
          color: tokens.ink60,
          textTransform: "uppercase",
          mb: 2.25,
        }}
      >
        <Box component="span">
          № {String(idx + 1).padStart(3, "0")} · {trip.stamp}
        </Box>
        <Box component="span" sx={{ color: tokens.accent }}>
          {trip.date}
        </Box>
      </Box>

      <Box
        className="travel-image"
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          overflow: "hidden",
          mb: 2.75,
          transition: "transform 380ms cubic-bezier(.2,.7,.2,1)",
          background: tokens.paperDeep,
        }}
      >
        <Image
          src={trip.cover}
          alt={trip.place}
          fill
          sizes="(max-width: 768px) 90vw, 30vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "saturate(0.92)",
          }}
        />
      </Box>

      <Typography
        component="h2"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 48, md: 52 },
          fontWeight: 400,
          lineHeight: 0.95,
          letterSpacing: "-1.2px",
          m: 0,
        }}
      >
        {country}{" "}
        <Box component="span" sx={{ color: tokens.accent, fontStyle: "italic" }}>
          &rsquo;{yy}.
        </Box>
      </Typography>

      <Box
        sx={{
          fontFamily: tokens.serif,
          fontSize: 17,
          fontStyle: "italic",
          color: tokens.ink60,
          mt: 1.5,
          lineHeight: 1.45,
          flex: 1,
        }}
      >
        {trip.sub}
      </Box>

      <Box
        sx={{
          mt: 2.75,
          pt: 1.75,
          borderTop: `1px solid ${tokens.hair}`,
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.4px",
          color: tokens.ink60,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box component="span">{trip.duration}</Box>
        <Box className="travel-cta" component="span" sx={{ color: tokens.accent }}>
          read entry →
        </Box>
      </Box>
    </MuiLink>
  );
}

function TravelsArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous trips" : "Next trips"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        border: `1px solid ${disabled ? tokens.hair : tokens.hairStrong}`,
        borderRadius: 0,
        background: "transparent",
        color: disabled ? tokens.ink40 : tokens.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: tokens.mono,
        fontSize: 14,
        lineHeight: 1,
        transition: "background 180ms, color 180ms, border-color 180ms",
        userSelect: "none",
        "&:hover": disabled
          ? {}
          : {
              background: tokens.accent,
              color: tokens.paper,
              borderColor: tokens.accent,
            },
      }}
    >
      {dir === "prev" ? "←" : "→"}
    </Box>
  );
}
