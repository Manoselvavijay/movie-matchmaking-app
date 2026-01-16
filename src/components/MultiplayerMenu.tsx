'use client';

import { useState } from 'react';
import { Gamepad2, X, Users, Play, Radio } from 'lucide-react';
import { startNewGame } from '@/app/actions/game';
import { useRouter } from 'next/navigation';

export default function MultiplayerMenu({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [joinPin, setJoinPin] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStartGame = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setLoading(true);
        try {
            const room = await startNewGame();
            setIsOpen(false);
            router.push(`/game/wait?pin=${room.pin}`);
        } catch (e) {
            console.error(e);
            alert("Failed to start game");
            setLoading(false);
        }
    };

    const handleJoinGame = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinPin) return;
        setIsOpen(false);
        router.push(`/join/${joinPin}`);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:text-white text-gray-300 transition group relative"
                title="Multiplayer"
            >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-full transition-all duration-300" />
                <Gamepad2 size={24} className="group-hover:text-blue-400 transition-colors" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                            <div className="flex items-center gap-3">
                                <Gamepad2 className="text-blue-400" size={24} />
                                <h2 className="text-xl font-bold text-white">Multiplayer</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">

                            {/* Option 1: Start New Game */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                                        <Play size={20} />
                                    </div>
                                    <span className="font-semibold">Start a New Game</span>
                                </div>
                                <button
                                    onClick={handleStartGame}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? "Creating..." : "Create Room"}
                                </button>
                                <p className="text-xs text-gray-500 text-center">Get a PIN to share with a friend</p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#1a1a1a] text-gray-500 uppercase tracking-wider font-medium">Or</span>
                                </div>
                            </div>

                            {/* Option 2: Join Existing Game */}
                            <form onSubmit={handleJoinGame} className="space-y-4">
                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                                        <Users size={20} />
                                    </div>
                                    <span className="font-semibold">Join Existing Game</span>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit PIN"
                                        maxLength={4}
                                        value={joinPin}
                                        onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, ''))}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-purple-500 transition placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                                    />
                                    <button
                                        type="submit"
                                        disabled={joinPin.length !== 4}
                                        className="px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Join
                                    </button>
                                </div>
                            </form>

                        </div>

                        {/* Footer */}
                        {!user && (
                            <div className="p-4 bg-yellow-500/10 text-yellow-500 text-xs text-center border-t border-white/5">
                                Sign in to create a room.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
