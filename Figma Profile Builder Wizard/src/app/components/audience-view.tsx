import React, { useState } from 'react';
import { ProfileData } from '../types/profile';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Mail, MapPin, ChevronDown, ChevronUp, Instagram, Youtube, Linkedin, Twitter, Facebook, Globe, Film } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AudienceViewProps {
  profile: ProfileData;
}

export function AudienceView({ profile }: AudienceViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: true,
    work: true,
    style: true,
    philosophy: true
  });

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-accent rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                {profile.profilePhoto ? (
                  <ImageWithFallback
                    src={profile.profilePhoto}
                    alt={profile.stageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted" style={{ fontFamily: 'var(--font-serif)' }}>
                    {profile.stageName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                {profile.stageName}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.primaryRoles?.map(role => (
                  <span key={role} className="text-xs uppercase tracking-wider text-secondary" style={{ fontFamily: 'var(--font-sans)' }}>
                    {role}
                  </span>
                ))}
              </div>

              {location && (
                <div className="flex items-center gap-2 text-muted mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              )}

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
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                {profile.openToCollaborations === 'Yes' && (
                  <Button variant="outline">
                    Collaborate
                  </Button>
                )}
              </div>
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
                        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Selected Work</h2>
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
                    {/* Mobile/Tablet: Vertical Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                      {profile.filmography.slice(0, 6).map((film) => (
                        <Card key={film.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-[2/3] bg-accent relative overflow-hidden group">
                            {film.posterUrl ? (
                              <ImageWithFallback
                                src={film.posterUrl}
                                alt={film.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-12 h-12 text-muted" />
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h3 className="mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{film.title}</h3>
                            <p className="text-sm text-muted mb-2">{film.year}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-xs">{film.format}</Badge>
                              <Badge variant="outline" className="text-xs">{film.primaryRole}</Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop: Horizontal Scroll */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto pb-4 -mx-2 px-2">
                        <div className="flex gap-4" style={{ width: 'max-content' }}>
                          {profile.filmography.map((film) => (
                            <Card key={film.id} className="overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0" style={{ width: '280px' }}>
                              <div className="aspect-[2/3] bg-accent relative overflow-hidden group">
                                {film.posterUrl ? (
                                  <ImageWithFallback
                                    src={film.posterUrl}
                                    alt={film.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Film className="w-12 h-12 text-muted" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="p-4">
                                <h3 className="mb-1 truncate" style={{ fontFamily: 'var(--font-serif)' }}>{film.title}</h3>
                                <p className="text-sm text-muted mb-2">{film.year}</p>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">{film.format}</Badge>
                                  <Badge variant="outline" className="text-xs">{film.primaryRole}</Badge>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {profile.filmography.length > 6 && (
                      <Button variant="outline" className="w-full mt-4 lg:hidden">
                        View All Work ({profile.filmography.length})
                      </Button>
                    )}
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
                    <Badge variant="default">{profile.availability}</Badge>
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
      </div>
    </div>
  );
}