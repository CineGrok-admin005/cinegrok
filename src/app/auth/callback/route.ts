/**
 * Auth Callback Handler
 * 
 * Handles OAuth callbacks and email confirmations
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'

    if (code) {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            return NextResponse.redirect(
                new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
            )
        }
    }

    // Redirect to the specified page or dashboard
    return NextResponse.redirect(new URL(redirect, request.url))
}
