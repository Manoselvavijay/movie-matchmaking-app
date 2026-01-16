import { createClient } from "@/utils/supabase/server";
import { fetchTrendingMovies, mapTMDBMovieToAppMovie } from "@/lib/tmdb";
import SwipeInterface from "@/components/SwipeInterface";
import MultiplayerSwipeInterface from "@/components/MultiplayerSwipeInterface";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MultiplayerGamePage({ searchParams }: { searchParams: Promise<{ roomId?: string }> }) {
    const { roomId } = await searchParams;

    // We require a roomId for this page
    if (!roomId) {
        redirect('/');
    }

    // Fetch user session
    let user = null;
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (error) {
        console.error('Error fetching user session:', error);
    }

    // If not authenticated, redirect to login (although middleware might catch this, good to be safe)
    if (!user) {
        redirect(`/login?next=/game/play?roomId=${roomId}`);
    }

    // Fetch movies
    const tmdbMovies = await fetchTrendingMovies();
    const allMovies = tmdbMovies.map(mapTMDBMovieToAppMovie);

    // Filter/Shuffle logic
    // User wants them to start on the *same* movie, but shuffled.
    // We use a seeded shuffle based on the roomId to ensure deterministic order for both players.
    const seededRandom = (seed: string) => {
        let h = 0xdeadbeef;
        for (let i = 0; i < seed.length; i++)
            h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
        return () => {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return (h >>> 0) / 4294967296;
        }
    }

    const rng = seededRandom(roomId);
    const movies = allMovies.sort(() => rng() - 0.5);

    return (
        <MultiplayerSwipeInterface
            initialMovies={movies}
            initialUser={user}
            roomId={roomId}
        />
    );
}
