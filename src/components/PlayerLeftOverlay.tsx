"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

export default function PlayerLeftOverlay() {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <LogOut size={32} />
                </div>

                <h2 className="text-2xl font-bold text-white">Player Left</h2>
                <p className="text-gray-400">
                    Your friend has left the game. The session has ended.
                </p>

                <div className="space-y-3 pt-4">
                    <Link
                        href="/"
                        className="block w-full py-3 bg-red-600 rounded-xl font-bold text-white hover:bg-red-700 transition"
                    >
                        Start New Multiplayer
                    </Link>
                    <Link
                        href="/solo" // Or main page
                        className="block w-full py-3 bg-gray-800 rounded-xl font-bold text-white hover:bg-gray-700 transition"
                    >
                        Play Solo
                    </Link>
                </div>
            </div>
        </div>
    );
}
