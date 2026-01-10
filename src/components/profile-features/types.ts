// Award category options - common film festival/competition categories
export const AWARD_CATEGORIES = [
  'Best Director',
  'Best Film',
  'Best Screenplay',
  'Best Cinematography',
  'Best Actor',
  'Best Actress',
  'Best Supporting Actor',
  'Best Supporting Actress',
  'Best Documentary',
  'Best Short Film',
  'Best Animation',
  'Best Debut Feature',
  'Jury Prize',
  'Grand Jury Prize',
  'Audience Award',
  'Special Mention',
  'Golden Bear',
  'Golden Lion',
  'Palme d\'Or',
  'Custom', // Allows user to enter their own
] as const;

// Film Achievement structure for awards, nominations, selections, screenings
export interface FilmAchievement {
  id: string;
  type: 'award' | 'nomination' | 'official_selection' | 'screening';
  eventCategory: 'festival' | 'competition' | 'ceremony' | 'other';
  eventName: string;           // e.g., "Cannes Film Festival"
  year: string;                // e.g., "2024"
  category?: string;           // e.g., "Best Director" or custom
  customCategory?: string;     // User-entered custom category
  result: 'won' | 'nominated' | 'selected' | 'screened';
  notes?: string;              // Optional additional details
}

export interface FilmographyEntry {
  id: string;
  title: string;
  year: string;
  // Production has 'genre' string, scalable had 'genres' string[]. 
  // We'll support both or map carefully. Let's add 'genre' string to match production UI.
  genre?: string;
  genres?: string[]; // Keep for compatibility if needed
  duration?: string; // Missing field
  format?: string;
  status?: string;
  primaryRole?: string;
  role?: string; // Production uses 'role'
  additionalRoles?: string[];
  crewScale?: string;
  synopsis: string;
  watchLink?: string; // Scalable used this
  link?: string; // Production uses this
  posterUrl?: string; // Fixed typo from posterUr
  poster?: string; // Production

  // New Fields per User Request
  logline?: string;
  awards?: string;        // DEPRECATED: Keep for migration compatibility
  screenings?: string;    // DEPRECATED: Keep for migration compatibility
  press?: string;
  durationValue?: string;
  durationUnit?: 'min' | 'hour';

  // NEW: Structured achievements
  achievements?: FilmAchievement[];
}

export interface ProfileData {
  // Personal
  stageName?: string; // Scalable
  name?: string; // Production
  legalName?: string;
  email: string;
  phone?: string;
  pronouns?: string;
  dateOfBirth?: string;
  dob?: string; // Production
  profilePhoto?: string;
  profile_photo_url?: string; // Production mapping

  // Location
  country: string;
  currentState?: string;
  current_state?: string; // Production
  nativeState?: string;
  native_state?: string; // Production
  currentCity?: string;
  current_location?: string; // Production
  nativeCity?: string;
  native_location?: string; // Production
  nationality?: string;
  languages?: string;
  preferredContact?: string; // Instagram, LinkedIn, Twitter, Facebook, YouTube, Website

  // Professional
  primaryRoles: string[]; // Scalable (array)
  secondaryRoles: string[]; // Scalable (array)
  roles?: string[]; // Production often uses single 'roles' array
  customRole?: string; // Custom role text
  customRoleType?: 'primary' | 'secondary' | null;

  yearsActive?: string;
  years_active?: string; // Production

  preferredGenres?: string[]; // Scalable
  genres?: string[]; // Production

  visualStyle?: string;
  style?: string; // Production

  creativeInfluences?: string;
  influences?: string; // Production

  creativePhilosophy?: string;
  philosophy?: string; // Production

  beliefAboutCinema?: string; // "Belief About Cinema"
  messageOrIntent?: string; // "Message or Intent"
  creativeSignature?: string; // "Creative Signature"

  // Education
  educationTraining?: string; // General education text

  openToCollaborations?: string;
  open_to_collab?: string; // Production

  availability?: string;

  preferredWorkLocation?: string;
  work_location?: string; // Production

  // Filmography
  filmography: FilmographyEntry[];
  films?: any[]; // Production mapping

  // Awards & Press (Missing in Scalable)
  awards?: string;
  screenings?: string;
  press?: string;

  // Social
  instagram?: string;
  youtube?: string;
  imdb?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  letterboxd?: string;

  // Education
  schooling?: string;
  higherSecondary?: string;
  higher_secondary?: string; // Production
  undergraduate?: string;
  postgraduate?: string;
  phd?: string;
  certifications?: string;

  aiBio?: string;
  isComplete: boolean;
  lastUpdated: Date;
}
