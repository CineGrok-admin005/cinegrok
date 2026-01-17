/**
 * Collaboration Interests API Route
 * 
 * Enhanced API for managing collaboration interests with:
 * - GET: Fetch interests with filtering
 * - PATCH: Update status or notes
 * - (POST/DELETE inherited from existing route)
 * 
 * @module api/v1/collaboration-interests
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbService, authService } from '@/services';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/collaboration-interests
 * Get collaboration interests with optional filtering
 * 
 * Query params:
 * - status: Filter by status (interested, shortlisted, contacted, archived)
 * - role: Filter by filmmaker role
 * - location: Filter by location
 */
export async function GET(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const filters = {
            status: searchParams.get('status') || undefined,
            role: searchParams.get('role') || undefined,
            location: searchParams.get('location') || undefined,
        };

        const interests = await dbService.getCollaborationInterests(user.id, filters);

        return NextResponse.json({
            interests,
            count: interests.length,
            filters
        });

    } catch (error) {
        logger.error('ERR_COLLAB_001', 'Failed to fetch collaboration interests', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Failed to fetch interests' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/v1/collaboration-interests
 * Update status or notes for a collaboration interest
 * 
 * Body: { filmmakerId: string, status?: string, notes?: string }
 */
export async function PATCH(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { filmmakerId, status, notes } = await request.json();

        if (!filmmakerId) {
            return NextResponse.json(
                { error: 'filmmakerId is required' },
                { status: 400 }
            );
        }

        // Update status if provided
        if (status) {
            const validStatuses = ['interested', 'shortlisted', 'contacted', 'archived'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: 'Invalid status value' },
                    { status: 400 }
                );
            }
            await dbService.updateInterestStatus(user.id, filmmakerId, status);
            logger.info('INF_COLLAB_003', user.id, { filmmakerId, status });
        }

        // Update notes if provided
        if (notes !== undefined) {
            await dbService.updateInterestNotes(user.id, filmmakerId, notes);
            logger.info('INF_COLLAB_004', user.id, { filmmakerId, hasNotes: notes.length > 0 });
        }

        return NextResponse.json({
            success: true,
            message: 'Interest updated successfully'
        });

    } catch (error) {
        logger.error('ERR_COLLAB_003', 'Failed to update collaboration interest', undefined, {
            error: String(error),
        });
        return NextResponse.json(
            { error: 'Failed to update interest' },
            { status: 500 }
        );
    }
}
