import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { resolveTravelArticlePath } from "@/lib/travelArticleFiles";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const filePath = resolveTravelArticlePath(slug);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    return NextResponse.json(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
