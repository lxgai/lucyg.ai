"use client";
import { Typography, Stack, Link as MuiLink } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/blog", label: "Blog" },
    { href: "/travels", label: "Travels" },
    { href: "/projects", label: "Projects" },
    { href: "/favorites", label: "Favorites" },
    { href: "/about", label: "About" },
  ];

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
                fontSize: 18,
                fontWeight: 500,
                fontFamily: "Arial, sans-serif",
                color: isActive ? "#ec7db1" : "inherit",
                fontStyle: isActive ? "italic" : "normal",
              }}
            >
              {link.label}
            </MuiLink>
          );
        })}
      </Stack>
    </>
  );
}
