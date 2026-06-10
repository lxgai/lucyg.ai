import process from "node:process";
import { listTripImages } from "./lib/travel-bucket.mjs";

// Lists the image files for a trip in the Supabase storage bucket and prints
// their logical site paths (/images/travels/<id>/<file>), one per line.
//
// Usage: node scripts/list-travel-bucket.mjs <trip-id> [--json]
//
// See scripts/lib/travel-bucket.mjs for the required .env.local variables.

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const tripId = args.find((arg) => !arg.startsWith("--"));

  if (!tripId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tripId)) {
    throw new Error("Usage: node scripts/list-travel-bucket.mjs <trip-id> [--json]");
  }

  const paths = await listTripImages(tripId);
  if (paths.length === 0) {
    console.error(`No images found under travels/${tripId}/ in the bucket.`);
    process.exitCode = 1;
    return;
  }

  if (asJson) {
    console.log(JSON.stringify(paths, null, 2));
  } else {
    for (const p of paths) console.log(p);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
