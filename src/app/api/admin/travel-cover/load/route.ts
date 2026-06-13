import { NextResponse } from "next/server";
import { TRIPS } from "@/data/travels";
import { resolveTravelEntry } from "@/data/travelEntries";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return resolved entries so the editor preview shows the same place/cities/
  // date/duration as the public index (all derived from the detail page).
  return NextResponse.json({ trips: TRIPS.map(resolveTravelEntry) });
}
