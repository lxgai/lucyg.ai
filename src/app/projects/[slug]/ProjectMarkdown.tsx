import Image from "next/image";
import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { tableWrapClass } from "@/components/site/Article";
import type { TocItem } from "@/components/site/Toc";
import { resolveSiteImageSrc } from "@/lib/images";
import { slugify } from "@/lib/slug";

const DIVIDER_TEXT = /^[\s✧✦]+$/;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

// Strips inline markdown (`code`, *emphasis*, [links](...)) from a heading line.
function plainHeading(line: string) {
  return line
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

// Splits "# Overview\n\n<lede>\n\n## ..." into the lede and the remaining body.
export function splitOverview(markdown: string) {
  const trimmed = markdown.trim();
  const heading = /^#\s+Overview\s*\n+/i.exec(trimmed);
  if (!heading) return { lede: "", body: trimmed };

  const rest = trimmed.slice(heading[0].length);
  const next = rest.search(/\n#{1,6}\s+/);
  return next === -1 ? { lede: rest.trim(), body: "" } : { lede: rest.slice(0, next).trim(), body: rest.slice(next).trim() };
}

// h2s with their h3s nested, using the same ids the renderer assigns.
export function markdownHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const label = plainHeading(match[2]);
    const item: TocItem = { href: `#${slugify(label)}`, label };
    const parent = headings.at(-1);
    if (match[1] === "###" && parent) {
      parent.children = [...(parent.children ?? []), item];
    } else {
      headings.push(item);
    }
  }

  return headings;
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure>
      <Image
        src={resolveSiteImageSrc(src)}
        alt={alt ?? ""}
        width={0}
        height={0}
        sizes="(max-width: 904px) 100vw, 720px"
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}

const components: Components = {
  h2({ children }) {
    return <h2 id={slugify(textOf(children))}>{children}</h2>;
  },
  h3({ children }) {
    return <h3 id={slugify(textOf(children))}>{children}</h3>;
  },
  p({ node, children }) {
    // A paragraph holding only images renders as bare <figure>s.
    const onlyImages = node?.children.every(
      (child) =>
        (child.type === "element" && child.tagName === "img") ||
        (child.type === "text" && !child.value.trim()),
    );
    if (onlyImages) return <>{children}</>;
    if (DIVIDER_TEXT.test(textOf(children))) {
      return (
        <div className="article-divider" aria-hidden="true">
          * * *
        </div>
      );
    }
    return <p>{children}</p>;
  },
  img({ src, alt }) {
    return <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />;
  },
  a({ href, children }) {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className={tableWrapClass}>
        <table>{children}</table>
      </div>
    );
  },
};

export default function ProjectMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
