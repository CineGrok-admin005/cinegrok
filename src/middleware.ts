/**
 * Middleware for Supabase Auth
 * 
 * Handles authentication and subscription checks for protected routes
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const pathname = request.nextUrl.pathname

    // Refresh session if expired
    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes that require authentication
    const protectedRoutes = ['/profile-builder', '/dashboard', '/settings']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !user) {
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // BETA LAUNCH: Subscription check disabled - All users get free access
    // Uncomment this block when ready to enforce paid subscriptions
    /*
    if (pathname.startsWith('/profile-builder') && user) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_status')
                .eq('id', user.id)
                .single()

            const hasActiveSubscription =
                profile?.subscription_status === 'active' ||
                profile?.subscription_status === 'trialing'

            if (!hasActiveSubscription) {
                return NextResponse.redirect(new URL('/pricing', request.url))
            }
        } catch (error) {
            console.error('Middleware subscription check error:', error)
        }
    }
    */

    // Redirect authenticated users away from auth pages
    if (user && pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/profile-builder/:path*',
        '/dashboard/:path*',
        '/settings/:path*',
        '/auth/:path*',
    ],
}
