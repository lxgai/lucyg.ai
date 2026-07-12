import TravelDetailPage from "@/components/travel/TravelDetailPage";
import china25 from "@/data/travel-details/china-25.json";
import type { TravelDetailData } from "@/types/travelDetail";

export default function China25Page() {
  return <TravelDetailPage data={china25 as TravelDetailData} />;
}
