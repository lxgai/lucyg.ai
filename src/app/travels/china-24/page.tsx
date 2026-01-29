"use client";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const MAX_CANVAS_SCALE = 1.6;

const collageItems = [
  {
    key: "westlake-dumplings",
    src: "/images/travels/china-24/westlake-dumplings.png",
    alt: "Hangzhou West Lake",
    width: 480,
    height: 120,
    top: 290,
    left: 40,
  },
    {
    key: "hangzhou",
    src: "/images/travels/china-24/hangzhou.jpg",
    alt: "Hangzhou City",
    width: 250,
    height: 210,
    top: 620,
    left: 470,
    rotate: "4deg",
  },
  {
    key: "coconut-drink",
    src: "/images/travels/china-24/coconut-drink.png",
    alt: "Coconut drink",
    width: 50,
    height: 70,
    top: 720,
    left: 80,
    rotate: "-18deg",
  },
  {
    key: "stars",
    src: "/images/travels/china-24/stars-purple.png",
    alt: "Purple stars doodle",
    width: 200,
    height: 70,
    top: 370,
    left: 530,
  },
  {
    key: "family",
    src: "/images/travels/china-24/family-stickered.png",
    alt: "Family sticker",
    width: 280,
    height: 280,
    top: 180,
    left: 820,
    rotate: "2deg",
  },
  {
    key: "three-bridges",
    src: "/images/travels/china-24/three-natural-bridges-arrow.png",
    alt: "Three Natural Bridges",
    width: 230,
    height: 330,
    top: 430,
    left: 820,
  },
  {
    key: "jiuli",
    src: "/images/travels/china-24/jiuli-city.jpg",
    alt: "Jiuli City",
    width: 255,
    height: 170,
    top: 610,
    left: 1107,
  },
    {
    key: "yangtze",
    src: "/images/travels/china-24/yangtze-river.png",
    alt: "Yangtze River cruise",
    width: 450,
    height: 210,
    top: 210,
    left: 1390,
  },
  {
    key: "hongyadong",
    src: "/images/travels/china-24/hongyadong-heart.png",
    alt: "Hongyadong at night",
    width: 300,
    height: 210,
    top: 210,
    left: 1100,
  },
  {
    key: "xiaomian",
    src: "/images/travels/china-24/xiaomian.png",
    alt: "Xiaomian noodles",
    width: 120,
    height: 100,
    top: 500,
    left: 1700,
    rotate: "18deg",
  },
];

export default function China24Page() {
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
      <Header />

      <Box
        sx={{
          "--page-gutter": { xs: "24px", md: "72px" },
          px: "var(--page-gutter)",
          pt: { xs: 4, md: 12 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            "--canvas-scale": {
              xs: `min(calc((100vw - (var(--page-gutter) * 2)) / ${CANVAS_WIDTH}px), ${MAX_CANVAS_SCALE})`,
              sm: `min(calc((100vw - (var(--page-gutter) * 2)) / ${CANVAS_WIDTH}px), ${MAX_CANVAS_SCALE})`,
              md: `min(calc((100vw - (var(--page-gutter) * 2)) / ${CANVAS_WIDTH}px), ${MAX_CANVAS_SCALE})`,
              lg: `min(calc((100vw - (var(--page-gutter) * 2)) / ${CANVAS_WIDTH}px), ${MAX_CANVAS_SCALE})`,
              xl: `min(calc((100vw - (var(--page-gutter) * 2)) / ${CANVAS_WIDTH}px), ${MAX_CANVAS_SCALE})`,
            },
            "--canvas-offset-x": { xs: "0px", md: "-48px" },
            "--canvas-width": `${CANVAS_WIDTH}px`,
            "--canvas-height": `${CANVAS_HEIGHT}px`,
            position: "relative",
            width: "calc(var(--canvas-width) * var(--canvas-scale))",
            height: "calc(var(--canvas-height) * var(--canvas-scale))",
            minHeight: "100svh",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: { xs: "relative", md: "absolute" },
              inset: { md: 0 },
              width: "var(--canvas-width)",
              minHeight: "var(--canvas-height)",
              height: "var(--canvas-height)",
              transform: "scale(var(--canvas-scale))",
              transformOrigin: "top left",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 80,
                left: 80,
                maxWidth: 380,
                fontFamily: "var(--font-vt323), monospace",
                color: "#1f1b17",
              }}
            >
              <Typography component="div" sx={{ fontFamily: "inherit", mb: 1, fontSize: "1.5rem" }}>
                07/2024 
              </Typography>
            </Box>

           <Box
              sx={{
                position: "absolute",
                top: 140,
                left: 80,
                maxWidth: 380,
                fontFamily: "var(--font-vt323), monospace",
                color: "#1f1b17",
              }}
            >
              <Typography component="div" sx={{ fontFamily: "inherit", mb: 1, fontSize: "1.5rem" }}>
                Hangzhou 杭州, China
              </Typography>
         
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: 195,
                left: 80,
                maxWidth: 600,
                fontFamily: "var(--font-vt323), monospace",
                color: "#1f1b17",
              }}
            >
              <Typography component="div" sx={{ fontFamily: "inherit", lineHeight: 1.3, fontSize: "1.2rem" }}>
                Highlights:
                <br />
                &nbsp;+ West Lake
                <br />
                &nbsp;+ The wonton soup my mom makes
                <br />
                &nbsp;+ Seeing how much the city has developed since I first went 15+ years ago
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: 120,
                left: 960,
                width: 850,
                maxWidth: "none",
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "0.95rem",
                color: "#1f1b17",
                textAlign: "right",
              }}
            >
              <Typography
                component="div"
                sx={{ fontFamily: "inherit", mb: 1, fontSize: "1.2rem" }}
              >
                Chongqing 重庆, China
                <br />
              </Typography>
              <Typography
                component="div"
                sx={{ fontFamily: "inherit", lineHeight: 1.2, width: "100%", fontSize: "1.2rem" }}
              >
                The urban, &quot;8-D&quot; topography of this city is especially lovely at night and feeds
                into my cyberpunk dreams - although we were definitely dropped off at the wrong
                elevation more than once.
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: 560,
                left: 1430,
                maxWidth: 380,
                fontFamily: "var(--font-vt323), monospace",
                color: "#1f1b17",
              }}
            >
              <Typography component="div" sx={{ fontFamily: "inherit", lineHeight: 1.6, fontSize: "1.1rem" }}>
                Loved:
                <br />
                &nbsp;+ City skyline &amp; Hongya Dong at night
                <br />
                &nbsp;+ Yangtze River cruise
                <br />
                &nbsp;+ Xiao Mian noodles (did not get to try the hotpot sadly)
                <br />
                <br />
                We also ventured outside the main city area:
                <br />
                &nbsp;+ Chiyou Jiuli City
                <br />
                &nbsp;+ Three Natural Bridges
              </Typography>
            </Box>

            {collageItems.map(item => (
              <Box
                key={item.key}
                sx={{
                  position: "absolute",
                  top: item.top,
                  left: item.left,
                  transform: `rotate(${item.rotate})`,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes={`${Math.round(item.width * MAX_CANVAS_SCALE)}px`}
                  style={{ display: "block" }}
                  quality={100}
                  priority
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
