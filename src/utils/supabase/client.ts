import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase client could not be created: Missing env vars");
        return null;
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
