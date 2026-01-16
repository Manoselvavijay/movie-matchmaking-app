'use server';

import { createClient } from "@/utils/supabase/server";
import { fetchTrendingMovies } from "@/lib/tmdb";
import { redirect } from "next/navigation";

function generatePin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function startNewGame() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Must be logged in to start a game");
    }

    // Fetch movies to play with
    const movies = await fetchTrendingMovies();
    const movieIds = movies.map(m => m.id);

    let pin = generatePin();
    let isUnique = false;

    // Simple uniqueness check retry loop
    while (!isUnique) {
        const { data } = await supabase.from('rooms').select('id').eq('pin', pin).single();
        if (!data) {
            isUnique = true;
        } else {
            pin = generatePin();
        }
    }

    const { data: room, error } = await supabase
        .from('rooms')
        .insert({
            pin,
            host_user_id: user.id,
            movie_ids: movieIds,
            status: 'waiting'
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating room (detailed):", JSON.stringify(error, null, 2));
        throw new Error(`Failed to create room: ${error.message} - ${error.details || ''} - ${error.hint || ''}`);
    }

    return room;
}

export async function joinGame(pin: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Must be logged in to join a game");
    }

    // Find the room
    const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('pin', pin)
        .single();

    if (fetchError || !room) {
        throw new Error("Room not found");
    }

    // Allow existing participants to re-join regardless of status
    if (room.host_user_id === user.id || room.player2_user_id === user.id) {
        return room;
    }

    if (room.status !== 'waiting') {
        throw new Error("Game already started or finished");
    }

    // Update player 2
    const { data: updatedRoom, error: updateError } = await supabase
        .from('rooms')
        .update({
            player2_user_id: user.id,
            status: 'ready' // Optional: change status to ready when p2 joins
        })
        .eq('id', room.id)
        .select()
        .single();

    if (updateError) {
        console.error("Error joining room:", updateError);
        throw new Error("Failed to join room");
    }

    return updatedRoom;
}

export async function submitSwipe(roomId: string, movieId: string, liked: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Must be logged in to swipe");
    }

    try {
        const { error } = await supabase
            .from('swipes')
            .insert({
                room_id: roomId,
                user_id: user.id,
                movie_id: movieId.toString(),
                liked
            });

        if (error) {
            // Ignore unique constraint violations (duplicate swipes)
            if (error.code !== '23505') {
                console.error("Error submitting swipe:", error);
                throw error;
            }
        }
    } catch (e) {
        console.error("Submit swipe failed:", e);
        // Don't block the UI for this, but log it
    }
}
