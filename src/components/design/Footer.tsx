import { Box } from "@mui/material";
import { PageContainer } from "./layout";
import { tokens } from "./tokens";

// Minimal copyright line closing every page — mono, right-aligned, quiet.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ pt: { xs: 3.5, md: 4.5 }, pb: { xs: 4.5, md: 5.5 } }}>
      <PageContainer>
        <Box
          sx={{
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "1.2px",
            color: tokens.ink60,
            textAlign: "right",
          }}
        >
          © {year} Lucy Gai · All rights reserved
        </Box>
      </PageContainer>
    </Box>
  );
}
