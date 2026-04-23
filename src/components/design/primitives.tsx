"use client";
import { Box } from "@mui/material";
import type { CSSProperties, ReactNode } from "react";
import { tokens } from "./tokens";

export function Hair({
  dashed = false,
  color = tokens.hair,
  style,
}: {
  dashed?: boolean;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <Box
      sx={{
        height: "1px",
        width: "100%",
        background: dashed ? "transparent" : color,
        borderTop: dashed ? `1px dashed ${tokens.hair}` : "none",
        ...style,
      }}
    />
  );
}

export function CardLabel({
  cat,
  no,
  date,
}: {
  cat: string;
  no: string;
  date?: string;
}) {
  return (
    <Box
      sx={{
        fontFamily: tokens.mono,
        fontSize: 9,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        color: tokens.ink60,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box component="span" sx={{ color: tokens.accent }}>
        CAT. {cat}
      </Box>
      <Box component="span">№ {no}</Box>
      {date && <Box component="span">{date}</Box>}
    </Box>
  );
}

export function Pill({
  children,
  onClick,
  filled = false,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  filled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Box
      component="span"
      onClick={onClick}
      sx={{
        display: "inline-block",
        padding: "8px 16px",
        border: `1px solid ${filled ? tokens.ink : tokens.hairStrong}`,
        background: filled ? tokens.ink : "transparent",
        color: filled ? tokens.paper : tokens.ink,
        fontFamily: tokens.mono,
        fontSize: 10,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        cursor: onClick ? "pointer" : "default",
        transition: "all 180ms",
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
