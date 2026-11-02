import type { CSSProperties } from "react";
import type { TravelAlign, TravelBackground, TravelCanvasFont, TravelCanvasItem } from "@/types/travelArticle";

// Canvases are authored at the main column's full width and scaled down from there.
export const CANVAS_WIDTH = 720;

// The six "Cutout Treatments" from the design project, used behind canvases and images.
export const BACKGROUNDS: { value: TravelBackground; label: string }[] = [
  { value: "none", label: "None" },
  { value: "panel", label: "Solid panel" },
  { value: "border", label: "Border" },
  { value: "jade", label: "Jade tint" },
  { value: "dots", label: "Dot grid" },
  { value: "magenta", label: "Magenta tint" },
];

export const ALIGNMENTS: { value: TravelAlign; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

export const CANVAS_FONTS: { value: TravelCanvasFont; label: string }[] = [
  { value: "body", label: "Bricolage (body)" },
  { value: "heading", label: "DM Serif (heading)" },
  { value: "hand", label: "Nothing You Could Do (hand)" },
  { value: "code", label: "JetBrains Mono (code)" },
];

function percentOfWidth(px: number) {
  return `${(px / CANVAS_WIDTH) * 100}%`;
}

export function canvasStyle(height: number): CSSProperties {
  return { aspectRatio: `${CANVAS_WIDTH} / ${height}` };
}

// Position as percentages of the canvas so the layout scales with the column.
export function canvasItemStyle(item: TravelCanvasItem, height: number): CSSProperties {
  const style: CSSProperties = {
    left: percentOfWidth(item.x),
    top: `${(item.y / height) * 100}%`,
    width: percentOfWidth(item.width),
    zIndex: item.zIndex,
    transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
  };

  if (item.kind === "text") {
    // cqw is relative to the canvas, which is an inline-size container.
    style.fontSize = `${(item.size / CANVAS_WIDTH) * 100}cqw`;
    style.textAlign = item.align;
  }

  return style;
}
