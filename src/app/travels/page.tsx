import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { SITE_NAV } from "@/components/site/siteNav";
import listStyles from "@/components/site/list.module.css";
import ExpandableTags from "@/components/site/ExpandableTags";
import { pageTitleClass } from "@/components/site/ui";
import { TRAVEL_ENTRIES } from "@/data/travelEntries";
import { dateSortValue, formatDisplayDate } from "@/lib/dates";

export const revalidate = 3600;

function cities(citySummary: string) {
  return citySummary
    .split("·")
    .map((city) => city.trim())
    .filter(Boolean);
}

export default function TravelsPage() {
  const trips = [...TRAVEL_ENTRIES].sort((a, b) => dateSortValue(b.date) - dateSortValue(a.date));

  return (
    <SiteShell toc={SITE_NAV}>
      <h1 className={pageTitleClass} style={{ marginBottom: 28 }}>
        Travel Log
      </h1>
      <ul className={listStyles.list}>
        {trips.map((trip) => (
          <li key={trip.id} className={listStyles.item}>
            <div className={listStyles.row}>
              <p className={listStyles.date}>{formatDisplayDate(trip.date)}</p>
              <h2 className={listStyles.title}>
                {trip.hasDetail ? <Link href={`/travels/${trip.id}`}>{trip.place}</Link> : trip.place}
              </h2>
              <ExpandableTags labels={cities(trip.sub)} large />
            </div>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
