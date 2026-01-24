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

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 900;
const MOBILE_CANVAS_WIDTH = 430;
const MOBILE_CANVAS_HEIGHT = 667;

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
    top: { xs: "115%", md: "90%" },
    left: { xs: "70%", md: "auto" },
    right: { md: "10%" },
    transform: { xs: "translateX(-50%)", md: "none" },
    href: "/travels",
    zIndex: 20,
  },
};

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Header blurOnMobileOpen />

      <Box
        sx={{
          "--canvas-scale": {
            xs: `min(calc(100vw / ${MOBILE_CANVAS_WIDTH}px), 1)`,
            sm: `min(calc(100vw / ${MOBILE_CANVAS_WIDTH}px), 1)`,
            md: `min(calc(100vw / ${CANVAS_WIDTH}px), 1)`,
            lg: `min(calc(100vw / ${CANVAS_WIDTH}px), 1)`,
            xl: `min(calc(100vw / ${CANVAS_WIDTH}px), 1)`,
          },
          "--canvas-width": {
            xs: `${MOBILE_CANVAS_WIDTH}px`,
            sm: `${MOBILE_CANVAS_WIDTH}px`,
            md: `${CANVAS_WIDTH}px`,
            lg: `${CANVAS_WIDTH}px`,
            xl: `${CANVAS_WIDTH}px`,
          },
          "--canvas-height": {
            xs: `${MOBILE_CANVAS_HEIGHT}px`,
            sm: `${MOBILE_CANVAS_HEIGHT}px`,
            md: `${CANVAS_HEIGHT}px`,
            lg: `${CANVAS_HEIGHT}px`,
            xl: `${CANVAS_HEIGHT}px`,
          },
          position: "relative",
          width: "calc(var(--canvas-width) * var(--canvas-scale))",
          height: "calc(var(--canvas-height) * var(--canvas-scale))",
          minHeight: "100svh",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            position: { xs: "relative", sm: "relative", md: "absolute" },
            inset: { md: 0 },
            width: "var(--canvas-width)",
            minHeight: "var(--canvas-height)",
            height: "var(--canvas-height)",
            transform: "scale(var(--canvas-scale))",
            transformOrigin: "top left",
          }}
        >
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
              minHeight: "100%",
              width: "100%",
              px: { xs: 3, sm: 3, md: 6, lg: 6, xl: 6 },
            }}
          >
            <Typography
              component="div"
              sx={{
                position: "absolute",
                top: { xs: "34%", md: "52%" },
                left: { xs: "8%",  md: "0%", lg: "0%", xl: "0%" },
                transform: { xs: "translateX(-50%)", md: "none" },
                fontFamily: "var(--font-cooper-light), serif",
                fontSize: { xs: "3.5rem", md: "9rem", lg: "9rem", xl: "9rem" },
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
                top: { xs: "21%", sm: "21%", md: "38%"},
                left: { xs: "50%", md: "0%", lg: "0%", xl: "0%" },
                transform: { xs: "translateX(-50%) rotate(2deg)", md: "rotate(4deg)" },
              }}
            >
              <SelfieImage />
            </Box>

            <Typography
              component="div"
              sx={{
                position: "absolute",
                top: { xs: "88%", md: "52%" },
                left: { xs: "58%", md: "50%", lg: "50%", xl: "50%" },
                transform: { xs: "translateX(-50%)", md: "none" },
                fontFamily: "var(--font-cooper-light), serif",
                fontSize: { xs: "3.5rem", md: "10rem", lg: "10rem", xl: "10rem" },
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
                top: { xs: "100%", md: "78%" },
                left: { xs: "50%",  md: "54%", lg: "54%", xl: "54%" },
                transform: { xs: "translateX(-50%)", md: "none" },
                fontFamily: "var(--font-vt323), monospace",
                fontSize: { xs: "1rem",  md: "1.15rem", lg: "1.15rem", xl: "1.15rem" },
                letterSpacing: "0.5px",
                lineHeight: 1.6,
                width: { xs: "75vw", md: "auto" },
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
      </Box>
    </Box>
  );
}

function SelfieImage() {
  return (
    <Box
      sx={{
            position: "relative",
        width: { xs: 420, md: 720, lg: 720, xl: 720 },
        height: { xs: 520, md: 820, lg: 820, xl: 820 },
        overflow: "visible",
        borderRadius: 12,
      }}
    >
      <Image
        src="/images/home/selfie1.png"
        alt="Lucy selfie"
        fill
        sizes="(max-width: 600px) 85vw, (max-width: 900px) 70vw, (max-width: 1536px) 620px, 720px"
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
