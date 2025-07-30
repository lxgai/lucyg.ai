"use client";
import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";


export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        background: "radial-gradient(circle at center, #FFFFFF 0%, rgba(226, 208, 193, 0.4) 100%)",
        overflow: "hidden",
      }}
    >
      {/* Top Left: Lucy Logo */}
      <MuiLink
        href="/"
        underline="none"
        sx={{
          position: "absolute",
          top: 48,
          left: 88,
          zIndex: 10,
        }}
      >
        <Typography variant="h4" sx={{fontWeight: 500, color: "#252525", fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          Lucy Gai
        </Typography>
      </MuiLink>

      {/* Top Right: Navigation */}
      <Stack
        direction="row"
        spacing={4}
        sx={{
          position: "absolute",
          top: 48,
          right: 88,
          zIndex: 10,
        }}
      >
        <MuiLink href="/blog" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          Blog
        </MuiLink>
        <MuiLink href="/travels" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          Travels
        </MuiLink>
        <MuiLink href="/links" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          Links
        </MuiLink>
      </Stack>

      {/* Center: Polaroid Photo and Intro */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {/* Polaroid Photo */}
        <PolaroidPhoto />

        {/* Spacer */}

        {/* Intro Text */}
        <Box sx={{ maxWidth: 550, ml: { xs: 6, sm: 16 } }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            fontFamily: 'var(--font-lato), sans-serif', 
            fontSize: { xs: '2.5rem', sm: '3.5rem' },
            color: 'transparent',
            WebkitTextStroke: '1px #252525',
            textStroke: '1px #252525'
          }}>
            Hi, I&apos;m Lucy.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Current software engineer, travel enthusiast, and overthinker.
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            More to come soon!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


// PolaroidPhoto component
function PolaroidPhoto() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#fff",
        borderRadius: 0,
        boxShadow: "0 8px 32px 0 rgba(30,30,60,0.15), 0 2px 8px #0001",
        width: { xs: 220, sm: 320 },
        pt: 2, pr: 2, pl: 2, pb: 6,
        position: "relative",
        transform: "rotate(7deg)",
        transition: "transform 0.2s",
        "&:hover": { transform: "rotate(4deg) scale(1.04)" },
        mr: { xs: 6, sm: 16 },
      }}
    >
      {/* Photo - taller than wide */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4/5",
          borderRadius: 0,
          backgroundImage: "url('/countryside.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 2px 8px #0002",
        }}
      />

      {/* Polaroid caption */}
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, mb: 0.5, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          BANFF
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
          Jasper National Park
        </Typography>
        <MuiLink
          href="/travels"
          underline="hover"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 14,
            fontWeight: 500,
            color: "primary.main",
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            "&:hover": { textDecoration: "underline" },
          }}
        >
          more
          <Box
            component="span"
            sx={{
              ml: 0.5,
              fontSize: 18,
              display: "inline-block",
              transform: "translateY(1px)", // arrow is "thrown" too!
            }}
          >
            &rarr;
          </Box>
        </MuiLink>
      </Box>
    </Box>
  );
}