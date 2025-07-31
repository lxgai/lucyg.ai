"use client";
import { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues with Leaflet
const TravelMap = dynamic(() => import('@/components/TravelMap'), { 
  ssr: false,
  loading: () => <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</Box>
});

import PhotoGallery from '@/components/PhotoGallery';
import { Photo } from '@/types/photo';
import Header from '@/components/Header';

// Mock data for development/fallback
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: '/countryside.jpg',
    thumbnail: '/countryside.jpg',
    location: {
      name: 'Banff',
      coordinates: [51.1784, -115.5708] as [number, number]
    },
    caption: 'Beautiful mountain views in Banff',
    date: '2024-06-15'
  },
  // Add more mock photos as needed
];

export default function TravelsPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Use API route to avoid CORS issues
        const response = await fetch('/api/sanity-photos');
        const data = await response.json();
        
        if (data.success && data.photos.length > 0) {
          setPhotos(data.photos);
        } else {
          console.log('No photos from Sanity, using mock data');
          setPhotos(mockPhotos);
        }
      } catch (error) {
        console.error('Error loading photos:', error);
        setPhotos(mockPhotos);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPhotos();
  }, []);

  // Filter photos based on selected location
  const filteredPhotos = selectedLocation 
    ? photos.filter(photo => photo.location.name === selectedLocation)
    : photos;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        background: 'radial-gradient(circle at center, #FFFFFF 0%, rgba(226, 208, 193, 0.4) 100%)',
      }}
    >
      <Header />

      {/* Main Content */}
      <Container 
        maxWidth={false} 
        sx={{ 
          pt: 15, 
          height: '100vh',
          display: 'flex',
          gap: 4,
          px: { xs: 2, md: 8 }
        }}
      >
        {/* Left Side - Photo Gallery */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontWeight: 700,
              fontFamily: 'var(--font-lato), sans-serif',
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            {selectedLocation ? `${selectedLocation} Photos` : 'All Travel Photos'}
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <Typography sx={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                Loading photos...
              </Typography>
            </Box>
          ) : (
            <PhotoGallery 
              photos={filteredPhotos} 
              onLocationClick={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          )}
        </Box>

        {/* Right Side - Map */}
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 180px)',
          }}
        >
          <Box
            sx={{
              width: '75%',
              height: '60%',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <TravelMap 
              photos={photos}
              onLocationSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}