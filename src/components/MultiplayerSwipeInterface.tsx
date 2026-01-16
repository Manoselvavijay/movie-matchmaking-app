"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import ActionButtons from "@/components/ActionButtons";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import { Movie } from "@/data/movies";
import { Film, LogOut } from "lucide-react";
import Link from "next/link";
import MovieBackground from "./MovieBackground";
import ProfileModal from "./ProfileModal";
import MatchWatchLogo from "./MatchWatchLogo";
import MatchFoundModal from "./MatchFoundModal";
import MatchedMoviesList from "./MatchedMoviesList";
import PlayerLeftOverlay from "./PlayerLeftOverlay";
import LeaveModal from "./LeaveModal";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { submitSwipe, resumeGame, leaveGame } from "@/app/actions/game";

interface MultiplayerSwipeInterfaceProps {
    initialMovies: Movie[];
    initialUser: User | null;
    roomId: string;
}

export default function MultiplayerSwipeInterface({ initialMovies, initialUser, roomId }: MultiplayerSwipeInterfaceProps) {
    const [cardStack, setCardStack] = useState<Movie[]>(initialMovies);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [user, setUser] = useState<User | null>(initialUser);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Multiplayer State
    const [matches, setMatches] = useState<Movie[]>([]);
    const [isMatchListOpen, setIsMatchListOpen] = useState(false);
    const [currentMatch, setCurrentMatch] = useState<Movie | null>(null);
    const [waitingForOther, setWaitingForOther] = useState(false);
    const [roomStatus, setRoomStatus] = useState<string>('playing');
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Fetch latest user session
    useEffect(() => {
        const supabase = createClient();

        if (!user && supabase) {
            supabase.auth.getUser().then(({ data }) => {
                setUser(data.user);
            });
        }

        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch initial room status and matches
    useEffect(() => {
        const fetchRoomData = async () => {
            const supabase = createClient();
            if (!supabase) return;

            // 1. Fetch Room Status
            const { data: roomData } = await supabase.from('rooms').select('status').eq('id', roomId).single();
            if (roomData) {
                setRoomStatus(roomData.status);
            }

            // 2. Fetch Existing Matches
            const { data: matchesData } = await supabase
                .from('matches')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });

            if (matchesData && matchesData.length > 0) {
                const matchedMovies = matchesData
                    .map(m => initialMovies.find(im => im.id.toString() === m.movie_id))
                    .filter((m): m is Movie => !!m);

                setMatches(matchedMovies);

                // 3. State Recovery: If paused, show the latest match to allow resuming
                if (roomData?.status === 'paused' && matchedMovies.length > 0) {
                    const lastMatch = matchedMovies[matchedMovies.length - 1];
                    setCurrentMatch(lastMatch);
                }
            }
        };
        fetchRoomData();
    }, [roomId, initialMovies]);

    // Multiplayer Logic: Realtime Subscriptions
    useEffect(() => {
        if (!roomId || !user) return;

        const supabase = createClient();
        if (!supabase) return;


        console.log("Subscribing to room:", roomId);

        // Channel for Matches and Room Status
        const channel = supabase
            .channel(`game_${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'matches',
                    filter: `room_id=eq.${roomId}`,
                },
                (payload) => {
                    console.log("Match Found Payload:", payload);
                    const newMatch = payload.new as any;
                    const movie = initialMovies.find(m => m.id.toString() === newMatch.movie_id.toString());

                    if (movie) {
                        // Strict Server Authority: Only add to match list when server says so
                        setMatches(prev => {
                            if (prev.some(m => m.id === movie.id)) return prev;
                            return [...prev, movie];
                        });

                        // Show Match Modal
                        setCurrentMatch(movie);

                        // We do NOT manually set roomStatus to paused here, 
                        // we wait for the 'rooms' UPDATE event to trigger that state change 
                        // to ensure we are in sync with the DB. 
                        // However, for UX responsiveness, we can optimistically set it 
                        // IF we are sure the trigger works. 
                        // Given the user constraint "Multiplayer must be... DB logic", 
                        // let's rely on the Update event below for the 'paused' status.
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rooms',
                    filter: `id=eq.${roomId}`,
                },
                (payload) => {
                    console.log("Room Update Payload:", payload);
                    const newRoom = payload.new as any;
                    setRoomStatus(newRoom.status);

                    // If we receive 'playing', close modals and waiting screens
                    if (newRoom.status === 'playing') {
                        setCurrentMatch(null);
                        setWaitingForOther(false);
                    }
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status);
            });

        return () => {
            if (supabase) supabase.removeChannel(channel);
        };
    }, [roomId, user, initialMovies]);

    const handleSwipe = async (direction: "left" | "right") => {
        if (cardStack.length === 0) return;

        // Strict Pause Check
        if (roomStatus === 'paused' || roomStatus.startsWith('paused_') || roomStatus === 'abandoned') {
            console.log("Game paused or ended, swipe ignored");
            return;
        }

        const currentMovie = cardStack[0];
        const newStack = cardStack.slice(1);
        setCardStack(newStack);

        const liked = direction === "right";

        console.log(`Swiping ${liked ? 'Right' : 'Left'} on ${currentMovie.title} (${currentMovie.id})`);

        // Submit to DB - No local watchlist usage here!
        try {
            await submitSwipe(roomId, currentMovie.id.toString(), liked);
        } catch (error) {
            console.error("Failed to submit swipe:", error);
        }
    };

    const handleKeepPlaying = async () => {
        setWaitingForOther(true);
        await resumeGame(roomId);
    };

    const handleLeaveClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLeaveModal(true);
    };

    const confirmLeave = async () => {
        setShowLeaveModal(false);
        await leaveGame(roomId);
        window.location.href = '/';
    };

    const handleInfoClick = () => {
        if (cardStack.length > 0) {
            setSelectedMovie(cardStack[0]);
        }
    };

    const posterUrls = initialMovies.map(m => m.poster).filter(Boolean);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden relative">
            <MovieBackground posters={posterUrls} />

            {/* Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-1">
                    <MatchWatchLogo />
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        onClick={handleLeaveClick}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition backdrop-blur-sm border border-gray-700"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:inline">Leave</span>
                    </Link>

                    <button
                        onClick={() => setIsMatchListOpen(true)}
                        className="relative group w-10 h-10 flex items-center justify-center hover:scale-110 hover:text-white text-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <Film size={24} className="text-red-500" />
                        {matches.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full pointer-events-none shadow-sm">
                                {matches.length}
                            </span>
                        )}
                    </button>

                    {/* Profile Icon */}
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
                        <div className="w-10 h-10" />
                    )}
                </div>
            </header>

            {/* Card Stack */}
            <div className="relative w-full max-w-[320px] aspect-[2/3] flex items-center justify-center z-10 mt-28 md:mt-20">
                {cardStack.length > 0 ? (
                    cardStack.slice(0, 3).map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onSwipe={handleSwipe}
                            onInfoClick={handleInfoClick}
                        />
                    ))
                ) : (
                    <div className="text-center text-white z-20 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">You've reached the end!</h2>
                            <p className="text-gray-400">Wait for your friend or check matches.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setIsMatchListOpen(true)}
                                className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition"
                            >
                                View Matched Movies
                            </button>
                            <Link
                                href="/"
                                onClick={handleLeaveClick}
                                className="text-gray-400 hover:text-white text-sm font-medium transition"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {cardStack.length > 0 && (
                <ActionButtons onSwipe={handleSwipe} onInfoClick={handleInfoClick} />
            )}

            {/* Movie Details Modal */}
            <MovieDetailsModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />

            {/* Profile Modal */}
            {isProfileOpen && user && (
                <ProfileModal
                    user={user}
                    onClose={() => setIsProfileOpen(false)}
                />
            )}

            {/* Match Found Modal */}
            {currentMatch && (
                <MatchFoundModal
                    movie={currentMatch}
                    onKeepPlaying={handleKeepPlaying}
                    waitingForOther={waitingForOther}
                />
            )}

            {/* Matched Movies List */}
            <MatchedMoviesList
                matches={matches}
                isOpen={isMatchListOpen}
                onClose={() => setIsMatchListOpen(false)}
            />

            {/* Leave Confirmation Modal */}
            {showLeaveModal && (
                <LeaveModal
                    onConfirm={confirmLeave}
                    onCancel={() => setShowLeaveModal(false)}
                />
            )}

            {/* Player Left Overlay */}
            {roomStatus === 'abandoned' && (
                <PlayerLeftOverlay />
            )}
        </main>
    );
}
