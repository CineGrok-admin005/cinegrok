import { NextResponse } from 'next/server';
import { authService } from '@/services';

export async function POST() {
    try {
        await authService.signOut();
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
