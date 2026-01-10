-- Test Data for CineGrok Platform
-- Mix of famous filmmakers (all tiers) + emerging talents
-- Covers all roles and tier levels

-- First, let's insert the raw data
-- Note: In production, this would come from Google Sheets via the ingest API

-- 1. ACCLAIMED TIER - Christopher Nolan (Veteran Director)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio, style_vector)
VALUES (
  'Christopher Nolan',
  'christopher-nolan',
  '{
    "email": "nolan@example.com",
    "legal_name": "Christopher Edward Nolan",
    "roles": "Director, Writer, Producer",
    "years_active": "1998-2024",
    "current_location": "Los Angeles, CA",
    "nationality": "British-American",
    "genres": "Science Fiction, Thriller, Drama",
    "style": "Non-linear narratives, practical effects, IMAX cinematography",
    "influences": "Stanley Kubrick, Ridley Scott, Terrence Malick",
    "philosophy": "Cinema should challenge audiences intellectually while delivering visceral entertainment",
    "awards": "Academy Award for Best Director (Oppenheimer), Multiple BAFTA Awards, Golden Globe Awards",
    "screenings": "Cannes Film Festival, Venice Film Festival, Toronto International Film Festival",
    "films": [
      {"title": "Oppenheimer", "year": "2023", "role": "Director", "genre": "Biography"},
      {"title": "Tenet", "year": "2020", "role": "Director", "genre": "Sci-Fi"},
      {"title": "Dunkirk", "year": "2017", "role": "Director", "genre": "War"},
      {"title": "Interstellar", "year": "2014", "role": "Director", "genre": "Sci-Fi"},
      {"title": "Inception", "year": "2010", "role": "Director", "genre": "Sci-Fi"},
      {"title": "The Dark Knight", "year": "2008", "role": "Director", "genre": "Action"},
      {"title": "The Prestige", "year": "2006", "role": "Director", "genre": "Mystery"},
      {"title": "Batman Begins", "year": "2005", "role": "Director", "genre": "Action"},
      {"title": "Memento", "year": "2000", "role": "Director", "genre": "Thriller"},
      {"title": "Following", "year": "1998", "role": "Director", "genre": "Thriller"}
    ],
    "imdb": "https://www.imdb.com/name/nm0634240/",
    "website": "https://www.syncopy.com"
  }'::jsonb,
  'Christopher Nolan is a visionary filmmaker renowned for his intellectually complex narratives and groundbreaking visual storytelling. With a career spanning over two decades, he has directed some of cinema''s most iconic films, including "Inception," "The Dark Knight" trilogy, and the Oscar-winning "Oppenheimer." His work is characterized by non-linear storytelling, practical effects, and a commitment to shooting on IMAX film.

Nolan''s films explore themes of time, memory, identity, and morality, challenging audiences to engage deeply with the narrative while delivering spectacular entertainment. His dedication to practical filmmaking and rejection of CGI-heavy approaches has made him a champion of traditional cinema in the digital age.

With numerous Academy Awards, BAFTAs, and Golden Globes to his name, Nolan continues to push the boundaries of what cinema can achieve, inspiring a new generation of filmmakers to think bigger and bolder.',
  NULL
);

-- 2. ACCLAIMED TIER - Greta Gerwig (Established Director/Writer)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Greta Gerwig',
  'greta-gerwig',
  '{
    "email": "gerwig@example.com",
    "legal_name": "Greta Celeste Gerwig",
    "roles": "Director, Writer, Actor",
    "years_active": "2006-2024",
    "current_location": "New York, NY",
    "nationality": "American",
    "genres": "Comedy-Drama, Coming-of-Age",
    "style": "Authentic female perspectives, witty dialogue, emotional depth",
    "influences": "Woody Allen, Noah Baumbach, Mike Leigh",
    "philosophy": "Stories should capture the messy beauty of being human",
    "awards": "Academy Award nominations for Best Director and Best Adapted Screenplay (Barbie, Little Women)",
    "screenings": "Sundance Film Festival, Cannes Film Festival, Toronto International Film Festival",
    "films": [
      {"title": "Barbie", "year": "2023", "role": "Director, Writer", "genre": "Comedy"},
      {"title": "Little Women", "year": "2019", "role": "Director, Writer", "genre": "Drama"},
      {"title": "Lady Bird", "year": "2017", "role": "Director, Writer", "genre": "Comedy-Drama"},
      {"title": "Mistress America", "year": "2015", "role": "Writer, Actor", "genre": "Comedy"},
      {"title": "Frances Ha", "year": "2012", "role": "Writer, Actor", "genre": "Comedy-Drama"}
    ],
    "imdb": "https://www.imdb.com/name/nm1950086/",
    "instagram": "https://instagram.com/gretagerwig"
  }'::jsonb,
  'Greta Gerwig has emerged as one of contemporary cinema''s most distinctive voices, bringing authentic female perspectives and sharp wit to the screen. From her breakout performances in mumblecore films to directing the billion-dollar phenomenon "Barbie," Gerwig has proven her versatility and vision as both actor and filmmaker.

Her directorial work, including "Lady Bird" and "Little Women," showcases her talent for capturing the complexities of female experience with humor, heart, and unflinching honesty. Gerwig''s films are characterized by naturalistic dialogue, nuanced character development, and a deep understanding of human relationships.

With multiple Academy Award nominations and critical acclaim, Gerwig continues to redefine what mainstream cinema can be, proving that personal, character-driven stories can resonate with global audiences.'
);

-- 3. VETERAN TIER - Roger Deakins (Cinematographer)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Roger Deakins',
  'roger-deakins',
  '{
    "email": "deakins@example.com",
    "legal_name": "Roger Alexander Deakins",
    "roles": "Cinematographer",
    "years_active": "1982-2024",
    "current_location": "Santa Monica, CA",
    "nationality": "British",
    "genres": "Drama, Thriller, Western",
    "style": "Natural lighting, minimalist approach, emotional visual storytelling",
    "influences": "Gordon Willis, Conrad Hall",
    "philosophy": "Cinematography should serve the story, not overshadow it",
    "awards": "2 Academy Awards (Blade Runner 2049, 1917), 16 nominations, ASC Lifetime Achievement Award",
    "screenings": "Worked on films screened at every major festival",
    "films": [
      {"title": "1917", "year": "2019", "role": "Cinematographer", "genre": "War"},
      {"title": "Blade Runner 2049", "year": "2017", "role": "Cinematographer", "genre": "Sci-Fi"},
      {"title": "Sicario", "year": "2015", "role": "Cinematographer", "genre": "Thriller"},
      {"title": "Skyfall", "year": "2012", "role": "Cinematographer", "genre": "Action"},
      {"title": "True Grit", "year": "2010", "role": "Cinematographer", "genre": "Western"},
      {"title": "No Country for Old Men", "year": "2007", "role": "Cinematographer", "genre": "Thriller"},
      {"title": "The Shawshank Redemption", "year": "1994", "role": "Cinematographer", "genre": "Drama"}
    ],
    "imdb": "https://www.imdb.com/name/nm0005683/",
    "website": "https://www.rogerdeakins.com"
  }'::jsonb,
  'Roger Deakins is widely regarded as one of the greatest cinematographers in film history, with a career spanning over four decades and collaborations with visionary directors like the Coen Brothers, Denis Villeneuve, and Sam Mendes. His work is characterized by a masterful use of natural light, meticulous composition, and an unwavering commitment to serving the story.

After 13 Academy Award nominations, Deakins finally won his first Oscar for "Blade Runner 2049" and followed it with another for "1917," cementing his legacy as a true master of the craft. His approach to cinematography emphasizes simplicity and emotional resonance over technical showmanship.

From the stark beauty of "No Country for Old Men" to the immersive one-shot technique of "1917," Deakins continues to inspire cinematographers worldwide with his dedication to visual storytelling excellence.'
);

-- 4. ESTABLISHED TIER - Ari Aster (Director)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Ari Aster',
  'ari-aster',
  '{
    "email": "aster@example.com",
    "legal_name": "Ari Aster",
    "roles": "Director, Writer",
    "years_active": "2011-2024",
    "current_location": "New York, NY",
    "nationality": "American",
    "genres": "Horror, Psychological Thriller, Drama",
    "style": "Slow-burn tension, family trauma, unsettling imagery",
    "influences": "Ingmar Bergman, Roman Polanski, Stanley Kubrick",
    "philosophy": "Horror is the perfect vehicle for exploring human suffering",
    "awards": "Sundance Grand Jury Prize nominee, Critics Choice Award",
    "screenings": "Sundance Film Festival, Cannes Film Festival, SXSW",
    "films": [
      {"title": "Beau Is Afraid", "year": "2023", "role": "Director, Writer", "genre": "Horror"},
      {"title": "Midsommar", "year": "2019", "role": "Director, Writer", "genre": "Horror"},
      {"title": "Hereditary", "year": "2018", "role": "Director, Writer", "genre": "Horror"}
    ],
    "imdb": "https://www.imdb.com/name/nm2257207/",
    "instagram": "https://instagram.com/ariastermovies"
  }'::jsonb,
  'Ari Aster burst onto the horror scene with "Hereditary," a film that redefined modern horror with its unflinching exploration of family trauma and grief. His follow-up, "Midsommar," further established him as a master of psychological terror, using bright daylight and beautiful imagery to create deeply unsettling experiences.

Aster''s films are characterized by meticulous attention to detail, slow-burn pacing, and a willingness to push audiences into uncomfortable emotional territory. His work draws heavily from art cinema traditions while remaining accessible to genre audiences.

With only three feature films to his name, Aster has already become one of the most influential voices in contemporary horror, inspiring a new wave of elevated genre filmmaking.'
);

-- 5. RISING TIER - Chloe Zhao (Director/Writer)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Chloe Zhao',
  'chloe-zhao',
  '{
    "email": "zhao@example.com",
    "legal_name": "Zhao Ting",
    "roles": "Director, Writer, Editor",
    "years_active": "2015-2024",
    "current_location": "Los Angeles, CA",
    "nationality": "Chinese-American",
    "genres": "Drama, Western, Superhero",
    "style": "Natural light, non-professional actors, intimate storytelling",
    "influences": "Terrence Malick, Kelly Reichardt, Lynne Ramsay",
    "philosophy": "Find the universal in the specific, the epic in the intimate",
    "awards": "Academy Award for Best Director (Nomadland), Golden Lion at Venice",
    "screenings": "Venice Film Festival, Sundance Film Festival, Toronto International Film Festival",
    "films": [
      {"title": "Eternals", "year": "2021", "role": "Director", "genre": "Superhero"},
      {"title": "Nomadland", "year": "2020", "role": "Director, Writer, Editor", "genre": "Drama"},
      {"title": "The Rider", "year": "2017", "role": "Director, Writer, Editor", "genre": "Drama"},
      {"title": "Songs My Brothers Taught Me", "year": "2015", "role": "Director, Writer, Editor", "genre": "Drama"}
    ],
    "imdb": "https://www.imdb.com/name/nm2125482/"
  }'::jsonb,
  'Chloe Zhao made history as the first woman of color to win the Academy Award for Best Director for her intimate epic "Nomadland." Her distinctive visual style, characterized by natural light and the use of non-professional actors, brings authenticity and emotional depth to stories of people living on society''s margins.

Zhao''s early films, "Songs My Brothers Taught Me" and "The Rider," established her as a unique voice in independent cinema, blending documentary and narrative techniques to create deeply humanistic portraits. Her transition to Marvel''s "Eternals" demonstrated her ability to bring her intimate storytelling approach to blockbuster filmmaking.

With a Golden Lion from Venice and an Oscar for Best Director, Zhao continues to bridge the gap between art house and mainstream cinema, proving that personal vision can thrive at any scale.'
);

-- 6. EMERGING TIER - Priya Sharma (New Director from India)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Priya Sharma',
  'priya-sharma',
  '{
    "email": "priya@example.com",
    "legal_name": "Priya Sharma",
    "roles": "Director, Writer",
    "years_active": "2022-2024",
    "current_location": "Mumbai, India",
    "nationality": "Indian",
    "genres": "Drama, Social Commentary",
    "style": "Observational, character-driven, socially conscious",
    "influences": "Satyajit Ray, Mira Nair, Chaitanya Tamhane",
    "philosophy": "Cinema can be a mirror to society and a catalyst for change",
    "films": [
      {"title": "Monsoon Dreams", "year": "2024", "role": "Director, Writer", "genre": "Drama"},
      {"title": "Street Voices", "year": "2023", "role": "Director", "genre": "Documentary"}
    ],
    "screenings": "Mumbai Film Festival, MAMI",
    "instagram": "https://instagram.com/priyasharmafilms"
  }'::jsonb,
  'Priya Sharma is an emerging voice in Indian independent cinema, bringing fresh perspectives to stories of urban life and social change. Her debut feature "Monsoon Dreams" premiered at the Mumbai Film Festival, earning praise for its intimate portrayal of working-class women navigating modern India.

Sharma''s background in documentary filmmaking informs her observational approach to fiction, creating authentic characters and situations that resonate with contemporary audiences. Her work focuses on underrepresented voices and social issues, using cinema as a tool for empathy and understanding.

With only two films to her name, Sharma represents the new generation of Indian filmmakers committed to telling stories that matter, building a body of work that promises to make a significant impact on world cinema.'
);

-- 7. ESTABLISHED TIER - Thelma Schoonmaker (Editor)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Thelma Schoonmaker',
  'thelma-schoonmaker',
  '{
    "email": "schoonmaker@example.com",
    "legal_name": "Thelma Colbert Schoonmaker",
    "roles": "Editor",
    "years_active": "1967-2024",
    "current_location": "New York, NY",
    "nationality": "American",
    "genres": "Drama, Crime, Biography",
    "style": "Rhythmic editing, music-driven sequences, emotional pacing",
    "influences": "Michael Powell, Emeric Pressburger",
    "philosophy": "Editing is about rhythm, emotion, and serving the director''s vision",
    "awards": "3 Academy Awards (Raging Bull, The Aviator, The Departed), ACE Career Achievement Award",
    "collaborations": "Martin Scorsese (50+ year collaboration)",
    "films": [
      {"title": "Killers of the Flower Moon", "year": "2023", "role": "Editor", "genre": "Drama"},
      {"title": "The Irishman", "year": "2019", "role": "Editor", "genre": "Crime"},
      {"title": "Silence", "year": "2016", "role": "Editor", "genre": "Drama"},
      {"title": "The Wolf of Wall Street", "year": "2013", "role": "Editor", "genre": "Biography"},
      {"title": "Hugo", "year": "2011", "role": "Editor", "genre": "Drama"},
      {"title": "Shutter Island", "year": "2010", "role": "Editor", "genre": "Thriller"},
      {"title": "The Departed", "year": "2006", "role": "Editor", "genre": "Crime"},
      {"title": "The Aviator", "year": "2004", "role": "Editor", "genre": "Biography"},
      {"title": "Raging Bull", "year": "1980", "role": "Editor", "genre": "Biography"}
    ],
    "imdb": "https://www.imdb.com/name/nm0774817/"
  }'::jsonb,
  'Thelma Schoonmaker is a legendary film editor whose five-decade collaboration with Martin Scorsese has produced some of cinema''s most iconic works. With three Academy Awards and numerous other accolades, she is widely regarded as one of the greatest editors in film history, known for her innovative approach to rhythm, pacing, and emotional storytelling.

Schoonmaker''s editing style is characterized by precise timing, creative use of music, and an intuitive understanding of how to build tension and release. From the brutal fight sequences of "Raging Bull" to the frenetic energy of "The Wolf of Wall Street," her work demonstrates a mastery of the editor''s craft.

Her partnership with Scorsese represents one of cinema''s most enduring creative collaborations, with Schoonmaker''s editing playing a crucial role in shaping the director''s distinctive visual language and narrative style.'
);

-- 8. RISING TIER - Marcus Chen (Cinematographer)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Marcus Chen',
  'marcus-chen',
  '{
    "email": "marcus@example.com",
    "legal_name": "Marcus Chen",
    "roles": "Cinematographer",
    "years_active": "2019-2024",
    "current_location": "Los Angeles, CA",
    "nationality": "Chinese-American",
    "genres": "Drama, Thriller, Music Video",
    "style": "Bold colors, dynamic camera movement, experimental lighting",
    "influences": "Bradford Young, Hoyte van Hoytema, Emmanuel Lubezki",
    "philosophy": "Every frame should be a painting that moves",
    "films": [
      {"title": "Neon Nights", "year": "2024", "role": "Cinematographer", "genre": "Thriller"},
      {"title": "The Last Summer", "year": "2023", "role": "Cinematographer", "genre": "Drama"},
      {"title": "City Lights", "year": "2022", "role": "Cinematographer", "genre": "Drama"},
      {"title": "Reflections", "year": "2021", "role": "Cinematographer", "genre": "Short"}
    ],
    "screenings": "Sundance Film Festival, SXSW",
    "instagram": "https://instagram.com/marcuschenDP",
    "website": "https://marcuschen.com"
  }'::jsonb,
  'Marcus Chen is a rising cinematographer known for his bold use of color and dynamic visual storytelling. With a background in music videos and commercials, Chen brings a fresh, contemporary aesthetic to narrative filmmaking, creating visually striking images that serve the emotional core of the story.

His work on "Neon Nights" garnered attention at Sundance for its innovative lighting design and fluid camera movement, establishing him as a cinematographer to watch. Chen''s approach combines technical precision with artistic experimentation, pushing the boundaries of what''s possible with modern digital cameras.

As he transitions from independent films to larger productions, Chen represents a new generation of cinematographers who are redefining the visual language of contemporary cinema with their fearless creativity and technical innovation.'
);

-- 9. EMERGING TIER - Sofia Rodriguez (Writer/Director)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Sofia Rodriguez',
  'sofia-rodriguez',
  '{
    "email": "sofia@example.com",
    "legal_name": "Sofia Maria Rodriguez",
    "roles": "Writer, Director",
    "years_active": "2023-2024",
    "current_location": "Mexico City, Mexico",
    "nationality": "Mexican",
    "genres": "Drama, Magical Realism",
    "style": "Poetic imagery, cultural storytelling, intimate character studies",
    "influences": "Alfonso Cuarón, Alejandro González Iñárritu, Lucrecia Martel",
    "philosophy": "Stories should honor our roots while reaching for the universal",
    "films": [
      {"title": "Entre Sombras", "year": "2024", "role": "Writer, Director", "genre": "Drama"}
    ],
    "open_to_collab": "Yes",
    "availability": "Available for projects",
    "instagram": "https://instagram.com/sofiarodriguezfilms"
  }'::jsonb,
  'Sofia Rodriguez is an emerging Mexican filmmaker whose debut feature "Entre Sombras" (Between Shadows) introduces a powerful new voice in Latin American cinema. Drawing on her cultural heritage and personal experiences, Rodriguez crafts intimate stories that blend magical realism with contemporary social commentary.

Her visual style is characterized by poetic imagery and careful attention to the rhythms of everyday life, creating a cinematic language that feels both deeply rooted in Mexican culture and universally resonant. Rodriguez''s work explores themes of family, identity, and belonging with sensitivity and nuance.

As a first-time feature director, Rodriguez represents the exciting future of independent cinema, bringing fresh perspectives and authentic voices to the screen. She is currently developing her second feature and is open to collaborations with like-minded filmmakers.'
);

-- 10. VETERAN TIER - Trent Reznor & Atticus Ross (Composers)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Trent Reznor',
  'trent-reznor',
  '{
    "email": "reznor@example.com",
    "legal_name": "Michael Trent Reznor",
    "roles": "Composer, Producer",
    "years_active": "2010-2024",
    "current_location": "Los Angeles, CA",
    "nationality": "American",
    "genres": "Electronic, Ambient, Experimental",
    "style": "Atmospheric soundscapes, electronic textures, emotional depth",
    "influences": "Brian Eno, Vangelis, John Carpenter",
    "philosophy": "Music should enhance the emotional landscape of the film",
    "awards": "2 Academy Awards (The Social Network, Soul), Golden Globe, Grammy Awards",
    "collaborations": "Atticus Ross (composing partner), David Fincher, Pixar",
    "films": [
      {"title": "Challengers", "year": "2024", "role": "Composer", "genre": "Drama"},
      {"title": "Bones and All", "year": "2022", "role": "Composer", "genre": "Horror"},
      {"title": "Soul", "year": "2020", "role": "Composer", "genre": "Animation"},
      {"title": "Mank", "year": "2020", "role": "Composer", "genre": "Biography"},
      {"title": "Gone Girl", "year": "2014", "role": "Composer", "genre": "Thriller"},
      {"title": "The Social Network", "year": "2010", "role": "Composer", "genre": "Biography"}
    ],
    "imdb": "https://www.imdb.com/name/nm1337467/",
    "website": "https://www.nin.com"
  }'::jsonb,
  'Trent Reznor, alongside his longtime collaborator Atticus Ross, has revolutionized film scoring by bringing an electronic, atmospheric approach to mainstream cinema. Best known as the founder of Nine Inch Nails, Reznor transitioned to film composition with "The Social Network," winning an Academy Award for his haunting, minimalist score.

The Reznor-Ross partnership is characterized by layered electronic textures, ambient soundscapes, and an ability to capture complex emotional states through music. Their work spans from the dark psychological thriller "Gone Girl" to the life-affirming Pixar film "Soul," demonstrating remarkable versatility.

With two Oscars, multiple Grammys, and a Golden Globe, Reznor and Ross have established themselves as among the most innovative and sought-after composers in contemporary cinema, bringing a fresh sonic palette to film music.'
);

-- 11. EMERGING TIER - Jamal Washington (Actor/Director)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Jamal Washington',
  'jamal-washington',
  '{
    "email": "jamal@example.com",
    "legal_name": "Jamal Washington",
    "roles": "Actor, Director",
    "years_active": "2022-2024",
    "current_location": "Atlanta, GA",
    "nationality": "American",
    "genres": "Drama, Comedy",
    "style": "Authentic performances, community-focused storytelling",
    "influences": "Spike Lee, Barry Jenkins, Ryan Coogler",
    "philosophy": "Tell our stories with honesty, humor, and heart",
    "films": [
      {"title": "Corner Store Chronicles", "year": "2024", "role": "Actor, Director", "genre": "Comedy-Drama"},
      {"title": "Sunday Morning", "year": "2023", "role": "Actor", "genre": "Short"}
    ],
    "open_to_collab": "Yes",
    "instagram": "https://instagram.com/jamalwfilms",
    "youtube": "https://youtube.com/@jamalwashington"
  }'::jsonb,
  'Jamal Washington is an emerging actor-director from Atlanta whose work focuses on authentic portrayals of Black community life. His debut feature "Corner Store Chronicles" blends humor and heart to tell a day-in-the-life story set in a neighborhood convenience store, earning praise for its naturalistic performances and sharp dialogue.

Washington''s approach to filmmaking is deeply rooted in his community, working with local actors and crew to create stories that feel genuine and lived-in. His background in theater informs his work with actors, drawing out nuanced performances that bring depth to even the smallest roles.

As both actor and director, Washington brings a unique perspective to his projects, understanding the creative process from multiple angles. He is actively seeking collaborations and building a body of work that celebrates everyday Black excellence.'
);

-- 12. RISING TIER - Emma Thompson (Producer)
INSERT INTO filmmakers (name, profile_url, raw_form_data, ai_generated_bio)
VALUES (
  'Emma Thompson',
  'emma-thompson-producer',
  '{
    "email": "emma@example.com",
    "legal_name": "Emma Louise Thompson",
    "roles": "Producer",
    "years_active": "2018-2024",
    "current_location": "London, UK",
    "nationality": "British",
    "genres": "Drama, Documentary, Social Issue Films",
    "style": "Story-first approach, championing diverse voices",
    "philosophy": "Great producing is about empowering filmmakers to realize their vision",
    "films": [
      {"title": "The Last Garden", "year": "2024", "role": "Producer", "genre": "Documentary"},
      {"title": "Voices Unheard", "year": "2023", "role": "Producer", "genre": "Drama"},
      {"title": "Breaking Barriers", "year": "2022", "role": "Producer", "genre": "Documentary"},
      {"title": "New Horizons", "year": "2021", "role": "Associate Producer", "genre": "Drama"}
    ],
    "screenings": "Sheffield Doc/Fest, Hot Docs, Tribeca Film Festival",
    "linkedin": "https://linkedin.com/in/emmathompsonproducer",
    "open_to_collab": "Yes"
  }'::jsonb,
  'Emma Thompson is a rising producer specializing in documentary and social issue films that amplify underrepresented voices. With a background in journalism and a passion for storytelling, Thompson has quickly established herself as a producer who champions important stories and supports emerging filmmakers.

Her production company focuses on projects that combine artistic excellence with social impact, from environmental documentaries to character-driven dramas exploring contemporary issues. Thompson''s hands-on approach and commitment to filmmaker support have made her a sought-after collaborator in the independent film community.

With four films produced in as many years and screenings at major festivals, Thompson is building a reputation for quality storytelling and ethical production practices, positioning herself as a key player in the next generation of independent producers.'
);

-- Note: AI-generated bios and style_vectors would normally be created by the /api/v1/process-ai endpoint
-- For this test data, we're manually inserting the bios and leaving style_vector as NULL
-- In production, you would call the AI processing endpoint for each filmmaker
