interface ActionButtonsProps {
    onSwipe: (direction: "left" | "right") => void;
    onInfoClick: () => void;
    disabled?: boolean;
}
import { X, Heart, Info } from "lucide-react";

export default function ActionButtons({ onSwipe, onInfoClick, disabled }: ActionButtonsProps) {
    return (
        <div className="flex items-center justify-center space-x-8 mt-10 z-10 pb-6">
            {/* Dislike Button */}
            <button
                onClick={() => onSwipe("left")}
                disabled={disabled}
                className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                aria-label="Dislike"
            >
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 transition-all duration-300"></div>
                <div className="relative text-red-500">
                    <X size={32} strokeWidth={2.5} />
                </div>
            </button>

            {/* Info Button */}
            <button
                onClick={onInfoClick}
                disabled={disabled}
                className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                aria-label="Info"
            >
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-blue-400/30 group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300"></div>
                <div className="relative text-blue-400">
                    <Info size={24} strokeWidth={2.5} />
                </div>
            </button>

            {/* Like Button */}
            <button
                onClick={() => onSwipe("right")}
                disabled={disabled}
                className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                aria-label="Like"
            >
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-all duration-300"></div>
                <div className="relative text-green-500">
                    <Heart size={32} fill="currentColor" className="text-green-500 shadow-sm" />
                </div>
            </button>
        </div>
    );
}
