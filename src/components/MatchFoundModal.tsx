import { Movie } from "@/data/movies";

interface MatchFoundModalProps {
    movie: Movie;
    onKeepPlaying: () => void;
    waitingForOther: boolean;
}

export default function MatchFoundModal({ movie, onKeepPlaying, waitingForOther }: MatchFoundModalProps) {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8 text-center space-y-6">

                {/* Title */}
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                        It's a Match!
                    </h2>
                    <p className="text-gray-600 text-sm">You both want to watch:</p>
                </div>

                {/* Movie Poster */}
                <div className="relative w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Movie Title */}
                <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>

                {/* Controls */}
                <div className="w-full pt-2">
                    <button
                        onClick={onKeepPlaying}
                        disabled={waitingForOther}
                        className={`w-full py-4 rounded-full font-bold text-base transition-all duration-300 transform active:scale-95 ${waitingForOther
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                            }`}
                    >
                        {waitingForOther ? "Waiting for friend..." : "Keep Playing"}
                    </button>
                </div>
            </div>
        </div>
    );
}
