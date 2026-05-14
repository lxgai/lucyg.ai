import { notFound } from "next/navigation";
import TravelDetailEditorClient from "./TravelDetailEditorClient";

export default function TravelDetailEditorPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <TravelDetailEditorClient />;
}
