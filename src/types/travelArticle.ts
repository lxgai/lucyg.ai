// A travel article is a title, dates, city tags and a flat list of body blocks.
// Section blocks are the headings; the table of contents is built from them.

export type TravelBackground = "none" | "panel" | "border" | "jade" | "dots" | "magenta";
export type TravelAlign = "left" | "center" | "right";

export type TravelImageBlock = {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  captionAlign?: TravelAlign;
  // Shows through transparent areas of the image, with padding around it.
  background?: TravelBackground;
};

export type TravelTextBlock = {
  id: string;
  type: "text";
  text: string;
};

export type TravelSectionBlock = {
  id: string;
  type: "section";
  level: 2 | 3;
  title: string;
  altTitle?: string;
  subtitle?: string;
};

export type TravelCanvasFont = "body" | "heading" | "hand" | "code";

// Canvas coordinates are px in a 720px-wide design space (the main column's
// width). The public page scales the whole canvas down on narrower screens.
type TravelCanvasPlacement = {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
};

export type TravelCanvasImage = TravelCanvasPlacement & {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  captionAlign?: TravelAlign;
  background?: TravelBackground;
};

export type TravelCanvasText = TravelCanvasPlacement & {
  kind: "text";
  text: string;
  font: TravelCanvasFont;
  size: number;
  align?: TravelAlign;
};

export type TravelCanvasItem = TravelCanvasImage | TravelCanvasText;

export type TravelCanvasBlock = {
  id: string;
  type: "canvas";
  height: number;
  background: TravelBackground;
  items: TravelCanvasItem[];
};

export type TravelBlock = TravelImageBlock | TravelTextBlock | TravelSectionBlock | TravelCanvasBlock;

export type TravelArticle = {
  slug: string;
  // Travel Log and sidebar name, e.g. "China".
  place: string;
  title: string;
  // "MM / DD / YYYY"
  startDate: string;
  endDate: string;
  tags: string[];
  blocks: TravelBlock[];
};
