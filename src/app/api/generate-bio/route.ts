/**
 * AI Bio Generation API Route
 * 
 * Generates filmmaker bio using form data
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { formData } = body

        // Generate bio from form data
        const bio = generateBioFromData(formData)

        return NextResponse.json({ bio })
    } catch (error: any) {
        console.error('Bio Generation Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate bio' },
            { status: 500 }
        )
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
