export type TravelDetailBreakpoint = "large" | "medium" | "small";
export type TravelDetailAlign = "left" | "right";
export type TravelDetailTextTone = "body" | "caption" | "annotation";

export type TravelDetailFreeformLayout = {
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
};

export type TravelDetailResponsiveLayout = Record<TravelDetailBreakpoint, TravelDetailFreeformLayout>;
export type TravelDetailResponsiveNumber = Record<TravelDetailBreakpoint, number>;

export type TravelDetailSectionCanvas = {
  largeWidth: number;
  largeHeight: number;
  mediumWidth: number;
  mediumHeight: number;
  smallWidth: number;
  smallHeight: number;
};

export type TravelDetailImageBlock = {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  cutout?: boolean;
  layout: TravelDetailResponsiveLayout;
};

export type TravelDetailTextBlock = {
  id: string;
  type: "text";
  text: string;
  tone?: TravelDetailTextTone;
  fontSize: TravelDetailResponsiveNumber;
  layout: TravelDetailResponsiveLayout;
};

export type TravelDetailBlock = TravelDetailImageBlock | TravelDetailTextBlock;

export type TravelDetailTapeDecoration = {
  id: string;
  type: "tape";
  color: string;
  opacity: number;
  height: TravelDetailResponsiveNumber;
  layout: TravelDetailResponsiveLayout;
};

export type TravelDetailHeroMetadataField = {
  label: string;
  description: string;
};

export type TravelDetailHero = {
  title: string;
  italicTitle?: string;
  image: TravelDetailImageBlock;
  intro: string;
  metadataFields?: TravelDetailHeroMetadataField[];
  titleTopMargin?: TravelDetailResponsiveNumber;
  canvasHeight: TravelDetailResponsiveNumber;
  copyLayout: TravelDetailResponsiveLayout;
  decorations: TravelDetailTapeDecoration[];
};

export type TravelDetailSection = {
  id: string;
  no: string;
  name: string;
  nativeName: string;
  romanizedName: string;
  dayLabel: string;
  coordinates: string;
  blurb: string;
  align: TravelDetailAlign;
  canvas: TravelDetailSectionCanvas;
  blocks: TravelDetailBlock[];
  decorations: TravelDetailTapeDecoration[];
};

export type TravelDetailClosing = {
  eyebrow: string;
};

export type TravelDetailData = {
  fileNo: string;
  section: string;
  metadata: {
    place: string;
    dateRange: string;
    duration: string;
  };
  hero: TravelDetailHero;
  sections: TravelDetailSection[];
  closing: TravelDetailClosing;
};
