import { Box } from '@mui/material';
import Header from '@/components/Header';

export default function BlogPage() {
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
      <Box sx={{ pt: 20, px: 11 }}>
        <p>Blog posts coming soon...</p>
      </Box>
    </Box>
  );
}
