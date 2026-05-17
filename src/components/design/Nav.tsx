"use client";
import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemText,
  Portal,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { tokens } from "./tokens";

const LINKS: Array<{ label: string; href: string; match: string }> = [
  { label: "Projects", href: "/projects", match: "/projects" },
  { label: "Travels", href: "/travels", match: "/travels" },
  { label: "Favorites", href: "/favorites", match: "/favorites" },
  { label: "Blog", href: "/blog", match: "/blog" },
  { label: "About", href: "/about", match: "/about" },
];

export default function Nav() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(match: string) {
    if (match === "/") return pathname === "/";
    return pathname === match || pathname.startsWith(`${match}/`);
  }

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: tokens.paper,
        borderBottom: `1px solid ${tokens.hair}`,
        pl: { xs: 2, md: 5, lg: 7 },
        pr: { xs: 4, md: 10, lg: 13 },
        py: { xs: 2, md: 2.5 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: tokens.mono,
      }}
    >
      <MuiLink
        component={NextLink}
        href="/"
        underline="none"
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1.25,
          color: tokens.ink,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: tokens.serif,
            fontStyle: "italic",
            fontSize: { xs: 20, md: 22 },
            letterSpacing: "-0.2px",
            color: tokens.ink,
          }}
        >
          Lucy Gai
        </Typography>
        <Typography
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            fontFamily: tokens.mono,
            fontSize: 9,
            color: tokens.ink40,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
          }}
        >
          — EST. 2024
        </Typography>
      </MuiLink>

      <Stack
        direction="row"
        spacing={3.5}
        sx={{
          display: { xs: "none", md: "flex" },
          fontSize: 11,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
        }}
      >
        {LINKS.map((link) => {
          const active = isActive(link.match);
          return (
            <MuiLink
              key={link.href}
              component={NextLink}
              href={link.href}
              underline="none"
              sx={{
                fontFamily: tokens.mono,
                fontSize: 11,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                color: active ? tokens.accent : tokens.ink,
                borderBottom: `1px solid ${active ? tokens.accent : "transparent"}`,
                paddingBottom: "3px",
                transition: "color 180ms, border-color 180ms",
                "&:hover": { color: tokens.accent },
              }}
            >
              {link.label}
            </MuiLink>
          );
        })}
      </Stack>

      <Portal>
        <IconButton
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            right: 12,
            zIndex: 1200,
            display: { xs: "inline-flex", md: "none" },
            color: tokens.ink,
          }}
        >
          <MenuIcon sx={{ fontSize: 26 }} />
        </IconButton>
      </Portal>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(31, 26, 22, 0.25)", backdropFilter: "blur(2px)" },
          },
        }}
        PaperProps={{
          sx: {
            width: "80vw",
            maxWidth: 320,
            backgroundColor: tokens.paper,
            borderLeft: `1px solid ${tokens.hair}`,
            p: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: tokens.serif,
              fontStyle: "italic",
              fontSize: 22,
              color: tokens.ink,
            }}
          >
            Lucy Gai
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: tokens.ink }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ p: 0 }}>
          {LINKS.map((link) => {
            const active = isActive(link.match);
            return (
              <ListItemButton
                key={link.href}
                component={NextLink}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 1.5,
                  px: 0,
                  borderBottom: `1px solid ${tokens.hair}`,
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontFamily: tokens.mono,
                    fontSize: 12,
                    letterSpacing: "1.6px",
                    textTransform: "uppercase",
                    color: active ? tokens.accent : tokens.ink,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}
