import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, options } = await req.json();
        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
        });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
