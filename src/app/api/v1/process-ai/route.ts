import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // 1. Retrieve Data
        const { data: filmmaker, error: fetchError } = await supabase
            .from('filmmakers')
            .select('raw_form_data')
            .eq('id', id)
            .single();

        if (fetchError || !filmmaker) {
            return NextResponse.json({ error: 'Filmmaker not found' }, { status: 404 });
        }

        const rawData = filmmaker.raw_form_data;
        // Create a string representation of the data for the AI
        const dataString = JSON.stringify(rawData, null, 2);

        // 2. Bio Generation
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
      You are a professional film industry publicist.
      Based on the following raw data from a filmmaker's portfolio submission, write a professional, concise, 3-paragraph bio.
      Focus on their role, style, key works, and philosophy.
      
      Raw Data:
      ${dataString}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const bio = response.text();

        // 3. Vector Embedding
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embeddingResult = await embeddingModel.embedContent(bio);
        const embedding = embeddingResult.embedding.values;

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('filmmakers')
            .update({
                ai_generated_bio: bio,
                style_vector: embedding,
            })
            .eq('id', id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true, bio }, { status: 200 });
    } catch (error: any) {
        console.error('AI Processing error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
