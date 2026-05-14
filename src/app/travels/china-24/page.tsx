import TravelDetailPage from "@/components/travel/TravelDetailPage";
import china24 from "@/data/travel-details/china-24.json";
import type { TravelDetailData } from "@/types/travelDetail";

export default function China24Page() {
  return <TravelDetailPage data={china24 as TravelDetailData} />;
}
