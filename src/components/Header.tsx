"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Link as MuiLink,
  IconButton,
  Portal,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";

export default function Header({ blurOnMobileOpen = false }: { blurOnMobileOpen?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: "/blog", label: "Blog" },
    { href: "/travels", label: "Travels" },
    { href: "/projects", label: "Projects" },
    { href: "/favorites", label: "Favorites" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <Portal>
        <IconButton
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 8,
            left: 8,
            zIndex: 12,
            display: { xs: "inline-flex", md: "none" },
            color: "#d877ab",
          }}
        >
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Portal>

      {/* Top Left: Lucy Logo */}
      <MuiLink
        href="/"
        underline="none"
        sx={{
          position: "absolute",
          top: 48,
          left: 58,
          zIndex: 10,
          display: { xs: "none", md: "inline-flex" },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#252525", fontFamily: 'Arial, sans-serif', fontSize: 26, letterSpacing: 0.2 }}>
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
          display: { xs: "none", md: "flex" },
        }}
      >
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(link.href);
          return (
            <MuiLink
              key={link.href}
              href={link.href}
              color="inherit"
              underline="none"
              sx={{
                fontSize: 24,
                fontWeight: 500,
                fontFamily: "Arial, sans-serif",
                color: isActive ? "#d877ab" : "inherit",
                fontStyle: isActive ? "italic" : "normal",
              }}
            >
              {link.label}
            </MuiLink>
          );
        })}
      </Stack>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        BackdropProps={{
          sx: {
            backgroundColor: "transparent",
            backdropFilter: "blur(2px)",
          },
        }}
        PaperProps={{
          sx: {
            width: "70vw",
            maxWidth: 320,
            backgroundColor: "rgba(252, 217, 231, 0.45)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
            pt: 3,
            position: "fixed",
            top: 0,
            bottom: 0,
            height: "100svh",
            overflow: "hidden",
            left: 0,
            marginLeft: 0,
            borderRadius: 0,
          },
        }}
      >
        <Box sx={{ px: 4, pb: 2, position: "relative", zIndex: 1 }}>
          <MuiLink href="/" underline="none" onClick={() => setMobileOpen(false)}>
            <Typography sx={{ fontFamily: "Arial, sans-serif", fontSize: "1.5rem", color: "#252525" }}>
              Lucy Gai
            </Typography>
          </MuiLink>
        </Box>
        <List sx={{ px: 3.5, mt: 2.5, position: "relative", zIndex: 1 }}>
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <ListItemButton
                key={link.href}
                component="a"
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  px: 1.25,
                  py: 1.3,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "1.1rem",
                    color: isActive ? "#d877ab" : "#252525",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
