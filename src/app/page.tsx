import { fetchTrendingMovies, mapTMDBMovieToAppMovie } from "@/lib/tmdb";
import SwipeInterface from "@/components/SwipeInterface";
import { movies as mockMovies } from "@/data/movies";

export default async function Home() {
  // Fetch real data from TMDB
  const tmdbMovies = await fetchTrendingMovies();

  // Transform to our app's format
  const initialMovies = tmdbMovies.length > 0
    ? tmdbMovies.map(mapTMDBMovieToAppMovie)
    : mockMovies; // Fallback to mock data if API fails or empty

  return (
    <SwipeInterface initialMovies={initialMovies} />
  );
}
