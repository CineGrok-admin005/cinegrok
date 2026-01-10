import { NextRequest, NextResponse } from 'next/server';
import { filmmakerDomain } from '@/domain/filmmaker.logic';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, profile_url, ...raw_form_data } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        // Ingest using domain logic
        const result = await filmmakerDomain.ingestFilmmaker({
            name,
            profile_url: profile_url || null,
            ...raw_form_data
        });

        return NextResponse.json(
            { message: 'Data ingested successfully', id: result.id },
            {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error('Ingest error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}
