-- 5 Rich Sample Profiles for CineGrok Design Verification
-- These profiles have ALL fields populated to showcase the Figma design

-- ============================================================================
-- 1. PRIYA SHARMA - Documentary/Drama Director
-- ============================================================================
INSERT INTO filmmakers (
    name,
    profile_url,
    profile_photo_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    'Priya Sharma',
    'priya-sharma-' || extract(epoch from now())::bigint,
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    jsonb_build_object(
        'name', 'Priya Sharma',
        'email', 'priya.sharma@cinegrok.com',
        'phone', '+91 98765 12345',
        'pronouns', 'She/Her',
        'dob', '1985-03-15',
        'country', 'India',
        'current_location', 'Mumbai, Maharashtra, India',
        'native_location', 'Jaipur, Rajasthan',
        'nationality', 'Indian',
        'languages', 'Hindi, English, Rajasthani, Marathi',
        
        'roles', ARRAY['Director', 'Writer', 'Producer'],
        'genres', ARRAY['Documentary', 'Drama', 'Social Realism'],
        'years_active', '2010',
        'style', 'Known for intimate observational documentaries that give voice to marginalized communities. Uses natural lighting, handheld cameras, and long takes to create immersive experiences. Blends vérité techniques with poetic visual compositions.',
        'influences', 'Mira Nair, Satyajit Ray, Deepa Mehta, Kim Longinotto, Frederick Wiseman',
        'philosophy', 'Cinema should be a mirror that reflects our society while also being a window into experiences beyond our own.',
        'belief', 'Every story, no matter how small, deserves to be told with dignity and craft. Documentary is not about capturing truth; it is about revealing it.',
        'message', 'Looking for collaborators who believe in authentic storytelling and are passionate about giving platform to unheard voices.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'Threads of Time',
                'year', '2023',
                'genre', 'Documentary',
                'role', 'Director, Writer',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'An intimate portrait of three generations of women weavers in Banaras, exploring how tradition adapts to modernity.'
            ),
            jsonb_build_object(
                'title', 'The Last Monsoon',
                'year', '2022',
                'genre', 'Drama',
                'role', 'Director, Writer, Producer',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A farmer faces impossible choices as climate change threatens his ancestral lands.'
            ),
            jsonb_build_object(
                'title', 'Daughters of the Well',
                'year', '2020',
                'genre', 'Documentary',
                'role', 'Director',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Solo',
                'synopsis', 'Women in a drought-stricken village take control of their water resources.'
            ),
            jsonb_build_object(
                'title', 'Silent Streets',
                'year', '2019',
                'genre', 'Social Drama',
                'role', 'Writer, Director',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A transgender woman navigates the streets of Mumbai in search of acceptance and home.'
            ),
            jsonb_build_object(
                'title', 'The Weight of Tradition',
                'year', '2024',
                'genre', 'Documentary',
                'role', 'Director',
                'format', 'Documentary',
                'status', 'Post-Production',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'Exploring the clash between ancient customs and modern aspirations in rural India.'
            )
        ),
        
        'imdb', 'https://www.imdb.com/name/priyasharma',
        'instagram', 'https://instagram.com/priyasharmafilms',
        'twitter', 'https://twitter.com/priyasharma',
        'linkedin', 'https://linkedin.com/in/priyasharma',
        'website', 'https://priyasharmafilms.com',
        'youtube', 'https://youtube.com/@priyasharmafilms',
        
        'schooling', 'St. Xavier's High School, Jaipur',
        'undergraduate', 'Lady Shri Ram College - English Literature (2006)',
        'postgraduate', 'Film and Television Institute of India (FTII) - Direction (2010)',
        'certifications', 'Berlinale Talents 2015, Mumbai Documentary Workshop',
        
        'awards', 'National Film Award for Best Documentary (2023), MAMI Best Director (2022), Cannes ACID selection (2021)',
        'screenings', 'Sundance Film Festival, IDFA Amsterdam, Mumbai Film Festival, Berlin Documentary Forum',
        
        'open_to_collab', 'Yes, actively seeking cinematographers and sound designers for my next documentary.',
        'availability', 'Available from March 2026',
        'contact_method', 'Direct contact welcome'
    ),
    'Priya Sharma is an acclaimed Director, Writer, and Producer based in Mumbai, India. Active since 2010, she has crafted 5 projects spanning Documentary, Drama, and Social Realism. Her work is characterized by intimate observational documentaries that give voice to marginalized communities, using natural lighting, handheld cameras, and long takes to create immersive experiences. Influenced by Mira Nair, Satyajit Ray, and Deepa Mehta, she believes that cinema should be a mirror that reflects our society while also being a window into experiences beyond our own. Notable works include "Threads of Time" (2023), "The Last Monsoon" (2022), and "Silent Streets" (2019). Her work has been recognized with the National Film Award for Best Documentary and selection at Sundance and IDFA.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- ============================================================================
-- 2. VIKRAM KRISHNAMURTHY - Cinematographer
-- ============================================================================
INSERT INTO filmmakers (
    name,
    profile_url,
    profile_photo_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    'Vikram Krishnamurthy',
    'vikram-krishna-' || extract(epoch from now())::bigint,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    jsonb_build_object(
        'name', 'Vikram Krishnamurthy',
        'email', 'vikram.k@cinegrok.com',
        'phone', '+91 87654 32109',
        'pronouns', 'He/Him',
        'dob', '1982-11-22',
        'country', 'India',
        'current_location', 'Chennai, Tamil Nadu, India',
        'native_location', 'Madurai, Tamil Nadu',
        'nationality', 'Indian',
        'languages', 'Tamil, Hindi, English, Telugu',
        
        'roles', ARRAY['Cinematographer', 'Director of Photography'],
        'genres', ARRAY['Drama', 'Thriller', 'Commercial'],
        'years_active', '2005',
        'style', 'Master of chiaroscuro lighting with deep, dramatic shadows. Known for using anamorphic lenses to create distinctive wide compositions. Prefers in-camera effects over post-production manipulation. Expert in both digital (ARRI Alexa) and film (35mm Kodak Vision3).',
        'influences', 'Vittorio Storaro, Roger Deakins, Santosh Sivan, P.C. Sreeram, Emmanuel Lubezki',
        'philosophy', 'Light is the most powerful storyteller. Every frame should feel like it could be paused and hung on a wall.',
        'belief', 'Technical excellence must serve emotional truth. A beautiful shot that doesn''t serve the story is worthless.',
        'message', 'Open to challenging projects that push visual boundaries. Particularly interested in period dramas and neo-noir.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'Shadows of Madras',
                'year', '2024',
                'genre', 'Neo-Noir Thriller',
                'role', 'Cinematographer',
                'format', 'Feature Film',
                'status', 'Post-Production',
                'crew_scale', 'Large (20+)',
                'synopsis', 'A detective hunts a serial killer through the rain-soaked streets of 1970s Madras.'
            ),
            jsonb_build_object(
                'title', 'The Forgotten Temple',
                'year', '2023',
                'genre', 'Drama',
                'role', 'Director of Photography',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Large (20+)',
                'synopsis', 'An archaeologist discovers a temple that rewrites the history of South India.'
            ),
            jsonb_build_object(
                'title', 'Monsoon Wedding Blues',
                'year', '2022',
                'genre', 'Romantic Drama',
                'role', 'Cinematographer',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A family reunion during a monsoon wedding reveals long-buried secrets.'
            ),
            jsonb_build_object(
                'title', 'Echoes',
                'year', '2021',
                'genre', 'Psychological Thriller',
                'role', 'Cinematographer',
                'format', 'Web Series',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A woman starts hearing voices that predict the future.'
            ),
            jsonb_build_object(
                'title', 'The River Keeper',
                'year', '2020',
                'genre', 'Documentary',
                'role', 'Director of Photography',
                'format', 'Documentary',
                'status', 'Released',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'Following the last boatman on a dying river.'
            ),
            jsonb_build_object(
                'title', 'Neon Dreams',
                'year', '2019',
                'genre', 'Cyberpunk',
                'role', 'Cinematographer',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A hacker in near-future Chennai fights digital oppression.'
            )
        ),
        
        'imdb', 'https://www.imdb.com/name/vikramk',
        'instagram', 'https://instagram.com/vikramkframes',
        'twitter', 'https://twitter.com/vikramdop',
        'website', 'https://vikramkrishnamurthy.com',
        
        'undergraduate', 'Loyola College, Chennai - Visual Communication (2004)',
        'postgraduate', 'SRFTI, Kolkata - Cinematography (2007)',
        'certifications', 'ARRI Master Class (2018), Kodak Film School Workshop',
        
        'awards', 'Filmfare Best Cinematography (2023), South Indian International Movie Award (2022), National Award Nomination',
        'screenings', 'Toronto International Film Festival, Busan International Film Festival, IFFI Goa',
        
        'open_to_collab', 'Yes, currently looking for interesting scripts.',
        'availability', 'Available immediately',
        'contact_method', 'Through agent or direct email'
    ),
    'Vikram Krishnamurthy is a distinguished Cinematographer and Director of Photography based in Chennai. With nearly two decades of experience since 2005, he has lensed 6 major projects spanning Drama, Thriller, and Commercial cinema. His signature style features chiaroscuro lighting with deep, dramatic shadows and anamorphic wide compositions. Influenced by masters like Vittorio Storaro and Roger Deakins, he believes that light is the most powerful storyteller. Notable works include "Shadows of Madras" (2024), "The Forgotten Temple" (2023), and "Monsoon Wedding Blues" (2022). His work has earned him the Filmfare Best Cinematography award.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- ============================================================================
-- 3. AISHA KHAN - Editor / Director
-- ============================================================================
INSERT INTO filmmakers (
    name,
    profile_url,
    profile_photo_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    'Aisha Khan',
    'aisha-khan-' || extract(epoch from now())::bigint,
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400',
    jsonb_build_object(
        'name', 'Aisha Khan',
        'email', 'aisha.khan@cinegrok.com',
        'phone', '+91 99887 76655',
        'pronouns', 'She/Her',
        'dob', '1990-07-08',
        'country', 'India',
        'current_location', 'Hyderabad, Telangana, India',
        'native_location', 'Lucknow, Uttar Pradesh',
        'nationality', 'Indian',
        'languages', 'Hindi, Urdu, English, Telugu',
        
        'roles', ARRAY['Editor', 'Director', 'Colorist'],
        'genres', ARRAY['Drama', 'Experimental', 'Music Video'],
        'years_active', '2013',
        'style', 'Known for rhythmic editing that creates emotional momentum. Pioneered a unique approach to color grading that blends nostalgic warmth with contemporary sharpness. Expert in non-linear narratives and montage sequences.',
        'influences', 'Thelma Schoonmaker, Walter Murch, Sally Menke, Bina Paul, A. Sreekar Prasad',
        'philosophy', 'Editing is the last rewrite—the final chance to shape the story and find its hidden rhythms.',
        'belief', 'Every cut is a choice to show or hide, to rush or linger. The editor is the audience''s guide through the story.',
        'message', 'Seeking innovative projects that challenge conventional narrative structures.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'Fractures',
                'year', '2024',
                'genre', 'Psychological Drama',
                'role', 'Editor, Director',
                'format', 'Feature Film',
                'status', 'Post-Production',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A woman pieces together her fragmented memories after an accident.'
            ),
            jsonb_build_object(
                'title', 'The Color of Memory',
                'year', '2023',
                'genre', 'Experimental',
                'role', 'Director, Colorist',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'An abstract exploration of how we remember loved ones we have lost.'
            ),
            jsonb_build_object(
                'title', 'Gharana',
                'year', '2022',
                'genre', 'Family Drama',
                'role', 'Editor',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Large (20+)',
                'synopsis', 'Three siblings reunite at their ancestral home for their father''s final days.'
            ),
            jsonb_build_object(
                'title', 'Rebellion Series',
                'year', '2022',
                'genre', 'Music Video',
                'role', 'Editor, Colorist',
                'format', 'Music Video',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A series of 5 interconnected music videos for indie rock band "The Nomads".'
            ),
            jsonb_build_object(
                'title', 'Whispers in the Dark',
                'year', '2021',
                'genre', 'Horror Thriller',
                'role', 'Editor',
                'format', 'Web Series',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'An 8-episode series about haunted old-Delhi havelis.'
            )
        ),
        
        'imdb', 'https://www.imdb.com/name/aishakhan',
        'instagram', 'https://instagram.com/aishakhanedits',
        'linkedin', 'https://linkedin.com/in/aishakhaneditor',
        'website', 'https://aishakhaneditor.com',
        'vimeo', 'https://vimeo.com/aishakhan',
        
        'undergraduate', 'Jamia Millia Islamia - Mass Communication (2011)',
        'postgraduate', 'National Institute of Design - Film & Video (2013)',
        'certifications', 'DaVinci Resolve Certified Colorist, AVID Certified Editor',
        
        'awards', 'Zee Cine Award for Best Editing (2023), YouTube Music Video Award (2022)',
        'screenings', 'Mumbai Shorts Festival, Indian Film Festival of Los Angeles',
        
        'open_to_collab', 'Selectively, depending on the project vision.',
        'availability', 'Booked until June 2026',
        'contact_method', 'Email preferred'
    ),
    'Aisha Khan is a versatile Editor, Director, and Colorist based in Hyderabad. Since 2013, she has shaped 5+ projects across Drama, Experimental, and Music Video genres. Her rhythmic editing creates emotional momentum, and she has pioneered a unique color grading approach that blends nostalgic warmth with contemporary sharpness. Influenced by legends like Thelma Schoonmaker and Walter Murch, she believes editing is the last rewrite. Notable works include "Fractures" (2024), "The Color of Memory" (2023), and "Gharana" (2022). Her work earned the Zee Cine Award for Best Editing.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- ============================================================================
-- 4. RAJAN VERMA - Sound Designer / Composer
-- ============================================================================
INSERT INTO filmmakers (
    name,
    profile_url,
    profile_photo_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    'Rajan Verma',
    'rajan-verma-' || extract(epoch from now())::bigint,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    jsonb_build_object(
        'name', 'Rajan Verma',
        'email', 'rajan.verma@cinegrok.com',
        'phone', '+91 88776 55443',
        'pronouns', 'He/Him',
        'dob', '1978-02-28',
        'country', 'India',
        'current_location', 'Pune, Maharashtra, India',
        'native_location', 'Shimla, Himachal Pradesh',
        'nationality', 'Indian',
        'languages', 'Hindi, English, Punjabi',
        
        'roles', ARRAY['Sound Designer', 'Composer', 'Music Director'],
        'genres', ARRAY['Drama', 'Documentary', 'Indie', 'Experimental'],
        'years_active', '2000',
        'style', 'Specializes in ambient soundscapes that blur the line between score and sound design. Expert in field recording and incorporating natural sounds into musical compositions. Known for minimal, evocative scores that enhance emotional subtlety.',
        'influences', 'Resul Pookutty, A.R. Rahman, Ennio Morricone, Hans Zimmer, Ryuichi Sakamoto',
        'philosophy', 'Sound is 50% of the cinema experience. When done right, you feel it rather than hear it.',
        'belief', 'The best sound design is invisible—it immerses you completely without drawing attention to itself.',
        'message', 'Available for films that respect the role of sound in storytelling.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'The Valley',
                'year', '2024',
                'genre', 'Drama',
                'role', 'Sound Designer, Composer',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Large (20+)',
                'synopsis', 'A sound engineer returns to his remote Himalayan village after 20 years.'
            ),
            jsonb_build_object(
                'title', 'Silence Between Notes',
                'year', '2023',
                'genre', 'Documentary',
                'role', 'Sound Designer',
                'format', 'Documentary',
                'status', 'Released',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'Following classical musicians preparing for their final performance.'
            ),
            jsonb_build_object(
                'title', 'Underwater',
                'year', '2022',
                'genre', 'Experimental',
                'role', 'Sound Designer, Composer',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Solo',
                'synopsis', 'An audio-visual meditation on ocean conservation.'
            ),
            jsonb_build_object(
                'title', 'The Inheritance',
                'year', '2021',
                'genre', 'Family Drama',
                'role', 'Music Director',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Large (20+)',
                'synopsis', 'A joint family is torn apart by a disputed will.'
            ),
            jsonb_build_object(
                'title', 'Echoes of Partition',
                'year', '2020',
                'genre', 'Historical Documentary',
                'role', 'Sound Designer, Composer',
                'format', 'Documentary',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'Survivors of the 1947 partition share their memories through sound and music.'
            ),
            jsonb_build_object(
                'title', 'Night Bus',
                'year', '2019',
                'genre', 'Thriller',
                'role', 'Sound Designer',
                'format', 'Feature Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A tense night journey on a bus through rural India.'
            ),
            jsonb_build_object(
                'title', 'Mindscape',
                'year', '2025',
                'genre', 'Sci-Fi',
                'role', 'Composer',
                'format', 'Feature Film',
                'status', 'Pre-Production',
                'crew_scale', 'Large (20+)',
                'synopsis', 'A neuroscientist can enter people''s dreams.'
            )
        ),
        
        'imdb', 'https://www.imdb.com/name/rajanverma',
        'instagram', 'https://instagram.com/rajanvermasound',
        'twitter', 'https://twitter.com/rajanverma',
        'website', 'https://rajanvermasound.com',
        'spotify', 'https://open.spotify.com/artist/rajanverma',
        
        'undergraduate', 'Delhi University - Physics (1999)',
        'postgraduate', 'Film and Television Institute of India (FTII) - Sound Design (2002)',
        'certifications', 'Dolby Atmos Mixing Certified, Pro Tools Expert Certification',
        
        'awards', 'National Film Award for Best Sound Design (2021), Mirchi Music Award (2020), IIFA Best Background Score nomination',
        'screenings', 'Venice Film Festival (Sound Section), Cannes Film Market',
        
        'open_to_collab', 'Yes, open to interesting projects worldwide.',
        'availability', 'Available from February 2026',
        'contact_method', 'Direct contact or through agent'
    ),
    'Rajan Verma is a distinguished Sound Designer, Composer, and Music Director based in Pune with over two decades of experience. Since 2000, he has crafted soundscapes for 7 projects spanning Drama, Documentary, and Experimental genres. Known for ambient soundscapes that blur the line between score and sound design, he incorporates field recordings and natural sounds into evocative compositions. Influenced by Resul Pookutty and A.R. Rahman, he believes sound is 50% of the cinema experience. Notable works include "The Valley" (2024) and "Echoes of Partition" (2020). Winner of the National Film Award for Best Sound Design.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- ============================================================================
-- 5. NEHA DESAI - Writer / Director (Early Career)
-- ============================================================================
INSERT INTO filmmakers (
    name,
    profile_url,
    profile_photo_url,
    raw_form_data,
    ai_generated_bio,
    status,
    published_at,
    created_at,
    updated_at
) VALUES (
    'Neha Desai',
    'neha-desai-' || extract(epoch from now())::bigint,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    jsonb_build_object(
        'name', 'Neha Desai',
        'email', 'neha.desai@cinegrok.com',
        'phone', '+91 77665 54433',
        'pronouns', 'She/Her',
        'dob', '1995-12-10',
        'country', 'India',
        'current_location', 'Ahmedabad, Gujarat, India',
        'native_location', 'Surat, Gujarat',
        'nationality', 'Indian',
        'languages', 'Gujarati, Hindi, English',
        
        'roles', ARRAY['Writer', 'Director'],
        'genres', ARRAY['Coming-of-Age', 'Drama', 'LGBTQ+'],
        'years_active', '2019',
        'style', 'Fresh and intimate stories centered on young women navigating tradition and modernity. Uses vibrant colors, contemporary music, and handheld camerawork to create an energetic visual language. Stories often blend humor with emotional depth.',
        'influences', 'Zoya Akhtar, Alankrita Shrivastava, Greta Gerwig, Céline Sciamma, Barry Jenkins',
        'philosophy', 'I want to tell stories about people who look like me—young Indian women finding their voice.',
        'belief', 'Every generation needs storytellers who understand their specific anxieties and dreams.',
        'message', 'Ready to collaborate on projects that center underrepresented voices. Actively seeking producers and investors for my first feature.',
        
        'films', jsonb_build_array(
            jsonb_build_object(
                'title', 'Chai and Secrets',
                'year', '2024',
                'genre', 'Coming-of-Age Drama',
                'role', 'Writer, Director',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Small (2-5)',
                'synopsis', 'A young woman comes out to her grandmother over their daily chai ritual.'
            ),
            jsonb_build_object(
                'title', 'The Arranged Life',
                'year', '2023',
                'genre', 'Romantic Comedy',
                'role', 'Writer, Director',
                'format', 'Short Film',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'A woman hires an actor to play her boyfriend at family gatherings.'
            ),
            jsonb_build_object(
                'title', 'Spectrum',
                'year', '2022',
                'genre', 'LGBTQ+ Drama',
                'role', 'Writer',
                'format', 'Web Series',
                'status', 'Released',
                'crew_scale', 'Medium (6-20)',
                'synopsis', 'An anthology series about queer lives in small-town India.'
            ),
            jsonb_build_object(
                'title', 'Between Two Suitcases',
                'year', '2025',
                'genre', 'Drama',
                'role', 'Writer, Director',
                'format', 'Feature Film',
                'status', 'Development',
                'crew_scale', 'TBD',
                'synopsis', 'A young woman must choose between her dream job abroad and caring for her aging parents.'
            )
        ),
        
        'instagram', 'https://instagram.com/nehadesaifilms',
        'twitter', 'https://twitter.com/nehadesai',
        'linkedin', 'https://linkedin.com/in/nehadesai',
        'website', 'https://nehadesaifilms.com',
        
        'undergraduate', 'St. Xavier''s College, Ahmedabad - Media Studies (2016)',
        'certifications', 'MAMI Year-Round Programme (2020), Screenwriters Lab (2021)',
        
        'awards', 'Best Short Film at KASHISH Mumbai (2024), Special Jury Mention at Dharamshala International Film Festival (2023)',
        'screenings', 'MAMI Mumbai Film Festival, Dharamshala International Film Festival, KASHISH Mumbai',
        
        'open_to_collab', 'Yes, actively seeking collaborators and mentors for my first feature.',
        'availability', 'Available immediately',
        'contact_method', 'Open to direct contact via email or Instagram DM'
    ),
    'Neha Desai is an emerging Writer and Director based in Ahmedabad. Since 2019, she has created 4 projects focusing on Coming-of-Age, Drama, and LGBTQ+ stories. Her fresh, intimate storytelling centers young women navigating tradition and modernity, using vibrant colors and energetic camerawork. Influenced by Zoya Akhtar and Greta Gerwig, she wants to tell stories about people who look like her. Notable works include "Chai and Secrets" (2024) and "The Arranged Life" (2023). Winner of Best Short Film at KASHISH Mumbai 2024.',
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- ============================================================================
-- Verify the inserts
-- ============================================================================
SELECT 
    id,
    name,
    profile_url,
    profile_photo_url,
    status,
    '/filmmakers/' || id as profile_link
FROM filmmakers 
WHERE name IN ('Priya Sharma', 'Vikram Krishnamurthy', 'Aisha Khan', 'Rajan Verma', 'Neha Desai')
ORDER BY created_at DESC;
