import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, provider, options } = await req.json();
        const supabase = await createSupabaseServerClient();

        if (provider) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options
            });
            if (error) throw error;
            return NextResponse.json(data);
        }

        if (email && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return NextResponse.json(data);
        }

        if (email) {
            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: options || {}
            });
            if (error) throw error;
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid login request' }, { status: 400 });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
