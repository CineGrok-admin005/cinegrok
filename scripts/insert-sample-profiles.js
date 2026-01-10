/**
 * Script to insert 5 rich sample profiles into Supabase for design verification.
 * Run with: node scripts/insert-sample-profiles.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const profiles = [
    {
        name: 'Priya Sharma',
        profile_url: `priya-sharma-${Date.now()}`,
        raw_form_data: {
            name: 'Priya Sharma',
            profile_photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
            email: 'priya.sharma@cinegrok.com',
            phone: '+91 98765 12345',
            pronouns: 'She/Her',
            dob: '1985-03-15',
            country: 'India',
            current_location: 'Mumbai, Maharashtra, India',
            native_location: 'Jaipur, Rajasthan',
            nationality: 'Indian',
            languages: 'Hindi, English, Rajasthani, Marathi',
            roles: ['Director', 'Writer', 'Producer'],
            genres: ['Documentary', 'Drama', 'Social Realism'],
            years_active: '2010',
            style: 'Known for intimate observational documentaries that give voice to marginalized communities. Uses natural lighting, handheld cameras, and long takes to create immersive experiences.',
            influences: 'Mira Nair, Satyajit Ray, Deepa Mehta, Kim Longinotto, Frederick Wiseman',
            philosophy: 'Cinema should be a mirror that reflects our society while also being a window into experiences beyond our own.',
            belief: 'Every story, no matter how small, deserves to be told with dignity and craft.',
            films: [
                { title: 'Threads of Time', year: '2023', genre: 'Documentary', role: 'Director, Writer', format: 'Feature Film', status: 'Released', crew_scale: 'Small (2-5)', synopsis: 'An intimate portrait of three generations of women weavers in Banaras.' },
                { title: 'The Last Monsoon', year: '2022', genre: 'Drama', role: 'Director, Writer, Producer', format: 'Feature Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A farmer faces impossible choices as climate change threatens his ancestral lands.' },
                { title: 'Daughters of the Well', year: '2020', genre: 'Documentary', role: 'Director', format: 'Short Film', status: 'Released', crew_scale: 'Solo', synopsis: 'Women in a drought-stricken village take control of their water resources.' },
                { title: 'Silent Streets', year: '2019', genre: 'Social Drama', role: 'Writer, Director', format: 'Feature Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A transgender woman navigates the streets of Mumbai.' },
                { title: 'The Weight of Tradition', year: '2024', genre: 'Documentary', role: 'Director', format: 'Documentary', status: 'Post-Production', crew_scale: 'Small (2-5)', synopsis: 'Exploring the clash between ancient customs and modern aspirations.' }
            ],
            instagram: 'https://instagram.com/priyasharmafilms',
            twitter: 'https://twitter.com/priyasharma',
            linkedin: 'https://linkedin.com/in/priyasharma',
            website: 'https://priyasharmafilms.com',
            youtube: 'https://youtube.com/@priyasharmafilms',
            schooling: 'St. Xavier\'s High School, Jaipur',
            undergraduate: 'Lady Shri Ram College - English Literature (2006)',
            postgraduate: 'Film and Television Institute of India (FTII) - Direction (2010)',
            certifications: 'Berlinale Talents 2015, Mumbai Documentary Workshop',
            open_to_collab: 'Yes, actively seeking cinematographers and sound designers.',
            availability: 'Available from March 2026'
        },
        ai_generated_bio: 'Priya Sharma is an acclaimed Director, Writer, and Producer based in Mumbai. Active since 2010, she has crafted 5 projects spanning Documentary, Drama, and Social Realism. Her work is characterized by intimate observational documentaries that give voice to marginalized communities. Notable works include "Threads of Time" (2023) and "The Last Monsoon" (2022).',
        status: 'published',
        published_at: new Date().toISOString()
    },
    {
        name: 'Vikram Krishnamurthy',
        profile_url: `vikram-krishna-${Date.now()}`,
        raw_form_data: {
            name: 'Vikram Krishnamurthy',
            profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            email: 'vikram.k@cinegrok.com',
            phone: '+91 87654 32109',
            pronouns: 'He/Him',
            country: 'India',
            current_location: 'Chennai, Tamil Nadu, India',
            native_location: 'Madurai, Tamil Nadu',
            languages: 'Tamil, Hindi, English, Telugu',
            roles: ['Cinematographer', 'Director of Photography'],
            genres: ['Drama', 'Thriller', 'Commercial'],
            years_active: '2005',
            style: 'Master of chiaroscuro lighting with deep, dramatic shadows. Known for using anamorphic lenses to create distinctive wide compositions. Expert in both digital (ARRI Alexa) and film (35mm Kodak Vision3).',
            influences: 'Vittorio Storaro, Roger Deakins, Santosh Sivan, P.C. Sreeram, Emmanuel Lubezki',
            philosophy: 'Light is the most powerful storyteller. Every frame should feel like it could be paused and hung on a wall.',
            films: [
                { title: 'Shadows of Madras', year: '2024', genre: 'Neo-Noir Thriller', role: 'Cinematographer', format: 'Feature Film', status: 'Post-Production', crew_scale: 'Large (20+)', synopsis: 'A detective hunts a serial killer through 1970s Madras.' },
                { title: 'The Forgotten Temple', year: '2023', genre: 'Drama', role: 'Director of Photography', format: 'Feature Film', status: 'Released', crew_scale: 'Large (20+)', synopsis: 'An archaeologist discovers a temple that rewrites history.' },
                { title: 'Monsoon Wedding Blues', year: '2022', genre: 'Romantic Drama', role: 'Cinematographer', format: 'Feature Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A family reunion during a monsoon wedding reveals secrets.' },
                { title: 'Echoes', year: '2021', genre: 'Psychological Thriller', role: 'Cinematographer', format: 'Web Series', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A woman starts hearing voices that predict the future.' },
                { title: 'The River Keeper', year: '2020', genre: 'Documentary', role: 'Director of Photography', format: 'Documentary', status: 'Released', crew_scale: 'Small (2-5)', synopsis: 'Following the last boatman on a dying river.' },
                { title: 'Neon Dreams', year: '2019', genre: 'Cyberpunk', role: 'Cinematographer', format: 'Short Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A hacker in near-future Chennai fights digital oppression.' }
            ],
            instagram: 'https://instagram.com/vikramkframes',
            twitter: 'https://twitter.com/vikramdop',
            website: 'https://vikramkrishnamurthy.com',
            undergraduate: 'Loyola College, Chennai - Visual Communication (2004)',
            postgraduate: 'SRFTI, Kolkata - Cinematography (2007)',
            certifications: 'ARRI Master Class (2018), Kodak Film School Workshop',
            open_to_collab: 'Yes, currently looking for interesting scripts.',
            availability: 'Available immediately'
        },
        ai_generated_bio: 'Vikram Krishnamurthy is a distinguished Cinematographer based in Chennai with nearly two decades of experience. Known for chiaroscuro lighting and anamorphic compositions. Notable works include "Shadows of Madras" (2024) and "The Forgotten Temple" (2023).',
        status: 'published',
        published_at: new Date().toISOString()
    },
    {
        name: 'Aisha Khan',
        profile_url: `aisha-khan-${Date.now()}`,
        raw_form_data: {
            name: 'Aisha Khan',
            profile_photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400',
            email: 'aisha.khan@cinegrok.com',
            pronouns: 'She/Her',
            country: 'India',
            current_location: 'Hyderabad, Telangana, India',
            native_location: 'Lucknow, Uttar Pradesh',
            languages: 'Hindi, Urdu, English, Telugu',
            roles: ['Editor', 'Director', 'Colorist'],
            genres: ['Drama', 'Experimental', 'Music Video'],
            years_active: '2013',
            style: 'Known for rhythmic editing that creates emotional momentum. Pioneered a unique approach to color grading that blends nostalgic warmth with contemporary sharpness.',
            influences: 'Thelma Schoonmaker, Walter Murch, Sally Menke, Bina Paul',
            philosophy: 'Editing is the last rewrite—the final chance to shape the story and find its hidden rhythms.',
            films: [
                { title: 'Fractures', year: '2024', genre: 'Psychological Drama', role: 'Editor, Director', format: 'Feature Film', status: 'Post-Production', crew_scale: 'Medium (6-20)', synopsis: 'A woman pieces together her fragmented memories after an accident.' },
                { title: 'The Color of Memory', year: '2023', genre: 'Experimental', role: 'Director, Colorist', format: 'Short Film', status: 'Released', crew_scale: 'Small (2-5)', synopsis: 'An abstract exploration of how we remember loved ones.' },
                { title: 'Gharana', year: '2022', genre: 'Family Drama', role: 'Editor', format: 'Feature Film', status: 'Released', crew_scale: 'Large (20+)', synopsis: 'Three siblings reunite at their ancestral home for their father\'s final days.' },
                { title: 'Rebellion Series', year: '2022', genre: 'Music Video', role: 'Editor, Colorist', format: 'Music Video', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A series of 5 interconnected music videos for indie rock band.' },
                { title: 'Whispers in the Dark', year: '2021', genre: 'Horror Thriller', role: 'Editor', format: 'Web Series', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'An 8-episode series about haunted old-Delhi havelis.' }
            ],
            instagram: 'https://instagram.com/aishakhanedits',
            linkedin: 'https://linkedin.com/in/aishakhaneditor',
            website: 'https://aishakhaneditor.com',
            undergraduate: 'Jamia Millia Islamia - Mass Communication (2011)',
            postgraduate: 'National Institute of Design - Film & Video (2013)',
            certifications: 'DaVinci Resolve Certified Colorist, AVID Certified Editor',
            open_to_collab: 'Selectively, depending on the project vision.',
            availability: 'Booked until June 2026'
        },
        ai_generated_bio: 'Aisha Khan is a versatile Editor, Director, and Colorist based in Hyderabad. Her rhythmic editing creates emotional momentum. Notable works include "Fractures" (2024) and "Gharana" (2022).',
        status: 'published',
        published_at: new Date().toISOString()
    },
    {
        name: 'Rajan Verma',
        profile_url: `rajan-verma-${Date.now()}`,
        raw_form_data: {
            name: 'Rajan Verma',
            profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            email: 'rajan.verma@cinegrok.com',
            pronouns: 'He/Him',
            country: 'India',
            current_location: 'Pune, Maharashtra, India',
            native_location: 'Shimla, Himachal Pradesh',
            languages: 'Hindi, English, Punjabi',
            roles: ['Sound Designer', 'Composer', 'Music Director'],
            genres: ['Drama', 'Documentary', 'Indie', 'Experimental'],
            years_active: '2000',
            style: 'Specializes in ambient soundscapes that blur the line between score and sound design. Expert in field recording and incorporating natural sounds into musical compositions.',
            influences: 'Resul Pookutty, A.R. Rahman, Ennio Morricone, Hans Zimmer, Ryuichi Sakamoto',
            philosophy: 'Sound is 50% of the cinema experience. When done right, you feel it rather than hear it.',
            films: [
                { title: 'The Valley', year: '2024', genre: 'Drama', role: 'Sound Designer, Composer', format: 'Feature Film', status: 'Released', crew_scale: 'Large (20+)', synopsis: 'A sound engineer returns to his remote Himalayan village after 20 years.' },
                { title: 'Silence Between Notes', year: '2023', genre: 'Documentary', role: 'Sound Designer', format: 'Documentary', status: 'Released', crew_scale: 'Small (2-5)', synopsis: 'Following classical musicians preparing for their final performance.' },
                { title: 'Underwater', year: '2022', genre: 'Experimental', role: 'Sound Designer, Composer', format: 'Short Film', status: 'Released', crew_scale: 'Solo', synopsis: 'An audio-visual meditation on ocean conservation.' },
                { title: 'The Inheritance', year: '2021', genre: 'Family Drama', role: 'Music Director', format: 'Feature Film', status: 'Released', crew_scale: 'Large (20+)', synopsis: 'A joint family is torn apart by a disputed will.' },
                { title: 'Echoes of Partition', year: '2020', genre: 'Historical Documentary', role: 'Sound Designer, Composer', format: 'Documentary', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'Survivors of the 1947 partition share their memories.' },
                { title: 'Night Bus', year: '2019', genre: 'Thriller', role: 'Sound Designer', format: 'Feature Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A tense night journey on a bus through rural India.' },
                { title: 'Mindscape', year: '2025', genre: 'Sci-Fi', role: 'Composer', format: 'Feature Film', status: 'Pre-Production', crew_scale: 'Large (20+)', synopsis: 'A neuroscientist can enter people\'s dreams.' }
            ],
            instagram: 'https://instagram.com/rajanvermasound',
            twitter: 'https://twitter.com/rajanverma',
            website: 'https://rajanvermasound.com',
            undergraduate: 'Delhi University - Physics (1999)',
            postgraduate: 'Film and Television Institute of India (FTII) - Sound Design (2002)',
            certifications: 'Dolby Atmos Mixing Certified, Pro Tools Expert Certification',
            open_to_collab: 'Yes, open to interesting projects worldwide.',
            availability: 'Available from February 2026'
        },
        ai_generated_bio: 'Rajan Verma is a distinguished Sound Designer and Composer based in Pune with over two decades of experience. Known for ambient soundscapes that blur the line between score and sound design. Notable works include "The Valley" (2024) and "Echoes of Partition" (2020).',
        status: 'published',
        published_at: new Date().toISOString()
    },
    {
        name: 'Neha Desai',
        profile_url: `neha-desai-${Date.now()}`,
        raw_form_data: {
            name: 'Neha Desai',
            profile_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            email: 'neha.desai@cinegrok.com',
            pronouns: 'She/Her',
            country: 'India',
            current_location: 'Ahmedabad, Gujarat, India',
            native_location: 'Surat, Gujarat',
            languages: 'Gujarati, Hindi, English',
            roles: ['Writer', 'Director'],
            genres: ['Coming-of-Age', 'Drama', 'LGBTQ+'],
            years_active: '2019',
            style: 'Fresh and intimate stories centered on young women navigating tradition and modernity. Uses vibrant colors, contemporary music, and handheld camerawork.',
            influences: 'Zoya Akhtar, Alankrita Shrivastava, Greta Gerwig, Céline Sciamma, Barry Jenkins',
            philosophy: 'I want to tell stories about people who look like me—young Indian women finding their voice.',
            films: [
                { title: 'Chai and Secrets', year: '2024', genre: 'Coming-of-Age Drama', role: 'Writer, Director', format: 'Short Film', status: 'Released', crew_scale: 'Small (2-5)', synopsis: 'A young woman comes out to her grandmother over their daily chai ritual.' },
                { title: 'The Arranged Life', year: '2023', genre: 'Romantic Comedy', role: 'Writer, Director', format: 'Short Film', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'A woman hires an actor to play her boyfriend at family gatherings.' },
                { title: 'Spectrum', year: '2022', genre: 'LGBTQ+ Drama', role: 'Writer', format: 'Web Series', status: 'Released', crew_scale: 'Medium (6-20)', synopsis: 'An anthology series about queer lives in small-town India.' },
                { title: 'Between Two Suitcases', year: '2025', genre: 'Drama', role: 'Writer, Director', format: 'Feature Film', status: 'Development', crew_scale: 'TBD', synopsis: 'A young woman must choose between her dream job abroad and caring for her aging parents.' }
            ],
            instagram: 'https://instagram.com/nehadesaifilms',
            twitter: 'https://twitter.com/nehadesai',
            linkedin: 'https://linkedin.com/in/nehadesai',
            website: 'https://nehadesaifilms.com',
            undergraduate: 'St. Xavier\'s College, Ahmedabad - Media Studies (2016)',
            certifications: 'MAMI Year-Round Programme (2020), Screenwriters Lab (2021)',
            open_to_collab: 'Yes, actively seeking collaborators and mentors for my first feature.',
            availability: 'Available immediately'
        },
        ai_generated_bio: 'Neha Desai is an emerging Writer and Director based in Ahmedabad. Since 2019, she has created 4 projects focusing on Coming-of-Age, Drama, and LGBTQ+ stories. Notable works include "Chai and Secrets" (2024) and "The Arranged Life" (2023).',
        status: 'published',
        published_at: new Date().toISOString()
    }
];

async function insertProfiles() {
    console.log('Inserting 5 rich sample profiles...\n');

    for (const profile of profiles) {
        const { data, error } = await supabase
            .from('filmmakers')
            .insert(profile)
            .select('id, name, profile_url');

        if (error) {
            console.error(`❌ Failed to insert ${profile.name}:`, error.message);
        } else {
            console.log(`✅ Inserted: ${data[0].name}`);
            console.log(`   Profile URL: /filmmakers/${data[0].id}\n`);
        }
    }

    console.log('Done! Visit the profiles in your browser to verify the design.');
}

insertProfiles().catch(console.error);
