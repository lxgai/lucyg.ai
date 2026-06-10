import TravelDetailPage from "@/components/travel/TravelDetailPage";
import japan24 from "@/data/travel-details/japan-24.json";
import type { TravelDetailData } from "@/types/travelDetail";

export default function Japan24Page() {
  return <TravelDetailPage data={japan24 as TravelDetailData} />;
}
