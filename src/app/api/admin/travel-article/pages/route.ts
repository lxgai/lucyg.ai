import { NextResponse } from "next/server";
import fs from "fs";
import { travelArticleDir } from "@/lib/travelArticleFiles";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const slugs = fs
      .readdirSync(travelArticleDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""))
      .sort();
    return NextResponse.json({ slugs });
  } catch {
    return NextResponse.json({ error: "Failed to read travel articles" }, { status: 500 });
  }
}
