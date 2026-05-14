import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const imageRoot = path.join(process.cwd(), "public", "images", "travels");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /\.(?:avif|gif|jpe?g|png|webp)$/i;

function resolveImageDir(slug: string) {
  if (!slugPattern.test(slug)) return null;

  const dirPath = path.resolve(imageRoot, slug);
  const relative = path.relative(imageRoot, dirPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return dirPath;
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const dirPath = resolveImageDir(slug);
  if (!dirPath) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const files = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map((entry) => `/images/travels/${slug}/${entry.name}`)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ assets: files });
  } catch {
    return NextResponse.json({ error: "Image directory not found" }, { status: 404 });
  }
}
