import TravelDetailPage from "@/components/travel/TravelDetailPage";
import netherlands25 from "@/data/travel-details/netherlands-25.json";
import type { TravelDetailData } from "@/types/travelDetail";

export default function Netherlands25Page() {
  return <TravelDetailPage data={netherlands25 as TravelDetailData} />;
}
