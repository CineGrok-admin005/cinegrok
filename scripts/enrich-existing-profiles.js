
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Data Generators ---

const SCHOOLS = [
    'FTII, Pune', 'SRFTI, Kolkata', 'Whistling Woods International', 'NYU Tisch School of the Arts',
    'London Film School', 'National School of Drama (NSD)', 'AFI Conservatory'
];

const DEGREES = ['Diploma in Filmmaking', 'B.A. in Visual Arts', 'M.F.A. in Cinema', 'Certificate in Acting', 'Sound Engineering Diploma'];

const FESTIVALS = [
    'Cannes Film Festival', 'Sundance', 'TIFF', 'Berlinale', 'Mumbai Film Festival (MAMI)',
    'IFFI Goa', 'Tribeca', 'Venice Film Festival'
];

const AWARDS = [
    'Best Director', 'Best Cinematography', 'Jury Prize', 'Audience Choice Award',
    'Best Short Film', 'Special Mention', 'Best Sound Design', 'Best Actor'
];

const GENRES = ['Drama', 'Thriller', 'Documentary', 'Horror', 'Sci-Fi', 'Comedy', 'Romance', 'Action'];

// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandoms = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Generate Filmography based on role and experience
const generateFilmography = (role, yearsActiveStr) => {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(yearsActiveStr?.split(' ')[0]) || (currentYear - 2);
    const yearsExperience = currentYear - startYear;

    let numFilms = 2; // Default for freshers
    if (yearsExperience > 5) numFilms = 5 + Math.floor(Math.random() * 5); // 5-10 films
    if (yearsExperience > 15) numFilms = 10 + Math.floor(Math.random() * 10); // 10-20 films

    const films = [];
    for (let i = 0; i < numFilms; i++) {
        const filmYear = currentYear - Math.floor(Math.random() * yearsExperience);
        const status = filmYear === currentYear ? 'Post-Production' : 'Released';

        films.push({
            id: `film-${Math.random().toString(36).substr(2, 9)}`, // ID needed for list keys
            title: `Project ${Math.random().toString(36).substr(2, 5).toUpperCase()}`, // Placeholder titles
            year: filmYear.toString(),
            genre: getRandom(GENRES),
            role: role,
            status: status,
            format: Math.random() > 0.7 ? 'Feature Film' : 'Short Film',
            crewScale: Math.random() > 0.5 ? 'Medium (6-20)' : 'Small (2-5)',
            synopsis: 'A gripping tale exploring human emotions and societal structures.',
            posterUrl: '', // Could add placeholder images
            achievements: Math.random() > 0.7 ? [
                {
                    id: `ach-${Math.random()}`,
                    eventName: getRandom(FESTIVALS),
                    year: filmYear.toString(),
                    result: Math.random() > 0.5 ? 'won' : 'selected',
                    type: Math.random() > 0.5 ? 'award' : 'official_selection',
                    category: getRandom(AWARDS)
                }
            ] : []
        });
    }

    // Sort by year desc
    return films.sort((a, b) => parseInt(b.year) - parseInt(a.year));
};

const enrichProfiles = async () => {
    console.log('Fetching all existing profiles...');
    const { data: profiles, error } = await supabase.from('filmmakers').select('*');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} profiles. Enriching data...`);

    for (const profile of profiles) {
        const role = (profile.primary_roles && profile.primary_roles[0]) || 'Filmmaker';
        const yearsActive = profile.years_active || '2020';

        // Generate richer data
        const enrichedFilmography = generateFilmography(role, yearsActive);

        const education = [
            {
                institution: getRandom(SCHOOLS),
                degree: getRandom(DEGREES),
                year: (parseInt(yearsActive.split(' ')[0]) || 2020) - 1
            }
        ];

        // Construct new raw_form_data merging existing with new
        const newRawData = {
            ...(profile.raw_form_data || {}), // Keep existing

            // Core Identity (Ensure Sync)
            name: profile.name,
            email: profile.email || `${profile.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
            stageName: profile.stage_name,
            legalName: profile.legal_name,

            // Bio & Location (Ensure Sync)
            bio: profile.bio || profile.ai_generated_bio,
            currentCity: profile.current_city,
            currentState: profile.current_state,
            country: profile.country || 'India',

            // Professional (Ensure Sync)
            primaryRoles: profile.primary_roles || [],
            secondaryRoles: profile.secondary_roles || [],
            roles: profile.primary_roles || [], // Legacy support
            yearsActive: yearsActive,

            // Creative DNA (Map from DB columns)
            creativeInfluences: profile.creative_influences || "Cinema Verite, Italian Neorealism, French New Wave",
            visualStyle: profile.visual_style || "Naturalistic, Handheld, High Contrast",
            creativePhilosophy: profile.creative_philosophy || "Cinema is truth at 24 frames per second.",
            beliefAboutCinema: profile.belief_about_cinema,
            messageOrIntent: profile.message_intent,
            creativeSignature: profile.creative_signature,

            // Availability & Work
            openToCollaborations: profile.open_to_collaborations || "Yes",
            availability: profile.availability || "Available from next month",
            preferredWorkLocation: profile.preferred_work_location || "India",

            // Enriched Fields
            filmography: enrichedFilmography, // The main requested feature
            films: enrichedFilmography, // Legacy support

            educationTraining: `${education[0].degree} from ${education[0].institution}`,

            socials: {
                instagram: `https://instagram.com/${profile.name.replace(/\s+/g, '').toLowerCase()}`,
                linkedin: `https://linkedin.com/in/${profile.name.replace(/\s+/g, '').toLowerCase()}`,
                imdb: `https://imdb.com/name/nm${Math.floor(Math.random() * 1000000)}`
            },

            // Ensure visual consistency
            profile_photo_url: profile.raw_form_data?.profile_photo_url || null
        };

        // Update DB
        const { error: updateError } = await supabase
            .from('filmmakers')
            .update({
                raw_form_data: newRawData,
                updated_at: new Date().toISOString()
            })
            .eq('id', profile.id);

        if (updateError) {
            console.error(`Failed to update ${profile.name}:`, updateError.message);
        } else {
            console.log(`✅ Enriched ${profile.name} (${role}, ${enrichedFilmography.length} films)`);
        }
    }

    console.log('Enrichment complete.');
};

enrichProfiles().catch(console.error);
