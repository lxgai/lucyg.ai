"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { tokens } from "@/components/design/tokens";
import { resolveSiteImageSrc } from "@/lib/images";
import type { ResolvedTravelEntry } from "@/data/travelEntries";

type CoverMap = Record<string, string>;
type ToastState = { message: string; type: "success" | "error" } | null;

function travelTitle(trip: ResolvedTravelEntry) {
  const parts = trip.place
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const yy = (trip.date.match(/(\d{4})/)?.[1] ?? "").slice(-2);

  return { country, yy };
}

function assetName(src: string) {
  return src.split("/").pop() ?? src;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 50,
        px: 2,
        py: 1,
        fontFamily: tokens.mono,
        fontSize: 12,
        color: "#fff",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        background: toast.type === "success" ? "#3f6f43" : "#9b3838",
      }}
    >
      {toast.message}
    </Box>
  );
}

function CoverCard({
  trip,
  cover,
  index,
  selected,
  dirty,
  onSelect,
}: {
  trip: ResolvedTravelEntry;
  cover: string;
  index: number;
  selected: boolean;
  dirty: boolean;
  onSelect: () => void;
}) {
  const { country, yy } = travelTitle(trip);

  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        appearance: "none",
        textAlign: "left",
        font: "inherit",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        color: tokens.ink,
        background: "transparent",
        p: 1.5,
        border: `1px solid ${selected ? tokens.accent : "transparent"}`,
        outline: selected ? `1px solid ${tokens.accent}` : "none",
        transition: "border-color 160ms",
        "&:hover": { borderColor: selected ? tokens.accent : tokens.hair },
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
          mb: 1.5,
        }}
      >
        <Box component="span">№ {String(index + 1).padStart(3, "0")}</Box>
        <Box component="span" sx={{ color: tokens.accent }}>
          {dirty ? "● edited" : trip.date}
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          overflow: "hidden",
          mb: 2,
          background: tokens.paperDeep,
        }}
      >
        {cover ? (
          <Image
            src={resolveSiteImageSrc(cover)}
            alt={trip.place}
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            style={{ objectFit: "cover", objectPosition: "center", filter: "saturate(0.92)" }}
          />
        ) : null}
      </Box>

      <Typography
        component="h2"
        sx={{
          fontFamily: tokens.serif,
          fontSize: 40,
          fontWeight: 400,
          lineHeight: 0.95,
          letterSpacing: "-1.2px",
          whiteSpace: "nowrap",
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
          fontSize: 15,
          fontStyle: "italic",
          color: tokens.ink60,
          mt: 1,
          lineHeight: 1.4,
        }}
      >
        {trip.sub}
      </Box>
    </Box>
  );
}

function AssetPicker({
  trip,
  assets,
  loading,
  currentCover,
  onPick,
}: {
  trip: ResolvedTravelEntry;
  assets: string[];
  loading: boolean;
  currentCover: string;
  onPick: (src: string) => void;
}) {
  return (
    <Box>
      <Box
        sx={{
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: tokens.ink60,
          mb: 1.5,
        }}
      >
        {trip.id} · choose cover
      </Box>

      {loading ? (
        <Box sx={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.ink40 }}>Loading photos…</Box>
      ) : assets.length === 0 ? (
        <Box sx={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.ink40 }}>No photos found.</Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
            gap: 1.25,
          }}
        >
          {assets.map((asset) => {
            const active = asset === currentCover;
            return (
              <Box
                key={asset}
                component="button"
                type="button"
                onClick={() => onPick(asset)}
                title={assetName(asset)}
                sx={{
                  appearance: "none",
                  p: 0,
                  cursor: "pointer",
                  background: "transparent",
                  border: `2px solid ${active ? tokens.accent : tokens.hair}`,
                  outline: active ? `1px solid ${tokens.accent}` : "none",
                  transition: "border-color 140ms",
                  "&:hover": { borderColor: tokens.accent },
                }}
              >
                <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: tokens.paperDeep }}>
                  <Image
                    src={resolveSiteImageSrc(asset)}
                    alt={assetName(asset)}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <Box
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 8,
                    color: active ? tokens.accent : tokens.ink40,
                    px: 0.5,
                    py: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {assetName(asset)}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default function TravelCoverEditorClient() {
  const [trips, setTrips] = useState<ResolvedTravelEntry[]>([]);
  const [covers, setCovers] = useState<CoverMap>({});
  const [originalCovers, setOriginalCovers] = useState<CoverMap>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assetsByTrip, setAssetsByTrip] = useState<Record<string, string[]>>({});
  const [assetsLoading, setAssetsLoading] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/admin/travel-cover/load");
        const data = (await res.json()) as { trips?: ResolvedTravelEntry[]; error?: string };
        if (cancelled) return;

        const loaded = data.trips ?? [];
        const map: CoverMap = {};
        for (const trip of loaded) map[trip.id] = trip.cover;

        setTrips(loaded);
        setCovers(map);
        setOriginalCovers(map);
        setSelectedId(loaded[0]?.id ?? null);
      } catch {
        if (!cancelled) setToast({ message: "Failed to load trips", type: "error" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadAssets = useCallback(
    async (slug: string) => {
      if (assetsByTrip[slug] || assetsLoading[slug]) return;

      setAssetsLoading((prev) => ({ ...prev, [slug]: true }));
      try {
        const res = await fetch(`/api/admin/travel-cover/assets?slug=${encodeURIComponent(slug)}`);
        const data = (await res.json()) as { assets?: string[]; error?: string };
        setAssetsByTrip((prev) => ({ ...prev, [slug]: data.assets ?? [] }));
      } catch {
        setAssetsByTrip((prev) => ({ ...prev, [slug]: [] }));
      } finally {
        setAssetsLoading((prev) => ({ ...prev, [slug]: false }));
      }
    },
    [assetsByTrip, assetsLoading],
  );

  useEffect(() => {
    if (selectedId) void loadAssets(selectedId);
  }, [selectedId, loadAssets]);

  const dirtyIds = useMemo(
    () => new Set(trips.filter((trip) => covers[trip.id] !== originalCovers[trip.id]).map((trip) => trip.id)),
    [trips, covers, originalCovers],
  );
  const isDirty = dirtyIds.size > 0;

  const selectedTrip = trips.find((trip) => trip.id === selectedId) ?? null;

  const handleSave = useCallback(async () => {
    if (!isDirty || saving) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/travel-cover/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ covers }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };

      if (data.success) {
        setOriginalCovers(covers);
        setToast({ message: "Covers saved", type: "success" });
      } else {
        setToast({ message: data.error ?? "Save failed", type: "error" });
      }
    } catch {
      setToast({ message: "Save failed", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [covers, isDirty, saving]);

  return (
    <Box sx={{ minHeight: "100svh", width: "100%", background: tokens.paper, color: tokens.ink }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          px: { xs: 2.5, md: 7 },
          py: 2,
          borderBottom: `1px solid ${tokens.hairStrong}`,
          background: tokens.paper,
        }}
      >
        <Box>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: tokens.ink60,
            }}
          >
            Admin · Dev only
          </Box>
          <Typography
            sx={{ fontFamily: tokens.serif, fontSize: 26, lineHeight: 1.1, m: 0, mt: 0.5 }}
          >
            Travel cover{" "}
            <Box component="span" sx={{ fontStyle: "italic" }}>
              editor.
            </Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.ink40 }}>
            {isDirty ? `${dirtyIds.size} unsaved` : "no changes"}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setCovers(originalCovers)}
            disabled={!isDirty || saving}
            sx={{
              appearance: "none",
              fontFamily: tokens.mono,
              fontSize: 11,
              letterSpacing: "1px",
              textTransform: "uppercase",
              px: 2,
              py: 1,
              border: `1px solid ${tokens.hairStrong}`,
              background: "transparent",
              color: tokens.ink,
              cursor: !isDirty || saving ? "not-allowed" : "pointer",
              opacity: !isDirty || saving ? 0.4 : 1,
            }}
          >
            Reset
          </Box>
          <Box
            component="button"
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            sx={{
              appearance: "none",
              fontFamily: tokens.mono,
              fontSize: 11,
              letterSpacing: "1px",
              textTransform: "uppercase",
              px: 2,
              py: 1,
              border: `1px solid ${tokens.accent}`,
              background: !isDirty || saving ? "transparent" : tokens.accent,
              color: !isDirty || saving ? tokens.ink40 : tokens.paper,
              cursor: !isDirty || saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 380px" },
          gap: { xs: 4, lg: 5 },
          px: { xs: 2.5, md: 7 },
          py: 4,
          alignItems: "start",
        }}
      >
        <Box>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: tokens.ink60,
              mb: 2,
            }}
          >
            Index grid preview · click a trip to edit its cover
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {trips.map((trip, index) => (
              <CoverCard
                key={trip.id}
                trip={trip}
                cover={covers[trip.id] ?? trip.cover}
                index={index}
                selected={trip.id === selectedId}
                dirty={dirtyIds.has(trip.id)}
                onSelect={() => setSelectedId(trip.id)}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            position: { lg: "sticky" },
            top: { lg: 96 },
            border: `1px solid ${tokens.hair}`,
            background: tokens.paperCard,
            p: 2.5,
          }}
        >
          {selectedTrip ? (
            <AssetPicker
              trip={selectedTrip}
              assets={assetsByTrip[selectedTrip.id] ?? []}
              loading={!!assetsLoading[selectedTrip.id]}
              currentCover={covers[selectedTrip.id] ?? selectedTrip.cover}
              onPick={(src) => setCovers((prev) => ({ ...prev, [selectedTrip.id]: src }))}
            />
          ) : (
            <Box sx={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.ink40 }}>
              Select a trip to choose its cover.
            </Box>
          )}
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Box>
  );
}
