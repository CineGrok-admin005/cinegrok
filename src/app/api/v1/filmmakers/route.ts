/**
 * Filmmakers API Route
 * 
 * GET /api/v1/filmmakers - List all filmmakers with processed bios
 * GET /api/v1/filmmakers/[id] - Get single filmmaker
 * 
 * Security: Read-only endpoint, uses Supabase RLS
 * Scalability: Implements pagination and caching headers
 * Performance: Only fetches filmmakers with completed AI processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET all filmmakers
 * Query params:
 * - limit: number of results (default: 50, max: 100)
 * - offset: pagination offset (default: 0)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const offset = parseInt(searchParams.get('offset') || '0');

        // Fetch filmmakers with completed AI processing
        // Security: Only return public data, no sensitive fields
        const { data, error, count } = await supabase
            .from('filmmakers')
            .select('id, name, profile_url, ai_generated_bio, raw_form_data, created_at', { count: 'exact' })
            .not('ai_generated_bio', 'is', null) // Only show processed profiles
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Set caching headers for performance
        // Cache for 5 minutes, revalidate in background
        return NextResponse.json(
            {
                data,
                pagination: {
                    total: count,
                    limit,
                    offset,
                    hasMore: count ? offset + limit < count : false,
                },
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        );
    } catch (error: any) {
        console.error('Filmmakers API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
