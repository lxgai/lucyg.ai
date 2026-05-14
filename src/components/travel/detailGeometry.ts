import type { TravelDetailBreakpoint, TravelDetailData, TravelDetailSection } from "@/types/travelDetail";

export const travelDetailCanvasXBounds = {
  min: -50,
  max: 150,
} as const;

export const travelDetailViewportWidth: Record<TravelDetailBreakpoint, number> = {
  large: 2048,
  medium: 1120,
  small: 470,
};

export const travelDetailPageGutterPx: Record<TravelDetailBreakpoint, number> = {
  large: 104,
  medium: 80,
  small: 32,
};

export function travelDetailCanvasWidth(section: TravelDetailSection, breakpoint: TravelDetailBreakpoint) {
  if (breakpoint === "large") return section.canvas.largeWidth;
  if (breakpoint === "medium") return section.canvas.mediumWidth;
  return section.canvas.smallWidth;
}

export function travelDetailCanvasHeight(section: TravelDetailSection, breakpoint: TravelDetailBreakpoint) {
  if (breakpoint === "large") return section.canvas.largeHeight;
  if (breakpoint === "medium") return section.canvas.mediumHeight;
  return section.canvas.smallHeight;
}

export function travelDetailSurfaceWidth(data: TravelDetailData, breakpoint: TravelDetailBreakpoint) {
  const viewportWidth = travelDetailViewportWidth[breakpoint];
  const widestCanvas = data.sections.length
    ? Math.max(...data.sections.map((section) => travelDetailCanvasWidth(section, breakpoint)))
    : 0;
  const canvasBleedRight = Math.max(0, ((travelDetailCanvasXBounds.max - 100) / 100) * widestCanvas);

  return viewportWidth + canvasBleedRight;
}
