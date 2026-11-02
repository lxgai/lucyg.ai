import Image from "next/image";
import Article from "@/components/site/Article";
import { siteNavWith } from "@/components/site/siteNav";
import type { TocItem } from "@/components/site/Toc";
import { cx } from "@/lib/cx";
import { formatDisplayDate } from "@/lib/dates";
import { resolveSiteImageSrc } from "@/lib/images";
import type {
  TravelArticle as TravelArticleData,
  TravelBackground,
  TravelBlock,
  TravelCanvasBlock,
  TravelCanvasItem,
  TravelImageBlock,
  TravelSectionBlock,
  TravelTextBlock,
} from "@/types/travelArticle";
import { CANVAS_WIDTH, canvasItemStyle, canvasStyle } from "./travelCanvas";
import styles from "./travelArticle.module.css";

export const travelArticleStyles = styles;

const FULL_SIZES = "(max-width: 904px) 100vw, 720px";

// Site nav with the trip under Travels: the page title, h2 sections under it,
// h3 sections under the h2 before them.
export function travelArticleToc(article: TravelArticleData): TocItem[] {
  const sections: TocItem[] = [];

  for (const block of article.blocks) {
    if (block.type !== "section") continue;

    const item: TocItem = { href: `#${block.id}`, label: block.title };
    const parent = sections.at(-1);
    if (block.level === 3 && parent) {
      parent.children = [...(parent.children ?? []), item];
    } else {
      sections.push(item);
    }
  }

  return siteNavWith("/travels", [{ href: "#top", label: article.title.replace(/\.$/, ""), children: sections }]);
}

export function travelArticleDates(article: TravelArticleData) {
  return [article.startDate, article.endDate].map(formatDisplayDate).filter(Boolean).join(" - ");
}

function backgroundClass(background: TravelBackground | undefined) {
  return background && background !== "none" ? styles[`bg-${background}`] : undefined;
}

// Background treatment for an image: the fill plus padding around the image.
function treatedClass(background: TravelBackground | undefined) {
  const bg = backgroundClass(background);
  return bg ? cx(styles.treated, bg) : undefined;
}

export function canvasClassName(background: TravelBackground) {
  return cx(styles.canvas, backgroundClass(background));
}

export function canvasItemClassName(item: TravelCanvasItem) {
  return cx(styles.canvasItem, item.kind === "text" && cx(styles.canvasText, styles[`font-${item.font}`]));
}

// The visible content of a canvas item, positioned by its wrapper.
export function CanvasItemContent({ item, priority = false }: { item: TravelCanvasItem; priority?: boolean }) {
  if (item.kind === "text") return <>{item.text}</>;

  const share = (item.width / CANVAS_WIDTH) * 100;
  const image = (
    <Image
      src={resolveSiteImageSrc(item.src)}
      alt={item.alt}
      width={0}
      height={0}
      sizes={`(max-width: 904px) ${Math.ceil(share)}vw, ${Math.ceil(item.width)}px`}
      draggable={false}
      priority={priority}
      // Until it loads the image is 0px tall, so one starting above the canvas
      // top is fully clipped and native lazy loading never fetches it.
      loading={!priority && item.y < 0 ? "eager" : undefined}
      className={cx(styles.canvasImage, treatedClass(item.background))}
    />
  );
  if (!item.caption) return image;

  return (
    <>
      {image}
      <span className={cx(styles.canvasCaption, item.captionAlign && styles[`align-${item.captionAlign}`])}>
        {item.caption}
      </span>
    </>
  );
}

function ImageBlock({ block, priority }: { block: TravelImageBlock; priority: boolean }) {
  // An image block added in the editor has no src until one is picked.
  if (!block.src) return null;

  return (
    <figure className={styles.figure}>
      <Image
        src={resolveSiteImageSrc(block.src)}
        alt={block.alt}
        width={0}
        height={0}
        sizes={FULL_SIZES}
        priority={priority}
        className={cx(styles.image, treatedClass(block.background))}
      />
      {block.caption && (
        <figcaption className={cx(styles.caption, block.captionAlign && styles[`align-${block.captionAlign}`])}>
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function TextBlock({ block }: { block: TravelTextBlock }) {
  // Blank lines split the text into paragraphs.
  return (
    <>
      {block.text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
    </>
  );
}

export function SectionBlock({ block }: { block: TravelSectionBlock }) {
  const Heading = block.level === 2 ? "h2" : "h3";
  return (
    <>
      <Heading
        id={block.id}
        className={cx(block.level === 2 ? styles.h2 : styles.h3, block.subtitle && styles.withSubtitle)}
      >
        {block.title}
        {block.altTitle && <span className={styles.altTitle}>{block.altTitle}</span>}
      </Heading>
      {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}
    </>
  );
}

function CanvasBlock({ block, priority = false }: { block: TravelCanvasBlock; priority?: boolean }) {
  return (
    <div className={canvasClassName(block.background)} style={canvasStyle(block.height)}>
      {block.items.map((item) => (
        <div
          key={item.id}
          className={canvasItemClassName(item)}
          style={canvasItemStyle(item, block.height)}
          aria-hidden={item.kind === "image" && !item.alt ? true : undefined}
        >
          <CanvasItemContent item={item} priority={priority} />
        </div>
      ))}
    </div>
  );
}

export function TravelBlockView({ block, priority = false }: { block: TravelBlock; priority?: boolean }) {
  switch (block.type) {
    case "image":
      return <ImageBlock block={block} priority={priority} />;
    case "text":
      return <TextBlock block={block} />;
    case "section":
      return <SectionBlock block={block} />;
    case "canvas":
      return <CanvasBlock block={block} />;
    default: {
      const unhandled: never = block;
      return unhandled;
    }
  }
}

// An opening canvas becomes the hero above the title.
export function splitHero(blocks: TravelBlock[]): { hero?: TravelCanvasBlock; body: TravelBlock[] } {
  const [first, ...rest] = blocks;
  return first?.type === "canvas" ? { hero: first, body: rest } : { body: blocks };
}

export default function TravelArticle({ article }: { article: TravelArticleData }) {
  const { hero, body: blocks } = splitHero(article.blocks);
  // Only an opening image is above the fold.
  const firstImage = hero ? -1 : blocks.findIndex((block) => block.type === "image");

  return (
    <Article
      title={article.title}
      meta={travelArticleDates(article)}
      tags={article.tags}
      hero={hero && <CanvasBlock block={hero} priority />}
    >
      {blocks.map((block, index) => (
        <TravelBlockView key={block.id} block={block} priority={index === firstImage && index < 2} />
      ))}
    </Article>
  );
}
