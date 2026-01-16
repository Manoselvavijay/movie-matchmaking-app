import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables in middleware')
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser().
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()
    const path = url.pathname

    // Arrays of paths
    const authPaths = ['/login', '/signup']
    const publicPaths = ['/auth/callback'] // Add other purely public paths if necessary

    if (!user) {
        // User is NOT logged in
        // Allow access to auth paths, public paths, and root
        // Redirect everything else to /login
        if (!authPaths.some(p => path.startsWith(p)) && !publicPaths.some(p => path.startsWith(p)) && path !== '/') {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    } else {
        // User IS logged in
        // Redirect away from auth pages to home
        if (authPaths.some(p => path.startsWith(p))) {
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
