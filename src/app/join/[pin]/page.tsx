import { joinGame } from "@/app/actions/game";
import { redirect } from "next/navigation";
import Link from "next/link";
import MatchWatchLogo from "@/components/MatchWatchLogo";
import { Loader2 } from "lucide-react";

export default async function JoinPage({ params }: { params: Promise<{ pin: string }> }) {
    const { pin } = await params;
    let error = null;

    let room = null;
    try {
        room = await joinGame(pin);
    } catch (e: any) {
        console.error("Join error:", e);
        // If user is not logged in, we might want to redirect to login with a callback
        // But for now, let's show the error.
        if (e.message?.includes("Must be logged in")) {
            return (
                <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <MatchWatchLogo />
                    <h1 className="text-2xl font-bold text-white">Login Required</h1>
                    <p className="text-gray-400 max-w-sm">You need to be signed in to join a multiplayer game.</p>
                    <Link
                        href={`/login?next=/join/${pin}`}
                        className="px-8 py-3 bg-red-600 rounded-full font-bold text-white hover:bg-red-700 transition w-full max-w-xs"
                    >
                        Sign In to Join
                    </Link>
                </main>
            );
        }
        error = e.message || "Failed to join room";
    }

    if (room) {
        redirect(`/game/play?roomId=${room.id}`);
    }

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6">
            <MatchWatchLogo />

            {error ? (
                <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-8 max-w-sm w-full">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Unavailable</h1>
                    <p className="text-gray-300">{error}</p>
                    <div className="mt-6">
                        <Link href="/" className="text-sm font-medium text-white hover:underline">
                            Return Home
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <p className="text-white text-lg">Joining room...</p>
                </div>
            )}
        </main>
    );
}
