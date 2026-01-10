/**
 * Interested Profiles API Route
 * 
 * Allows authenticated users to express/remove interest in filmmaker profiles.
 * Follows /scalable-saas architecture - uses dbService, not direct Supabase.
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbService, authService } from '@/services';

/**
 * GET /api/interested-profiles
 * Get all profiles the current user has expressed interest in
 * 
 * Query params:
 * - filmmakerId: (optional) Check if specific filmmaker is in list
 */
export async function GET(request: NextRequest) {
    try {
        const { user, error: authError } = await authService.getCurrentUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const filmmakerId = searchParams.get('filmmakerId');

        // If checking specific filmmaker
        if (filmmakerId) {
            const isInterested = await dbService.isInterested(user.id, filmmakerId);
            return NextResponse.json({ isInterested });
        }

        // Get all interested profiles
        const profiles = await dbService.getInterestedProfiles(user.id);
        return NextResponse.json({ profiles });

    } catch (error) {
        console.error('Error fetching interested profiles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch interested profiles' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/interested-profiles
 * Express interest in a filmmaker profile
 * 
 * Body: { filmmakerId: string }
 */
export async function POST(request: NextRequest) {
    try {
        const { user, error: authError } = await authService.getCurrentUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { filmmakerId } = await request.json();

        if (!filmmakerId) {
            return NextResponse.json(
                { error: 'filmmakerId is required' },
                { status: 400 }
            );
        }

        await dbService.expressInterest(user.id, filmmakerId);

        return NextResponse.json({
            success: true,
            message: 'Interest expressed successfully'
        });

    } catch (error) {
        console.error('Error expressing interest:', error);
        return NextResponse.json(
            { error: 'Failed to express interest' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/interested-profiles
 * Remove interest in a filmmaker profile
 * 
 * Body: { filmmakerId: string }
 */
export async function DELETE(request: NextRequest) {
    try {
        const { user, error: authError } = await authService.getCurrentUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { filmmakerId } = await request.json();

        if (!filmmakerId) {
            return NextResponse.json(
                { error: 'filmmakerId is required' },
                { status: 400 }
            );
        }

        await dbService.removeInterest(user.id, filmmakerId);

        return NextResponse.json({
            success: true,
            message: 'Interest removed successfully'
        });

    } catch (error) {
        console.error('Error removing interest:', error);
        return NextResponse.json(
            { error: 'Failed to remove interest' },
            { status: 500 }
        );
    }
}
