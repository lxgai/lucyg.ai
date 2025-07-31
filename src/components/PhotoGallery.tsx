import { Box, ImageList, ImageListItem, Chip, Typography } from '@mui/material';
import { Photo } from '@/types/photo';
import Image from 'next/image';

interface PhotoGalleryProps {
  photos: Photo[];
  onLocationClick: (location: string | null) => void;
  selectedLocation: string | null;
}

export default function PhotoGallery({ photos, onLocationClick, selectedLocation }: PhotoGalleryProps) {

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Location filter chips */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => onLocationClick(null)}
          color={selectedLocation === null ? 'primary' : 'default'}
          sx={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
        />
        {Array.from(new Set(photos.map(p => p.location.name))).map((location, index) => (
          <Chip
            key={`location-${index}-${location}`}
            label={location}
            onClick={() => onLocationClick(location)}
            color={selectedLocation === location ? 'primary' : 'default'}
            sx={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
          />
        ))}
      </Box>

      {/* Photo grid */}
      <ImageList 
        cols={3} 
        gap={20}
        sx={{
          overflow: 'auto',
          height: 'calc(100vh - 300px)',
          pr: 2,
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '5px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        {photos.map((photo) => (
          <ImageListItem 
            key={photo.id}
            sx={{ padding: 0 }}
          >
            {/* Polaroid Frame */}
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: '10px 10px 50px 10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px) rotate(-1deg)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                },
              }}
            >
              {/* Square Photo Container */}
              <Box 
                sx={{ 
                  position: 'relative', 
                  width: '100%',
                  paddingBottom: '100%', // Creates square aspect ratio
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Image
                  src={photo.thumbnail}
                  alt={photo.caption || photo.location.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  style={{ 
                    objectFit: 'cover',
                  }}
                />
              </Box>
              {/* Polaroid Caption Area */}
              <Box
                sx={{
                  pt: 1.5,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#333',
                  }}
                >
                  {photo.location.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontSize: '0.75rem',
                    color: '#666',
                  }}
                >
                  {photo.date}
                </Typography>
              </Box>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Photo lightbox/modal can be added here */}
    </Box>
  );
}