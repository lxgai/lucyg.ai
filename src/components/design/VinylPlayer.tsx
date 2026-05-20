"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import { tokens } from "./tokens";

type Album = { src: string; title: string };

export default function VinylPlayer({
  album,
  disabled = false,
  playing,
  onToggle,
}: {
  album: Album;
  disabled?: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      onClick={disabled ? undefined : onToggle}
      sx={{
        width: { xs: 300, md: 400 },
        height: { xs: 300, md: 400 },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.76 : 1,
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          width: { xs: 260, md: 360 },
          height: { xs: 260, md: 360 },
          borderRadius: "50%",
          position: "relative",
          background:
            "radial-gradient(circle, #1a1613 0%, #0d0a08 60%, #1a1613 100%)",
          animation: playing && !disabled ? "spin 4s linear infinite" : "none",
          boxShadow:
            "0 14px 48px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: `${14 + i * 18}px`,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.035)",
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 110, md: 136 },
            height: { xs: 110, md: 136 },
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${tokens.paper}`,
            boxShadow: `0 0 0 2px ${tokens.accent}`,
          }}
        >
          <Image
            src={album.src}
            alt={album.title}
            fill
            sizes="140px"
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: tokens.paper,
            zIndex: 2,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: { xs: -18, md: -30 },
          width: { xs: 160, md: 200 },
          height: 10,
          background: tokens.ink20,
          borderRadius: 1,
          transformOrigin: "right center",
          transform: playing && !disabled ? "rotate(-28deg)" : "rotate(-50deg)",
          transition: "transform 700ms cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -2,
            top: -10,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: tokens.ink40,
            border: `2px solid ${tokens.paper}`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: -6,
            top: -3,
            width: 16,
            height: 16,
            background: tokens.ink,
            borderRadius: 0.5,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: tokens.mono,
          fontSize: 9,
          color: tokens.ink40,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {disabled ? "AUDIO PENDING" : playing ? "▶ PLAYING" : "CLICK TO PLAY"}
      </Box>
    </Box>
  );
}
