// Subtle color variations for role-based accents
// Staying within the monochrome palette but adding visual interest

export const roleColors: Record<string, string> = {
  'Director': '#18181b',
  'Cinematographer': '#27272a',
  'Editor': '#3f3f46',
  'Writer': '#52525b',
  'Producer': '#18181b',
  'Actor': '#3f3f46',
  'Production Designer': '#52525b',
  'Sound Designer': '#3f3f46',
  'Composer': '#27272a',
  'Colorist': '#52525b',
  'VFX Artist': '#3f3f46',
  'Animator': '#27272a'
};

export const getRoleColor = (role: string): string => {
  return roleColors[role] || '#52525b';
};

export const genreColors: Record<string, string> = {
  'Drama': '#18181b',
  'Comedy': '#27272a',
  'Thriller': '#3f3f46',
  'Horror': '#18181b',
  'Documentary': '#52525b',
  'Romance': '#3f3f46',
  'Action': '#27272a',
  'Sci-Fi': '#3f3f46',
  'Fantasy': '#52525b',
  'Experimental': '#18181b',
  'Musical': '#3f3f46',
  'Period': '#52525b'
};

export const getGenreColor = (genre: string): string => {
  return genreColors[genre] || '#a1a1aa';
};
