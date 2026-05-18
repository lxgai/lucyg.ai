import { NextResponse } from "next/server";
import { getLetterboxdFavoriteMovieEntries } from "@/lib/letterboxd";

export async function GET() {
  const movies = await getLetterboxdFavoriteMovieEntries();

  return NextResponse.json({ movies });
}
