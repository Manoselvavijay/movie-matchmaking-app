'use server';

import { createClient } from "@/utils/supabase/server";
import { fetchTrendingMovies } from "@/lib/tmdb";

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
        throw new Error(`Failed to create room: ${error.message}`);
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

    // Check if room is full
    if (room.player2_user_id && room.player2_user_id !== user.id) {
        throw new Error("Game already started");
    }

    // Update player 2
    const { data: updatedRoom, error: updateError } = await supabase
        .from('rooms')
        .update({
            player2_user_id: user.id,
            status: 'playing' // Auto-start game when p2 joins
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

export async function resumeGame(roomId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in");

    const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

    if (fetchError || !room) throw new Error("Room not found");

    let newStatus = room.status;

    // State machine for resuming
    // paused -> paused_HOST_ready OR paused_PLAYER2_ready
    // paused_X_ready -> playing (if Y confirms)

    if (room.status === 'paused') {
        if (room.host_user_id === user.id) newStatus = 'paused_host_ready';
        else if (room.player2_user_id === user.id) newStatus = 'paused_player2_ready';
    } else if (room.status === 'paused_host_ready') {
        // If player 2 confirms now, we are good to go
        if (room.player2_user_id === user.id) newStatus = 'playing';
    } else if (room.status === 'paused_player2_ready') {
        // If host confirms now, we are good to go
        if (room.host_user_id === user.id) newStatus = 'playing';
    }

    if (newStatus !== room.status) {
        await supabase.from('rooms').update({ status: newStatus }).eq('id', roomId);
    }

    return newStatus;
}

export async function submitSwipe(roomId: string, movieId: string, liked: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Must be logged in to swipe");
    }

    try {
        // 1. Insert into swipes
        const { error } = await supabase
            .from('swipes')
            .upsert({
                room_id: roomId,
                user_id: user.id,
                movie_id: movieId.toString(),
                liked
            }, {
                onConflict: 'room_id,user_id,movie_id'
            });

        if (error) {
            console.error("Error submitting swipe:", error);
            throw error;
        }

        // 2. Query swipes where room_id = currentRoom, movie_id = swipedMovie, liked = true
        if (liked) {
            const { count, error: countError } = await supabase
                .from('swipes')
                .select('*', { count: 'exact', head: true }) // head: true for simpler counting
                .eq('room_id', roomId)
                .eq('movie_id', movieId.toString())
                .eq('liked', true);

            if (countError) {
                console.error("Error counting swipes:", countError);
            }

            // 3. If count = 2 -> MATCH FOUND
            if (count === 2) {
                console.log("Match detected! Count is 2 on movie:", movieId);

                // Insert into matches
                const { error: matchError } = await supabase
                    .from('matches')
                    .insert({
                        room_id: roomId,
                        movie_id: movieId.toString()
                    });

                if (!matchError || matchError.code === '23505') {
                    // Emit real-time event is handled by Supabase subscription to 'matches'

                    // Pause the game for both users
                    await supabase
                        .from('rooms')
                        .update({ status: 'paused' })
                        .eq('id', roomId);
                }
            }
        }

    } catch (e) {
        console.error("Submit swipe failed:", e);
    }
}

export async function leaveGame(roomId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Mark room as ended/abandoned
    await supabase.from('rooms').update({ status: 'abandoned' }).eq('id', roomId);
}
