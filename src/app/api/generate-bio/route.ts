/**
 * Bio Generation API Route
 * 
 * Generates filmmaker bios using deterministic templates.
 * Includes rate limiting and structured logging.
 * 
 * No external AI dependencies - instant, reliable generation.
 * 
 * @module api/generate-bio
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateBioFromTemplate, getNextVariant, BioVariant, BioFormData } from '@/lib/bio-templates';
import { createRateLimitMiddleware, RateLimits } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    let userId: string | undefined;

    try {
        // Get user for rate limiting and logging
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;

        // Rate limiting
        const identifier = userId || request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimit = createRateLimitMiddleware('BIO_GENERATION', identifier);

        if (!rateLimit.allowed) {
            logger.rateLimit('BIO_GENERATION', identifier, RateLimits.BIO_GENERATION.limit, RateLimits.BIO_GENERATION.windowMs);

            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please wait before generating another bio.',
                    code: 'ERR_API_001',
                    retryAfter: rateLimit.headers['Retry-After']
                },
                {
                    status: 429,
                    headers: rateLimit.headers
                }
            );
        }

        // Parse request body
        const body = await request.json();
        const { formData, variant = 1 } = body as { formData: BioFormData; variant?: BioVariant };

        if (!formData) {
            logger.error('ERR_API_002', 'Missing formData in request', userId);
            return NextResponse.json(
                { error: 'Missing form data for bio generation', code: 'ERR_API_002' },
                { status: 400 }
            );
        }

        // Validate we have minimum required data
        const name = formData.stageName || formData.name;
        if (!name) {
            logger.error('ERR_BIO_002', 'Insufficient profile data for bio generation', userId);
            return NextResponse.json(
                { error: 'Name is required for bio generation', code: 'ERR_BIO_002' },
                { status: 400 }
            );
        }

        // Generate bio using deterministic templates
        const bio = generateBioFromTemplate(formData, variant);
        const nextVariant = getNextVariant(variant);

        logger.info('Bio generated successfully', userId, {
            variant,
            nextVariant,
            bioLength: bio.length,
            durationMs: Date.now() - startTime
        });

        return NextResponse.json({
            bio,
            variant,
            nextVariant,
            meta: {
                generated: new Date().toISOString(),
                method: 'template',
            }
        }, {
            headers: rateLimit.headers
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        logger.error('ERR_BIO_001', `Bio generation failed: ${errorMessage}`, userId, {
            error: errorMessage,
            durationMs: Date.now() - startTime
        });

        return NextResponse.json(
            {
                error: 'Failed to generate bio. Please try again.',
                code: 'ERR_BIO_001'
            },
            { status: 500 }
        );
    }
}
