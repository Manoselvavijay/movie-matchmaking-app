'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Users } from 'lucide-react';
import { startNewGame } from '@/app/actions/game';
import MatchWatchLogo from '@/components/MatchWatchLogo';
import ProfileModal from '@/components/ProfileModal';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface GameModeSelectionProps {
    user: User | null;
}

export default function GameModeSelection({ user }: GameModeSelectionProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showMultiplayerOptions, setShowMultiplayerOptions] = useState(false);
    const [joinPin, setJoinPin] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleStartMultiplayer = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setShowMultiplayerOptions(true);
    };

    const handleCreateRoom = async () => {
        if (!user) return; // Should already be handled
        setLoading(true);
        try {
            const room = await startNewGame();
            router.push(`/game/wait?pin=${room.pin}`);
        } catch (e) {
            console.error(e);
            alert("Failed to start game");
            setLoading(false);
        }
    };

    const handleJoinGame = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinPin || joinPin.length !== 4) return;
        // Note: Joining technically might not need auth for just entering PIN, 
        // but Requirements say "When the user clicks Multiplayer... prompted to sign in first"
        // and we are already past that check.
        router.push(`/join/${joinPin}`);
    };

    const handleSoloMode = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        router.push('/solo');
    };

    // Shared Navbar Logic
    const renderNavbar = () => (
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
            <MatchWatchLogo />
            <div>
                {user ? (
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="w-10 h-10 rounded overflow-hidden border-2 border-transparent hover:border-white transition"
                    >
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </button>
                ) : (
                    <Link href="/login" className="px-5 py-2 bg-[#E50914] text-white rounded font-medium text-sm hover:bg-[#b81d24] transition">
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );

    if (showMultiplayerOptions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative bg-black overflow-hidden">
                {/* Navbar */}
                {renderNavbar()}

                <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 z-10">
                    <h1 className="text-3xl font-bold mb-2">Multiplayer</h1>
                    <p className="text-gray-400 mb-8 max-w-xs">Play with friends to find the perfect movie match.</p>

                    <div className="w-full max-w-sm space-y-6">
                        {/* Create Room */}
                        <button
                            onClick={handleCreateRoom}
                            disabled={loading}
                            className="w-full py-4 bg-[#E50914] hover:bg-[#b81d24] text-white rounded-md font-bold text-lg shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Creating..." : "Create Room"}
                        </button>

                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-gray-800 w-full absolute"></div>
                            <span className="bg-black px-3 text-sm text-gray-500 relative z-10">OR</span>
                        </div>

                        {/* Join Room */}
                        <form onSubmit={handleJoinGame} className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter PIN"
                                    maxLength={4}
                                    value={joinPin}
                                    onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-center text-lg text-white focus:outline-none focus:border-[#E50914] transition placeholder:text-gray-600"
                                />
                                <button
                                    type="submit"
                                    disabled={joinPin.length !== 4}
                                    className="px-6 bg-[#333] hover:bg-[#444] text-white rounded-md font-bold transition disabled:opacity-50"
                                >
                                    Join
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={() => setShowMultiplayerOptions(false)}
                            className="text-gray-500 hover:text-white text-sm mt-4 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {isProfileOpen && user && (
                    <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center animate-in fade-in zoom-in duration-500 relative bg-black overflow-hidden">
            {/* Navbar */}
            {renderNavbar()}

            <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 z-10">
                {/* Logo Big Center (Optional - User liked current design? 
                   User said: "navbar that includes the logo on the left... show two options". 
                   So maybe we don't need big logo center? The prompt image had "Movie Matchmaker" text. 
                   Let's keep the big branding for visual appeal but smaller or just text?) 
                   -> Keeping the big logo/text center for now as "Hero" content.
                */}
                <div className="mb-8 scale-125 origin-center hidden md:block">
                    {/* Only show big logo on desktop if logo is also in navbar? 
                        Actually, Netflix usually just has logo in navbar. 
                        Let's just show a big Title here instead of logo duplication if possible. 
                        Or just keep consistent.
                        I'll keep the big logo for now as it looks good.
                     */}
                    {/* <MatchWatchLogo /> */}
                </div>

                {/* Text Title instead? */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Movie Matchmaker</h1>

                <p className="text-gray-400 mb-12 max-w-sm leading-relaxed">
                    Find the perfect movie to watch with your friends. Swipe right to like, left to pass.
                </p>

                <div className="w-full max-w-sm space-y-6">

                    {/* Multiplayer Button */}
                    <button
                        onClick={handleStartMultiplayer}
                        className="group w-full py-4 bg-[#E50914] hover:bg-[#b81d24] text-white rounded-md font-bold text-lg shadow-[0_4px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_4px_25px_rgba(229,9,20,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                    >
                        <Users size={24} className="group-hover:scale-110 transition-transform" />
                        Start Multiplayer
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center py-2">
                        <div className="border-t border-gray-800 w-full absolute"></div>
                        <span className="bg-black px-3 text-xs font-medium text-gray-500 uppercase tracking-widest relative z-10">OR</span>
                    </div>

                    {/* Solo Mode Button */}
                    <button
                        onClick={handleSoloMode}
                        className="group w-full py-4 bg-[#181818] hover:bg-[#262626] border border-gray-800 hover:border-gray-700 text-white rounded-md font-bold text-lg transition-all flex items-center justify-center gap-3"
                    >
                        <Play size={24} className="fill-current group-hover:scale-110 transition-transform" />
                        Solo Mode
                    </button>
                </div>
            </div>

            {isProfileOpen && user && (
                <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />
            )}
        </div>
    );
}
