"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import ActionButtons from "@/components/ActionButtons";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import { Movie } from "@/data/movies";
import { Film, Clapperboard } from "lucide-react";
import Link from "next/link";
import MovieBackground from "./MovieBackground";

interface SwipeInterfaceProps {
    initialMovies: Movie[];
}

export default function SwipeInterface({ initialMovies }: SwipeInterfaceProps) {
    const [cardStack, setCardStack] = useState<Movie[]>(initialMovies);
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // Load watchlist from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("watchlist");
        if (saved) {
            setWatchlist(JSON.parse(saved));
        }
    }, []);

    const handleSwipe = (direction: "left" | "right") => {
        if (cardStack.length === 0) return;

        const currentMovie = cardStack[0];
        const newStack = cardStack.slice(1);
        setCardStack(newStack);

        if (direction === "right") {
            if (!watchlist.some((m) => m.id === currentMovie.id)) {
                const newWatchlist = [...watchlist, currentMovie];
                setWatchlist(newWatchlist);
                localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
            }
        }
    };

    const handleInfoClick = () => {
        if (cardStack.length > 0) {
            setSelectedMovie(cardStack[0]);
        }
    };

    const posterUrls = initialMovies.map(m => m.poster).filter(Boolean);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden relative">
            <MovieBackground posters={posterUrls} />

            {/* Header */}
            <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg opacity-20 transform rotate-3"></div>
                        <Clapperboard className="text-red-500 relative z-10" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                        Watch Later
                    </h1>
                </div>
                <Link href="/watchlist" className="relative group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center relative active:scale-95 transition-all duration-200 bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20">
                        <Film className="relative text-gray-200 z-10" size={20} />
                    </div>
                    {watchlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full pointer-events-none z-20 shadow-md">
                            {watchlist.length}
                        </span>
                    )}
                </Link>
            </header>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm aspect-[2/3] flex items-center justify-center z-10">
                {cardStack.length > 0 ? (
                    cardStack.slice(0, 3).map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onSwipe={handleSwipe}
                            onInfoClick={handleInfoClick} // Only active for top card (index 0) naturally
                        />
                    ))
                ) : (
                    <div className="text-center text-white z-20">
                        <h2 className="text-2xl font-bold mb-2">No more movies!</h2>
                        <p className="text-gray-400 mb-6">Check back later for more.</p>
                        <button
                            onClick={() => setCardStack(initialMovies)}
                            className="px-6 py-3 bg-red-500 rounded-full font-bold hover:bg-red-600 transition shadow-lg hover:shadow-red-500/20"
                        >
                            Reset Stack
                        </button>
                    </div>
                )}
            </div>

            {/* Controls */}
            {cardStack.length > 0 && (
                <ActionButtons onSwipe={handleSwipe} onInfoClick={handleInfoClick} />
            )}

            {/* Movie Details Modal */}
            <MovieDetailsModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </main>
    );
}
