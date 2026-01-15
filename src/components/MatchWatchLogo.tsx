import React from "react";

export default function MatchWatchLogo() {
    const text = "MATCHWATCH".split("");

    return (
        <div className="flex items-center gap-1 select-none origin-left">
            {/* Curvy MW Ribbon Icon */}
            <div className="relative w-8 h-10 md:w-10 md:h-12 filter drop-shadow-lg">
                <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Ribbon folding effect for M (Left Part) */}
                    <path
                        d="M8 10 L8 70 L18 60 L18 20 L28 35"
                        stroke="#E50914"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Ribbon folding effect for W (Right Part) - Slanted Gap */}
                    <path
                        d="M36 35 L46 20 L46 60 L56 70 L56 10"
                        stroke="#E50914"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Darker segments to simulate fold depth */}
                    <path d="M8 70 L18 60" stroke="#B20710" strokeWidth="12" strokeLinecap="round" />
                    <path d="M18 20 L28 35" stroke="#B20710" strokeWidth="12" strokeLinecap="round" />

                    <path d="M36 35 L46 20" stroke="#B20710" strokeWidth="12" strokeLinecap="round" />
                    <path d="M46 60 L56 70" stroke="#B20710" strokeWidth="12" strokeLinecap="round" />

                    {/* Sprocket holes on the ribbon */}
                    <circle cx="8" cy="20" r="1.5" fill="black" fillOpacity="0.5" />
                    <circle cx="8" cy="40" r="1.5" fill="black" fillOpacity="0.5" />
                    <circle cx="8" cy="60" r="1.5" fill="black" fillOpacity="0.5" />

                    <circle cx="56" cy="20" r="1.5" fill="black" fillOpacity="0.5" />
                    <circle cx="56" cy="40" r="1.5" fill="black" fillOpacity="0.5" />
                    <circle cx="56" cy="60" r="1.5" fill="black" fillOpacity="0.5" />
                </svg>
            </div>

            {/* Small Stylish Text - Reel Style */}
            <div className="flex flex-col justify-center">
                <div className="flex bg-black/80 border-y-2 border-dashed border-gray-800 py-0.5 px-1 rounded-sm gap-0.5">
                    {text.map((char, index) => (
                        <div key={index} className="w-3 md:w-3.5 flex justify-center">
                            <span className={`text-[10px] md:text-[11px] font-bold leading-none ${index < 5 ? 'text-red-600' : 'text-white'}`}>
                                {char}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
