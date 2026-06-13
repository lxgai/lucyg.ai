import { notFound } from "next/navigation";
import TravelCoverEditorClient from "./TravelCoverEditorClient";

export default function TravelCoverEditorPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <TravelCoverEditorClient />;
}
