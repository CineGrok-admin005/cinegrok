import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, profile_url, ...raw_form_data } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('filmmakers')
            .insert([
                {
                    name,
                    profile_url: profile_url || null, // Optional, can be generated later if null
                    raw_form_data: raw_form_data,
                },
            ])
            .select('id')
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Trigger AI processing (fire and forget, or await if critical)
        // For now, we'll just return success and let the client (or a separate trigger) handle AI
        // In a real production app, you might use a queue or a separate async call.
        // Here, we'll call the process-ai endpoint internally or just assume the user will trigger it.
        // Given the requirements, we'll just return success here.

        // OPTIONAL: Trigger AI processing immediately
        // fetch(`${req.nextUrl.origin}/api/v1/process-ai`, {
        //   method: 'POST',
        //   body: JSON.stringify({ id: data.id }),
        // });

        return NextResponse.json({ message: 'Data ingested successfully', id: data.id }, { status: 201 });
    } catch (error) {
        console.error('Ingest error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
