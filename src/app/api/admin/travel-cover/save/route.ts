import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TRIPS, type Trip } from "@/data/travels";
import { normalizeSiteImagePath } from "@/lib/images";

const travelsFilePath = path.join(process.cwd(), "src", "data", "travels.ts");

// Mirrors the Trip shape in @/data/travels: id + cover are required; the
// place/sub/date/duration fallbacks are written only when a trip actually has
// them (trips with a detail page leave them unset).
function serializeTrip(trip: Trip) {
  const lines = [`    id: ${JSON.stringify(trip.id)},`];
  if (trip.place !== undefined) lines.push(`    place: ${JSON.stringify(trip.place)},`);
  if (trip.sub !== undefined) lines.push(`    sub: ${JSON.stringify(trip.sub)},`);
  if (trip.date !== undefined) lines.push(`    date: ${JSON.stringify(trip.date)},`);
  if (trip.duration !== undefined) lines.push(`    duration: ${JSON.stringify(trip.duration)},`);
  lines.push(`    cover: ${JSON.stringify(trip.cover)},`);
  return ["  {", ...lines, "  },"].join("\n");
}

function serializeTrips(trips: Trip[]) {
  const body = trips.map(serializeTrip).join("\n");

  return `export type Trip = {
  id: string;
  cover: string;
  place?: string;
  sub?: string;
  date?: string;
  duration?: string;
};

export const TRIPS: Trip[] = [
${body}
];
`;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { covers?: unknown };
    const covers = body.covers;

    if (!covers || typeof covers !== "object") {
      return NextResponse.json({ error: "Missing covers" }, { status: 400 });
    }

    const coverMap = covers as Record<string, unknown>;
    const nextTrips: Trip[] = [];

    for (const trip of TRIPS) {
      const raw = coverMap[trip.id];

      if (raw === undefined) {
        nextTrips.push(trip);
        continue;
      }

      if (typeof raw !== "string") {
        return NextResponse.json({ error: `Invalid cover for ${trip.id}` }, { status: 400 });
      }

      const normalized = normalizeSiteImagePath(raw);
      if (!normalized.startsWith("/images/travels/")) {
        return NextResponse.json({ error: `Invalid cover path for ${trip.id}` }, { status: 400 });
      }

      nextTrips.push({ ...trip, cover: normalized });
    }

    fs.writeFileSync(travelsFilePath, serializeTrips(nextTrips), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save covers" }, { status: 500 });
  }
}
