"use client";

import { useState, useEffect } from "react";
import CollageCanvas from "./CollageCanvas";
import { CollageLayoutData } from "@/types/collage";

interface AspectRatios {
  large: number;
  medium: number;
  small: number;
}

interface CollageLayoutProps {
  layout: CollageLayoutData;
  aspectRatios?: Partial<AspectRatios>;
  className?: string;
}

const DEFAULT_ASPECT_RATIOS: AspectRatios = {
  large: 56.25,
  medium: 100,
  small: 150,
};

type Breakpoint = "large" | "medium" | "small";

function getBreakpoint(width: number): Breakpoint {
  if (width >= 1024) return "large";
  if (width >= 640) return "medium";
  return "small";
}

export default function CollageLayout({
  layout,
  aspectRatios,
  className,
}: CollageLayoutProps) {
  const ratios: AspectRatios = { ...DEFAULT_ASPECT_RATIOS, ...aspectRatios };
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("large");

  useEffect(() => {
    function update() {
      setBreakpoint(getBreakpoint(window.innerWidth));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <CollageCanvas
      items={layout[breakpoint]}
      aspectRatio={ratios[breakpoint]}
      className={className}
    />
  );
}
