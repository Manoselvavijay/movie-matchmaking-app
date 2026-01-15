"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MovieBackgroundProps {
    posters: string[];
}

export default function MovieBackground({ posters }: MovieBackgroundProps) {
    // Simplified background for performance - just a dark gradient/color or single static image if desired.
    // The previous implementation had too many moving layers causing lag.
    return (
        <div className="fixed inset-0 z-0 bg-[#000000]">
            {/* Optional: Very subtle static gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
        </div>
    );
}
