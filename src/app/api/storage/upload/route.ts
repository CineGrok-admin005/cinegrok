import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const bucket = formData.get('bucket') as string || 'avatars';
        const path = formData.get('path') as string;

        if (!file || !path) {
            return NextResponse.json({ error: 'File and path are required' }, { status: 400 });
        }

        const publicUrl = await storageService.uploadFile(bucket, path, file);
        return NextResponse.json({ publicUrl });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
