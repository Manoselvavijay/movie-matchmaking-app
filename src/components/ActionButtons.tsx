interface ActionButtonsProps {
    onSwipe: (direction: "left" | "right") => void;
    onInfoClick: () => void;
    disabled?: boolean;
}
import { X, Heart, Info } from "lucide-react";

export default function ActionButtons({ onSwipe, onInfoClick, disabled }: ActionButtonsProps) {
    return (
        <div className="flex items-center justify-center space-x-6 mt-8 z-10 pb-6">
            {/* Dislike Button */}
            <button
                onClick={() => onSwipe("left")}
                disabled={disabled}
                className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50"
                aria-label="Dislike"
            >
                <div className="absolute inset-0 bg-[#2a2a2a] border border-white/20 rounded-full group-hover:bg-white/10 transition-colors"></div>
                <div className="relative text-white">
                    <X size={20} strokeWidth={2} />
                </div>
            </button>

            {/* Watch Trailer Button */}
            <button
                onClick={onInfoClick}
                disabled={disabled}
                className="relative h-12 pl-6 pr-8 rounded bg-white text-black flex items-center justify-center gap-3 transition-transform duration-200 active:scale-95 disabled:opacity-50 hover:bg-white/90"
                aria-label="Watch Trailer"
            >
                <div className="text-black fill-black">
                    {/* Using a filled play icon-like triangle or just the Info icon but filled contextually if Play is preferred, keeping Info for now but styled as Play */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" />
                    </svg>
                </div>
                <span className="text-base font-bold tracking-wide">Play Trailer</span>
            </button>

            {/* Like Button */}
            <button
                onClick={() => onSwipe("right")}
                disabled={disabled}
                className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50"
                aria-label="Like"
            >
                <div className="absolute inset-0 bg-[#2a2a2a] border border-white/20 rounded-full group-hover:bg-white/10 transition-colors"></div>
                <div className="relative text-white">
                    <Heart size={20} strokeWidth={2} />
                </div>
            </button>
        </div>
    );
}
