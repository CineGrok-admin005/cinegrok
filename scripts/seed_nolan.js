const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env.local loader
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const dbConfig = fs.readFileSync(envPath, 'utf8');
            dbConfig.split('\n').forEach(line => {
                const [key, ...value] = line.split('=');
                if (key && value && !process.env[key.trim()]) {
                    process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
                }
            });
            console.log('Loaded .env.local');
        }
    } catch (e) {
        console.warn('Could not load .env.local, relying on process.env');
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY) are set in .env.local');
    process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using ANON KEY. This will likely fail with RLS errors unless your IP is allowlisted or policies are open.');
} else {
    console.log('Using Service Role Key (bypassing RLS).');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const nolanProfile = {
    name: 'Christopher Nolan',
    profile_url: `christopher-nolan-${Date.now()}`,
    raw_form_data: {
        name: 'Christopher Nolan',
        email: 'nolan@example.com',
        pronouns: 'He/Him',
        dob: '1970-07-30',
        country: 'United Kingdom',
        current_location: 'Los Angeles, California',
        native_location: 'London, England',
        nationality: 'British-American',
        languages: 'English',
        roles: ['Director', 'Writer', 'Producer'],
        genres: ['Drama', 'Thriller', 'Sci-Fi'],
        years_active: '1998-Present',
        style: 'Known for complex narratives, practical effects over CGI, and exploring themes of time, memory, and identity. Uses IMAX cameras extensively and favors non-linear storytelling with intricate plot structures that challenge conventional narrative forms.',
        influences: 'Stanley Kubrick, Ridley Scott, Terrence Malick, Fritz Lang, Orson Welles',
        philosophy: 'I believe in the power of cinema to transport audiences to new realities while grounding stories in emotional truth and practical filmmaking techniques. The medium demands respect for both the craft and the audience.',
        belief: 'Cinema is a collaborative art form that should challenge audiences intellectually while providing visceral entertainment. Every technical choice should serve the emotional core of the story.',
        message: 'Every frame should serve the story, and every story should leave audiences questioning their perception of reality. Film is a medium of dreams made tangible.',
        films: [
            {
                title: 'Inception',
                year: '2010',
                genre: 'Sci-Fi Thriller',
                role: 'Director, Writer, Producer',
                duration: '148 min',
                synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. As he navigates through layers of dreams within dreams, he must confront his own guilt and the nature of reality itself.',
                link: 'https://www.imdb.com/title/tt1375666/',
                poster: ''
            },
            {
                title: 'The Dark Knight',
                year: '2008',
                genre: 'Action, Crime, Drama',
                role: 'Director, Writer, Producer',
                duration: '152 min',
                synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. A crime epic that redefined the superhero genre.',
                link: 'https://www.imdb.com/title/tt0468569/',
                poster: ''
            },
            {
                title: 'Interstellar',
                year: '2014',
                genre: 'Sci-Fi, Drama',
                role: 'Director, Writer, Producer',
                duration: '169 min',
                synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. A visually stunning exploration of love, sacrifice, and the bonds that transcend time and space.',
                link: 'https://www.imdb.com/title/tt0816692/',
                poster: ''
            },
            {
                title: 'Dunkirk',
                year: '2017',
                genre: 'War, Drama, History',
                role: 'Director, Writer, Producer',
                duration: '106 min',
                synopsis: 'Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II. Told from three perspectives across different timelines.',
                link: 'https://www.imdb.com/title/tt5013056/',
                poster: ''
            },
            {
                title: 'Oppenheimer',
                year: '2023',
                genre: 'Biography, Drama, History',
                role: 'Director, Writer, Producer',
                duration: '180 min',
                synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A complex portrait of genius, ambition, and the moral weight of scientific discovery.',
                link: 'https://www.imdb.com/title/tt15398776/',
                poster: ''
            }
        ],
        imdb: 'https://www.imdb.com/name/nm0634240/',
        instagram: 'https://instagram.com/christophernolan',
        twitter: 'https://twitter.com/christophernolan',
        website: 'https://christophernolan.net',
        youtube: 'https://youtube.com/@christophernolan',
        undergraduate: 'University College London - English Literature (1993)',
        certifications: 'Self-taught in filmmaking, studied classic cinema extensively. Honorary doctorates from Princeton University and University College London.',
        awards: 'Academy Award Winner (Best Director - Oppenheimer), 5 Academy Awards total, 2 Golden Globe Awards, BAFTA Awards, Directors Guild of America Awards',
        screenings: 'Cannes Film Festival, Venice Film Festival, Toronto International Film Festival, Sundance Film Festival',
        open_to_collab: 'No',
        contact_method: 'Through representation only'
    },
    generated_bio: 'Christopher Nolan is a visionary Director, Writer, and Producer known for their work in Drama, Thriller, and Sci-Fi. Drawing inspiration from Stanley Kubrick, Ridley Scott, Terrence Malick, Fritz Lang, and Orson Welles, their visual and narrative style is characterized by complex narratives, practical effects over CGI, and exploring themes of time, memory, and identity. Uses IMAX cameras extensively and favors non-linear storytelling with intricate plot structures that challenge conventional narrative forms. I believe in the power of cinema to transport audiences to new realities while grounding stories in emotional truth and practical filmmaking techniques. The medium demands respect for both the craft and the audience. Cinema is a collaborative art form that should challenge audiences intellectually while providing visceral entertainment. Every technical choice should serve the emotional core of the story. Notable works include "Inception" (2010), "The Dark Knight" (2008), "Interstellar" (2014), "Dunkirk" (2017), and "Oppenheimer" (2023). Their work has been recognized with Academy Award Winner (Best Director - Oppenheimer), 5 Academy Awards total, 2 Golden Globe Awards, BAFTA Awards, Directors Guild of America Awards. Every frame should serve the story, and every story should leave audiences questioning their perception of reality. Film is a medium of dreams made tangible.',
    status: 'published',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

async function seed() {
    console.log('Starting seed process...');

    // 1. Get a user ID (try to get the first user)
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    let userId;
    if (!userError && users && users.users.length > 0) {
        userId = users.users[0].id;
        console.log(`Using existing user ID: ${userId}`);
    } else {
        // If we can't list users (likely due to permissions or no users), we might need to skip or fake it.
        // However, the SQL script used a subquery on auth.users. 
        // If we are using the service role key, we should be able to direct insert or query.
        // Let's try to fetch from a public table if auth fails, or just warn.
        console.warn('Could not fetch users from auth.admin (check service role permissions). trying to proceed without explicit user_id if table allows nullable, otherwise this might fail.');
        // Alternative: Try to see if there's an authenticated user flow, but this is a script.
        // We will try to proceed. Ideally we need a valid UUID.
        // Use a placeholder UUID if testing locally and constraints allow, or fail.
        // But better: Just try to query the table if we can't use admin auth.
    }

    // If we still don't have a user ID, and it's required...
    // The SQL used: (SELECT id FROM auth.users LIMIT 1)
    // If we have the Service Role Key, we can just do a raw query if 'rpc' is set up, but likely not.
    // Best bet: If listUsers failed, we can't easily get a user ID unless we have one hardcoded.

    if (!userId) {
        console.log("No user found. Attempting to insert without user_id (if schema allows) or checking for existing filmmakers to grab a user_id from...");
        const { data: existing } = await supabase.from('filmmakers').select('user_id').limit(1).single();
        if (existing) {
            userId = existing.user_id;
            console.log(`Found existing user_id from filmmakers table: ${userId}`);
        }
    }

    const profile = { ...nolanProfile, user_id: userId };

    // 2. Upsert profile
    const { data, error } = await supabase
        .from('filmmakers')
        .upsert([profile], { onConflict: 'profile_url' })
        .select();

    if (error) {
        console.error('Error inserting profile:', error);
    } else {
        console.log('Successfully inserted Christopher Nolan profile!');
        console.log('ID:', data[0].id);
        console.log('URL:', data[0].profile_url);
    }
}

seed().catch(console.error);
