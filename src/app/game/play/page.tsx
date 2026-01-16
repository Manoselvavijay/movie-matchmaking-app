import { createClient } from "@/utils/supabase/server";
import { fetchTrendingMovies, mapTMDBMovieToAppMovie } from "@/lib/tmdb";
import SwipeInterface from "@/components/SwipeInterface";
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
    const movies = tmdbMovies.map(mapTMDBMovieToAppMovie);

    return (
        <SwipeInterface
            initialMovies={movies}
            initialUser={user}
        />
    );
}
