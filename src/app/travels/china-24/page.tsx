"use client";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";

const hangzhouHighlights = [
  "West Lake",
  "Seeing how much the city has developed since I first went 15+ years ago",
  "The wonton soup my mom makes",
];

const chongqingHighlights = [
  "City skyline & Hongya Dong at night",
  "Yangtze River cruise",
  "Xiao Mian noodles (did not get to try the hotpot sadly)",
  "Chiyou Jiuli City",
  "Three Natural Bridges",
];

const vtFont = {
  fontFamily: "var(--font-vt323), monospace",
  fontSize: { xs: "1.05rem", sm: "1.05rem", md: "1.25rem", lg: "1.25rem", xl: "1.25rem" },
};

const vtFontLarge = {
  ...vtFont,
  fontSize: { xs: "1.35rem", sm: "1.35rem", md: "1.6rem", lg: "1.6rem", xl: "1.6rem" },
};

const chongqingContentOffset = {
  pl: { xs: 0, sm: 0, md: 0, lg: 6, xl: 6 },
};

export default function China24Page() {
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

      <Box
        sx={{
          pt: { xs: 16, sm: 16, md: 20, lg: 20, xl: 20 },
          pb: 12,
          px: { xs: 3, sm: 3, md: 8, lg: 8, xl: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
            gap: { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 },
            fontFamily: "var(--font-vt323), monospace",
          }}
        >
          {/* Hangzhou column */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              mt: { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 },
              ml: { xs: 0, sm: 0, md: 0, lg: 36, xl: 36 },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", sm: "flex-start", md: "flex-start", lg: "flex-start", xl: "flex-start" },
            }}
          >
            <Typography sx={{ ...vtFontLarge, mb: 2 }}>07/2024</Typography>
            <Typography sx={{ ...vtFontLarge, mb: 2 }}>Hangzhou 杭州, China</Typography>

            <Typography sx={{ ...vtFont, mb: 1 }}>Highlights:</Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mb: 4 }}>
              {hangzhouHighlights.map(item => (
                <Typography component="li" key={item} sx={{ ...vtFont, mb: 1.2, display: "flex", gap: 1 }}>
                  <span>+</span>
                  <span>{item}</span>
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 680,
                transform: "rotate(-3deg)",
              }}
            >
              <Image
                src="/images/travels/china-24/hangzhou24.png"
                alt="Hangzhou West Lake"
                width={960}
                height={720}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }}
                priority
              />
            </Box>
          </Box>

          {/* Chongqing column */}
          <Box
            sx={{
              flex: 1.1,
              position: "relative",
              mt: { xs: 6, sm: 6, md: 6, lg: 10, xl: 10 },
              mr: { xs: 0, sm: 0, md: 0, lg: 36, xl: 36 },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-end", sm: "flex-end", md: "flex-end", lg: "flex-end", xl: "flex-end" },
              gap: 2,
            }}
          >
            <Typography
              sx={{
                ...vtFontLarge,
                textAlign: { xs: "left", sm: "left", md: "left", lg: "right", xl: "right" },
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "flex-start", md: "flex-start", lg: "flex-end", xl: "flex-end" },
              }}
            >
              Chongqing 重庆, China
            </Typography>
            <Typography
              sx={{
                ...vtFont,
                maxWidth: 780,
                textAlign: { xs: "left", sm: "left", md: "left", lg: "right", xl: "right" },
                ml: { xs: 0, sm: 0, md: 0, lg: "auto", xl: "auto" },
                lineHeight: 1.6,
              }}
            >
              The urban “8-D” layout of this city is especially lovely at night and feeds into my
              cyberpunk dreams—although we were definitely dropped off at the wrong elevation more than once.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                alignItems: "flex-start",
                gap: { xs: 3, sm: 3, md: 3, lg: 6, xl: 6 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: "100%", md: "100%", lg: "60%", xl: "60%" },
                  transform: "rotate(1deg)",
                  mr: { xs: 0, sm: 0, md: 0, lg: -12, xl: -12 }
                }}
              >
                <Image
                  src="/images/travels/china-24/yangtzeriver.png"
                  alt="Yangtze River cruise"
                  width={900}
                  height={600}
                  style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }}
                  priority
                />
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "100%", lg: "35%", xl: "35%" },
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  transform: "rotate(-6deg)",
                  mt: { xs: 2, sm: 2, md: 2, lg: 10, xl: 10 },
                  mr: { xs: 0, sm: 0, md: 0, lg: 6, xl: 6 },
                }}
              >
                <Image
                  src="/images/travels/china-24/xiaomian.png"
                  alt="Xiao Mian noodles"
                  width={260}
                  height={180}
                  style={{ width: "100%", maxWidth: 220, height: "auto", display: "block" }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                alignItems: "flex-start",
                gap: { xs: 3, sm: 3, md: 3, lg: 6, xl: 6 },
                width: "100%",
                mt: { xs: 2, sm: 2, md: 2, lg: 4, xl: 4 },
              }}
            >
              <Box sx={{ flex: 1, mt: { xs: 1, sm: 1, md: 1, lg: 4, xl: 4 }, ml: { xs: 0, sm: 0, md: 0, lg: 4, xl: 4 } }}>
                <Typography sx={{ ...vtFont, ...chongqingContentOffset, mb: 1 }}>Loved:</Typography>
                <Box component="ul" sx={{ listStyle: "none", mb: 3, ...chongqingContentOffset }}>
                  {chongqingHighlights.slice(0, 3).map(item => (
                    <Typography component="li" key={item} sx={{ ...vtFont, mb: 1, display: "flex", gap: 1 }}>
                      <span>+</span>
                      <span>{item}</span>
                    </Typography>
                  ))}
                </Box>

                <Typography sx={{ ...vtFont, ...chongqingContentOffset, mb: 1 }}>
                  We also ventured outside the main city area:
                </Typography>
                <Typography sx={{ ...vtFont, ...chongqingContentOffset, mb: 3 }}>+ {chongqingHighlights[3]}</Typography>

                <Typography sx={{ ...vtFont, ...chongqingContentOffset, mb: 1 }}>And my favorite:</Typography>
                <Typography sx={{ ...vtFont, ...chongqingContentOffset, mb: 3 }}>+ {chongqingHighlights[4]}</Typography>
              </Box>

              <Box
                sx={{
                  alignSelf: { xs: "center", sm: "center", md: "center", lg: "flex-start", xl: "flex-start" },
                  mt: { xs: 1, sm: 1, md: 1, lg: -6, xl: -6 },
                  mr: { xs: 0, sm: 0, md: 0, lg: 8, xl: 8 },
                }}
              >
                <Image
                  src="/images/travels/china-24/threenaturalbridges.png"
                  alt="Three Natural Bridges"
                  width={360}
                  height={450}
                  style={{ width: 340, height: "auto", display: "block" }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
