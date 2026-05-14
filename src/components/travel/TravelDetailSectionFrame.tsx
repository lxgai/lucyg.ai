"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { DragEventHandler, MouseEventHandler, ReactNode, Ref } from "react";
import { tokens } from "@/components/design/tokens";
import type { TravelDetailBreakpoint, TravelDetailData, TravelDetailSection } from "@/types/travelDetail";
import {
  travelDetailCanvasHeight,
  travelDetailCanvasWidth,
  travelDetailPageGutterPx,
  travelDetailSurfaceWidth,
  travelDetailViewportWidth,
} from "./detailGeometry";

export function TravelDetailSurface({
  data,
  breakpoint,
  children,
  sx,
}: {
  data: TravelDetailData;
  breakpoint: TravelDetailBreakpoint;
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={[
        {
          width: travelDetailSurfaceWidth(data, breakpoint),
          overflow: "visible",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box sx={{ width: travelDetailViewportWidth[breakpoint], overflow: "visible" }}>{children}</Box>
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
          width: travelDetailViewportWidth[breakpoint],
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
          <Typography sx={{ display: isSmall ? "none" : "block", fontFamily: tokens.serif, fontStyle: "italic", fontSize: 25, color: tokens.accent }}>
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
