"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MovieBackgroundProps {
    posters: string[];
}

export default function MovieBackground({ posters }: MovieBackgroundProps) {
    // Limit posters to avoid excessive DOM nodes
    const limitedPosters = posters.slice(0, 7); // Only take top 7
    // Duplicate for infinite scroll effect (x3 should be enough)
    const displayPosters = [...limitedPosters, ...limitedPosters, ...limitedPosters];

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-black">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/85 z-10 backdrop-blur-[1px]"></div>

            {/* Poster Grid/Marquee */}
            <div className="absolute inset-0 z-0 -rotate-12 scale-125 opacity-30 grayscale-[60%] will-change-transform">
                <div className="flex flex-col gap-6 animate-scroll-vertical">
                    {/* Row 1 */}
                    <div className="flex gap-6 animate-scroll-horizontal-slow will-change-transform">
                        {displayPosters.map((src, i) => (
                            <div key={`r1-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden bg-gray-900">
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Row 2 (Offset) */}
                    <div className="flex gap-6 animate-scroll-horizontal-slow pl-16 will-change-transform" style={{ animationDirection: 'reverse' }}>
                        {displayPosters.map((src, i) => (
                            <div key={`r2-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden bg-gray-900">
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Row 3 */}
                    <div className="flex gap-6 animate-scroll-horizontal-slow will-change-transform">
                        {displayPosters.map((src, i) => (
                            <div key={`r3-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden bg-gray-900">
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
