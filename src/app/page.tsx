import { fetchTrendingMovies, mapTMDBMovieToAppMovie } from "@/lib/tmdb";
import SwipeInterface from "@/components/SwipeInterface";
import { movies as mockMovies } from "@/data/movies";

import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // Fetch real data from TMDB
  const tmdbMovies = await fetchTrendingMovies();

  // Fetch user session for initial state (avoids flicker)
  // Fetch user session for initial state
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Error fetching user session:', error);
    // User remains null, app continues to load
  }

  // Transform to our app's format
  const initialMovies = tmdbMovies.length > 0
    ? tmdbMovies.map(mapTMDBMovieToAppMovie)
    : mockMovies; // Fallback to mock data if API fails or empty

  return (
    <SwipeInterface initialMovies={initialMovies} initialUser={user} />
  );
}
