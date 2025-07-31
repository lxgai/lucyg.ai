"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Photo } from '@/types/photo';

delete (Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface TravelMapProps {
  photos: Photo[];
  onLocationSelect: (location: string | null) => void;
  selectedLocation: string | null;
}

// Component to fix map sizing issues
function MapSizeFixer() {
  const map = useMap();
  
  useEffect(() => {
    // Small delay to ensure container has rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
}

export default function TravelMap({ photos, onLocationSelect }: TravelMapProps) {
  // Group photos by location
  const locationGroups = photos.reduce((acc, photo) => {
    const key = `${photo.location.coordinates[0]},${photo.location.coordinates[1]}`;
    if (!acc[key]) {
      acc[key] = {
        name: photo.location.name,
        coordinates: photo.location.coordinates,
        photos: []
      };
    }
    acc[key].photos.push(photo);
    return acc;
  }, {} as Record<string, { name: string; coordinates: [number, number]; photos: Photo[] }>);

  const locations = Object.values(locationGroups);

  return (
    <MapContainer
      center={[40, -20]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
    >
      <MapSizeFixer />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          position={location.coordinates}
          eventHandlers={{
            click: () => {
              onLocationSelect(location.name);
            },
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
              <strong>{location.name}</strong>
              <br />
              {location.photos.length} photo{location.photos.length !== 1 ? 's' : ''}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}