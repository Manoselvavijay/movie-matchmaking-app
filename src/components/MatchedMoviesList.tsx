import { Movie } from "@/data/movies";
import { X, Film } from "lucide-react";

interface MatchedMoviesListProps {
    matches: Movie[];
    isOpen: boolean;
    onClose: () => void;
}

export default function MatchedMoviesList({ matches, isOpen, onClose }: MatchedMoviesListProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-lg animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Film className="text-red-500" />
                    Shared Matches
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 transition"
                >
                    <X size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {matches.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-50">
                        <Film size={48} />
                        <p>No matches yet. Keep swiping!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {matches.map((movie) => (
                            <div key={movie.id} className="relative aspect-[2/3] rounded-lg overflow-hidden border border-gray-800">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                                    <p className="text-xs font-bold text-white line-clamp-2">{movie.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
