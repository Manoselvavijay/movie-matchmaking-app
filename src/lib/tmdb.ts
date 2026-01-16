const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Default to w500 size

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

/**
 * Helper to construct full image URL
 */
export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'original' = 'w500') {
    if (!path) return '/placeholder-movie.png'; // Value matching your local placeholder if you have one, or null
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function fetchTrendingMovies(page = 1): Promise<Movie[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB_API_KEY is missing');
        return [];
    }

    try {
        // Add timeout signal
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const res = await fetch(
            `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`,
            {
                next: { revalidate: 3600 },
                signal: controller.signal
            }
        );
        clearTimeout(id);

        if (!res.ok) {
            console.warn(`TMDB API unreachable (${res.status}), using mock data.`);
            return [];
        }

        const data: TMDBResponse<Movie> = await res.json();
        return data.results || [];
    } catch (error) {
        // Safe logging needed for Vercel/Node logs
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn('TMDB API unreachable, falling back to mock data:', errorMessage);
        return [];
    }
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY is not defined in environment variables');
    }

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            throw new Error(`Failed to search movies: ${res.status}`);
        }

        const data: TMDBResponse<Movie> = await res.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}


export async function getMovieById(id: string | number): Promise<Movie | null> {
    if (!TMDB_API_KEY) return null;

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) return null;

        const data: Movie = await res.json();
        return data;
    } catch (e) {
        console.error(`Error fetching movie ${id}:`, e);
        return null;
    }
}

export async function getMoviesByIds(ids: Array<string | number>): Promise<Movie[]> {
    // TMDB doesn't have a bulk fetch, so we fetch sequentially to avoid rate limits/fetch failures
    const limitedIds = ids.slice(0, 20);
    const movies: Movie[] = [];

    for (const id of limitedIds) {
        const movie = await getMovieById(id);
        if (movie) {
            movies.push(movie);
        }
    }

    return movies;
}

// GENRE MAP (Ideally fetch this from API, but hardcoding for simplicity/performance in this demo)
const GENRES: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

import { Movie as AppMovie } from "@/data/movies";

export function mapTMDBMovieToAppMovie(tmdbMovie: Movie): AppMovie {
    return {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        year: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.split('-')[0]) : new Date().getFullYear(),
        genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.map(id => GENRES[id] || 'Movie') : ['Movie'],
        rating: tmdbMovie.vote_average,
        poster: getImageUrl(tmdbMovie.poster_path),
        summary: tmdbMovie.overview,
    };
}
