import React, { useState } from 'react';
import { ProfileData } from './types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Mail, MapPin, ChevronDown, ChevronUp, Instagram, Youtube, Linkedin, Twitter, Facebook, Globe, Film, Trophy, Award, Info, Play, PlayCircle, ExternalLink, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '@/lib/api';

interface AudienceViewProps {
  profile: ProfileData;
  filmmakerId?: string;
}

export function AudienceView({ profile, filmmakerId }: AudienceViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: true,
    work: true,
    style: true,
    philosophy: true
  });

  // State for expanded film info panel
  const [expandedFilmId, setExpandedFilmId] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const location = [profile.currentCity, profile.currentState, profile.country]
    .filter(Boolean)
    .join(', ');

  const socialLinks = [
    { icon: Instagram, url: profile.instagram, label: 'Instagram' },
    { icon: Youtube, url: profile.youtube, label: 'YouTube' },
    { icon: Linkedin, url: profile.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: profile.twitter, label: 'Twitter' },
    { icon: Facebook, url: profile.facebook, label: 'Facebook' },
    { icon: Globe, url: profile.website, label: 'Website' }
  ].filter(link => link.url);

  // Helper function to get achievement summary for a film
  const getFilmAchievementSummary = (filmId: string) => {
    const film = profile.filmography.find(f => f.id === filmId);
    if (!film?.achievements || film.achievements.length === 0) return null;

    const wins = film.achievements.filter(a => a.result === 'won').length;
    const nominations = film.achievements.filter(a => a.result === 'nominated').length;
    const selections = film.achievements.filter(a => a.result === 'selected').length;

    return { wins, nominations, selections, total: film.achievements.length };
  };

  // Calculate total achievements for header display
  const totalAchievements = profile.filmography.reduce((acc, film) => {
    const wins = film.achievements?.filter(a => a.result === 'won').length || 0;
    const nominations = film.achievements?.filter(a => a.result === 'nominated').length || 0;
    return acc + wins + nominations;
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-accent rounded-lg overflow-hidden">
                {profile.profilePhoto ? (
                  <ImageWithFallback
                    src={profile.profilePhoto}
                    alt={profile.stageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted" style={{ fontFamily: 'var(--font-serif)' }}>
                    {profile.stageName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                {profile.stageName}
                {profile.legalName && profile.legalName !== profile.stageName && (
                  <span className="text-2xl text-muted ml-3 font-sans font-normal align-middle">({profile.legalName})</span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                {profile.primaryRoles?.map((role, index) => (
                  <React.Fragment key={role}>
                    {index > 0 && <span className="text-muted">•</span>}
                    <span className="text-xs uppercase tracking-wider text-secondary" style={{ fontFamily: 'var(--font-sans)' }}>
                      {role}
                    </span>
                  </React.Fragment>
                ))}
                {profile.secondaryRoles && profile.secondaryRoles.length > 0 && (
                  <>
                    {profile.secondaryRoles.map((role) => (
                      <React.Fragment key={role}>
                        <span className="text-muted">•</span>
                        <span className="text-xs uppercase tracking-wider text-secondary" style={{ fontFamily: 'var(--font-sans)' }}>
                          {role}
                        </span>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </div>

              {/* Awards & Location row */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {location && (
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
                {totalAchievements > 0 && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#d4af37' }}>
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">{totalAchievements} Award{totalAchievements !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-accent transition-colors"
                        aria-label={link.label}
                        onClick={() => {
                          // Track social link click
                          if (filmmakerId) {
                            api.trackClick(filmmakerId, 'social', link.label.toLowerCase()).catch(() => { });
                          }
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Preferred Way to Contact */}
              {profile.preferredContact && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Mail className="w-4 h-4" />
                  <span>Preferred contact: <strong className="text-foreground">{profile.preferredContact}</strong></span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Collapsible open={expandedSections.about} onOpenChange={() => toggleSection('about')}>
              <div className="space-y-4">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full text-left group">
                    <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>About</h2>
                    {expandedSections.about ? (
                      <ChevronUp className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed">
                      {profile.stageName} is {profile.primaryRoles && profile.primaryRoles.length > 0
                        ? `a ${profile.primaryRoles.join(' and ')}`
                        : 'a filmmaker'} based in {location || 'India'}.
                      {profile.yearsActive && ` Active since ${profile.yearsActive},`} they have worked on {profile.filmography?.length || 0} project{profile.filmography?.length !== 1 ? 's' : ''}.
                      {profile.preferredGenres && profile.preferredGenres.length > 0 &&
                        ` Their work spans ${profile.preferredGenres.join(', ')}.`}
                    </p>

                    {profile.educationTraining && (
                      <div className="mt-4">
                        <h4 className="mb-2">Education & Training</h4>
                        <p className="text-sm text-muted leading-relaxed">{profile.educationTraining}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Separator />

            {/* Selected Work */}
            {profile.filmography && profile.filmography.length > 0 && (
              <Collapsible open={expandedSections.work} onOpenChange={() => toggleSection('work')}>
                <div className="space-y-4">
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full text-left group">
                      <div className="flex items-baseline gap-3">
                        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Filmography</h2>
                        <span className="text-sm text-muted">({profile.filmography.length} {profile.filmography.length === 1 ? 'film' : 'films'})</span>
                      </div>
                      {expandedSections.work ? (
                        <ChevronUp className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    {/* Horizontal Scroll Filmography */}
                    <div className="overflow-x-auto pb-4 -mx-2 px-2">
                      <div className="flex gap-4 items-stretch" style={{ width: 'max-content' }}>
                        {profile.filmography.map((film) => {
                          const achSummary = getFilmAchievementSummary(film.id);
                          const isExpanded = expandedFilmId === film.id;
                          const duration = film.durationValue ? `${film.durationValue} ${film.durationUnit || 'min'}` : null;
                          const hasWatchLink = !!(film.watchLink || film.link);
                          const hasTrailer = !!film.trailerUrl;

                          return (
                            <div key={film.id} className="flex gap-0 flex-shrink-0">
                              {/* Compact Film Card */}
                              <Card
                                className={`overflow-hidden transition-all flex-shrink-0 flex flex-col ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}
                                style={{
                                  width: '200px',
                                  height: '100%',
                                  minHeight: '340px',
                                  border: isExpanded ? '2px solid #18181b' : '1px solid #e4e4e7',
                                  borderRadius: '12px'
                                }}
                              >
                                {/* Poster with padding */}
                                <div className="p-3 pb-0">
                                  <div className="aspect-[2/3] bg-zinc-100 relative overflow-hidden rounded-lg">
                                    {film.posterUrl ? (
                                      <ImageWithFallback
                                        src={film.posterUrl}
                                        alt={film.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Film className="w-12 h-12 text-muted" />
                                      </div>
                                    )}

                                    {/* Achievement Laurel Overlay */}
                                    {achSummary && achSummary.total > 0 && (
                                      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                                        {achSummary.wins > 0 && (
                                          <div
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5"
                                            style={{ backgroundColor: '#d4af37', color: '#000' }}
                                          >
                                            <Trophy className="w-2.5 h-2.5" /> {achSummary.wins}
                                          </div>
                                        )}
                                        {achSummary.nominations > 0 && (
                                          <div
                                            className="px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5"
                                            style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #d4af37' }}
                                          >
                                            <Award className="w-2.5 h-2.5" /> {achSummary.nominations}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Card Content - Push to bottom */}
                                <div className="p-3 mt-auto">
                                  <h3 className="text-sm font-semibold mb-1 leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                                    {film.title}
                                  </h3>
                                  {/* Two-line metadata: Line 1 = Year • Format, Line 2 = Duration */}
                                  <div className="text-xs text-muted mb-2 space-y-0.5">
                                    <p className="truncate">{[film.year, film.format].filter(Boolean).join(' • ')}</p>
                                    {duration && <p className="truncate">{duration}</p>}
                                  </div>

                                  {/* INFO and WATCH Buttons - Matching Mockup */}
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-1 text-[11px] h-8 px-3 rounded-none border-zinc-300 ${isExpanded ? 'bg-zinc-900 text-white border-zinc-900' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedFilmId(isExpanded ? null : film.id);
                                        // Track film info click
                                        if (filmmakerId && !isExpanded) {
                                          api.trackClick(filmmakerId, 'film', film.id).catch(() => { });
                                        }
                                      }}
                                    >
                                      INFO
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-1 text-[11px] h-8 px-3 rounded-none border-zinc-300 ${isExpanded ? 'bg-zinc-900 text-white border-zinc-900' : ''}`}
                                      disabled={!hasWatchLink}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const link = film.watchLink || film.link;
                                        if (link) {
                                          // Track watch link click
                                          if (filmmakerId) {
                                            api.trackClick(filmmakerId, 'watch', film.id).catch(() => { });
                                          }
                                          window.open(link, '_blank');
                                        }
                                      }}
                                    >
                                      <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                      WATCH
                                    </Button>
                                  </div>
                                </div>
                              </Card>

                              {/* Right Side Drawer - Full Height (Desktop Mockup) */}
                              {isExpanded && (
                                <>
                                  {/* Backdrop */}
                                  <div
                                    className="fixed inset-0 bg-black/30 z-[60] animate-in fade-in duration-200"
                                    onClick={() => setExpandedFilmId(null)}
                                  />

                                  {/* Side Drawer Panel */}
                                  <div
                                    className="fixed top-0 right-0 h-screen z-[70] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                                    style={{
                                      width: 'min(45vw, 600px)',
                                      minWidth: '400px',
                                      borderLeft: '1px solid #e4e4e7'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Close Button - Minimal padding */}
                                    <div className="flex justify-end p-3 pr-4">
                                      <button
                                        onClick={() => setExpandedFilmId(null)}
                                        className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-900"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>

                                    {/* Content Container - Scrollable - Using CSS Grid */}
                                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                                      <div
                                        className="grid gap-x-4"
                                        style={{
                                          gridTemplateColumns: '140px 1fr',
                                          gridTemplateRows: 'auto auto auto 1fr'
                                        }}
                                      >
                                        {/* Poster - Spans 3 rows (title, meta, genre + divider row + logline row) */}
                                        <div className="row-span-4" style={{ gridColumn: 1, gridRow: '1 / 5' }}>
                                          <div className="w-full aspect-[2/3] bg-zinc-100 rounded-md overflow-hidden border border-zinc-200 shadow-sm">
                                            {film.posterUrl ? (
                                              <ImageWithFallback
                                                src={film.posterUrl}
                                                alt={film.title}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <Film className="w-10 h-10 text-muted" />
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Title - Row 1, Column 2 - BIGGER */}
                                        <div style={{ gridColumn: 2, gridRow: 1 }}>
                                          <h3 className="text-4xl font-bold leading-[1.05] mb-3 text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                                            {film.title}
                                          </h3>
                                        </div>

                                        {/* Meta - Row 2, Column 2 */}
                                        <div style={{ gridColumn: 2, gridRow: 2 }} className="mb-3">
                                          <p className="text-sm font-medium text-zinc-500 tracking-wide uppercase">
                                            {[film.year, film.format?.toUpperCase()].filter(Boolean).join(' • ')}
                                          </p>
                                        </div>

                                        {/* Genre Badge - Row 3, Column 2 */}
                                        <div style={{ gridColumn: 2, gridRow: 3 }} className="mb-4">
                                          {film.genre && (
                                            <Badge className="bg-zinc-100 text-zinc-700 text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-200">
                                              GENRE: {film.genre}
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Divider + Synopsis - Row 4, Column 2 */}
                                        <div style={{ gridColumn: 2, gridRow: 4 }}>
                                          {/* Divider - Only in this column */}
                                          <div className="h-px bg-zinc-300 w-full mb-5" />

                                          {/* Synopsis */}
                                          {film.synopsis && (
                                            <div className="mb-5">
                                              <p className="text-sm font-bold text-black mb-2">Synopsis</p>
                                              <p className="text-sm text-zinc-600 leading-relaxed">
                                                {film.synopsis}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Content below grid - matches grid Column 2 start (140px + gap-x-4) */}
                                      <div className="space-y-5" style={{ marginLeft: 'calc(140px + 1rem)' }}>

                                        {/* Role */}
                                        {(film.primaryRole || film.role) && (
                                          <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-bold text-black">Role:</span>
                                            <span className="text-sm text-zinc-700">{film.primaryRole || film.role}</span>
                                          </div>
                                        )}

                                        {/* Achievements - Horizontal scroll */}
                                        {film.achievements && film.achievements.length > 0 && (
                                          <div className="pt-2">
                                            <div className="overflow-x-auto">
                                              <div className="flex gap-6" style={{ width: 'max-content' }}>
                                                {film.achievements.map((ach) => (
                                                  <div key={ach.id} className="flex flex-col items-center text-center min-w-[70px]">
                                                    <div className="relative mb-1 text-zinc-800">
                                                      {/* Laurel wreath SVG */}
                                                      <svg width="48" height="38" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M10 40 Q5 30 10 20 Q15 10 20 15 Q25 20 20 30 Q15 40 10 40" />
                                                        <path d="M50 40 Q55 30 50 20 Q45 10 40 15 Q35 20 40 30 Q45 40 50 40" />
                                                        <path d="M15 42 Q10 35 15 28 Q20 22 24 26 Q28 30 24 38 Q20 45 15 42" />
                                                        <path d="M45 42 Q50 35 45 28 Q40 22 36 26 Q32 30 36 38 Q40 45 45 42" />
                                                      </svg>
                                                      {ach.result === 'won' && <Trophy className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                                    </div>
                                                    <span className="text-[7px] uppercase font-bold tracking-wide text-zinc-500 leading-tight">
                                                      {ach.result === 'won' ? 'BEST SHORT FILM' : 'OFFICIAL SELECTION'}
                                                    </span>
                                                    <span className="text-[9px] uppercase font-bold tracking-wider text-black leading-tight mt-0.5">
                                                      {ach.eventName.split(' ').slice(0, 2).join(' ')}
                                                    </span>
                                                    <span className="text-[8px] text-zinc-500 mt-0.5">
                                                      {ach.year || '2024'}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Footer: Action Buttons - Sticky at bottom */}
                                    <div className="border-t border-zinc-100 p-6 bg-white mt-auto">
                                      <div className="flex items-center gap-4">
                                        {hasWatchLink ? (
                                          <Button
                                            className="flex-1 bg-zinc-900 text-white hover:bg-black h-14 text-sm font-bold tracking-[0.15em] uppercase transition-all"
                                            onClick={() => {
                                              const link = film.watchLink || film.link;
                                              if (link) {
                                                // Track watch link click
                                                if (filmmakerId) {
                                                  api.trackClick(filmmakerId, 'watch', film.id).catch(() => { });
                                                }
                                                window.open(link, '_blank');
                                              }
                                            }}
                                          >
                                            WATCH
                                            <span className="ml-3 text-lg">→</span>
                                          </Button>
                                        ) : (
                                          <Button disabled className="flex-1 bg-zinc-100 text-zinc-400 h-14 text-sm font-bold tracking-[0.15em] uppercase">
                                            UNAVAILABLE
                                          </Button>
                                        )}

                                        {hasTrailer && (
                                          <button
                                            onClick={() => {
                                              // Track trailer click
                                              if (filmmakerId) {
                                                api.trackClick(filmmakerId, 'trailer', film.id).catch(() => { });
                                              }
                                              window.open(film.trailerUrl, '_blank');
                                            }}
                                            className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors px-4 py-2 hover:bg-zinc-50 rounded-lg"
                                          >
                                            <Play className="w-5 h-5 mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Trailer</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Creative Style */}
            {(profile.preferredGenres?.length || profile.visualStyle || profile.creativeInfluences) && (
              <Card className="p-6">
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Creative Style</h3>

                {profile.preferredGenres && profile.preferredGenres.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-muted mb-2">Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredGenres.map(genre => (
                        <Badge key={genre} variant="secondary">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.visualStyle && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-muted mb-2">Visual Style</p>
                    <p className="text-sm leading-relaxed">{profile.visualStyle}</p>
                  </div>
                )}

                {profile.creativeInfluences && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted mb-2">Influences</p>
                    <p className="text-sm leading-relaxed">{profile.creativeInfluences}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Creative Philosophy */}
            {profile.creativePhilosophy && (
              <Card className="p-6 bg-accent">
                <div className="mb-4">
                  <span className="text-6xl leading-none text-secondary" style={{ fontFamily: 'var(--font-serif)' }}>"</span>
                </div>
                <p className="text-sm italic leading-relaxed mb-4">
                  {profile.creativePhilosophy}
                </p>
                <p className="text-xs text-muted">— Creative Philosophy</p>
              </Card>
            )}

            {/* Collaboration Status */}
            {(profile.openToCollaborations || profile.availability) && (
              <Card className="p-6">
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Availability</h3>

                {profile.availability && (
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wider text-muted mb-1">Status</p>
                    <Badge variant="default" className="whitespace-normal text-left h-auto py-1">{profile.availability}</Badge>
                  </div>
                )}

                {profile.openToCollaborations && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted mb-1">Collaborations</p>
                    <p className="text-sm">{profile.openToCollaborations}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Languages */}
            {profile.languages && (
              <Card className="p-6">
                <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Languages</h3>
                <p className="text-sm">{profile.languages}</p>
              </Card>
            )}
          </div>
        </div>
      </div >
    </div >
  );
}