import { Box } from '@mui/material';
import Header from '@/components/Header';

export default function PortfolioPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: '#f5ede6',
      }}
    >
      <Header />
      <Box component="main" sx={{ pt: 20, px: 11 }}>
        <h1>My Projects</h1>
        <p>Coming soon...</p>
      </Box>
    </Box>
  );
}
