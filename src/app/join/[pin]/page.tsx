import { joinGame } from "@/app/actions/game";
import { redirect } from "next/navigation";
import Link from "next/link";
import MatchWatchLogo from "@/components/MatchWatchLogo";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function JoinPage({ params }: { params: Promise<{ pin: string }> }) {
    const { pin } = await params;

    // 1. Auth Check FIRST
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login with callback to this join page
        redirect(`/login?next=${encodeURIComponent(`/join/${pin}`)}`);
    }

    let error = null;
    let room = null;

    try {
        room = await joinGame(pin);
    } catch (e: any) {
        console.error("Join error:", e);
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
