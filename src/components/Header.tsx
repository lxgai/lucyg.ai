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
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#252525", fontFamily: 'Arial, sans-serif', letterSpacing: 0.2 }}>
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
        <MuiLink href="/blog" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'Arial, sans-serif' }}>
          Blog
        </MuiLink>
        <MuiLink href="/travels" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'Arial, sans-serif' }}>
          Travels
        </MuiLink>
        <MuiLink href="/projects" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'Arial, sans-serif' }}>
          Projects
        </MuiLink>
        <MuiLink href="/favorites" color="inherit" underline="none" sx={{ fontSize: 18, fontWeight: 500, fontFamily: 'Arial, sans-serif' }}>
          Favorites
        </MuiLink>
      </Stack>
    </>
  );
}
