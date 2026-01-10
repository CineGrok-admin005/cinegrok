import { NextResponse } from 'next/server';
import { authService, dbService } from '@/services';

export async function GET() {
    try {
        const user = await authService.getCurrentUser();
        if (!user) return NextResponse.json({ user: null });

        // Enrich with profile status
        const filmmaker = await dbService.getFilmmakerByUserId(user.id);

        return NextResponse.json({
            user: {
                ...user,
                hasProfile: !!filmmaker
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
