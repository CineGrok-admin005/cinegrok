-- Seed Data for 21 Diverse Filmmakers

-- Clean up previous attempts
DELETE FROM public.filmmakers WHERE email LIKE '%@example.com';

-- 1. ADITI SHARMA (Student Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles, 
    years_active, visual_style, belief_about_cinema, bio
) VALUES (
    gen_random_uuid(), 'Aditi Sharma', 'Aditi S.', 'aditi.student@example.com', 'Mumbai', 'India', 
    ARRAY['Director', 'Writer'], ARRAY['Editor'], '2024 - Present',
    'Raw, handheld, guerilla-style. Focus on urban isolation.',
    'Cinema is the only way to speak the unspoken truth of Gen-Z.',
    'Final year film student at FTII. Obsessed with mumblecore and hyper-realism.'
);

-- 2. ROHAN MEHTA (Emerging Cinematographer)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, belief_about_cinema, bio
) VALUES (
    gen_random_uuid(), 'Rohan Mehta', 'RoCam', 'rohan.dop@example.com', 'Delhi', 'India',
    ARRAY['Cinematographer'], ARRAY['Colorist'], '2021 - Present',
    'High contrast, neon-noir, deeply saturated colors.',
    'Every frame must be a painting that bleeds emotion.',
    'Freelance DoP specializing in music videos and indie shorts. Love experimenting with practical lights.'
);

-- 3. SARAH JOHN (Indie Producer)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio, open_to_collaborations
) VALUES (
    gen_random_uuid(), 'Sarah John', 'Sarah J', 'sarah.prod@example.com', 'Bangalore', 'India',
    ARRAY['Producer'], ARRAY['Line Producer'], '2019 - Present',
    'Bootstrapped 3 short films to festivals. I make a rupee stretch like a rubber band.',
    'Yes'
);

-- 4. VIKRAM SINGH (Mid-Career Actor)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, creative_signature, bio
) VALUES (
    gen_random_uuid(), 'Vikram Singh', 'Vikram S.', 'vikram.act@example.com', 'Mumbai', 'India',
    ARRAY['Actor'], ARRAY['Voice Artist'], '2015 - Present',
    'Intense brooding silences.',
    'Theatre-trained method actor. 10 years in TV, looking for gritty web series roles.'
);

-- 5. ANJALI MENON (Established Editor)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, bio
) VALUES (
    gen_random_uuid(), 'Anjali Menon', 'Anj', 'anjali.edit@example.com', 'Chennai', 'India',
    ARRAY['Editor'], ARRAY['Sound Designer'], '2012 - Present',
    'Rhythmic, non-linear, jump-cuts matching musical beats.',
    'Award-winning editor of 2 feature films. I write the final draft of the film in the timeline.'
);

-- 6. KABIR KHAN (Veteran Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, belief_about_cinema, bio
) VALUES (
    gen_random_uuid(), 'Kabir Khan', 'Kabir', 'kabir.k@example.com', 'Mumbai', 'India',
    ARRAY['Director'], ARRAY['Producer'], '1998 - Present',
    'Grand scale, symmetrical compositions, slow tracking shots.',
    'Cinema creates mythology for the modern age.',
    '25 years in the industry. 3 National Awards. Interested in mentoring the next generation.'
);

-- 7. MAYA PATEL (Documentary Maker)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, message_intent, bio
) VALUES (
    gen_random_uuid(), 'Maya Patel', 'Maya Docs', 'maya.p@example.com', 'Kolkata', 'India',
    ARRAY['Director', 'Cinematographer'], ARRAY['Writer'], '2016 - Present',
    'To give a voice to the marginalized rural communities.',
    'Traveling filmmaker. Focus on environmental issues and rural India.'
);

-- 8. ARJUN REDDY (Commercial Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, bio
) VALUES (
    gen_random_uuid(), 'Arjun Reddy', 'Arjun', 'arjun.ads@example.com', 'Hyderabad', 'India',
    ARRAY['Director'], ARRAY['VFX Artist'], '2014 - Present',
    'Slick, glossy, fast-paced, high VFX integration.',
    'Directed 50+ TVCs for major brands. Moving into feature films.'
);

-- 9. PRIYA DESAI (Sound Designer)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, creative_signature, bio
) VALUES (
    gen_random_uuid(), 'Priya Desai', 'Priya Sound', 'priya.snd@example.com', 'Pune', 'India',
    ARRAY['Sound Designer'], ARRAY['Music Director'], '2018 - Present',
    'Immersive 3D soundscapes and silence as a tool.',
    'FTII alumni. Specialized in sync sound and foley.'
);

-- 10. RAJ KUMAR (Action Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Raj Kumar', 'Master Raj', 'raj.stunt@example.com', 'Mumbai', 'India',
    ARRAY['Stunt Director'], ARRAY['Actor'], '2005 - Present',
    'Old school raw action, minimal wires, maximum impact.'
);

-- 11. ZARA SHEIKH (Art Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, bio
) VALUES (
    gen_random_uuid(), 'Zara Sheikh', 'Zara', 'zara.art@example.com', 'Mumbai', 'India',
    ARRAY['Production Designer'], ARRAY['Costume Designer'], '2015 - Present',
    'Vintage aesthetics, warm palettes, intricate set details.',
    'Worked on period dramas and historical biopics.'
);

-- 12. SAM ALBERT (Screenwriter)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, preferred_genres, bio
) VALUES (
    gen_random_uuid(), 'Sam Albert', 'Sam', 'sam.write@example.com', 'Goa', 'India',
    ARRAY['Writer'], ARRAY['Director'], '2010 - Present',
    ARRAY['Thriller', 'Mystery', 'Sci-Fi'],
    'Published author turned screenwriter. Expert in non-linear narratives.'
);

-- 13. NINA GUPTA (Casting Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Nina Gupta', 'Ninacasting', 'nina.cast@example.com', 'Mumbai', 'India',
    ARRAY['Casting Director'], ARRAY['Agent'], '2008 - Present',
    'Finding raw, untreated talent from small towns. Casted for 15+ feature films. Always looking for new faces.'
);

-- 14. DEV PATEL (VFX Supervisor)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, visual_style, bio
) VALUES (
    gen_random_uuid(), 'Dev Patel', 'DevFX', 'dev.vfx@example.com', 'Bangalore', 'India',
    ARRAY['VFX Artist'], ARRAY['Animator'], '2016 - Present',
    'Seamless CGI integration, photorealistic environments.',
    'Freelance supervisor. Expert in Blender and Maya.'
);

-- 15. ISHAAN KHANNA (Music Composer)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, creative_signature, bio
) VALUES (
    gen_random_uuid(), 'Ishaan Khanna', 'Ishaan', 'ishaan.music@example.com', 'Delhi', 'India',
    ARRAY['Music Director'], ARRAY['Sound Designer'], '2019 - Present',
    'Fusion of classical Indian instruments with synthwave.',
    'Indie musician composing for web series and shorts.'
);

-- 16. MIRA NAIR (Costume Stylist)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Mira Nair', 'Mira', 'mira.style@example.com', 'Mumbai', 'India',
    ARRAY['Costume Designer'], ARRAY['Art Director'], '2013 - Present',
    'Contemporary chic, urban street style. Stylist for major fashion magazines and ad films.'
);

-- 17. KARAN JOHAR (Emerging Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, preferred_genres, bio
) VALUES (
    gen_random_uuid(), 'Karan Johar', 'K.J.', 'karan.j2@example.com', 'Chandigarh', 'India',
    ARRAY['Director'], ARRAY['Writer'], '2023 - Present',
    ARRAY['Romance', 'Musical'],
    'Not THAT Karan Johar. Just a guy from Punjab who loves love stories.'
);

-- 18. TARA SUTARIA (Student Actor)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Tara Sutaria', 'Tara', 'tara.new@example.com', 'Mumbai', 'India',
    ARRAY['Actor'], ARRAY['Dancer'], '2024 - Present',
    'Classical dancer transitioning to screen acting. Looking for student films and auditions.'
);

-- 19. FARHAN AKHTAR (Writer/Director)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Farhan A.', 'Farhan', 'farhan.multi@example.com', 'Mumbai', 'India',
    ARRAY['Director'], ARRAY['Writer', 'Actor', 'Producer'], '2001 - Present',
    'Jack of all trades, master of all. Believer in total cinema control.'
);

-- 20. GEETA KAPOOR (Choreographer)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, bio
) VALUES (
    gen_random_uuid(), 'Geeta Kapoor', 'Geeta Ma', 'geeta.dance@example.com', 'Mumbai', 'India',
    ARRAY['Choreographer'], ARRAY['Director'], '1995 - Present',
    'Grand Bollywood dance numbers. Judge on dance reality shows. Choreographer for 100+ songs.'
);

-- 21. RAHUL DRAVID (Sports Doc Maker)
INSERT INTO public.filmmakers (
    id, name, stage_name, email, current_city, country, primary_roles, secondary_roles,
    years_active, preferred_genres, bio
) VALUES (
    gen_random_uuid(), 'Rahul Dravid', 'The Wall', 'rahul.doc@example.com', 'Bangalore', 'India',
    ARRAY['Director'], ARRAY['Editor'], '2012 - Present',
    ARRAY['Documentary', 'Sports'],
    'Focus on sports psychology and athlete biographies.'
);
