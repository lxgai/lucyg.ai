"use client";
import { Box, Typography, Stack, Link as MuiLink } from '@mui/material';

export default function Header() {
  return (
    <>
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
    </>
  );
}