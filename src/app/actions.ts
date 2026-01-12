"use server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovieTrailer(movieId: string) {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY is not defined');
    }

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        const results = data.results || [];

        // Filter for official trailers on YouTube
        const trailer = results.find(
            (video: any) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official === true
        );

        // Fallback to any YouTube trailer if official not found (or just the first YouTube video)
        const video = trailer || results.find((video: any) => video.site === "YouTube" && video.type === "Trailer");

        return video ? video.key : null; // Return the YouTube video ID
    } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
    }
}
