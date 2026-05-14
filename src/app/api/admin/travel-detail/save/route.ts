import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const detailDir = path.join(process.cwd(), "src", "data", "travel-details");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function resolveDetailPath(slug: string) {
  if (!slugPattern.test(slug)) return null;

  const filePath = path.resolve(detailDir, `${slug}.json`);
  const relative = path.relative(detailDir, filePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return filePath;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { slug?: unknown; json?: unknown };
    const slug = typeof body.slug === "string" ? body.slug : "";

    if (!slug || !body.json || typeof body.json !== "object") {
      return NextResponse.json({ error: "Missing slug or json" }, { status: 400 });
    }

    const filePath = resolveDetailPath(slug);
    if (!filePath) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    fs.writeFileSync(filePath, `${JSON.stringify(body.json, null, 2)}\n`, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
