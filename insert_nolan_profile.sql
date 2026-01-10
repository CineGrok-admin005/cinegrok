-- Comprehensive Christopher Nolan Profile
-- This demonstrates the full capabilities of the CineGrok platform

-- First, get the user_id (replace with your actual user ID from the auth.users table)
-- You can find this by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Insert the filmmaker profile
INSERT INTO filmmakers (
    user_id,
    name,
    profile_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users LIMIT 1), -- Uses the first user (you)
    'Christopher Nolan',
    'christopher-nolan-' || extract(epoch from now())::bigint,
    jsonb_build_object(
        'name', 'Christopher Nolan',
        'email', 'nolan@example.com',
        'pronouns', 'He/Him',
        'dob', '1970-07-30',
        'country', 'United Kingdom',
        'current_location', 'Los Angeles, California',
        'native_location', 'London, England',
        'nationality', 'British-American',
        'languages', 'English',
        
        'roles', ARRAY['Director', 'Writer', 'Producer'],
        'genres', ARRAY['Drama', 'Thriller', 'Sci-Fi'],
        'years_active', '1998-Present',
        'style', 'Known for complex narratives, practical effects over CGI, and exploring themes of time, memory, and identity. Uses IMAX cameras extensively and favors non-linear storytelling with intricate plot structures that challenge conventional narrative forms.',
        'influences', 'Stanley Kubrick, Ridley Scott, Terrence Malick, Fritz Lang, Orson Welles',
        'philosophy', 'I believe in the power of cinema to transport audiences to new realities while grounding stories in emotional truth and practical filmmaking techniques. The medium demands respect for both the craft and the audience.',
        'belief', 'Cinema is a collaborative art form that should challenge audiences intellectually while providing visceral entertainment. Every technical choice should serve the emotional core of the story.',
        'message', 'Every frame should serve the story, and every story should leave audiences questioning their perception of reality. Film is a medium of dreams made tangible.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'Inception',
                'year', '2010',
                'genre', 'Sci-Fi Thriller',
                'role', 'Director, Writer, Producer',
                'duration', '148 min',
                'synopsis', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. As he navigates through layers of dreams within dreams, he must confront his own guilt and the nature of reality itself.',
                'link', 'https://www.imdb.com/title/tt1375666/',
                'poster', ''
            ),
            jsonb_build_object(
                'title', 'The Dark Knight',
                'year', '2008',
                'genre', 'Action, Crime, Drama',
                'role', 'Director, Writer, Producer',
                'duration', '152 min',
                'synopsis', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. A crime epic that redefined the superhero genre.',
                'link', 'https://www.imdb.com/title/tt0468569/',
                'poster', ''
            ),
            jsonb_build_object(
                'title', 'Interstellar',
                'year', '2014',
                'genre', 'Sci-Fi, Drama',
                'role', 'Director, Writer, Producer',
                'duration', '169 min',
                'synopsis', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival. A visually stunning exploration of love, sacrifice, and the bonds that transcend time and space.',
                'link', 'https://www.imdb.com/title/tt0816692/',
                'poster', ''
            ),
            jsonb_build_object(
                'title', 'Dunkirk',
                'year', '2017',
                'genre', 'War, Drama, History',
                'role', 'Director, Writer, Producer',
                'duration', '106 min',
                'synopsis', 'Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II. Told from three perspectives across different timelines.',
                'link', 'https://www.imdb.com/title/tt5013056/',
                'poster', ''
            ),
            jsonb_build_object(
                'title', 'Oppenheimer',
                'year', '2023',
                'genre', 'Biography, Drama, History',
                'role', 'Director, Writer, Producer',
                'duration', '180 min',
                'synopsis', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A complex portrait of genius, ambition, and the moral weight of scientific discovery.',
                'link', 'https://www.imdb.com/title/tt15398776/',
                'poster', ''
            )
        ),
        
        'imdb', 'https://www.imdb.com/name/nm0634240/',
        'instagram', 'https://instagram.com/christophernolan',
        'twitter', 'https://twitter.com/christophernolan',
        'website', 'https://christophernolan.net',
        'youtube', 'https://youtube.com/@christophernolan',
        
        'undergraduate', 'University College London - English Literature (1993)',
        'certifications', 'Self-taught in filmmaking, studied classic cinema extensively. Honorary doctorates from Princeton University and University College London.',
        
        'awards', 'Academy Award Winner (Best Director - Oppenheimer), 5 Academy Awards total, 2 Golden Globe Awards, BAFTA Awards, Directors Guild of America Awards',
        'screenings', 'Cannes Film Festival, Venice Film Festival, Toronto International Film Festival, Sundance Film Festival',
        
        'open_to_collab', 'No',
        'contact_method', 'Through representation only'
    ),
    'Christopher Nolan is a visionary Director, Writer, and Producer known for their work in Drama, Thriller, and Sci-Fi. Drawing inspiration from Stanley Kubrick, Ridley Scott, Terrence Malick, Fritz Lang, and Orson Welles, their visual and narrative style is characterized by complex narratives, practical effects over CGI, and exploring themes of time, memory, and identity. Uses IMAX cameras extensively and favors non-linear storytelling with intricate plot structures that challenge conventional narrative forms. I believe in the power of cinema to transport audiences to new realities while grounding stories in emotional truth and practical filmmaking techniques. The medium demands respect for both the craft and the audience. Cinema is a collaborative art form that should challenge audiences intellectually while providing visceral entertainment. Every technical choice should serve the emotional core of the story. Notable works include "Inception" (2010), "The Dark Knight" (2008), "Interstellar" (2014), "Dunkirk" (2017), and "Oppenheimer" (2023). Their work has been recognized with Academy Award Winner (Best Director - Oppenheimer), 5 Academy Awards total, 2 Golden Globe Awards, BAFTA Awards, Directors Guild of America Awards. Every frame should serve the story, and every story should leave audiences questioning their perception of reality. Film is a medium of dreams made tangible.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Get the ID of the newly created filmmaker
SELECT 
    id,
    name,
    profile_url,
    '/filmmakers/' || id as profile_link
FROM filmmakers 
WHERE name = 'Christopher Nolan' 
ORDER BY created_at DESC 
LIMIT 1;
