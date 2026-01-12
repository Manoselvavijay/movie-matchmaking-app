"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Movie } from "@/data/movies";
import { cn } from "@/lib/utils";

interface MovieCardProps {
    movie: Movie;
    onSwipe: (direction: "left" | "right") => void;
    index: number;
    onInfoClick?: () => void;
}

export default function MovieCard({ movie, onSwipe, index, onInfoClick }: MovieCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Only allow dragging if it is the top card
    const isFront = index === 0;

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (Math.abs(info.offset.x) > 100) {
            const direction = info.offset.x > 0 ? "right" : "left";
            onSwipe(direction);
        }
    };

    const handleTap = () => {
        onInfoClick?.();
    };

    return (
        <motion.div
            style={{
                x: isFront ? x : 0,
                rotate: isFront ? rotate : 0,
                zIndex: 100 - index,
                scale: 1 - index * 0.05,
                top: index * 10,
                opacity: index > 2 ? 0 : 1, // Hide cards deeper in the stack
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onTap={isFront ? handleTap : undefined}
            animate={{
                scale: 1 - index * 0.05,
                top: index * 10,
                zIndex: 100 - index,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "absolute w-full max-w-sm aspect-[2/3] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 cursor-grab active:cursor-grabbing select-none"
            )}
        >
            <div className="relative h-full w-full">
                {/* Poster Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${movie.poster})` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-1 line-clamp-2">{movie.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-300 mb-3">
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold">
                            ★ {movie.rating}
                        </span>
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span className="truncate">{movie.genre.join(", ")}</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                        {movie.summary}
                    </p>
                </div>

                {/* Swipe Indicators */}
                <motion.div
                    style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
                    className="absolute top-8 left-8 border-4 border-green-500 text-green-500 text-3xl font-bold px-4 py-2 rounded-lg rotate-[-15deg]"
                >
                    LIKE
                </motion.div>
                <motion.div
                    style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
                    className="absolute top-8 right-8 border-4 border-red-500 text-red-500 text-3xl font-bold px-4 py-2 rounded-lg rotate-[15deg]"
                >
                    NOPE
                </motion.div>
            </div>
        </motion.div>
    );
}
