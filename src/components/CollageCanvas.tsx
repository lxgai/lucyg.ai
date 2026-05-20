"use client";

import Image from "next/image";
import { resolveSiteImageSrc } from "@/lib/images";
import { CollageItem } from "@/types/collage";

const REFERENCE_WIDTH = 1920;

function scaleFontSize(fontSize: string): string {
  const value = parseFloat(fontSize);
  if (fontSize.endsWith("rem")) {
    return `${((value * 16) / REFERENCE_WIDTH) * 100}cqw`;
  }
  if (fontSize.endsWith("px")) {
    return `${(value / REFERENCE_WIDTH) * 100}cqw`;
  }
  return fontSize;
}

interface CollageCanvasProps {
  items: CollageItem[];
  aspectRatio?: number;
  className?: string;
}

export default function CollageCanvas({
  items,
  aspectRatio = 56.25,
  className,
}: CollageCanvasProps) {
  let imageCount = 0;
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${aspectRatio}%`,
        containerType: "inline-size",
      }}
    >
      {items.map((item) => {
        const isPriorityImage = item.type === "image" && imageCount++ < 2;
        return (
        <div
            key={item.id}
            className={item.className}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.w ? `${item.w}%` : undefined,
              transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
              zIndex: item.z,
            }}
          >
            {item.type === "image" && item.src && (
              <Image
                src={resolveSiteImageSrc(item.src)}
                alt={item.alt || ""}
                width={item.imageW || 100}
                height={item.imageH || 100}
                sizes={`${Math.round(item.w)}vw`}
                style={{ width: "100%", height: "auto", display: "block" }}
                quality={85}
                priority={isPriorityImage}
                loading={isPriorityImage ? undefined : "lazy"}
              />
            )}
            {item.type === "text" && (
              <div
                style={{
                  fontFamily: item.fontFamily,
                  fontSize: item.fontSize
                    ? scaleFontSize(item.fontSize)
                    : undefined,
                  color: item.color,
                  textAlign: item.textAlign,
                  lineHeight: item.lineHeight,
                  whiteSpace: "pre-line",
                }}
              >
                {item.text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
