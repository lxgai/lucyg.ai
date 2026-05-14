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

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const filePath = resolveDetailPath(slug);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
