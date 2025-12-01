"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";

const decorations = {
  star: { src: "/images/home/chrome_star.png", alt: "star", width: 130, height: 130, top: "16%", left: "10%" },
  miffy: { src: "/images/home/miffy.png", alt: "miffy", width: 200, height: 200, top: "20%", right: "28%", rotate: "8deg" },
  cursor: { src: "/images/home/95_mouse.png", alt: "cursor", width: 32, height: 32, top: "16%", right: "12%" },
  start: { src: "/images/home/95_start.png", alt: "start button", width: 120, height: 40, top: "67%", right: "28%", href: "/travels", zIndex: 20 },
};

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflow: "hidden",
      }}
    >
      <Header />

      {/* Decorative assets */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <DecorativeImage {...decorations.star} />
        <DecorativeImage {...decorations.miffy} />
        <DecorativeImage {...decorations.cursor} />
      </Box>

      {/* Scrapbook hero stage */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          maxWidth: { md: 1280 },
          mx: "auto",
          px: { xs: 3, md: 6 },
        }}
      >
        <Typography
          component="div"
          sx={{
            position: "absolute",
            top: { xs: "30%", md: "42%" },
            left: { xs: "0%", md: "0%" },
            fontFamily: "var(--font-cooper-light), serif",
            fontSize: { xs: "3.5rem", md: "9rem" },
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Hi,
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: { xs: "34%", md: "37%" },
            left: { xs: "32%", md: "10%" },
            transform: "rotate(4deg)",
          }}
        >
          <SelfieImage />
        </Box>

        <Typography
          component="div"
          sx={{
            position: "absolute",
            top: { xs: "40%", md: "42%" },
            left: { xs: "60%", md: "50%" },
            fontFamily: "var(--font-cooper-light), serif",
            fontSize: { xs: "3.5rem", md: "10rem" },
            fontWeight: 400,
            lineHeight: 1,
            /*transform: "rotate(1deg)",*/
            whiteSpace: "nowrap",
          }}
        >
          I&apos;m Lucy
        </Typography>

        <Typography
          component="div"
          sx={{
            position: "absolute",
            top: { xs: "58%", md: "58%" },
            left: { xs: "58%", md: "54%" },
            fontFamily: "var(--font-vt323), monospace",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            letterSpacing: "0.5px",
            lineHeight: 1.6,
            maxWidth: 800,
            /*transform: "rotate(-1deg)",*/
          }}
        >
          Currently a software engineer, travel enthusiast, and [something else]. <br />
          Read about my thoughts, travels, and projects here.
        </Typography>

      </Box>

      {/* Clickable start button overlay */}
      <DecorativeImage {...decorations.start} />
    </Box>
  );
}

function SelfieImage() {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 260, md: 460 },
        height: { xs: 320, md: 500 },
        overflow: "visible",
        borderRadius: 12,
      }}
    >
      <Image
        src="/images/home/selfie1.png"
        alt="Lucy selfie"
        fill
        sizes="(max-width: 768px) 70vw, 30vw"
        style={{ objectFit: "contain", }} /* backgroundColor: "#f8f8f8" */
        priority
      />
    </Box>
  );
}

function DecorativeImage({
  src,
  alt,
  width,
  height,
  top,
  left,
  right,
  rotate,
  href,
  zIndex,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  top?: string;
  left?: string;
  right?: string;
  rotate?: string;
  href?: string;
  zIndex?: number;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        right,
        transform: rotate ? `rotate(${rotate})` : undefined,
        pointerEvents: href ? "auto" : "none",
        cursor: href ? "pointer" : "default",
        zIndex,
      }}
    >
      {href ? (
        <MuiLink href={href} underline="none" sx={{ display: "inline-block" }}>
          <Image src={src} alt={alt} width={width} height={height} priority />
        </MuiLink>
      ) : (
        <Image src={src} alt={alt} width={width} height={height} priority />
      )}
    </Box>
  );
}
