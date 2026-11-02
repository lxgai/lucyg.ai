import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { resolveTravelArticlePath } from "@/lib/travelArticleFiles";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { slug?: unknown; json?: unknown };
    const slug = typeof body.slug === "string" ? body.slug : "";

    if (!slug || !body.json || typeof body.json !== "object" || Array.isArray(body.json)) {
      return NextResponse.json({ error: "Missing slug or json" }, { status: 400 });
    }

    const filePath = resolveTravelArticlePath(slug);
    // Only existing articles can be saved; new trips are scaffolded in code.
    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    fs.writeFileSync(filePath, `${JSON.stringify(body.json, null, 2)}\n`, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
