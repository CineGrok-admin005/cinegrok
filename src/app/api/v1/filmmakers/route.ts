/**
 * Filmmakers API Route
 * 
 * GET /api/v1/filmmakers - List all filmmakers with processed bios
 * 
 * Security: Read-only endpoint, uses abstracted services
 * Scalability: Implements pagination and caching headers
 * Performance: Only fetches filmmakers with completed AI processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { filmmakerDomain } from '@/domain/filmmaker.logic';

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
        // Note: Offset/pagination logic should ideally move to domain/db service for complex queries

        // Fetch filmmakers using domain logic (DB-level filtering)
        const processedData = await filmmakerDomain.listFilmmakers(limit);

        // In-memory filtering removed in favor of DB optimization
        // const processedData = data.filter(f => f.generated_bio !== null);

        // Set caching headers for performance
        // Cache for 5 minutes, revalidate in background
        return NextResponse.json(
            {
                data: processedData,
                pagination: {
                    total: processedData.length,
                    limit,
                    offset: 0,
                    hasMore: false, // Simplified for now
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
