"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import type { DragEventHandler, MouseEventHandler, ReactNode, Ref } from "react";
import { tokens } from "@/components/design/tokens";
import type { TravelDetailBreakpoint, TravelDetailSection } from "@/types/travelDetail";
import {
  travelDetailCanvasHeight,
  travelDetailCanvasWidth,
  travelDetailPageGutterPx,
  travelDetailSurfaceWidth,
} from "./detailGeometry";

export function TravelDetailSurface({
  breakpoint,
  mode = "fixed",
  scaleMultiplier = 1,
  children,
  sx,
}: {
  breakpoint: TravelDetailBreakpoint;
  mode?: "fixed" | "fit-width";
  scaleMultiplier?: number;
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const designWidth = travelDetailSurfaceWidth(breakpoint);
  const [availableWidth, setAvailableWidth] = useState(designWidth);
  const [innerHeight, setInnerHeight] = useState(0);
  const scale = mode === "fit-width" ? (availableWidth / designWidth) * scaleMultiplier : 1;

  useEffect(() => {
    if (mode !== "fit-width") return undefined;
    const outer = outerRef.current;
    if (!outer) return undefined;

    const updateWidth = () => setAvailableWidth(outer.clientWidth || designWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [designWidth, mode]);

  useEffect(() => {
    if (mode !== "fit-width") return undefined;
    const inner = innerRef.current;
    if (!inner) return undefined;

    const updateHeight = () => setInnerHeight(inner.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [breakpoint, mode]);

  if (mode === "fixed") {
    return (
      <Box
        ref={innerRef}
        sx={[
          {
            width: designWidth,
            flex: "0 0 auto",
            overflow: "visible",
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      ref={outerRef}
      sx={[
        {
          width: "100%",
          height: innerHeight > 0 ? innerHeight * scale : undefined,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "clip",
        },
      ]}
    >
      <Box
        ref={innerRef}
        sx={[
          {
            width: designWidth,
            flex: "0 0 auto",
            overflow: "visible",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
}

export function TravelDetailViewportContainer({
  breakpoint,
  children,
  sx,
}: {
  breakpoint: TravelDetailBreakpoint;
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={[
        {
          width: "100%",
          px: `${travelDetailPageGutterPx[breakpoint]}px`,
          boxSizing: "border-box",
          overflow: "visible",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}

export function FixedSectionCanvas({
  width,
  height,
  children,
  canvasRef,
  onClick,
  onDragOver,
  onDrop,
  sx,
}: {
  width: number;
  height: number;
  children: ReactNode;
  canvasRef?: Ref<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDragOver?: DragEventHandler<HTMLDivElement>;
  onDrop?: DragEventHandler<HTMLDivElement>;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      ref={canvasRef}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={[
        {
          position: "relative",
          width,
          mx: "auto",
          height,
          overflow: "visible",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}

export function TravelDetailSectionFrame({
  section,
  breakpoint,
  children,
  canvasRef,
  onCanvasClick,
  onCanvasDragOver,
  onCanvasDrop,
  canvasSx,
}: {
  section: TravelDetailSection;
  breakpoint: TravelDetailBreakpoint;
  children: ReactNode;
  canvasRef?: Ref<HTMLDivElement>;
  onCanvasClick?: MouseEventHandler<HTMLDivElement>;
  onCanvasDragOver?: DragEventHandler<HTMLDivElement>;
  onCanvasDrop?: DragEventHandler<HTMLDivElement>;
  canvasSx?: SxProps<Theme>;
}) {
  const isRight = section.align === "right";
  const isSmall = breakpoint === "small";
  const width = travelDetailCanvasWidth(section, breakpoint);
  const height = travelDetailCanvasHeight(section, breakpoint);

  return (
    <Box component="section" sx={{ position: "relative", mb: isSmall ? 8 : 7, minHeight: isSmall ? undefined : 560 }}>
      <Typography
        aria-hidden
        sx={{
          display: isSmall ? "none" : "block",
          position: "absolute",
          top: -28,
          left: isRight ? "auto" : -1,
          right: isRight ? -1 : "auto",
          fontFamily: tokens.serif,
          fontSize: 220,
          lineHeight: 0.85,
          color: "rgba(31, 26, 22, 0.06)",
          letterSpacing: "-8px",
          pointerEvents: "none",
        }}
      >
        {section.no}
      </Typography>

      <Box sx={{ position: "relative", zIndex: 1, textAlign: !isSmall && isRight ? "right" : "left" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: !isSmall && isRight ? "flex-end" : "flex-start",
            gap: isSmall ? 1.5 : 2.25,
            flexWrap: "wrap",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: tokens.serif,
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: isSmall ? 48 : 76,
              lineHeight: 1,
              letterSpacing: "-1.4px",
            }}
          >
            {section.name}
          </Typography>
          <Typography sx={{ fontFamily: tokens.serif, fontSize: isSmall ? 30 : 42, color: tokens.ink60, letterSpacing: "2px" }}>
            {section.nativeName}
          </Typography>
          <Typography sx={{ display: isSmall ? "none" : "block", fontFamily: tokens.hand, fontWeight: 500, fontSize: 32, lineHeight: 1, color: tokens.accent }}>
            {section.dayLabel.toLowerCase()}
          </Typography>
        </Box>
        <Typography sx={{ mt: 0.5, fontFamily: tokens.mono, fontSize: 10, letterSpacing: "1.4px", color: tokens.ink40, textTransform: "uppercase" }}>
          {isRight ? `${section.romanizedName} · ${section.coordinates}` : `${section.coordinates} · ${section.romanizedName}`}
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <FixedSectionCanvas
          width={width}
          height={height}
          canvasRef={canvasRef}
          onClick={onCanvasClick}
          onDragOver={onCanvasDragOver}
          onDrop={onCanvasDrop}
          sx={canvasSx}
        >
          {children}
        </FixedSectionCanvas>
      </Box>
    </Box>
  );
}
