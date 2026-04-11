export interface CollageItem {
  id: string;
  type: "image" | "text";

  // Image fields
  src?: string;
  alt?: string;
  imageW?: number;
  imageH?: number;

  // Text fields
  text?: string;
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;

  // Layout (all percentages of canvas width/height)
  x: number;
  y: number;
  w: number;
  rotate: number;
  z: number;

  // Extra styling
  className?: string;
}

export interface CollageLayoutData {
  large: CollageItem[];
  medium: CollageItem[];
  small: CollageItem[];
  aspectRatios?: {
    large?: number;
    medium?: number;
    small?: number;
  };
}
