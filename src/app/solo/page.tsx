import { fetchTrendingMovies, mapTMDBMovieToAppMovie } from "@/lib/tmdb";
import SwipeInterface from "@/components/SwipeInterface";
import { movies as mockMovies } from "@/data/movies";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function SoloPage({ searchParams }: { searchParams: Promise<{ roomId?: string }> }) {
    const { roomId } = await searchParams;

    // Fetch user session for initial state
    let user = null;
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (error) {
        console.error('Error fetching user session:', error);
    }

    let movies: any[] = [];

    // Check if we are in a room (Legacy support if roomId is passed to /solo, though mostly for Multiplayer mode)
    if (roomId) {
        try {
            const supabase = await createClient();
            const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single();

            if (room && room.movie_ids && Array.isArray(room.movie_ids)) {
                const { getMoviesByIds } = await import("@/lib/tmdb");
                movies = await getMoviesByIds(room.movie_ids);
            }
        } catch (e) {
            console.error("Error fetching room:", e);
        }
    }

    // Fallback to trending if no movies found
    if (movies.length === 0) {
        // Need to re-import here as per original file structure or just call directly if imported?
        // Original file had dynamic import inside async function for some reason, duplicating strict logic.
        // But standard import at top is fine.
        const tmdbMovies = await fetchTrendingMovies();
        movies = tmdbMovies;
    }

    // Transform to our app's format
    const initialMovies = movies.length > 0
        ? movies.map(mapTMDBMovieToAppMovie)
        : mockMovies;

    return (
        <SwipeInterface initialMovies={initialMovies} initialUser={user} />
    );
}
