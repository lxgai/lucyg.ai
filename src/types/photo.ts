export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  caption?: string;
  date?: string;
}
