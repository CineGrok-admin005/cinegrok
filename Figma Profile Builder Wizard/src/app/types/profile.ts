// CineGrok Profile Types

export interface FilmographyEntry {
  id: string;
  title: string;
  year: string;
  format: string; // Feature Film, Short Film, Documentary, Web Series, etc.
  status: string; // Released, Completed, Festival Run, etc.
  primaryRole: string;
  additionalRoles: string[];
  crewScale: string; // Solo, Small, Medium, Large, Mega
  genres: string[];
  synopsis: string;
  posterUrl: string;
  watchLink: string;
}

export interface ProfileData {
  // Step 1: Personal Info
  profilePhoto?: string;
  legalName?: string;
  stageName: string;
  email: string;
  phone?: string;
  pronouns?: string;
  dateOfBirth?: string;
  country: string;
  currentState?: string;
  nativeState?: string;
  currentCity?: string;
  nativeCity?: string;
  nationality?: string;
  languages?: string;
  educationTraining?: string;

  // Step 2: Professional Details
  primaryRoles: string[];
  secondaryRoles?: string[];
  customRole?: string;
  customRoleType?: 'primary' | 'secondary';
  yearsActive?: string;
  preferredGenres?: string[];
  visualStyle?: string;
  creativeInfluences?: string;
  creativePhilosophy?: string;
  beliefAboutCinema?: string;
  messageOrIntent?: string;
  creativeSignature?: string;
  openToCollaborations?: string;
  availability?: string;
  preferredWorkLocation?: string;

  // Step 3: Filmography
  filmography: FilmographyEntry[];

  // Step 4: Social Links
  instagram?: string;
  youtube?: string;
  imdb?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  letterboxd?: string;

  // Step 5: Education (Detailed)
  schooling?: string;
  higherSecondary?: string;
  undergraduate?: string;
  postgraduate?: string;
  phd?: string;
  certifications?: string;
}

export const ROLE_OPTIONS = [
  'Director',
  'Cinematographer',
  'Editor',
  'Writer',
  'Producer',
  'Actor',
  'Production Designer',
  'Sound Designer',
  'Composer',
  'Colorist',
  'VFX Artist',
  'Animator'
];

export const GENRE_OPTIONS = [
  'Drama',
  'Comedy',
  'Thriller',
  'Horror',
  'Documentary',
  'Romance',
  'Action',
  'Sci-Fi',
  'Fantasy',
  'Experimental',
  'Musical',
  'Period'
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const PROJECT_FORMATS = [
  'Feature Film',
  'Short Film',
  'Documentary',
  'Web Series',
  'Commercial',
  'Music Video',
  'TV Series',
  'Experimental'
];

export const PROJECT_STATUSES = [
  'Released',
  'Completed',
  'Festival Run',
  'Post-Production',
  'Production',
  'Pre-Production',
  'Development'
];

export const CREW_SCALES = [
  'Solo',
  'Small (2-5)',
  'Medium (6-20)',
  'Large (21-50)',
  'Mega (50+)'
];

export const PRONOUN_OPTIONS = [
  'he/him',
  'she/her',
  'they/them',
  'other'
];

export const COLLABORATION_OPTIONS = [
  'Yes',
  'No',
  'Selective'
];

export const AVAILABILITY_OPTIONS = [
  'Available',
  'Busy',
  'Selective',
  'Part-time'
];
