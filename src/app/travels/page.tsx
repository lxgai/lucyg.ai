"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import china24 from "@/data/travel-details/china-24.json";
import { tokens } from "@/components/design/tokens";
import { TRIPS, type Trip } from "@/data/travels";
import { resolveSiteImageSrc } from "@/lib/images";
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

function travelDateValue(trip: TravelIndexEntry) {
  const [month = "1", year = "0"] = trip.date.split("/").map((part) => part.trim());
  return Number(year) * 12 + Number(month);
}

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
  const [sortNewest, setSortNewest] = useState(true);
  const trips = useMemo(
    () =>
      [...TRAVEL_INDEX_ENTRIES].sort((a, b) => {
        const aIndex = TRAVEL_INDEX_ENTRIES.findIndex((trip) => trip.id === a.id);
        const bIndex = TRAVEL_INDEX_ENTRIES.findIndex((trip) => trip.id === b.id);
        const dateDiff = travelDateValue(b) - travelDateValue(a);
        const newestOrder = dateDiff || aIndex - bIndex;

        return sortNewest ? newestOrder : -newestOrder;
      }),
    [sortNewest],
  );
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [titleWidth, setTitleWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [colW, setColW] = useState(0);
  const gap = 36;

  useLayoutEffect(() => {
    const measureTitleWidth = () => {
      const probe = document.createElement("span");
      probe.style.cssText = [
        "position:absolute",
        "top:-9999px",
        "left:-9999px",
        "visibility:hidden",
        "white-space:nowrap",
        `font-family:${tokens.serif}`,
        "font-size:52px",
        "line-height:0.95",
        "letter-spacing:-1.2px",
        "font-weight:400",
      ].join(";");
      document.body.appendChild(probe);

      const widest = TRAVEL_INDEX_ENTRIES.reduce((max, trip) => {
        const { country, yy } = travelTitle(trip);
        probe.textContent = `${country} '${yy}.`;
        return Math.max(max, probe.getBoundingClientRect().width);
      }, 0);

      probe.remove();
      setTitleWidth(Math.ceil(widest) + 8);
    };

    measureTitleWidth();
    void document.fonts?.ready.then(measureTitleWidth);
  }, []);

  useLayoutEffect(() => {
    if (!viewportRef.current) return;

    const update = () => setContainerWidth(viewportRef.current?.offsetWidth ?? 0);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const visible = useMemo(() => {
    if (!containerWidth || !titleWidth) return 1;

    for (const count of [3, 2, 1]) {
      const columnWidth = (containerWidth - (count - 1) * gap) / count;
      if (columnWidth >= titleWidth) return count;
    }

    return 1;
  }, [containerWidth, titleWidth]);

  const hasCarousel = trips.length > visible;
  const maxStart = Math.max(0, trips.length - visible);
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart((current) => Math.min(current, maxStart));
  }, [maxStart, trips.length, visible]);

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
      catNo="REF. B-IDX"
      title={
        <>
          Places, <Box component="span" sx={{ fontStyle: "italic" }}>cataloged.</Box>
        </>
      }
      subtitle={`${trips.length} entries · filed by date`}
    >
      <Box
        sx={{
          mt: 1,
          mb: 3,
          pb: 1.5,
          borderBottom: `1px solid ${tokens.hair}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.8px",
          color: tokens.ink60,
          textTransform: "uppercase",
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => {
            setSortNewest((value) => !value);
            setStart(0);
          }}
          sx={{
            appearance: "none",
            border: 0,
            background: "transparent",
            p: 0,
            color: tokens.ink60,
            cursor: "pointer",
            font: "inherit",
            letterSpacing: "inherit",
            textTransform: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.875,
            transition: "color 160ms",
            "&:hover": { color: tokens.accent },
          }}
        >
          <Box component="span">{sortNewest ? "newest first" : "oldest first"}</Box>
          <Box component="span" aria-hidden sx={{ fontSize: 9, opacity: 0.7 }}>
            ⇅
          </Box>
        </Box>
        {hasCarousel && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.25 }}>
            <Box component="span">
              {String(start + 1).padStart(2, "0")} -{" "}
              {String(Math.min(start + visible, trips.length)).padStart(2, "0")} /{" "}
              {String(trips.length).padStart(2, "0")}
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
        )}
      </Box>

      <Box
        ref={viewportRef}
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          ref={trackRef}
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${trips.length}, calc((100% - ${
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
          {trips.map((trip, i) => (
            <Box key={trip.id} data-trip-col sx={{ height: "100%" }}>
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
        height: "100%",
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
          № {String(idx + 1).padStart(3, "0")}
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
          src={resolveSiteImageSrc(trip.cover)}
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
          fontSize: { xs: 52, md: 52 },
          fontWeight: 400,
          lineHeight: 0.95,
          letterSpacing: "-1.2px",
          whiteSpace: "nowrap",
          m: 0,
          "@media (max-width:430px)": {
            fontSize: 40,
          },
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
        }}
      >
        {trip.sub}
      </Box>

      <Box
        sx={{
          mt: "auto",
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
        height: 26,
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
        "&:disabled, &:disabled:hover": {
          background: "transparent",
          color: tokens.ink40,
          borderColor: tokens.hair,
        },
      }}
    >
      {dir === "prev" ? "←" : "→"}
    </Box>
  );
}
