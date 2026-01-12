"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/data/movies";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("watchlist");
        if (saved) {
            const parsed = JSON.parse(saved);
            // Deduplicate just in case
            const unique = parsed.filter((movie: Movie, index: number, self: Movie[]) =>
                index === self.findIndex((m) => m.id === movie.id)
            );
            setWatchlist(unique);
        }
    }, []);

    const removeFromWatchlist = (id: string) => {
        const newList = watchlist.filter((m) => m.id !== id);
        setWatchlist(newList);
        localStorage.setItem("watchlist", JSON.stringify(newList));
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <header className="flex items-center mb-8 sticky top-0 bg-black/90 backdrop-blur-sm z-10 py-4">
                <Link href="/" className="mr-4 p-2 hover:bg-gray-800 rounded-full transition">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">My Watchlist</h1>
                </div>
            </header>

            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                    <p className="text-lg">No movies saved yet.</p>
                    <Link href="/" className="mt-4 text-red-500 hover:underline">
                        Go back and find some!
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                    {watchlist.map((movie) => (
                        <div
                            key={movie.id}
                            className="flex bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg"
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-24 h-36 object-cover"
                            />
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold line-clamp-1">{movie.title}</h3>
                                    <div className="flex items-center text-sm text-gray-400 space-x-2 mt-1">
                                        <span className="text-yellow-500">★ {movie.rating}</span>
                                        <span>• {movie.year}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{movie.summary}</p>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => removeFromWatchlist(movie.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition"
                                        aria-label="Remove"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
