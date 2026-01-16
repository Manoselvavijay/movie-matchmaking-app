"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import ActionButtons from "@/components/ActionButtons";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import { Movie } from "@/data/movies";
import { Film, LogOut } from "lucide-react";
import Link from "next/link";
import MovieBackground from "./MovieBackground";
import ProfileModal from "./ProfileModal";
import MatchWatchLogo from "./MatchWatchLogo";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface SwipeInterfaceProps {
    initialMovies: Movie[];
    initialUser: User | null;
}

export default function SwipeInterface({ initialMovies, initialUser }: SwipeInterfaceProps) {
    const [cardStack, setCardStack] = useState<Movie[]>(initialMovies);
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [user, setUser] = useState<User | null>(initialUser);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [returnUrl, setReturnUrl] = useState('/solo');

    // Fetch user on mount
    useEffect(() => {
        const supabase = createClient();
        if (!supabase || !user) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        if (typeof window !== 'undefined') {
            setReturnUrl(`/watchlist?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        }

        return () => subscription.unsubscribe();
    }, []);

    // Load watchlist (Local only, Solo logic)
    useEffect(() => {
        const saved = localStorage.getItem("watchlist");
        if (saved) {
            setWatchlist(JSON.parse(saved));
        }
    }, []);

    const handleSwipe = async (direction: "left" | "right") => {
        if (cardStack.length === 0) return;

        const currentMovie = cardStack[0];
        const newStack = cardStack.slice(1);
        setCardStack(newStack);

        const liked = direction === "right";

        if (liked) {
            // Solo Wishlist Logic
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
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-1">
                    <MatchWatchLogo />
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition backdrop-blur-sm border border-gray-700"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:inline">Exit</span>
                    </Link>

                    {/* Watchlist Link */}
                    <Link
                        href={returnUrl}
                        className="relative group"
                    >
                        <div className="w-10 h-10 flex items-center justify-center hover:text-white text-gray-300 transition">
                            <Film size={24} />
                        </div>
                        {watchlist.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
                                {watchlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Profile Icon */}
                    {user ? (
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="w-10 h-10 rounded overflow-hidden border-2 border-transparent hover:border-white transition"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        </button>
                    ) : (
                        <Link href="/login" className="px-4 py-1 text-white bg-red-600 rounded text-sm font-medium hover:bg-red-700 transition">
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            {/* Card Stack */}
            <div className="relative w-full max-w-[320px] aspect-[2/3] flex items-center justify-center z-10 mt-28 md:mt-20">
                {cardStack.length > 0 ? (
                    cardStack.slice(0, 3).map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onSwipe={handleSwipe}
                            onInfoClick={handleInfoClick}
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

            {/* Profile Modal */}
            {isProfileOpen && user && (
                <ProfileModal
                    user={user}
                    onClose={() => setIsProfileOpen(false)}
                />
            )}
        </main>
    );
}
