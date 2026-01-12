"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/data/movies";
import { X, Calendar, Star, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieTrailer } from "@/app/actions";

interface MovieDetailsModalProps {
    movie: Movie | null;
    onClose: () => void;
}

export default function MovieDetailsModal({ movie, onClose }: MovieDetailsModalProps) {
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        if (movie) {
            setTrailerKey(null);
            setShowTrailer(false);
            getMovieTrailer(movie.id).then(setTrailerKey);
        }
    }, [movie]);

    if (!movie) return null;

    return (
        <AnimatePresence>
            {movie && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg max-h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Header / Trailer */}
                        <div className="relative h-64 shrink-0 bg-black group">
                            {showTrailer && trailerKey ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                    title="Movie Trailer"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${movie.poster})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

                                    {trailerKey && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition z-10"
                                        >
                                            <div className="bg-red-600 text-white p-4 rounded-full shadow-lg transform group-hover:scale-110 transition">
                                                <Play size={32} fill="currentColor" />
                                            </div>
                                        </button>
                                    )}

                                    <div className="absolute bottom-0 left-0 p-6 z-20 pointer-events-none">
                                        <h2 className="text-3xl font-bold text-white mb-1 line-clamp-1">
                                            {movie.title}
                                        </h2>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold">
                                                <Star size={14} fill="currentColor" /> {movie.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> {movie.year}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 pt-2 overflow-y-auto no-scrollbar">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genre.map((g) => (
                                    <span key={g} className="text-xs font-semibold px-2 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                                        {g}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6">
                                {movie.summary}
                            </p>

                            {/* Additional info placeholder if we had more data */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                {/* Example future data points */}
                                {/* <div>
                                    <span className="block text-gray-500 text-xs uppercase mb-1">Director</span>
                                    Christopher Nolan
                                </div> */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
