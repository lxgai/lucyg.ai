"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Article from "@/components/site/Article";
import {
  CanvasItemContent,
  TravelBlockView,
  canvasClassName,
  canvasItemClassName,
  splitHero,
  travelArticleDates,
} from "@/components/travel/TravelArticle";
import { ALIGNMENTS, BACKGROUNDS, CANVAS_FONTS, CANVAS_WIDTH, canvasItemStyle } from "@/components/travel/travelCanvas";
import { parseDateParts } from "@/lib/dates";
import { resolveSiteImageSrc } from "@/lib/images";
import { slugify } from "@/lib/slug";
import type {
  TravelAlign,
  TravelArticle,
  TravelBlock,
  TravelBackground,
  TravelCanvasBlock,
  TravelCanvasFont,
  TravelCanvasItem,
  TravelSectionBlock,
} from "@/types/travelArticle";

type Selection = { blockId: string; itemId?: string } | null;
// Omit applied to each member of the canvas item union.
type NewCanvasItem = TravelCanvasItem extends infer Item ? (Item extends TravelCanvasItem ? Omit<Item, "zIndex"> : never) : never;
type Toast = { message: string; type: "success" | "error" } | null;
type Drag = {
  mode: "move" | "resize" | "rotate" | "height";
  blockId: string;
  itemId?: string;
  startX: number;
  startY: number;
  base: TravelArticle;
  initial: { x: number; y: number; width: number; height: number; centerX: number; centerY: number };
};

const assetDragType = "application/x-travel-asset";
const MIN_CANVAS_HEIGHT = 40;

const panelClass = "grid content-start gap-3 border border-[var(--lightgray)] p-4";
const headingClass = "font-[family-name:var(--font-heading)] text-lg text-[var(--dark)]";
const labelClass = "grid gap-1 text-xs font-semibold opacity-70";
const inputClass =
  "w-full min-w-0 border border-[var(--lightgray)] bg-[var(--light)] px-2 py-1.5 text-sm font-normal text-[var(--darkgray)] opacity-100 outline-none focus:border-[var(--underline)]";
const buttonClass =
  "border border-[var(--lightgray)] px-2.5 py-1.5 text-xs font-semibold text-[var(--darkgray)] hover:border-[var(--underline)] disabled:opacity-40";
const primaryButtonClass =
  "bg-[var(--darkgray)] px-3 py-1.5 text-xs font-semibold text-[var(--light)] disabled:opacity-40";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function imageName(src: string) {
  return src.split("/").pop() ?? src;
}

// "MM / DD / YYYY" ⇄ the <input type="date"> value "YYYY-MM-DD".
function toInputDate(value: string) {
  const parts = parseDateParts(value);
  if (!parts) return "";
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function fromInputDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${month} / ${day} / ${year}` : "";
}

// Section ids are the slugged title, kept unique across the article's blocks.
function sectionId(article: TravelArticle, block: TravelSectionBlock) {
  const base = slugify(block.title) || "section";
  const taken = new Set(article.blocks.filter((other) => other.id !== block.id).map((other) => other.id));
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  return id;
}

// Re-derives section anchors from their titles on save, so ids stay stable while typing.
function withSectionIds(article: TravelArticle) {
  const next = clone(article);
  const renamed = new Map<string, string>();
  for (const block of next.blocks) {
    if (block.type !== "section") continue;
    const id = sectionId(next, block);
    if (id !== block.id) renamed.set(block.id, id);
    block.id = id;
  }
  return { article: next, renamed };
}

function findBlock(article: TravelArticle, blockId: string) {
  return article.blocks.find((block) => block.id === blockId);
}

function findCanvas(article: TravelArticle, blockId: string) {
  const block = findBlock(article, blockId);
  return block?.type === "canvas" ? block : undefined;
}

function findItem(article: TravelArticle, blockId: string, itemId: string) {
  return findCanvas(article, blockId)?.items.find((item) => item.id === itemId);
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={labelClass}>
      {label}
      {children}
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <input className={inputClass} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function NumberInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <Field label={label}>
      <input
        type="number"
        step={step}
        className={inputClass}
        value={Math.round(value * 10) / 10}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </Field>
  );
}

function BackgroundPicker({ value, onChange }: { value: TravelBackground; onChange: (value: TravelBackground) => void }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold opacity-70">Background</span>
      <div className="grid grid-cols-3 gap-1.5">
        {BACKGROUNDS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            className="grid gap-1 border border-[var(--lightgray)] p-1 text-[10px] font-semibold aria-pressed:border-[var(--underline)] aria-pressed:text-[var(--underline)]"
            onClick={() => onChange(option.value)}
          >
            <span className={canvasClassName(option.value)} style={{ display: "block", height: 28, marginBottom: 0 }} />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AlignPicker({ label, value, onChange }: { label: string; value: TravelAlign; onChange: (value: TravelAlign) => void }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold opacity-70">{label}</span>
      <div className="grid grid-cols-3 gap-1.5">
        {ALIGNMENTS.map((option) => (
          <button key={option.value} type="button" aria-pressed={value === option.value} className={`${buttonClass} aria-pressed:border-[var(--underline)] aria-pressed:text-[var(--underline)]`} onClick={() => onChange(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold opacity-70">City tags</span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span key={tag} className="inline-flex items-center gap-1 bg-[color-mix(in_srgb,var(--underline)_12%,transparent)] px-1.5 py-0.5 text-xs font-semibold text-[var(--underline)]">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} className="opacity-70 hover:opacity-100" onClick={() => onChange(tags.filter((_, other) => other !== index))}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inputClass} min-w-0 flex-1`}
          value={draft}
          placeholder="Add a city"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className={buttonClass} onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}

function CanvasEditor({
  block,
  selection,
  onSelect,
  onStartDrag,
  onDropAsset,
}: {
  block: TravelCanvasBlock;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onStartDrag: (event: React.PointerEvent, mode: Drag["mode"], itemId?: string) => void;
  onDropAsset: (src: string, x: number, y: number) => void;
}) {
  return (
    <div className="relative" style={{ marginBottom: 20 }}>
      <div
        className={canvasClassName(block.background)}
        style={{ height: block.height, marginBottom: 0, outline: "1px dashed var(--gray)" }}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) onSelect({ blockId: block.id });
        }}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes(assetDragType)) event.preventDefault();
        }}
        onDrop={(event) => {
          const src = event.dataTransfer.getData(assetDragType);
          if (!src) return;
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          onDropAsset(src, event.clientX - rect.left, event.clientY - rect.top);
        }}
      >
        {block.items.map((item) => {
          const selected = selection?.blockId === block.id && selection.itemId === item.id;
          return (
            <div
              key={item.id}
              className={canvasItemClassName(item)}
              style={{
                ...canvasItemStyle(item, block.height),
                cursor: "move",
                outline: selected ? "2px solid var(--underline)" : undefined,
                touchAction: "none",
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ blockId: block.id, itemId: item.id });
                onStartDrag(event, "move", item.id);
              }}
            >
              <CanvasItemContent item={item} />
              {selected && (
                <>
                  <span
                    aria-label="Rotate"
                    title="Drag to rotate (shift snaps to 15°)"
                    className="absolute left-1/2 top-1 h-3.5 w-3.5 -translate-x-1/2 cursor-grab rounded-full border-2 border-[var(--underline)] bg-[var(--light)]"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      onStartDrag(event, "rotate", item.id);
                    }}
                  />
                  <span
                    aria-label="Resize"
                    title="Drag to resize"
                    className="absolute bottom-0 right-0 h-3.5 w-3.5 cursor-nwse-resize border-2 border-[var(--underline)] bg-[var(--light)]"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      onStartDrag(event, "resize", item.id);
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div
        aria-label="Resize canvas height"
        title="Drag to change the canvas height"
        className="absolute -bottom-1.5 left-1/2 h-3 w-16 -translate-x-1/2 cursor-ns-resize bg-[var(--gray)] hover:bg-[var(--underline)]"
        onPointerDown={(event) => {
          event.stopPropagation();
          onSelect({ blockId: block.id });
          onStartDrag(event, "height");
        }}
      />
    </div>
  );
}

function newBlock(type: TravelBlock["type"]): TravelBlock {
  switch (type) {
    case "image":
      return { id: uid("image"), type: "image", src: "", alt: "" };
    case "text":
      return { id: uid("text"), type: "text", text: "" };
    case "section":
      return { id: uid("section"), type: "section", level: 2, title: "" };
    case "canvas":
      return { id: uid("canvas"), type: "canvas", height: 400, background: "none", items: [] };
  }
}

export default function TravelDetailEditorClient() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [assets, setAssets] = useState<string[]>([]);
  const [article, setArticle] = useState<TravelArticle | null>(null);
  const [saved, setSaved] = useState<TravelArticle | null>(null);
  const [past, setPast] = useState<TravelArticle[]>([]);
  const [future, setFuture] = useState<TravelArticle[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const lastCommit = useRef<{ key: string; at: number } | null>(null);
  const latest = useRef<TravelArticle | null>(null);
  latest.current = article;

  const dirty = article !== null && saved !== null && JSON.stringify(article) !== JSON.stringify(saved);

  useEffect(() => {
    fetch("/api/admin/travel-article/pages")
      .then((response) => response.json() as Promise<{ slugs?: string[]; error?: string }>)
      .then((result) => {
        setSlugs(result.slugs ?? []);
        setSlug((current) => current || result.slugs?.[0] || "");
        if (result.error) setToast({ message: result.error, type: "error" });
      })
      .catch(() => setToast({ message: "Couldn't list travel articles", type: "error" }));
  }, []);

  useEffect(() => {
    if (!slug) return;
    setArticle(null);
    setSelection(null);
    setPast([]);
    setFuture([]);

    fetch(`/api/admin/travel-article/load?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json() as Promise<TravelArticle & { error?: string }>)
      .then((result) => {
        if (result.error) throw new Error(result.error);
        setArticle(result);
        setSaved(result);
      })
      .catch((error: Error) => setToast({ message: error.message || "Couldn't load article", type: "error" }));

    fetch(`/api/admin/travel-article/assets?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json() as Promise<{ assets?: string[] }>)
      .then((result) => setAssets(result.assets ?? []))
      .catch(() => setAssets([]));
  }, [slug]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Applies a change with undo history. Edits sharing a key within a second
  // (typing in one field) collapse into a single undo step.
  const update = useCallback(
    (mutate: (draft: TravelArticle) => void, key?: string) => {
      if (!article) return;
      const draft = clone(article);
      mutate(draft);

      const now = Date.now();
      const coalesce = key && lastCommit.current?.key === key && now - lastCommit.current.at < 1000;
      if (!coalesce) setPast((stack) => [...stack.slice(-99), article]);
      lastCommit.current = key ? { key, at: now } : null;
      setFuture([]);
      setArticle(draft);
    },
    [article],
  );

  const undo = useCallback(() => {
    if (!article || past.length === 0) return;
    setFuture((stack) => [article, ...stack]);
    setArticle(past[past.length - 1]);
    setPast((stack) => stack.slice(0, -1));
    lastCommit.current = null;
  }, [article, past]);

  const redo = useCallback(() => {
    if (!article || future.length === 0) return;
    setPast((stack) => [...stack, article]);
    setArticle(future[0]);
    setFuture((stack) => stack.slice(1));
    lastCommit.current = null;
  }, [article, future]);

  const save = useCallback(async () => {
    if (!article) return;
    const { article: next, renamed } = withSectionIds(article);
    try {
      const response = await fetch("/api/admin/travel-article/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, json: next }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Save failed");
      setArticle(next);
      setSaved(next);
      setSelection((current) => (current && renamed.has(current.blockId) ? { ...current, blockId: renamed.get(current.blockId)! } : current));
      setToast({ message: `Saved ${slug}`, type: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Save failed", type: "error" });
    }
  }, [article, slug]);

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    update((draft) => {
      if (selection.itemId) {
        const canvas = findCanvas(draft, selection.blockId);
        if (canvas) canvas.items = canvas.items.filter((item) => item.id !== selection.itemId);
      } else {
        draft.blocks = draft.blocks.filter((block) => block.id !== selection.blockId);
      }
    });
    setSelection(selection.itemId ? { blockId: selection.blockId } : null);
  }, [selection, update]);

  // Keyboard: undo/redo, save, delete, and arrow-key nudging for canvas items.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
        return;
      }
      if (isTyping(event.target)) return;

      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if ((event.key === "Delete" || event.key === "Backspace") && selection) {
        event.preventDefault();
        deleteSelection();
      } else if (selection?.itemId && event.key.startsWith("Arrow")) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        const { blockId, itemId } = selection;
        update((draft) => {
          const item = findItem(draft, blockId, itemId);
          if (!item) return;
          item.x += dx;
          item.y += dy;
        }, `nudge-${itemId}`);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelection, redo, save, selection, undo, update]);

  // Pointer drags edit the article live and become one undo step on release.
  useEffect(() => {
    if (!drag) return;
    const active = drag;

    function onMove(event: PointerEvent) {
      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      const next = clone(active.base);

      if (active.mode === "height") {
        const canvas = findCanvas(next, active.blockId);
        if (canvas) canvas.height = Math.max(MIN_CANVAS_HEIGHT, Math.round(active.initial.height + dy));
      } else if (active.itemId) {
        const item = findItem(next, active.blockId, active.itemId);
        if (!item) return;
        if (active.mode === "move") {
          item.x = Math.round(active.initial.x + dx);
          item.y = Math.round(active.initial.y + dy);
        } else if (active.mode === "resize") {
          item.width = Math.max(20, Math.round(active.initial.width + dx));
        } else {
          // The handle sits above the centre, so pointing straight up is 0°.
          const angle = (Math.atan2(event.clientY - active.initial.centerY, event.clientX - active.initial.centerX) * 180) / Math.PI + 90;
          const snap = event.shiftKey ? 15 : 1;
          let rotation = Math.round(angle / snap) * snap;
          if (rotation > 180) rotation -= 360;
          item.rotation = rotation;
        }
      }
      setArticle(next);
    }

    function onUp() {
      setDrag(null);
      if (latest.current && JSON.stringify(latest.current) !== JSON.stringify(active.base)) {
        setPast((stack) => [...stack.slice(-99), active.base]);
        setFuture([]);
      }
      lastCommit.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag]);

  function startDrag(event: React.PointerEvent, mode: Drag["mode"], blockId: string, itemId?: string) {
    if (!article || event.button !== 0) return;
    event.preventDefault();
    const canvas = findCanvas(article, blockId);
    const item = itemId ? findItem(article, blockId, itemId) : undefined;
    // Handles sit inside the item, so the item box is their parent.
    const target = event.currentTarget as HTMLElement;
    const rect = ((mode === "move" ? target : target.parentElement) ?? target).getBoundingClientRect();
    setDrag({
      mode,
      blockId,
      itemId,
      startX: event.clientX,
      startY: event.clientY,
      base: article,
      initial: {
        x: item?.x ?? 0,
        y: item?.y ?? 0,
        width: item?.width ?? 0,
        height: canvas?.height ?? 0,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      },
    });
  }

  function insertBlock(block: TravelBlock) {
    update((draft) => {
      const index = selection ? draft.blocks.findIndex((other) => other.id === selection.blockId) : -1;
      draft.blocks.splice(index === -1 ? draft.blocks.length : index + 1, 0, block);
    });
    setSelection({ blockId: block.id });
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    update((draft) => {
      const index = draft.blocks.findIndex((block) => block.id === blockId);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= draft.blocks.length) return;
      [draft.blocks[index], draft.blocks[target]] = [draft.blocks[target], draft.blocks[index]];
    });
  }

  function addCanvasItem(blockId: string, item: NewCanvasItem) {
    update((draft) => {
      const canvas = findCanvas(draft, blockId);
      if (!canvas) return;
      const zIndex = Math.max(0, ...canvas.items.map((other) => other.zIndex)) + 1;
      canvas.items.push({ ...item, zIndex });
    });
    setSelection({ blockId, itemId: item.id });
  }

  function addCanvasImage(blockId: string, src: string, centerX?: number, centerY?: number) {
    const canvas = article && findCanvas(article, blockId);
    if (!canvas) return;
    const width = 300;
    addCanvasItem(blockId, {
      id: uid("img"),
      kind: "image",
      src,
      alt: "",
      x: Math.round((centerX ?? CANVAS_WIDTH / 2) - width / 2),
      y: Math.round((centerY ?? canvas.height / 2) - width / 3),
      width,
      rotation: 0,
    });
  }

  function addCanvasText(blockId: string) {
    const canvas = article && findCanvas(article, blockId);
    if (!canvas) return;
    addCanvasItem(blockId, {
      id: uid("text"),
      kind: "text",
      text: "New text",
      font: "hand",
      size: 18,
      x: Math.round(CANVAS_WIDTH / 2 - 120),
      y: Math.round(canvas.height / 2 - 14),
      width: 240,
      rotation: 0,
    });
  }

  // Library clicks fill the selected image block, add to the selected canvas,
  // or append a new image block.
  function applyAsset(src: string) {
    if (!article) return;
    const block = selection ? findBlock(article, selection.blockId) : undefined;
    if (block?.type === "image") {
      update((draft) => {
        const target = findBlock(draft, block.id);
        if (target?.type === "image") target.src = src;
      });
    } else if (block?.type === "canvas") {
      addCanvasImage(block.id, src);
    } else {
      insertBlock({ id: uid("image"), type: "image", src, alt: "" });
    }
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[var(--light)] p-6 text-sm text-[var(--darkgray)]">
        {slugs.length === 0 && slug === "" ? "No travel articles in src/data/travel-articles yet." : "Loading travel editor…"}
        {toast && <p className="mt-2">{toast.message}</p>}
      </main>
    );
  }

  const selectedBlock = selection ? findBlock(article, selection.blockId) : undefined;
  const selectedItem = selection?.itemId ? findItem(article, selection.blockId, selection.itemId) : undefined;
  const libraryHint =
    selectedBlock?.type === "image"
      ? "Click to set the selected image"
      : selectedBlock?.type === "canvas"
        ? "Click or drag onto the canvas to add"
        : "Click to add an image block";
  const { hero, body } = splitHero(article.blocks);

  // A block in the preview with its selection outline and move controls;
  // index is its position in article.blocks.
  const renderBlock = (block: TravelBlock, index: number) => {
    const selected = selection?.blockId === block.id;
    return (
      <div
        key={block.id}
        className="group relative"
        style={{ outline: selected && !selection?.itemId ? "2px solid var(--underline)" : undefined, outlineOffset: 4 }}
        onPointerDown={() => {
          if (!selected || selection?.itemId) setSelection({ blockId: block.id });
        }}
      >
        {block.type === "canvas" ? (
          <CanvasEditor
            block={block}
            selection={selection}
            onSelect={setSelection}
            onStartDrag={(event, mode, itemId) => startDrag(event, mode, block.id, itemId)}
            onDropAsset={(src, x, y) => addCanvasImage(block.id, src, x, y)}
          />
        ) : block.type === "image" && !block.src ? (
          <div className="mb-5 grid h-40 place-items-center border border-dashed border-[var(--gray)] text-sm opacity-60">Pick an image from the library</div>
        ) : block.type === "text" && !block.text.trim() ? (
          <p className="mb-5 text-sm opacity-60">Empty text block. Write in the panel on the right.</p>
        ) : block.type === "section" && !block.title.trim() ? (
          <p className="mb-5 text-sm opacity-60">Untitled section. Add a title on the right.</p>
        ) : (
          <TravelBlockView block={block} />
        )}
        <div className={`absolute -left-11 top-0 grid gap-1 ${selected ? "" : "invisible group-hover:visible"}`}>
          <button type="button" aria-label="Move up" className={buttonClass} disabled={index === 0} onClick={() => moveBlock(block.id, -1)}>↑</button>
          <button type="button" aria-label="Move down" className={buttonClass} disabled={index === article.blocks.length - 1} onClick={() => moveBlock(block.id, 1)}>↓</button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--light)] font-[family-name:var(--font-body)] text-[var(--darkgray)]">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--lightgray)] bg-[var(--light)] px-5 py-3">
        <div>
          <p className="text-xs opacity-60">Dev only</p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl leading-none text-[var(--dark)]">Travel editor</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className={inputClass}
            value={slug}
            onChange={(event) => {
              if (dirty && !window.confirm("Discard unsaved changes?")) return;
              setSlug(event.target.value);
            }}
          >
            {slugs.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type="button" className={buttonClass} disabled={past.length === 0} onClick={undo}>
            Undo
          </button>
          <button type="button" className={buttonClass} disabled={future.length === 0} onClick={redo}>
            Redo
          </button>
          <a className={buttonClass} href={`/travels/${slug}`} target="_blank" rel="noopener noreferrer">
            View page ↗
          </a>
          <button type="button" className={primaryButtonClass} disabled={!dirty} onClick={() => void save()}>
            {dirty ? "Save" : "Saved"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 p-5 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="grid content-start gap-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-auto">
          <section className={panelClass}>
            <h2 className={headingClass}>Page</h2>
            <TextInput label="Title" value={article.title} onChange={(title) => update((draft) => void (draft.title = title), "title")} />
            <TextInput label="Place (Travel Log name)" value={article.place} onChange={(place) => update((draft) => void (draft.place = place), "place")} />
            <div className="grid gap-2">
              <Field label="Start">
                <input type="date" className={inputClass} value={toInputDate(article.startDate)} onChange={(event) => update((draft) => void (draft.startDate = fromInputDate(event.target.value)))} />
              </Field>
              <Field label="End">
                <input type="date" className={inputClass} value={toInputDate(article.endDate)} onChange={(event) => update((draft) => void (draft.endDate = fromInputDate(event.target.value)))} />
              </Field>
            </div>
            <TagEditor tags={article.tags} onChange={(tags) => update((draft) => void (draft.tags = tags))} />
          </section>

          <section className={panelClass}>
            <h2 className={headingClass}>Add block</h2>
            <p className="text-xs opacity-60">Inserted after the selected block.</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={buttonClass} onClick={() => insertBlock(newBlock("image"))}>Image</button>
              <button type="button" className={buttonClass} onClick={() => insertBlock(newBlock("text"))}>Text</button>
              <button type="button" className={buttonClass} onClick={() => insertBlock(newBlock("canvas"))}>Canvas</button>
              <button type="button" className={buttonClass} onClick={() => insertBlock(newBlock("section"))}>Section</button>
            </div>
          </section>

          <section className={panelClass}>
            <h2 className={headingClass}>Image library</h2>
            <p className="text-xs opacity-60">{libraryHint}</p>
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => (
                <button
                  key={asset}
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(assetDragType, asset);
                    event.dataTransfer.setData("text/plain", asset);
                  }}
                  onClick={() => applyAsset(asset)}
                  className="border border-[var(--lightgray)] p-1 text-left hover:border-[var(--underline)]"
                >
                  <span className="relative block aspect-square bg-[var(--lightgray)]">
                    <Image src={resolveSiteImageSrc(asset)} alt="" fill sizes="130px" className="object-contain" draggable={false} />
                  </span>
                  <span className="mt-1 block truncate text-[10px]">{imageName(asset)}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0 overflow-x-auto pb-24" onPointerDown={(event) => event.target === event.currentTarget && setSelection(null)}>
          {/* The column renders at its real 720px width so canvas coordinates are 1:1. */}
          <div style={{ width: CANVAS_WIDTH, margin: "0 auto", fontSize: 18, lineHeight: 1.65 } as CSSProperties}>
            <Article
              title={article.title || "Untitled"}
              meta={travelArticleDates(article)}
              tags={article.tags}
              hero={hero && renderBlock(hero, 0)}
            >
              {article.blocks.length === 0 && <p className="text-sm opacity-60">Add a block from the left to start.</p>}
              {body.map((block, index) => renderBlock(block, hero ? index + 1 : index))}
            </Article>
          </div>
        </section>

        <aside className={`${panelClass} xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-auto`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className={headingClass}>{selectedItem ? (selectedItem.kind === "image" ? "Canvas image" : "Text box") : selectedBlock ? `${selectedBlock.type[0].toUpperCase()}${selectedBlock.type.slice(1)} block` : "Selection"}</h2>
            <button type="button" className={buttonClass} disabled={!selection} onClick={deleteSelection}>
              Delete
            </button>
          </div>

          {!selectedBlock && <p className="text-sm opacity-60">Select a block in the page to edit it.</p>}

          {selectedBlock?.type === "image" && (
            <>
              <p className="text-xs opacity-60">{selectedBlock.src ? imageName(selectedBlock.src) : "No image yet. Pick one from the library."}</p>
              <TextInput label="Alt text" value={selectedBlock.alt} onChange={(alt) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "image") block.alt = alt; }, `alt-${selectedBlock.id}`)} />
              <TextInput label="Caption (optional)" value={selectedBlock.caption ?? ""} onChange={(caption) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "image") block.caption = caption || undefined; }, `caption-${selectedBlock.id}`)} />
              <AlignPicker label="Caption alignment" value={selectedBlock.captionAlign ?? "left"} onChange={(align) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "image") block.captionAlign = align === "left" ? undefined : align; })} />
              <BackgroundPicker value={selectedBlock.background ?? "none"} onChange={(background) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "image") block.background = background === "none" ? undefined : background; })} />
              <p className="text-xs opacity-60">The background shows through transparent parts of the image, with 8px of padding around it.</p>
            </>
          )}

          {selectedBlock?.type === "text" && (
            <Field label="Text (a blank line starts a new paragraph)">
              <textarea rows={14} className={inputClass} value={selectedBlock.text} onChange={(event) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "text") block.text = event.target.value; }, `text-${selectedBlock.id}`)} />
            </Field>
          )}

          {selectedBlock?.type === "section" && (
            <>
              <TextInput
                label="Section title (required)"
                value={selectedBlock.title}
                placeholder="Hangzhou"
                onChange={(title) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "section") block.title = title; }, `title-${selectedBlock.id}`)}
              />
              <Field label="Priority">
                <select className={inputClass} value={selectedBlock.level} onChange={(event) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "section") block.level = Number(event.target.value) === 3 ? 3 : 2; })}>
                  <option value={2}>Header 2</option>
                  <option value={3}>Header 3</option>
                </select>
              </Field>
              <TextInput label="Alt. title (optional)" value={selectedBlock.altTitle ?? ""} placeholder="杭州" onChange={(altTitle) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "section") block.altTitle = altTitle || undefined; }, `alt-${selectedBlock.id}`)} />
              <TextInput label="Subtitle (optional)" value={selectedBlock.subtitle ?? ""} placeholder="days 1 - 4" onChange={(subtitle) => update((draft) => { const block = findBlock(draft, selectedBlock.id); if (block?.type === "section") block.subtitle = subtitle || undefined; }, `subtitle-${selectedBlock.id}`)} />
              <p className="text-xs opacity-60">Anchor on save: #{sectionId(article, selectedBlock)}</p>
            </>
          )}

          {selectedBlock?.type === "canvas" && !selectedItem && (
            <>
              <NumberInput label="Height (px at 720 wide)" value={selectedBlock.height} onChange={(height) => update((draft) => { const canvas = findCanvas(draft, selectedBlock.id); if (canvas) canvas.height = Math.max(MIN_CANVAS_HEIGHT, Math.round(height)); }, `height-${selectedBlock.id}`)} />
              <BackgroundPicker value={selectedBlock.background} onChange={(background) => update((draft) => { const canvas = findCanvas(draft, selectedBlock.id); if (canvas) canvas.background = background; })} />
              <button type="button" className={buttonClass} onClick={() => addCanvasText(selectedBlock.id)}>
                Add text box
              </button>
              <p className="text-xs opacity-60">Add images by clicking them in the library or dragging them onto the canvas. Drag the bar under the canvas to change its height. Anything outside the canvas is clipped.</p>
            </>
          )}

          {selectedBlock?.type === "canvas" && selectedItem && (
            <>
              {selectedItem.kind === "text" ? (
                <>
                  <Field label="Text">
                    <textarea rows={5} className={inputClass} value={selectedItem.text} onChange={(event) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "text") item.text = event.target.value; }, `text-${selectedItem.id}`)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Font">
                      <select className={inputClass} value={selectedItem.font} onChange={(event) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "text") item.font = event.target.value as TravelCanvasFont; })}>
                        {CANVAS_FONTS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                    <NumberInput label="Size (px)" value={selectedItem.size} onChange={(size) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "text") item.size = Math.max(6, size); }, `size-${selectedItem.id}`)} />
                  </div>
                  <AlignPicker label="Alignment" value={selectedItem.align ?? "left"} onChange={(align) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "text") item.align = align === "left" ? undefined : align; })} />
                </>
              ) : (
                <>
                  <p className="text-xs opacity-60">{imageName(selectedItem.src)}</p>
                  <TextInput label="Alt text (empty for decorations)" value={selectedItem.alt} onChange={(alt) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "image") item.alt = alt; }, `alt-${selectedItem.id}`)} />
                  <TextInput label="Caption (optional)" value={selectedItem.caption ?? ""} onChange={(caption) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "image") item.caption = caption || undefined; }, `caption-${selectedItem.id}`)} />
                  <AlignPicker label="Caption alignment" value={selectedItem.captionAlign ?? "left"} onChange={(align) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "image") item.captionAlign = align === "left" ? undefined : align; })} />
                  <BackgroundPicker value={selectedItem.background ?? "none"} onChange={(background) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item?.kind === "image") item.background = background === "none" ? undefined : background; })} />
                </>
              )}
              <div className="grid grid-cols-2 gap-2">
                {(["x", "y", "width", "rotation"] as const).map((key) => (
                  <NumberInput
                    key={key}
                    label={key === "rotation" ? "Rotation (°)" : key === "width" ? "Width" : key.toUpperCase()}
                    value={selectedItem[key]}
                    onChange={(value) => update((draft) => { const item = findItem(draft, selectedBlock.id, selectedItem.id); if (item) item[key] = key === "width" ? Math.max(20, value) : value; }, `${key}-${selectedItem.id}`)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" className={buttonClass} onClick={() => update((draft) => { const canvas = findCanvas(draft, selectedBlock.id); const item = findItem(draft, selectedBlock.id, selectedItem.id); if (canvas && item) item.zIndex = Math.max(...canvas.items.map((other) => other.zIndex)) + 1; })}>
                  Bring to front
                </button>
                <button type="button" className={buttonClass} onClick={() => update((draft) => { const canvas = findCanvas(draft, selectedBlock.id); const item = findItem(draft, selectedBlock.id, selectedItem.id); if (canvas && item) item.zIndex = Math.min(...canvas.items.map((other) => other.zIndex)) - 1; })}>
                  Send to back
                </button>
              </div>
              <p className="text-xs opacity-60">Drag to move, the corner square to resize, the circle to rotate (shift snaps to 15°). Arrow keys nudge by 1px, shift by 10px.</p>
            </>
          )}
        </aside>
      </div>

      {toast && (
        <div role="status" className={`fixed bottom-5 right-5 z-50 px-4 py-2 text-sm font-semibold ${toast.type === "success" ? "bg-[var(--underline)] text-[var(--light)]" : "bg-[var(--darkgray)] text-[var(--light)]"}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
}
