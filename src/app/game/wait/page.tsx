'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import MatchWatchLogo from "@/components/MatchWatchLogo";
import { Copy, Check, Users, Loader2 } from "lucide-react";
import Link from "next/link";

function WaitingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pin = searchParams.get("pin");
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState("waiting");

    useEffect(() => {
        if (!pin) return;

        const supabase = createClient();
        if (!supabase) return;

        // Optional: Fetch initial status to check if already joined
        const checkStatus = async () => {
            const { data } = await supabase.from('rooms').select('*').eq('pin', pin).single();
            if (data && data.player2_user_id) {
                router.push(`/game/play?roomId=${data.id}`);
            }
        };
        checkStatus();

        // Subscribe to room changes
        const channel = supabase
            .channel(`room_${pin}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rooms',
                    filter: `pin=eq.${pin}`,
                },
                (payload) => {
                    const newRow = payload.new as any;
                    if (newRow.player2_user_id) {
                        setStatus("found");
                        setTimeout(() => {
                            router.push(`/game/play?roomId=${newRow.id}`);
                        }, 1000);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [pin, router]);

    const copyLink = () => {
        const url = `${window.location.origin}/join/${pin}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!pin) return <div className="text-white">Invalid Room</div>;

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 text-center space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Multiplayer Lobby</h1>
                <p className="text-gray-400">Invite a friend to start swiping!</p>
            </div>

            {/* PIN Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full border border-white/10 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <p className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-medium">Room PIN</p>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-widest font-mono">
                    {pin}
                </div>
            </div>

            {/* Share Link */}
            <div className="w-full space-y-4">
                <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition group active:scale-[0.98]"
                >
                    <div className="flex flex-col items-start truncate mr-4">
                        <span className="text-sm text-gray-400">Share Link</span>
                        <span className="text-zinc-500 text-xs truncate max-w-[200px]">{typeof window !== 'undefined' ? `${window.location.host}/join/${pin}` : 'Loading...'}</span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${copied ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </div>
                </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 text-white/80 bg-white/5 py-2 px-4 rounded-full">
                {status === 'waiting' ? (
                    <>
                        <Loader2 size={16} className="animate-spin text-blue-400" />
                        <span className="animate-pulse">Waiting for friend to join...</span>
                    </>
                ) : (
                    <>
                        <Users size={16} className="text-green-400" />
                        <span className="text-green-400 font-medium">Friend found! Starting...</span>
                    </>
                )}
            </div>

            <Link href="/" className="text-sm text-gray-500 hover:text-white transition underline decoration-gray-700 underline-offset-4">
                Cancel and return home
            </Link>
        </div>
    );
}

export default function WaitPage() {
    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="absolute top-6 left-6">
                <MatchWatchLogo />
            </div>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <WaitingContent />
            </Suspense>
        </main>
    );
}
