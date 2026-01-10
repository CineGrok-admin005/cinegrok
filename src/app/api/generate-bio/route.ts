import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            throw new Error('AI Service not configured. Please add GOOGLE_AI_API_KEY to your environment.')
        }

        const body = await request.json()
        const { formData } = body

        if (!formData || !formData.name) {
            throw new Error('Missing necessary filmmaker data for bio generation.')
        }

        // Generate bio using actual AI
        const bio = await generateProfessionalBio(formData)

        return NextResponse.json({ bio })
    } catch (error: any) {
        console.error('Bio Generation Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate bio' },
            { status: 500 }
        )
    }
}

async function generateProfessionalBio(data: any): Promise<string> {
    const prompt = `
        You are a professional film industry editorial writer for a platform like IMDb or Variety.
        Your task is to write a sophisticated, cinematic biography for a filmmaker in the THIRD PERSON (e.g., "Shivaji Raja is...", never "I am...").
        
        The bio should feel official, respectful, and insightful. Avoid marketing fluff and focus on their craft.
        
        Filmmaker Data:
        - Name: ${data.name}
        - Roles: ${data.roles?.join(', ') || 'Filmmaker'}
        - Location: ${data.current_location || data.country || 'Not specified'}
        - Years Active: ${data.years_active || 'Not specified'}
        - Genres: ${Array.isArray(data.genres) ? data.genres.join(', ') : data.genres || 'Various'}
        - Artistic Style: ${data.style || 'Not specified'}
        - Creative Philosophy: ${data.philosophy || 'Not specified'}
        - Key Influences: ${data.influences || 'Not specified'}
        - Notable Films: ${data.films?.map((f: any) => `"${f.title}" (${f.year})`).join(', ') || 'None listed'}
        - Awards/Press: ${data.awards || 'None'}
        
        Requirements:
        1. PERSPECTIVE: Strictly 3rd Person.
        2. TONE: Serious, cinematic, and professional.
        3. STRUCTURE: 
           - Paragraph 1: Introduction (Name, role, location, and years active).
           - Paragraph 2: Artistic style and philosophy (narrative themes, visual language).
           - Paragraph 3: Notable works and achievements.
        4. Word count: 100-150 words.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Basic cleanup in case Gemini adds markdown or markers
        return text.replace(/^"|"$/g, '').replace(/```[a-z]*\n|```/g, '');
    } catch (err) {
        console.error("Gemini Error:", err);
        throw new Error("The AI service encountered an issue. Please try again in a moment.");
    }
}

function generateBioFromData(data: any): string {
    const {
        name,
        roles = [],
        genres = [],
        years_active,
        style,
        influences,
        philosophy,
        belief,
        message,
        films = [],
        awards,
        country,
        current_location,
    } = data

    // Build a professional bio
    let bio = `${name} is a `

    // Add roles
    if (roles.length > 0) {
        if (roles.length === 1) {
            bio += `${roles[0]}`
        } else if (roles.length === 2) {
            bio += `${roles[0]} and ${roles[1]}`
        } else {
            bio += `${roles.slice(0, -1).join(', ')}, and ${roles[roles.length - 1]}`
        }
    } else {
        bio += 'filmmaker'
    }

    // Add location
    if (current_location || country) {
        bio += ` based in ${current_location || country}`
    }

    bio += '. '

    // Add genres
    if (genres.length > 0) {
        bio += `Known for their work in ${genres.slice(0, 2).join(' and ')}, `
    }

    // Add years active
    if (years_active) {
        bio += `they have been active in the industry since ${years_active}. `
    } else {
        bio += `they bring a unique perspective to their craft. `
    }

    // Add style/philosophy
    if (style) {
        bio += `Their visual and narrative style is characterized by ${style.toLowerCase()}. `
    }

    if (philosophy) {
        bio += `${philosophy} `
    }

    // Add influences
    if (influences) {
        bio += `Drawing inspiration from ${influences}, `
    }

    // Add belief
    if (belief) {
        bio += `${belief} `
    }

    // Add notable films
    if (films.length > 0) {
        const notableFilms = films.slice(0, 3)
        bio += `Notable works include `
        bio += notableFilms.map((f: any) => `"${f.title}" (${f.year})`).join(', ')
        bio += '. '
    }

    // Add awards
    if (awards) {
        bio += `Their work has been recognized with ${awards.toLowerCase()}. `
    }

    // Add message/intent
    if (message) {
        bio += `${message}`
    }

    return bio.trim()
}
