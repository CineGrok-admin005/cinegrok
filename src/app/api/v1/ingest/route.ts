import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

        // Insert into Supabase
        const { data, error } = await supabase
            .from('filmmakers')
            .insert([
                {
                    name,
                    profile_url: profile_url || null,
                    raw_form_data: raw_form_data,
                },
            ])
            .select('id')
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: error.message },
                {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        // OPTIONAL: Trigger AI processing immediately
        // fetch(`${req.nextUrl.origin}/api/v1/process-ai`, {
        //   method: 'POST',
        //   body: JSON.stringify({ id: data.id }),
        // });

        return NextResponse.json(
            { message: 'Data ingested successfully', id: data.id },
            {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('Ingest error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}
