import { NextRequest, NextResponse } from "next/server";
import { SHARED_TRAVEL_ASSETS, TRAVEL_ASSETS } from "@/data/travel-assets";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  if (!slugPattern.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const tripAssets = TRAVEL_ASSETS[slug];
  if (!tripAssets) {
    return NextResponse.json({ error: "Image assets not found" }, { status: 404 });
  }

  return NextResponse.json({
    assets: [...tripAssets, ...SHARED_TRAVEL_ASSETS].sort((a, b) => a.localeCompare(b)),
  });
}
