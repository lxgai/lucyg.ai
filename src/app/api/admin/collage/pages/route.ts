import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const travelsDir = path.join(process.cwd(), "src", "data", "travels");

  try {
    const files = fs.readdirSync(travelsDir).filter((f) => f.endsWith(".json"));
    const pages = files.map((f) => ({
      slug: f.replace(".json", ""),
      filePath: path.join("src", "data", "travels", f),
    }));
    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json({ error: "Failed to read pages" }, { status: 500 });
  }
}
