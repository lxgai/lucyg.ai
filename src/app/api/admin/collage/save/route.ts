import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { filePath: relPath, json } = body;

    if (!relPath || !json) {
      return NextResponse.json({ error: "Missing filePath or json" }, { status: 400 });
    }

    const absPath = path.join(process.cwd(), relPath);

    // Ensure the path is within the project
    if (!absPath.startsWith(process.cwd())) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    fs.writeFileSync(absPath, JSON.stringify(json, null, 2) + "\n", "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
