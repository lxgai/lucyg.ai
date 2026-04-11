"use client";
import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import Header from '@/components/Header';

const travelSections = [
  {
    date: '07/24',
    entries: [
      { label: 'China', href: '/travels/china-24' },
      { label: 'Japan', href: '/travels/japan-24' },
    ],
  },
  {
    date: '03/25',
    entries: [{ label: 'Netherlands', href: '/travels/netherlands-25' }],
  },
];

export default function TravelsPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: '#f5ede6',
        overflow: 'hidden',
      }}
    >
      <Header />

      <Box
        sx={{
          pt: { xs: 18, sm: 18, md: 20, lg: 20, xl: 20 },
          px: { xs: 3, sm: 3, md: 10, lg: 10, xl: 10 },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: { xs: '90%', sm: 420, md: 500, lg: 500, xl: 500 },
            minHeight: 560,
            backgroundImage: "url('/images/travels/travel_paper.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            p: { xs: 5, sm: 5, md: 6, lg: 6, xl: 6 },
            fontFamily: 'var(--font-vt323), monospace',
            color: '#111',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-vt323), monospace',
              fontSize: '1.2rem',
            }}
          >
            Contents:
          </Typography>

          {travelSections.map(section => (
            <Box key={section.date}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-vt323), monospace',
                  fontSize: '1rem',
                  mb: 1,
                }}
              >
                {section.date} -
              </Typography>
              <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {section.entries.map(entry => (
                  <MuiLink
                    key={entry.href}
                    component={Link}
                    href={entry.href}
                    underline="none"
                    sx={{
                      fontFamily: 'var(--font-vt323), monospace',
                      fontSize: '1rem',
                      color: '#111',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {entry.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
