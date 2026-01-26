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

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1200;

const vtFontMobile = {
  fontFamily: "var(--font-vt323), monospace",
  fontSize: { xs: "1.05rem", sm: "1.05rem" },
};

const vtFontLargeMobile = {
  ...vtFontMobile,
  fontSize: { xs: "1.35rem", sm: "1.35rem" },
};

const vtFontDesktop = {
  fontFamily: "var(--font-vt323), monospace",
  fontSize: "1.25rem",
};

const vtFontLargeDesktop = {
  ...vtFontDesktop,
  fontSize: "1.6rem",
};

export default function China24Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
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
          pt: { xs: 16},
          pb: 12,
          px: { xs: 3 },
          display: { xs: "block", sm: "block", md: "none" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontFamily: "var(--font-vt323), monospace",
          }}
        >
          {/* Hangzhou column */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              mt: 4,
              ml: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography sx={{ ...vtFontLargeMobile, mb: 2 }}>07/2024</Typography>
            <Typography sx={{ ...vtFontLargeMobile, mb: 2 }}>Hangzhou 杭州, China</Typography>

            <Typography sx={{ ...vtFontMobile, mb: 1 }}>Highlights:</Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mb: 4 }}>
              {hangzhouHighlights.map((item) => (
                <Typography component="li" key={item} sx={{ ...vtFontMobile, mb: 1.2, display: "flex", gap: 1 }}>
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
              mt: 6,
              mr: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                ...vtFontLargeMobile,
                textAlign: "left",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              Chongqing 重庆, China
            </Typography>
            <Typography
              sx={{
                ...vtFontMobile,
                maxWidth: 780,
                textAlign: "left",
                ml: 0,
                lineHeight: 1.6,
              }}
            >
              The urban &quot;8-D&quot; layout of this city is especially lovely at night and feeds into my
              cyberpunk dreams -- although we were definitely dropped off at the wrong elevation more than once.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  transform: "rotate(1deg)",
                  mr: 0,
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
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  transform: "rotate(-6deg)",
                  mt: 2,
                  mr: 0,
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
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
                width: "100%",
                mt: 2,
              }}
            >
              <Box sx={{ flex: 1, mt: 1, ml: 0 }}>
                <Typography sx={{ ...vtFontMobile, mb: 1 }}>Loved:</Typography>
                <Box component="ul" sx={{ listStyle: "none", mb: 3 }}>
                  {chongqingHighlights.slice(0, 3).map((item) => (
                    <Typography component="li" key={item} sx={{ ...vtFontMobile, mb: 1, display: "flex", gap: 1 }}>
                      <span>+</span>
                      <span>{item}</span>
                    </Typography>
                  ))}
                </Box>

                <Typography sx={{ ...vtFontMobile, mb: 1 }}>
                  We also ventured outside the main city area:
                </Typography>
                <Typography sx={{ ...vtFontMobile, mb: 3 }}>+ {chongqingHighlights[3]}</Typography>

                <Typography sx={{ ...vtFontMobile, mb: 1 }}>And my favorite:</Typography>
                <Typography sx={{ ...vtFontMobile, mb: 3 }}>+ {chongqingHighlights[4]}</Typography>
              </Box>

              <Box
                sx={{
                  alignSelf: "center",
                  mt: 1,
                  mr: 0,
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

      <Box
        sx={{
          "--gutter": {
            md: "0px",
            lg: "0px",
            xl: "0px",
          },
          "--canvas-scale": {
            md: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
            lg: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
            xl: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
          },
          "--canvas-width": {
            md: `${CANVAS_WIDTH}px`,
            lg: `${CANVAS_WIDTH}px`,
            xl: `${CANVAS_WIDTH}px`,
          },
          "--canvas-height": {
            md: `${CANVAS_HEIGHT}px`,
            lg: `${CANVAS_HEIGHT}px`,
            xl: `${CANVAS_HEIGHT}px`,
          },
          position: "relative",
          width: "100vw",
          height: "calc(var(--canvas-height) * var(--canvas-scale))",
          minHeight: "100svh",
          mx: 0,
          px: 0,
          display: { xs: "none", sm: "none", md: "block" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "var(--canvas-width)",
            height: "var(--canvas-height)",
            transform: "scale(var(--canvas-scale))",
            transformOrigin: "top left",
          }}
        >
          <Box
            sx={{
              pt: 20,
              pb: 12,
              px: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
                fontFamily: "var(--font-vt323), monospace",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  mt: 18,
                  ml: 16,
                  mr: -8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ ...vtFontLargeDesktop, mb: 2 }}>07/2024</Typography>
                <Typography sx={{ ...vtFontLargeDesktop, mb: 2 }}>Hangzhou 杭州, China</Typography>

                <Typography sx={{ ...vtFontDesktop, mb: 1 }}>Highlights:</Typography>
                <Box component="ul" sx={{ listStyle: "none", pl: 0, mb: 4 }}>
                  {hangzhouHighlights.map((item) => (
                    <Typography component="li" key={item} sx={{ ...vtFontDesktop, mb: 1.2, display: "flex", gap: 1 }}>
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

              <Box
                sx={{
                  flex: 1.1,
                  position: "relative",
                  mt: 26,
                  mr: 18,
                  ml: -2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    ...vtFontLargeDesktop,
                    textAlign: "right",
                  }}
                >
                  Chongqing 重庆, China
                </Typography>
                <Typography
                  sx={{
                    ...vtFontDesktop,
                    maxWidth: 780,
                    textAlign: "right",
                    ml: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  The urban &quot;8-D&quot; layout of this city is especially lovely at night and feeds into my
                  cyberpunk dreams - although we were definitely dropped off at the wrong elevation more than once.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 6,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "60%",
                      transform: "rotate(1deg)",
                      mr: -12,
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
                      width: "35%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      transform: "rotate(-6deg)",
                      mt: 10,
                      mr: 6,
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
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 6,
                    width: "100%",
                    mt: 4,
                  }}
                >
                  <Box sx={{ flex: 1, mt: 4, ml: 0 }}>
                    <Typography sx={{ ...vtFontDesktop, pl: 0, mb: 1 }}>Loved:</Typography>
                    <Box component="ul" sx={{ listStyle: "none", mb: 3, pl: 0 }}>
                      {chongqingHighlights.slice(0, 3).map((item) => (
                        <Typography component="li" key={item} sx={{ ...vtFontDesktop, mb: 1, display: "flex", gap: 1 }}>
                          <span>+</span>
                          <span>{item}</span>
                        </Typography>
                      ))}
                    </Box>

                    <Typography sx={{ ...vtFontDesktop, pl: 0, mb: 1 }}>
                      We also ventured outside the main city area:
                    </Typography>
                    <Typography sx={{ ...vtFontDesktop, pl: 0, mb: 3 }}>+ {chongqingHighlights[3]}</Typography>

                    <Typography sx={{ ...vtFontDesktop, pl: 0, mb: 1 }}>And my favorite:</Typography>
                    <Typography sx={{ ...vtFontDesktop, pl: 0, mb: 3 }}>+ {chongqingHighlights[4]}</Typography>
                  </Box>

                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      mt: -6,
                      mr: 8,
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
      </Box>
    </Box>
  );
}
