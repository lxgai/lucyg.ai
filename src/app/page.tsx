"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";

type ResponsivePosition = {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
};

const decorations = {
  star: {
    src: "/images/home/chrome_star.png",
    alt: "star",
    width: 130,
    height: 130,
    top: { xs: "8%", md: "16%" },
    left: { xs: "20%", md: "10%" },
    transform: { xs: "translateX(-50%)", md: "none" },
    display: { xs: "block", md: "block" },
  },
  miffy: {
    src: "/images/home/miffy.png",
    alt: "miffy",
    width: 200,
    height: 200,
    top: { xs: "6%", md: "20%" },
    left: { xs: "62%", sm: "62%", md: "auto" },
    right: { md: "20%" },
    transform: { xs: "scale(0.7) rotate(6deg)", md: "rotate(8deg)" },
  },
  cursor: {
    src: "/images/home/95_mouse.png",
    alt: "cursor",
    width: 32,
    height: 32,
    top: { md: "16%" },
    right: { md: "12%" },
    display: { xs: "none", md: "block" },
  },
  start: {
    src: "/images/home/95_start.png",
    alt: "start button",
    width: 120,
    height: 40,
    top: { xs: "77%", md: "67%" },
    left: { xs: "59%" },
    right: { md: "28%" },
    transform: { xs: "translateX(-50%)", md: "none" },
    href: "/travels",
    zIndex: 20,
  },
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
      <Header blurOnMobileOpen />

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
          maxWidth: { xs: "100%", sm: "100%", md: 1280, lg: 1280, xl: 1280 },
          mx: "auto",
          px: { xs: 3, sm: 3, md: 6, lg: 6, xl: 6 },
        }}
      >
        <Typography
          component="div"
          sx={{
            position: "absolute",
            top: { xs: "29%", sm: "29%", md: "42%", lg: "42%", xl: "42%" },
            left: { xs: "28%", sm: "28%", md: "0%", lg: "0%", xl: "0%" },
            transform: { xs: "translateX(-50%)", md: "none" },
            fontFamily: "var(--font-cooper-light), serif",
            fontSize: { xs: "3.5rem", sm: "3.5rem", md: "9rem", lg: "9rem", xl: "9rem" },
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
            top: { xs: "21%", sm: "21%", md: "28%", lg: "28%", xl: "28%" },
            left: { xs: "54%", sm: "50%", md: "0%", lg: "0%", xl: "0%" },
            transform: { xs: "translateX(-50%) rotate(2deg)", md: "rotate(4deg)" },
          }}
        >
          <SelfieImage />
        </Box>

        <Typography
          component="div"
          sx={{
            position: "absolute",
            top: { xs: "55%", sm: "58%", md: "42%", lg: "42%", xl: "42%" },
            left: { xs: "31%", sm: "33%", md: "50%", lg: "50%", xl: "50%" },
            transform: { xs: "translateX(-50%)", md: "none" },
            fontFamily: "var(--font-cooper-light), serif",
            fontSize: { xs: "3.5rem", sm: "3.5rem", md: "10rem", lg: "10rem", xl: "10rem" },
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
            top: { xs: "64%", sm: "66%", md: "58%", lg: "58%", xl: "58%" },
            left: { xs: "50%", sm: "52%", md: "54%", lg: "54%", xl: "54%" },
            transform: { xs: "translateX(-50%)", md: "none" },
            fontFamily: "var(--font-vt323), monospace",
            fontSize: { xs: "1rem", sm: "1rem", md: "1.15rem", lg: "1.15rem", xl: "1.15rem" },
            letterSpacing: "0.5px",
            lineHeight: 1.6,
            width: { xs: "78vw", sm: "74vw", md: "auto" },
            maxWidth: { xs: 440, sm: 520, md: 800 },
            /*transform: "rotate(-1deg)",*/
          }}
        >
          Currently a software engineer, travel enthusiast, and [something else].{" "}
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
        width: { xs: 360, sm: 420, md: 620, lg: 620, xl: 720 },
        height: { xs: 460, sm: 520, md: 700, lg: 700, xl: 820 },
        overflow: "visible",
        borderRadius: 12,
      }}
    >
      <Image
        src="/images/home/selfie1.png"
        alt="Lucy selfie"
        fill
        sizes="(max-width: 600px) 85vw, (max-width: 900px) 70vw, (max-width: 1536px) 40vw, 35vw"
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
  transform,
  display,
  href,
  zIndex,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  top?: string | ResponsivePosition;
  left?: string | ResponsivePosition;
  right?: string | ResponsivePosition;
  rotate?: string;
  transform?: string | ResponsivePosition;
  display?: string | ResponsivePosition;
  href?: string;
  zIndex?: number;
}) {
  const imageTransform = transform ?? (rotate ? `rotate(${rotate})` : undefined);
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        right,
        transform: imageTransform,
        display,
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
