"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { tokens } from "@/components/design/tokens";
import {
  TravelDetailSectionFrame,
  TravelDetailSurface,
  TravelDetailViewportContainer,
} from "@/components/travel/TravelDetailSectionFrame";
import { Closing, Hero, TravelMetadataStrip } from "@/components/travel/TravelDetailPage";
import {
  travelDetailCanvasWidth,
  travelDetailCanvasXBounds,
  travelDetailSurfaceWidth,
} from "@/components/travel/detailGeometry";
import type {
  TravelDetailBlock,
  TravelDetailBreakpoint,
  TravelDetailData,
  TravelDetailFreeformLayout,
  TravelDetailImageBlock,
  TravelDetailResponsiveLayout,
  TravelDetailSection,
  TravelDetailTapeDecoration,
  TravelDetailTextBlock,
  TravelDetailTextTone,
} from "@/types/travelDetail";

type PageInfo = { slug: string; filePath: string };
type HistoryEntry = { data: TravelDetailData; description: string };
type Selection =
  | { kind: "section"; sectionId: string }
  | { kind: "block"; sectionId: string; id: string }
  | { kind: "decoration"; sectionId: string; id: string };
type DragState = {
  sectionId: string;
  itemKind: "block" | "decoration";
  id: string;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  designWidth: number;
  initial: TravelDetailFreeformLayout;
};

type AssetResponse = { assets?: string[]; error?: string };

type PageResponse = { pages?: PageInfo[]; error?: string };

const breakpoints: TravelDetailBreakpoint[] = ["large", "medium", "small"];
const breakpointLabels: Record<TravelDetailBreakpoint, string> = {
  large: "Large",
  medium: "Medium",
  small: "Small",
};
const tones: TravelDetailTextTone[] = ["body", "caption", "annotation"];
const paper = "#fbf6ee";
const background = "#f1e9df";
const secondaryPaper = "#e6dccb";
const assetDragType = "application/x-travel-detail-asset";
const minCanvasX = travelDetailCanvasXBounds.min;
const maxCanvasX = travelDetailCanvasXBounds.max;
const minCanvasY = -220;

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function defaultLayout(x = 8, y = 24, width = 42, zIndex = 1): TravelDetailResponsiveLayout {
  return {
    large: { x, y, width, rotation: 0, zIndex, visible: true },
    medium: { x, y, width, rotation: 0, zIndex, visible: true },
    small: { x: 6, y, width: Math.min(88, Math.max(36, width * 1.6)), rotation: 0, zIndex, visible: true },
  };
}

function imageName(src: string) {
  return src.split("/").pop() ?? src;
}

function normalizeAssetSrc(src: string) {
  if (src.startsWith("/images/travels/")) return src;

  try {
    const url = new URL(src, window.location.origin);
    const encodedPath = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
    if (!encodedPath) return "";

    const decodedPath = decodeURIComponent(encodedPath);
    return decodedPath.startsWith("/images/travels/") ? decodedPath : "";
  } catch {
    return "";
  }
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(t);
  }, [onClose]);

  return <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 text-sm text-white shadow-lg ${type === "success" ? "bg-green-700" : "bg-red-700"}`}>{message}</div>;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="grid gap-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
      {label}
      {multiline ? (
        <textarea className="min-h-24 border border-stone-300 bg-[#fbf6ee] px-3 py-2 font-serif text-base normal-case tracking-normal text-stone-900 outline-none focus:border-stone-700" value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="border border-stone-300 bg-[#fbf6ee] px-3 py-2 font-serif text-base normal-case tracking-normal text-stone-900 outline-none focus:border-stone-700" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function NumberField({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="grid gap-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
      {label}
      <input type="number" min={min} max={max} step={step} className="border border-stone-300 bg-[#fbf6ee] px-3 py-2 font-mono text-xs normal-case tracking-normal text-stone-900 outline-none focus:border-stone-700" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <label className="grid gap-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
      {label}
      <select className="border border-stone-300 bg-[#fbf6ee] px-3 py-2 font-mono text-xs normal-case tracking-normal text-stone-900 outline-none focus:border-stone-700" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone-500">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function getSelected(data: TravelDetailData, selection: Selection | null) {
  if (!selection) return null;
  const section = data.sections.find((item) => item.id === selection.sectionId);
  if (!section) return null;
  if (selection.kind === "section") return { section, item: section };
  if (selection.kind === "block") return { section, item: section.blocks.find((item) => item.id === selection.id) ?? null };
  return { section, item: section.decorations.find((item) => item.id === selection.id) ?? null };
}

function PreviewBlock({ block, breakpoint, selected, onSelect, onPointerDown }: { block: TravelDetailBlock; breakpoint: TravelDetailBreakpoint; selected: boolean; onSelect: () => void; onPointerDown: (event: React.PointerEvent<HTMLElement>, mode: "move" | "resize") => void }) {
  const layout = block.layout[breakpoint];
  if (!layout.visible) return null;

  return (
    <div className={`absolute outline-offset-2 ${selected ? "outline outline-2 outline-stone-900" : ""}`} draggable={false} style={{ left: `${layout.x}%`, top: layout.y, width: `${layout.width}%`, zIndex: layout.zIndex, transform: `rotate(${layout.rotation}deg)` }} onDragStart={(event) => event.preventDefault()} onPointerDown={(event) => onPointerDown(event, "move")} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      {block.type === "image" ? (
        <figure draggable={false} className={block.cutout ? "" : "border border-stone-500 bg-[#fbf6ee] p-2 shadow-sm"}>
          <div className="relative w-full" style={{ aspectRatio: block.aspect }}>
            {block.src && <Image src={block.src} alt={block.alt} fill sizes="420px" draggable={false} className={block.cutout ? "object-contain drop-shadow-lg" : "object-cover sepia-[.08]"} />}
          </div>
          <figcaption className="mt-1 font-serif text-sm italic leading-tight text-stone-700">{block.caption}</figcaption>
        </figure>
      ) : (
        <p className="font-serif italic leading-snug text-stone-700" style={{ fontSize: block.fontSize[breakpoint] }}>{block.text}</p>
      )}
      <button type="button" aria-label="Resize" className="absolute -bottom-2 -right-2 h-4 w-4 border border-stone-900 bg-[#e6dccb]" onPointerDown={(event) => onPointerDown(event, "resize")} />
    </div>
  );
}

function PreviewTape({ decoration, breakpoint, selected, onSelect, onPointerDown }: { decoration: TravelDetailTapeDecoration; breakpoint: TravelDetailBreakpoint; selected: boolean; onSelect: () => void; onPointerDown: (event: React.PointerEvent<HTMLElement>, mode: "move" | "resize") => void }) {
  const layout = decoration.layout[breakpoint];
  if (!layout.visible) return null;

  return (
    <div className={`absolute border-y border-dashed border-amber-800/25 outline-offset-2 ${selected ? "outline outline-2 outline-stone-900" : ""}`} style={{ left: `${layout.x}%`, top: layout.y, width: `${layout.width}%`, height: decoration.height[breakpoint], zIndex: layout.zIndex, transform: `rotate(${layout.rotation}deg)`, background: decoration.color, opacity: decoration.opacity }} onPointerDown={(event) => onPointerDown(event, "move")} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <button type="button" aria-label="Resize tape" className="absolute -bottom-2 -right-2 h-4 w-4 border border-stone-900 bg-[#e6dccb]" onPointerDown={(event) => onPointerDown(event, "resize")} />
    </div>
  );
}

function SectionPreview({ section, breakpoint, selection, onSelect, onDropAsset, onDragItem }: { section: TravelDetailSection; breakpoint: TravelDetailBreakpoint; selection: Selection | null; onSelect: (selection: Selection) => void; onDropAsset: (sectionId: string, src: string) => void; onDragItem: (state: DragState) => void }) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const width = travelDetailCanvasWidth(section, breakpoint);

  const startDrag = (itemKind: "block" | "decoration", id: string, event: React.PointerEvent<HTMLElement>, mode: "move" | "resize") => {
    event.stopPropagation();
    const item = itemKind === "block" ? section.blocks.find((block) => block.id === id) : section.decorations.find((decoration) => decoration.id === id);
    if (!item) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onDragItem({ sectionId: section.id, itemKind, id, mode, startX: event.clientX, startY: event.clientY, designWidth: width, initial: { ...item.layout[breakpoint] } });
  };

  return (
    <TravelDetailSectionFrame
      section={section}
      breakpoint={breakpoint}
      canvasRef={canvasRef}
      onCanvasClick={() => onSelect({ kind: "section", sectionId: section.id })}
      onCanvasDragOver={(event) => {
        if (event.dataTransfer.types.includes(assetDragType)) event.preventDefault();
      }}
      onCanvasDrop={(event) => {
        const rawSrc = event.dataTransfer.getData(assetDragType);
        if (!rawSrc) return;
        event.preventDefault();
        const src = normalizeAssetSrc(rawSrc);
        if (src) onDropAsset(section.id, src);
      }}
    >
      {section.decorations.map((decoration) => <PreviewTape key={decoration.id} decoration={decoration} breakpoint={breakpoint} selected={selection?.kind === "decoration" && selection.id === decoration.id} onSelect={() => onSelect({ kind: "decoration", sectionId: section.id, id: decoration.id })} onPointerDown={(event, mode) => startDrag("decoration", decoration.id, event, mode)} />)}
      {section.blocks.map((block) => <PreviewBlock key={block.id} block={block} breakpoint={breakpoint} selected={selection?.kind === "block" && selection.id === block.id} onSelect={() => onSelect({ kind: "block", sectionId: section.id, id: block.id })} onPointerDown={(event, mode) => startDrag("block", block.id, event, mode)} />)}
    </TravelDetailSectionFrame>
  );
}

function Preview({ data, breakpoint, selection, onSelect, onDropAsset, onDragItem }: { data: TravelDetailData; breakpoint: TravelDetailBreakpoint; selection: Selection | null; onSelect: (selection: Selection) => void; onDropAsset: (sectionId: string, src: string) => void; onDragItem: (state: DragState) => void }) {
  return (
    <TravelDetailSurface
      breakpoint={breakpoint}
      mode="fixed"
      sx={{
        mx: "auto",
        width: travelDetailSurfaceWidth(breakpoint),
        minHeight: 640,
        maxWidth: "none",
        border: "1px solid rgba(120, 113, 108, 0.65)",
        background,
        color: tokens.ink,
        boxShadow: "0 1px 3px rgba(31, 26, 22, 0.1)",
      }}
    >
      <TravelMetadataStrip data={data} breakpoint={breakpoint} />
      <Hero data={data} breakpoint={breakpoint} onOpen={() => undefined} />
      <TravelDetailViewportContainer breakpoint={breakpoint} sx={{ pt: breakpoint === "small" ? 7 : 7.5 }}>
        {data.sections.map((section) => <SectionPreview key={section.id} section={section} breakpoint={breakpoint} selection={selection} onSelect={onSelect} onDropAsset={onDropAsset} onDragItem={onDragItem} />)}
      </TravelDetailViewportContainer>
      <Closing data={data} breakpoint={breakpoint} onOpen={() => undefined} />
    </TravelDetailSurface>
  );
}

export default function TravelDetailEditorPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [assets, setAssets] = useState<string[]>([]);
  const [data, setData] = useState<TravelDetailData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [breakpoint, setBreakpoint] = useState<TravelDetailBreakpoint>("large");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const skipHistoryRef = useRef(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;
  const selected = data ? getSelected(data, selection) : null;

  const pushHistory = useCallback((nextData: TravelDetailData, description: string) => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { data: structuredClone(nextData), description }]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const updateData = useCallback((description: string, mutator: (draft: TravelDetailData) => void) => {
    setData((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      mutator(next);
      pushHistory(next, description);
      return next;
    });
  }, [pushHistory]);

  useEffect(() => {
    fetch("/api/admin/travel-detail/pages")
      .then((response) => response.json() as Promise<PageResponse>)
      .then((body) => {
        const nextPages = body.pages ?? [];
        setPages(nextPages);
        if (nextPages[0]) setSelectedSlug(nextPages[0].slug);
      })
      .catch(() => setToast({ message: "Failed to load travel detail pages", type: "error" }));
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;

    fetch(`/api/admin/travel-detail/load?slug=${encodeURIComponent(selectedSlug)}`)
      .then((response) => response.json() as Promise<TravelDetailData>)
      .then((nextData) => {
        setData(nextData);
        setSelection(nextData.sections[0] ? { kind: "section", sectionId: nextData.sections[0].id } : null);
        setHistory([{ data: structuredClone(nextData), description: "Initial load" }]);
        setHistoryIndex(0);
      })
      .catch(() => setToast({ message: "Failed to load travel detail", type: "error" }));

    fetch(`/api/admin/travel-detail/assets?slug=${encodeURIComponent(selectedSlug)}`)
      .then((response) => response.json() as Promise<AssetResponse>)
      .then((body) => setAssets(body.assets ?? []))
      .catch(() => setToast({ message: "Failed to load image assets", type: "error" }));
  }, [selectedSlug]);

  useEffect(() => {
    if (!dragState) return;

    const onMove = (event: PointerEvent) => {
      setData((current) => {
        if (!current) return current;
        const next = structuredClone(current);
        const section = next.sections.find((item) => item.id === dragState.sectionId);
        if (!section) return current;
        const item = dragState.itemKind === "block" ? section.blocks.find((block) => block.id === dragState.id) : section.decorations.find((decoration) => decoration.id === dragState.id);
        if (!item) return current;
        const dx = event.clientX - dragState.startX;
        const dy = event.clientY - dragState.startY;
        if (dragState.mode === "resize") {
          item.layout[breakpoint].width = Math.max(5, Math.min(100, dragState.initial.width + (dx / dragState.designWidth) * 100));
        } else {
          item.layout[breakpoint].x = Math.max(minCanvasX, Math.min(maxCanvasX, dragState.initial.x + (dx / dragState.designWidth) * 100));
          item.layout[breakpoint].y = Math.max(minCanvasY, dragState.initial.y + dy);
        }
        return next;
      });
    };

    const onUp = () => {
      setData((current) => {
        if (current) pushHistory(current, dragState.mode === "resize" ? "Resize item" : "Move item");
        return current;
      });
      setDragState(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [breakpoint, dragState, pushHistory]);

  const undo = useCallback(() => {
    if (!canUndo) return;
    const nextIndex = historyIndex - 1;
    skipHistoryRef.current = true;
    setData(structuredClone(history[nextIndex].data));
    setHistoryIndex(nextIndex);
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    skipHistoryRef.current = true;
    setData(structuredClone(history[nextIndex].data));
    setHistoryIndex(nextIndex);
  }, [canRedo, history, historyIndex]);

  const save = async () => {
    if (!data || !selectedSlug) return;
    try {
      const response = await fetch("/api/admin/travel-detail/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: selectedSlug, json: data }) });
      const body = (await response.json()) as { success?: boolean; error?: string };
      setToast(body.success ? { message: "Saved travel detail JSON", type: "success" } : { message: body.error ?? "Save failed", type: "error" });
    } catch {
      setToast({ message: "Save failed", type: "error" });
    }
  };

  const copyJson = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setToast({ message: "Copied JSON", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  };

  const addSection = () => updateData("Add section", (draft) => {
    const index = draft.sections.length + 1;
    const section: TravelDetailSection = {
      id: uid("section"),
      no: String(index).padStart(2, "0"),
      name: "New section",
      nativeName: "",
      romanizedName: "New section",
      dayLabel: "Days",
      coordinates: "",
      align: "left",
      canvas: { largeWidth: 1120, largeHeight: 620, mediumWidth: 860, mediumHeight: 620, smallWidth: 390, smallHeight: 720 },
      blurb: "",
      blocks: [],
      decorations: [],
    };
    draft.sections.push(section);
    setSelection({ kind: "section", sectionId: section.id });
  });

  const addImage = (sectionId: string, src: string) => updateData("Add image", (draft) => {
    const imageSrc = normalizeAssetSrc(src);
    if (!imageSrc) return;
    const section = draft.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const block: TravelDetailImageBlock = { id: uid("image"), type: "image", src: imageSrc, alt: imageName(imageSrc), caption: imageName(imageSrc), aspect: "3 / 2", layout: defaultLayout(8, 40, 42, section.blocks.length + 1) };
    section.blocks.push(block);
    setSelection({ kind: "block", sectionId, id: block.id });
  });

  const addText = (sectionId: string) => updateData("Add text", (draft) => {
    const section = draft.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const block: TravelDetailTextBlock = { id: uid("text"), type: "text", text: "New note", tone: "caption", fontSize: { large: 18, medium: 18, small: 17 }, layout: defaultLayout(8, 120, 34, section.blocks.length + 1) };
    section.blocks.push(block);
    setSelection({ kind: "block", sectionId, id: block.id });
  });

  const addTape = (sectionId: string) => updateData("Add tape", (draft) => {
    const section = draft.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const decoration: TravelDetailTapeDecoration = { id: uid("tape"), type: "tape", color: "rgba(243, 215, 158, 0.65)", opacity: 0.88, height: { large: 24, medium: 24, small: 18 }, layout: defaultLayout(12, 20, 16, 20) };
    section.decorations.push(decoration);
    setSelection({ kind: "decoration", sectionId, id: decoration.id });
  });

  const deleteSelection = () => {
    if (!selection) return;
    updateData("Delete selection", (draft) => {
      if (selection.kind === "section") {
        draft.sections = draft.sections.filter((section) => section.id !== selection.sectionId);
        setSelection(draft.sections[0] ? { kind: "section", sectionId: draft.sections[0].id } : null);
        return;
      }
      const section = draft.sections.find((item) => item.id === selection.sectionId);
      if (!section) return;
      if (selection.kind === "block") section.blocks = section.blocks.filter((block) => block.id !== selection.id);
      if (selection.kind === "decoration") section.decorations = section.decorations.filter((decoration) => decoration.id !== selection.id);
      setSelection({ kind: "section", sectionId: section.id });
    });
  };

  const updateLayout = (next: Partial<TravelDetailFreeformLayout>) => {
    if (!selection || selection.kind === "section") return;
    updateData("Edit layout", (draft) => {
      const section = draft.sections.find((item) => item.id === selection.sectionId);
      const item = selection.kind === "block" ? section?.blocks.find((block) => block.id === selection.id) : section?.decorations.find((decoration) => decoration.id === selection.id);
      if (item) item.layout[breakpoint] = { ...item.layout[breakpoint], ...next };
    });
  };

  const selectedSectionId = selection?.sectionId ?? data?.sections[0]?.id ?? "";
  const selectedSection = data?.sections.find((section) => section.id === selectedSectionId) ?? null;
  const sectionItem = selected?.item && "blocks" in selected.item ? selected.item : null;
  const layoutItem = selected?.item && "layout" in selected.item ? selected.item : null;

  if (!data) {
    return <main className="min-h-screen bg-[#f1e9df] p-6 font-mono text-sm uppercase tracking-[0.16em] text-stone-600">Loading travel detail editor...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f1e9df] text-stone-900">
      <div className="sticky top-0 z-40 border-b border-stone-400 bg-[#e6dccb] px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Dev only · Travel detail editor</div><h1 className="font-serif text-3xl italic leading-none">Section canvas editor</h1></div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="border border-stone-400 bg-[#fbf6ee] px-3 py-2 font-mono text-xs" value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>{pages.map((page) => <option key={page.slug} value={page.slug}>{page.slug}</option>)}</select>
            {breakpoints.map((item) => <button key={item} className={`border border-stone-500 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] ${breakpoint === item ? "bg-stone-900 text-[#fbf6ee]" : ""}`} onClick={() => setBreakpoint(item)}>{breakpointLabels[item]}</button>)}
            <button className="border border-stone-500 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] disabled:opacity-40" disabled={!canUndo} onClick={undo}>Undo</button>
            <button className="border border-stone-500 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] disabled:opacity-40" disabled={!canRedo} onClick={redo}>Redo</button>
            <button className="border border-stone-500 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]" onClick={copyJson}>Copy JSON</button>
            <button className="bg-stone-900 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#fbf6ee]" onClick={save}>Save</button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[280px_minmax(0,1fr)_280px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <aside className="grid content-start gap-5">
          <div className="border border-stone-400 bg-[#fbf6ee] p-4">
            <div className="flex items-center justify-between gap-3"><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Sections</h2><button className="border border-stone-500 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" onClick={addSection}>Add section</button></div>
            <div className="mt-3 grid gap-2">{data.sections.map((section) => <button key={section.id} className={`border px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.12em] ${selection?.sectionId === section.id ? "border-stone-900 bg-[#e6dccb]" : "border-stone-300"}`} onClick={() => setSelection({ kind: "section", sectionId: section.id })}>{section.no} · {section.name}</button>)}</div>
            {selectedSection && <div className="mt-3 flex gap-2"><button className="border border-stone-500 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" onClick={() => addText(selectedSection.id)}>Add text</button><button className="border border-stone-500 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" onClick={() => addTape(selectedSection.id)}>Add tape</button></div>}
          </div>

          <div className="border border-stone-400 bg-[#fbf6ee] p-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Image library</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">{assets.map((asset) => <button key={asset} draggable onDragStart={(event) => { event.dataTransfer.setData(assetDragType, asset); event.dataTransfer.setData("text/plain", asset); }} onClick={() => selectedSection && addImage(selectedSection.id, asset)} className="border border-stone-300 bg-[#f1e9df] p-1 text-left"><div className="relative aspect-square bg-stone-200">{asset && <Image src={asset} alt="" fill sizes="140px" className="object-cover" draggable={false} />}</div><div className="mt-1 truncate font-mono text-[10px] text-stone-600">{imageName(asset)}</div></button>)}</div>
          </div>

          <div className="border border-stone-400 bg-[#fbf6ee] p-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Trip metadata</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Section" value={data.section} onChange={(section) => updateData("Edit section", (draft) => void (draft.section = section))} />
              <Field label="Catalog" value={data.catNo} onChange={(catNo) => updateData("Edit catalog", (draft) => void (draft.catNo = catNo))} />
              <Field label="Place" value={data.metadata.place} onChange={(place) => updateData("Edit place", (draft) => void (draft.metadata.place = place))} />
              <Field label="Date range" value={data.metadata.dateRange} onChange={(dateRange) => updateData("Edit date range", (draft) => void (draft.metadata.dateRange = dateRange))} />
              <Field label="Duration" value={data.metadata.duration} onChange={(duration) => updateData("Edit duration", (draft) => void (draft.metadata.duration = duration))} />
              <Field label="City summary" value={data.metadata.citySummary} onChange={(citySummary) => updateData("Edit city summary", (draft) => void (draft.metadata.citySummary = citySummary))} />
            </div>
          </div>

          <div className="border border-stone-400 bg-[#fbf6ee] p-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Hero</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Title" value={data.hero.title} onChange={(title) => updateData("Edit hero title", (draft) => void (draft.hero.title = title))} />
              <Field label="Subtitle line" value={data.hero.italicTitle ?? ""} onChange={(italicTitle) => updateData("Edit hero subtitle", (draft) => void (draft.hero.italicTitle = italicTitle))} />
              <Field label="Hero intro" value={data.hero.intro} multiline onChange={(intro) => updateData("Edit hero intro", (draft) => void (draft.hero.intro = intro))} />
              <Field label="Facts" value={data.hero.facts.join(" | ")} onChange={(facts) => updateData("Edit hero facts", (draft) => void (draft.hero.facts = facts.split("|").map((item) => item.trim()).filter(Boolean)))} />
              <Field label="Hero image" value={data.hero.image.src} onChange={(src) => updateData("Edit hero image", (draft) => void (draft.hero.image.src = src))} />
              <Field label="Hero caption" value={data.hero.image.caption} onChange={(caption) => updateData("Edit hero caption", (draft) => void (draft.hero.image.caption = caption))} />
              <Field label="Hero alt" value={data.hero.image.alt} onChange={(alt) => updateData("Edit hero alt", (draft) => void (draft.hero.image.alt = alt))} />
            </div>
          </div>

          <div className="border border-stone-400 bg-[#fbf6ee] p-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Closing</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Eyebrow" value={data.closing.eyebrow} onChange={(eyebrow) => updateData("Edit closing eyebrow", (draft) => void (draft.closing.eyebrow = eyebrow))} />
              <Field label="Title" value={data.closing.title} onChange={(title) => updateData("Edit closing title", (draft) => void (draft.closing.title = title))} />
              <Field label="Note title" value={data.closing.noteTitle} onChange={(noteTitle) => updateData("Edit closing note title", (draft) => void (draft.closing.noteTitle = noteTitle))} />
              <Field label="Note" value={data.closing.note} multiline onChange={(note) => updateData("Edit closing note", (draft) => void (draft.closing.note = note))} />
              <Field label="Signature" value={data.closing.signature} onChange={(signature) => updateData("Edit closing signature", (draft) => void (draft.closing.signature = signature))} />
              <Field label="Closing image" value={data.closing.image.src} onChange={(src) => updateData("Edit closing image", (draft) => void (draft.closing.image.src = src))} />
              <Field label="Closing caption" value={data.closing.image.caption} onChange={(caption) => updateData("Edit closing caption", (draft) => void (draft.closing.image.caption = caption))} />
              <Field label="Closing alt" value={data.closing.image.alt} onChange={(alt) => updateData("Edit closing alt", (draft) => void (draft.closing.image.alt = alt))} />
            </div>
          </div>
        </aside>

        <section className="overflow-auto px-2 pb-4"><Preview data={data} breakpoint={breakpoint} selection={selection} onSelect={setSelection} onDropAsset={addImage} onDragItem={setDragState} /></section>

        <aside className="sticky top-24 h-[calc(100vh-7rem)] overflow-auto border border-stone-400 bg-[#fbf6ee] p-4">
          <div className="flex items-center justify-between gap-3"><h2 className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Selection</h2><button className="border border-stone-500 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] disabled:opacity-40" disabled={!selection} onClick={deleteSelection}>Delete</button></div>
          {!selected?.item && <p className="mt-4 font-serif text-sm italic text-stone-600">Select a section, image, text block, or tape piece.</p>}
          {sectionItem && (
            <div className="mt-4 grid gap-3">
              <Field label="Name" value={sectionItem.name} onChange={(name) => updateData("Edit section name", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.name = name; })} />
              <Field label="Native name" value={sectionItem.nativeName} onChange={(nativeName) => updateData("Edit native name", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.nativeName = nativeName; })} />
              <Field label="Romanized name" value={sectionItem.romanizedName} onChange={(romanizedName) => updateData("Edit romanized name", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.romanizedName = romanizedName; })} />
              <Field label="Day label" value={sectionItem.dayLabel} onChange={(dayLabel) => updateData("Edit day label", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.dayLabel = dayLabel; })} />
              <Field label="Coordinates" value={sectionItem.coordinates} onChange={(coordinates) => updateData("Edit coordinates", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.coordinates = coordinates; })} />
              <SelectField label="Alignment" value={sectionItem.align} options={["left", "right"] as const} onChange={(align) => updateData("Edit section align", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.align = align; })} />
              <NumberField label="Large width" value={sectionItem.canvas.largeWidth} min={640} onChange={(largeWidth) => updateData("Edit large width", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.largeWidth = largeWidth; })} />
              <NumberField label="Large height" value={sectionItem.canvas.largeHeight} min={240} onChange={(largeHeight) => updateData("Edit large height", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.largeHeight = largeHeight; })} />
              <NumberField label="Medium width" value={sectionItem.canvas.mediumWidth} min={480} onChange={(mediumWidth) => updateData("Edit medium width", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.mediumWidth = mediumWidth; })} />
              <NumberField label="Medium height" value={sectionItem.canvas.mediumHeight} min={240} onChange={(mediumHeight) => updateData("Edit medium height", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.mediumHeight = mediumHeight; })} />
              <NumberField label="Small width" value={sectionItem.canvas.smallWidth} min={280} onChange={(smallWidth) => updateData("Edit small width", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.smallWidth = smallWidth; })} />
              <NumberField label="Small height" value={sectionItem.canvas.smallHeight} min={240} onChange={(smallHeight) => updateData("Edit small height", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.canvas.smallHeight = smallHeight; })} />
              <Field label="Blurb" value={sectionItem.blurb} multiline onChange={(blurb) => updateData("Edit blurb", (draft) => { const section = draft.sections.find((item) => item.id === sectionItem.id); if (section) section.blurb = blurb; })} />
            </div>
          )}
          {layoutItem && (
            <div className="mt-4 grid gap-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{layoutItem.id} · {layoutItem.type} · {breakpointLabels[breakpoint]}</div>
              {layoutItem.type === "image" && (
                <>
                  <Field label="Image path" value={layoutItem.src} onChange={(src) => updateData("Edit image path", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "image") block.src = src; })} />
                  <Field label="Alt" value={layoutItem.alt} onChange={(alt) => updateData("Edit alt", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "image") block.alt = alt; })} />
                  <Field label="Caption" value={layoutItem.caption} onChange={(caption) => updateData("Edit caption", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "image") block.caption = caption; })} />
                  <Field label="Aspect" value={layoutItem.aspect} onChange={(aspect) => updateData("Edit aspect", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "image") block.aspect = aspect; })} />
                  <CheckboxField label="Cutout" checked={Boolean(layoutItem.cutout)} onChange={(cutout) => updateData("Edit cutout", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "image") block.cutout = cutout; })} />
                </>
              )}
              {layoutItem.type === "text" && (
                <>
                  <Field label="Text" value={layoutItem.text} multiline onChange={(text) => updateData("Edit text", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "text") block.text = text; })} />
                  <SelectField label="Tone" value={layoutItem.tone ?? "caption"} options={tones} onChange={(tone) => updateData("Edit tone", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "text") block.tone = tone; })} />
                  <NumberField label="Font size" value={layoutItem.fontSize[breakpoint]} min={8} max={80} onChange={(fontSize) => updateData("Edit font size", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const block = section?.blocks.find((item) => item.id === layoutItem.id); if (block?.type === "text") block.fontSize[breakpoint] = fontSize; })} />
                </>
              )}
              {layoutItem.type === "tape" && (
                <>
                  <Field label="Color" value={layoutItem.color} onChange={(color) => updateData("Edit tape color", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const decoration = section?.decorations.find((item) => item.id === layoutItem.id); if (decoration) decoration.color = color; })} />
                  <NumberField label="Opacity" value={layoutItem.opacity} min={0} max={1} step={0.05} onChange={(opacity) => updateData("Edit tape opacity", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const decoration = section?.decorations.find((item) => item.id === layoutItem.id); if (decoration) decoration.opacity = opacity; })} />
                  <NumberField label="Height" value={layoutItem.height[breakpoint]} min={4} max={80} onChange={(height) => updateData("Edit tape height", (draft) => { const section = draft.sections.find((item) => item.id === selection?.sectionId); const decoration = section?.decorations.find((item) => item.id === layoutItem.id); if (decoration) decoration.height[breakpoint] = height; })} />
                </>
              )}
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="X %" value={layoutItem.layout[breakpoint].x} min={minCanvasX} max={maxCanvasX} step={0.1} onChange={(x) => updateLayout({ x })} />
                <NumberField label="Y px" value={layoutItem.layout[breakpoint].y} min={minCanvasY} step={1} onChange={(y) => updateLayout({ y })} />
                <NumberField label="Width %" value={layoutItem.layout[breakpoint].width} min={1} max={100} step={0.1} onChange={(width) => updateLayout({ width })} />
                <NumberField label="Rotation" value={layoutItem.layout[breakpoint].rotation} min={-45} max={45} step={0.1} onChange={(rotation) => updateLayout({ rotation })} />
                <NumberField label="Z-index" value={layoutItem.layout[breakpoint].zIndex} min={0} onChange={(zIndex) => updateLayout({ zIndex })} />
                <CheckboxField label="Visible" checked={layoutItem.layout[breakpoint].visible} onChange={(visible) => updateLayout({ visible })} />
              </div>
            </div>
          )}
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">Last history entry: {history[historyIndex]?.description ?? "none"}</div>
        </aside>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style jsx global>{`:root { --editor-paper: ${paper}; --editor-background: ${background}; --editor-secondary: ${secondaryPaper}; }`}</style>
    </main>
  );
}
