/**
 * Single Filmmaker API Route
 * 
 * GET /api/v1/filmmakers/[id] - Get filmmaker by ID
 * 
 * Security: Read-only, validates UUID format
 * Performance: Aggressive caching for profile pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { filmmakerDomain } from '@/domain/filmmaker.logic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Validate UUID format for security
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'Invalid filmmaker ID format' },
                { status: 400 }
            );
        }

        // Fetch single filmmaker using domain logic
        const data = await filmmakerDomain.getFilmmakerProfile(id);

        if (!data) {
            return NextResponse.json(
                { error: 'Filmmaker not found' },
                { status: 404 }
            );
        }

        // Cache profile pages aggressively (1 hour)
        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });
    } catch (error: any) {
        console.error('Filmmaker API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
