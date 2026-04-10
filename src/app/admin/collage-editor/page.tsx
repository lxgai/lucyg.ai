"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CollageItem, CollageLayoutData } from "@/types/collage";

type Breakpoint = "large" | "medium" | "small";

const ASPECT_RATIOS: Record<Breakpoint, number> = {
  large: 56.25,
  medium: 75,
  small: 150,
};

interface PageInfo {
  slug: string;
  filePath: string;
}

interface HistoryEntry {
  data: CollageLayoutData;
  description: string;
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] px-4 py-2 rounded shadow-lg text-white text-sm ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}

// ─── Main Editor ────────────────────────────────────────────────────────────
export default function CollageEditorPage() {
  // Production guard
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  // Page / data state
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [layoutData, setLayoutData] = useState<CollageLayoutData | null>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("large");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipHistoryRef = useRef(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Canvas ref for coordinate calculations
  const canvasRef = useRef<HTMLDivElement>(null);

  // Interaction state
  const [dragState, setDragState] = useState<{
    itemId: string;
    mode: "move" | "resize" | "rotate";
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origRotate: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  // Current items for active breakpoint
  const items: CollageItem[] = layoutData ? layoutData[breakpoint] : [];
  const selectedItem = items.find((i) => i.id === selectedItemId) ?? null;

  // ─── Push history ──────────────────────────────────────────────────────
  const pushHistory = useCallback(
    (data: CollageLayoutData, description: string) => {
      if (skipHistoryRef.current) {
        skipHistoryRef.current = false;
        return;
      }
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, { data: structuredClone(data), description }];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // ─── Update items helper ──────────────────────────────────────────────
  const updateItems = useCallback(
    (newItems: CollageItem[], desc: string, record = true) => {
      if (!layoutData) return;
      const newData = { ...layoutData, [breakpoint]: newItems };
      setLayoutData(newData);
      if (record) pushHistory(newData, desc);
    },
    [layoutData, breakpoint, pushHistory]
  );

  // ─── Update a single item ─────────────────────────────────────────────
  const updateItem = useCallback(
    (id: string, patch: Partial<CollageItem>, desc: string, record = true) => {
      updateItems(
        items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        desc,
        record
      );
    },
    [items, updateItems]
  );

  // ─── Fetch pages ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/collage/pages")
      .then((r) => r.json())
      .then((d) => setPages(d.pages || []))
      .catch(() => setToast({ message: "Failed to load pages", type: "error" }));
  }, []);

  // ─── Load page data ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedSlug) return;
    fetch(`/api/admin/collage/load?slug=${selectedSlug}`)
      .then((r) => r.json())
      .then((data: CollageLayoutData) => {
        setLayoutData(data);
        setSelectedItemId(null);
        setHistory([{ data: structuredClone(data), description: "Initial load" }]);
        setHistoryIndex(0);
      })
      .catch(() => setToast({ message: "Failed to load page data", type: "error" }));
  }, [selectedSlug]);

  // ─── Undo / Redo ──────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    skipHistoryRef.current = true;
    setLayoutData(structuredClone(history[newIndex].data));
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    skipHistoryRef.current = true;
    setLayoutData(structuredClone(history[newIndex].data));
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" && selectedItemId) {
        e.preventDefault();
        updateItems(
          items.filter((i) => i.id !== selectedItemId),
          `Delete ${selectedItemId}`
        );
        setSelectedItemId(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedItemId, items, updateItems]);

  // ─── Save ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!layoutData || !selectedFilePath) return;
    try {
      const res = await fetch("/api/admin/collage/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: selectedFilePath, json: layoutData }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Saved successfully!", type: "success" });
      } else {
        setToast({ message: data.error || "Save failed", type: "error" });
      }
    } catch {
      setToast({ message: "Save failed", type: "error" });
    }
  };

  // ─── Copy to clipboard ────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!layoutData) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(layoutData, null, 2));
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  };

  // ─── Canvas coordinate helpers ─────────────────────────────────────────
  const getCanvasRect = () => canvasRef.current?.getBoundingClientRect() ?? null;

  const pxToPercent = (pxX: number, pxY: number) => {
    const rect = getCanvasRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (pxX / rect.width) * 100,
      y: (pxY / rect.height) * 100,
    };
  };

  // ─── Pointer handlers ─────────────────────────────────────────────────
  const handleItemPointerDown = (
    e: React.PointerEvent,
    item: CollageItem,
    mode: "move" | "resize" | "rotate"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItemId(item.id);

    const rect = getCanvasRect();
    if (!rect) return;

    let centerX = 0;
    let centerY = 0;
    if (mode === "rotate") {
      // Center of the item in screen pixels
      centerX = rect.left + (item.x / 100) * rect.width + ((item.w / 100) * rect.width) / 2;
      centerY = rect.top + (item.y / 100) * rect.height;
    }

    setDragState({
      itemId: item.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      origW: item.w,
      origRotate: item.rotate,
      centerX,
      centerY,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    e.preventDefault();

    const rect = getCanvasRect();
    if (!rect) return;

    if (dragState.mode === "move") {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      const dPercent = pxToPercent(dx, dy);
      updateItem(
        dragState.itemId,
        {
          x: Math.round((dragState.origX + dPercent.x) * 100) / 100,
          y: Math.round((dragState.origY + dPercent.y) * 100) / 100,
        },
        "Move",
        false
      );
    } else if (dragState.mode === "resize") {
      const dx = e.clientX - dragState.startX;
      const dw = (dx / rect.width) * 100;
      const newW = Math.max(2, Math.round((dragState.origW + dw) * 100) / 100);
      updateItem(dragState.itemId, { w: newW }, "Resize", false);
    } else if (dragState.mode === "rotate") {
      const angle =
        Math.atan2(e.clientY - dragState.centerY, e.clientX - dragState.centerX) *
        (180 / Math.PI);
      const startAngle =
        Math.atan2(dragState.startY - dragState.centerY, dragState.startX - dragState.centerX) *
        (180 / Math.PI);
      const newRotate = Math.round(dragState.origRotate + (angle - startAngle));
      updateItem(dragState.itemId, { rotate: newRotate }, "Rotate", false);
    }
  };

  const handlePointerUp = () => {
    if (dragState && layoutData) {
      pushHistory(layoutData, `${dragState.mode} ${dragState.itemId}`);
    }
    setDragState(null);
  };

  // ─── Delete selected ──────────────────────────────────────────────────
  const deleteSelected = () => {
    if (!selectedItemId) return;
    updateItems(
      items.filter((i) => i.id !== selectedItemId),
      `Delete ${selectedItemId}`
    );
    setSelectedItemId(null);
  };

  // ─── Property change handler ──────────────────────────────────────────
  const handlePropChange = (field: string, value: string | number) => {
    if (!selectedItem) return;
    updateItem(selectedItem.id, { [field]: value } as Partial<CollageItem>, `Edit ${field}`);
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 select-none">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <span className="font-bold text-sm tracking-wide text-gray-300">COLLAGE EDITOR</span>

        {/* Page selector */}
        <select
          className="bg-gray-700 text-gray-100 text-sm rounded px-2 py-1 border border-gray-600"
          value={selectedSlug}
          onChange={(e) => {
            const slug = e.target.value;
            setSelectedSlug(slug);
            const page = pages.find((p) => p.slug === slug);
            setSelectedFilePath(page?.filePath ?? "");
          }}
        >
          <option value="">Select page...</option>
          {pages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.slug}
            </option>
          ))}
        </select>

        {/* Breakpoint selector */}
        {(["large", "medium", "small"] as Breakpoint[]).map((bp) => (
          <button
            key={bp}
            onClick={() => {
              setBreakpoint(bp);
              setSelectedItemId(null);
            }}
            className={`text-xs px-3 py-1 rounded ${
              breakpoint === bp
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {bp}
          </button>
        ))}

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </button>
        <button
          onClick={deleteSelected}
          disabled={!selectedItemId}
          className="text-xs px-2 py-1 rounded bg-red-700 text-white hover:bg-red-600 disabled:opacity-40"
        >
          Delete
        </button>
        <button
          onClick={handleCopy}
          disabled={!layoutData}
          className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
        >
          Copy JSON
        </button>
        <button
          onClick={handleSave}
          disabled={!layoutData || !selectedFilePath}
          className="text-xs px-3 py-1 rounded bg-green-700 text-white hover:bg-green-600 disabled:opacity-40"
        >
          Save
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
          {layoutData ? (
            <div className="w-full max-w-[1200px]">
              <div
                ref={canvasRef}
                className="relative w-full bg-[#f5ede6] rounded shadow-lg"
                style={{ paddingBottom: `${ASPECT_RATIOS[breakpoint]}%` }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={() => setSelectedItemId(null)}
              >
                {items.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  return (
                    <div
                      key={item.id}
                      style={{
                        position: "absolute",
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.w}%`,
                        transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
                        zIndex: item.z,
                        cursor: dragState?.itemId === item.id ? "grabbing" : "grab",
                        outline: isSelected ? "2px solid #3b82f6" : "none",
                        outlineOffset: "2px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                      }}
                      onPointerDown={(e) => handleItemPointerDown(e, item, "move")}
                    >
                      {/* Render item content */}
                      {item.type === "image" && item.src && (
                        <Image
                          src={item.src}
                          alt={item.alt || ""}
                          width={item.imageW || 400}
                          height={item.imageH || 300}
                          style={{ width: "100%", height: "auto", display: "block", pointerEvents: "none" }}
                          draggable={false}
                        />
                      )}
                      {item.type === "text" && (
                        <div
                          style={{
                            fontFamily: item.fontFamily,
                            fontSize: item.fontSize,
                            color: item.color,
                            textAlign: item.textAlign,
                            lineHeight: item.lineHeight,
                            whiteSpace: "pre-line",
                            pointerEvents: "none",
                          }}
                        >
                          {item.text}
                        </div>
                      )}

                      {/* Resize handle */}
                      {isSelected && (
                        <div
                          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-sm cursor-ew-resize"
                          onPointerDown={(e) => handleItemPointerDown(e, item, "resize")}
                        />
                      )}

                      {/* Rotate handle */}
                      {isSelected && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-7 flex flex-col items-center cursor-crosshair"
                          onPointerDown={(e) => handleItemPointerDown(e, item, "rotate")}
                        >
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <div className="w-px h-3 bg-blue-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 mt-20">Select a page to start editing</div>
          )}
        </div>

        {/* Properties panel */}
        <div className="w-72 shrink-0 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            Properties
          </h2>
          {selectedItem ? (
            <div className="space-y-3">
              <PropField label="ID" value={selectedItem.id} disabled />
              <PropField label="Type" value={selectedItem.type} disabled />

              <div className="grid grid-cols-2 gap-2">
                <PropFieldNum
                  label="x %"
                  value={selectedItem.x}
                  onChange={(v) => handlePropChange("x", v)}
                  step={0.1}
                />
                <PropFieldNum
                  label="y %"
                  value={selectedItem.y}
                  onChange={(v) => handlePropChange("y", v)}
                  step={0.1}
                />
                <PropFieldNum
                  label="w %"
                  value={selectedItem.w}
                  onChange={(v) => handlePropChange("w", v)}
                  step={0.1}
                />
                <PropFieldNum
                  label="rotate"
                  value={selectedItem.rotate}
                  onChange={(v) => handlePropChange("rotate", v)}
                  step={1}
                />
                <PropFieldNum
                  label="z"
                  value={selectedItem.z}
                  onChange={(v) => handlePropChange("z", v)}
                  step={1}
                />
              </div>

              {selectedItem.type === "image" && (
                <>
                  <PropField
                    label="src"
                    value={selectedItem.src ?? ""}
                    onChange={(v) => handlePropChange("src", v)}
                  />
                  <PropField
                    label="alt"
                    value={selectedItem.alt ?? ""}
                    onChange={(v) => handlePropChange("alt", v)}
                  />
                </>
              )}

              {selectedItem.type === "text" && (
                <>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">text</label>
                    <textarea
                      className="w-full bg-gray-700 text-gray-100 text-xs rounded px-2 py-1 border border-gray-600 resize-y"
                      rows={4}
                      value={selectedItem.text ?? ""}
                      onChange={(e) => handlePropChange("text", e.target.value)}
                    />
                  </div>
                  <PropField
                    label="fontFamily"
                    value={selectedItem.fontFamily ?? ""}
                    onChange={(v) => handlePropChange("fontFamily", v)}
                  />
                  <PropField
                    label="fontSize"
                    value={selectedItem.fontSize ?? ""}
                    onChange={(v) => handlePropChange("fontSize", v)}
                  />
                  <PropField
                    label="color"
                    value={selectedItem.color ?? ""}
                    onChange={(v) => handlePropChange("color", v)}
                  />
                </>
              )}

              <PropField
                label="className"
                value={selectedItem.className ?? ""}
                onChange={(v) => handlePropChange("className", v)}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-xs">No item selected</p>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Reusable prop field components ──────────────────────────────────────────

function PropField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input
        type="text"
        className="w-full bg-gray-700 text-gray-100 text-xs rounded px-2 py-1 border border-gray-600 disabled:opacity-50"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function PropFieldNum({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input
        type="number"
        className="w-full bg-gray-700 text-gray-100 text-xs rounded px-2 py-1 border border-gray-600"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
