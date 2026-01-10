import { ProfileData } from './types';

export const mockProfile: ProfileData = {
  // Personal Info
  stageName: "Arjun Mehta",
  email: "arjun.mehta@cinegrok.com",
  phone: "+91 98765 43210",
  pronouns: "he/him",
  dateOfBirth: "1990-05-15",
  country: "India",
  currentState: "Maharashtra",
  nativeState: "Kerala",
  currentCity: "Mumbai",
  nativeCity: "Kochi",
  nationality: "Indian",
  languages: "Hindi, English, Malayalam, Tamil",
  educationTraining: "Film & Television Institute of India (FTII), Pune - Cinematography, 2012-2015. Specialized training in documentary filmmaking and color grading.",

  // Professional Details
  primaryRoles: ["Director", "Cinematographer"],
  secondaryRoles: ["Editor"],
  yearsActive: "2015 - Present",
  preferredGenres: ["Drama", "Documentary", "Experimental"],
  visualStyle: "Known for naturalistic lighting and long takes that capture authentic human moments. Favors wide lenses and observational camera work that allows subjects space to breathe.",
  creativeInfluences: "Satyajit Ray, Wong Kar-wai, Andrei Tarkovsky, Mani Kaul, Ritwik Ghatak",
  creativePhilosophy: "Cinema is a medium of time and light. Every frame should serve the emotional truth of the story, not just its visual appeal. I believe in minimal intervention and letting moments unfold organically.",
  beliefAboutCinema: "Cinema has the unique power to compress and expand time, to make the invisible visible. It's not just entertainment—it's a way of seeing, a way of understanding human experience.",
  messageOrIntent: "To tell stories that reflect the complexity of contemporary Indian life, especially voices from the margins that often go unheard in mainstream cinema.",
  creativeSignature: "Extended tracking shots through crowded urban spaces, natural ambient sound design",
  openToCollaborations: "Selective",
  availability: "Available",
  preferredWorkLocation: "Mumbai, Remote",

  // Filmography
  filmography: [
    {
      id: "1",
      title: "Monsoon Diary",
      year: "2023",
      format: "Feature Film",
      status: "Festival Run",
      primaryRole: "Director",
      additionalRoles: ["Cinematographer"],
      crewScale: "Medium (6-20)",
      genres: ["Drama"],
      synopsis: "A intimate portrait of three generations of women in a Kerala household during the monsoon season, exploring themes of memory, tradition, and change.",
      posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
      watchLink: "https://vimeo.com/example"
    },
    {
      id: "2",
      title: "City of Echoes",
      year: "2022",
      format: "Documentary",
      status: "Released",
      primaryRole: "Director",
      additionalRoles: ["Cinematographer", "Editor"],
      crewScale: "Small (2-5)",
      genres: ["Documentary"],
      synopsis: "An observational documentary following street musicians in Mumbai over one year, capturing the rhythm of urban life through sound and image.",
      posterUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=600&fit=crop",
      watchLink: "https://youtube.com/watch?v=example"
    },
    {
      id: "3",
      title: "Between Stations",
      year: "2021",
      format: "Short Film",
      status: "Released",
      primaryRole: "Cinematographer",
      additionalRoles: [],
      crewScale: "Small (2-5)",
      genres: ["Drama", "Experimental"],
      synopsis: "A 15-minute meditation on waiting and transit, shot entirely in Mumbai's train stations during early morning hours.",
      posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop",
      watchLink: ""
    },
    {
      id: "4",
      title: "The Last Letter",
      year: "2020",
      format: "Short Film",
      status: "Released",
      primaryRole: "Director",
      additionalRoles: ["Editor"],
      crewScale: "Solo",
      genres: ["Drama"],
      synopsis: "A lockdown film about a daughter discovering her late mother's unsent letters, exploring themes of grief and unspoken words.",
      posterUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400&h=600&fit=crop",
      watchLink: "https://vimeo.com/example"
    },
    {
      id: "5",
      title: "Frames of Reference",
      year: "2019",
      format: "Web Series",
      status: "Released",
      primaryRole: "Cinematographer",
      additionalRoles: [],
      crewScale: "Medium (6-20)",
      genres: ["Documentary"],
      synopsis: "A 6-episode series profiling emerging independent filmmakers across India, their creative processes and challenges.",
      posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
      watchLink: "https://youtube.com/playlist/example"
    },
    {
      id: "6",
      title: "Urban Fragments",
      year: "2018",
      format: "Short Film",
      status: "Released",
      primaryRole: "Director",
      additionalRoles: ["Cinematographer"],
      crewScale: "Solo",
      genres: ["Experimental"],
      synopsis: "A non-narrative visual essay exploring the architecture and spaces of Mumbai through time-lapse and long exposure photography.",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
      watchLink: ""
    }
  ],

  // Social Links
  instagram: "https://instagram.com/arjunmehta.cinema",
  youtube: "https://youtube.com/@arjunmehtafilms",
  imdb: "https://imdb.com/name/nm1234567",
  linkedin: "https://linkedin.com/in/arjunmehta",
  website: "https://arjunmehta.com",
  letterboxd: "https://letterboxd.com/arjunmehta",

  // Education (Detailed)
  schooling: "St. Xavier's High School, Kochi - 2006",
  higherSecondary: "Loyola College, Chennai - Science, 2008",
  undergraduate: "B.A. in English Literature, Delhi University - 2011",
  postgraduate: "Cinematography, FTII Pune - 2015",
  certifications: "Workshop: Advanced Color Grading (DaVinci Resolve) - 2019\nWorkshop: Documentary Ethics and Practice - 2018\nCertification: Drone Cinematography - 2020",

  // Status
  isComplete: true,
  lastUpdated: new Date()
};
