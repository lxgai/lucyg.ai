import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const detailDir = path.join(process.cwd(), "src", "data", "travel-details");

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const files = fs.readdirSync(detailDir).filter((file) => file.endsWith(".json"));
    return NextResponse.json({
      pages: files.map((file) => ({
        slug: file.replace(/\.json$/, ""),
        filePath: path.join("src", "data", "travel-details", file),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to read travel detail pages" }, { status: 500 });
  }
}
