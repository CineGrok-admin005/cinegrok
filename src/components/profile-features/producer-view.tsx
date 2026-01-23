import React, { useState, useEffect } from 'react';
import { ProfileData, FilmAchievement } from './types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Mail, Phone, MapPin, Download, Heart, HeartOff, Trophy, Award, Film, Star, FileText, FileCode, ChevronDown, ChevronUp, Handshake, Play, ExternalLink, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import * as api from '@/lib/api';
import { toast } from 'sonner';
import { downloadAsHTML, printAsPDF } from '@/domain/profile-export.logic';

interface ProducerViewProps {
  profile: ProfileData;
  isOwner?: boolean; // True if viewing own profile
  filmmakerId?: string; // Filmmaker database ID for interest tracking
  filmmaker?: any; // Raw filmmaker data for exports
}

export function ProducerView({ profile, isOwner = false, filmmakerId, filmmaker }: ProducerViewProps) {
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingInterest, setIsCheckingInterest] = useState(true);
  const [expandedFilmIds, setExpandedFilmIds] = useState<Set<string>>(new Set());

  // Check if user is interested in this profile on mount
  useEffect(() => {
    if (filmmakerId && !isOwner) {
      checkInterestStatus();
    } else {
      setIsCheckingInterest(false);
    }
  }, [filmmakerId, isOwner]);

  const checkInterestStatus = async () => {
    try {
      const result = await api.isInterested(filmmakerId!);
      setIsInterested(result.isInterested);
    } catch (error) {
      // User not logged in or error - silently ignore
      console.log('Interest check failed (user may not be logged in)');
    } finally {
      setIsCheckingInterest(false);
    }
  };

  const handleInterestToggle = async () => {
    if (!filmmakerId) return;

    setIsLoading(true);
    try {
      if (isInterested) {
        await api.removeInterest(filmmakerId);
        setIsInterested(false);
      } else {
        await api.expressInterest(filmmakerId);
        setIsInterested(true);
      }
    } catch (error: any) {
      // If 401, user needs to log in
      if (error?.status === 401) {
        toast.error('Please log in to express interest in profiles.');
        // Could redirect to login here
      } else {
        console.error('Interest toggle failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (filmmaker) {
      printAsPDF(filmmaker);
    }
  };

  const handleExportHTML = () => {
    if (filmmaker) {
      downloadAsHTML(filmmaker);
    }
  };

  // Toggle film expansion in Individual Film Details section
  const toggleFilmExpanded = (filmId: string) => {
    setExpandedFilmIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filmId)) {
        newSet.delete(filmId);
      } else {
        newSet.add(filmId);
      }
      return newSet;
    });
  };

  // Helper to format duration
  const formatDuration = (film: any) => {
    if (film.durationValue && film.durationUnit) {
      return `${film.durationValue} ${film.durationUnit}`;
    }
    if (film.duration) return film.duration;
    return null;
  };
  const getProjectStats = () => {
    const statusCount: Record<string, number> = {};
    const formatCount: Record<string, number> = {};
    const roleCount: Record<string, number> = {};
    const scaleCount: Record<string, number> = {};
    const genreCount: Record<string, number> = {};

    profile.filmography.forEach(film => {
      // Status
      if (film.status) {
        statusCount[film.status] = (statusCount[film.status] || 0) + 1;
      }
      // Format
      if (film.format) {
        formatCount[film.format] = (formatCount[film.format] || 0) + 1;
      }
      // Role
      if (film.primaryRole) {
        roleCount[film.primaryRole] = (roleCount[film.primaryRole] || 0) + 1;
      }
      // Scale
      if (film.crewScale) {
        scaleCount[film.crewScale] = (scaleCount[film.crewScale] || 0) + 1;
      }
      // Genres
      film.genres?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    return { statusCount, formatCount, roleCount, scaleCount, genreCount };
  };

  const stats = getProjectStats();

  // Calculate achievement statistics
  const getAchievementStats = () => {
    let totalWins = 0;
    let totalNominations = 0;
    let totalSelections = 0;
    let totalScreenings = 0;
    const allAchievements: Array<FilmAchievement & { filmTitle: string; filmYear: string }> = [];

    profile.filmography.forEach(film => {
      film.achievements?.forEach(ach => {
        allAchievements.push({
          ...ach,
          filmTitle: film.title,
          filmYear: film.year
        });

        if (ach.result === 'won') totalWins++;
        else if (ach.result === 'nominated') totalNominations++;
        else if (ach.result === 'selected') totalSelections++;
        else if (ach.result === 'screened') totalScreenings++;
      });
    });

    // Sort by year descending
    allAchievements.sort((a, b) => (b.year || '').localeCompare(a.year || ''));

    return {
      totalWins,
      totalNominations,
      totalSelections,
      totalScreenings,
      allAchievements,
      hasAchievements: allAchievements.length > 0
    };
  };

  const achievementStats = getAchievementStats();

  const statusData = Object.entries(stats.statusCount).map(([name, value]) => ({
    name,
    value
  }));

  const formatData = Object.entries(stats.formatCount).map(([name, value]) => ({
    name,
    value
  }));

  const scaleData = Object.entries(stats.scaleCount).map(([name, value]) => ({
    name,
    value
  }));

  const location = [profile.currentCity, profile.currentState, profile.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                {profile.profilePhoto ? (
                  <ImageWithFallback
                    src={profile.profilePhoto}
                    alt={profile.stageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-muted" style={{ fontFamily: 'var(--font-serif)' }}>
                    {profile.stageName?.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  {profile.stageName}
                  {profile.legalName && profile.legalName !== profile.stageName && (
                    <span className="text-lg text-muted ml-2 font-sans font-normal">({profile.legalName})</span>
                  )}
                </h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.primaryRoles?.map(role => (
                    <span key={role} className="text-xs uppercase tracking-wider text-secondary">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Interest Button - Only show for non-owners */}
              {!isOwner && filmmakerId && (
                <Button
                  variant={isInterested ? "default" : "outline"}
                  size="sm"
                  onClick={handleInterestToggle}
                  disabled={isLoading || isCheckingInterest}
                >
                  {isInterested ? (
                    <>
                      <Handshake className="w-4 h-4 mr-2" />
                      Interested
                    </>
                  ) : (
                    <>
                      <Handshake className="w-4 h-4 mr-2" />
                      {isLoading ? 'Loading...' : 'Collaborate'}
                    </>
                  )}
                </Button>
              )}

              {/* Export Button - Only show for profile owners */}
              {isOwner && filmmaker && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportHTML}>
                      <FileCode className="w-4 h-4 mr-2" />
                      Download as HTML
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact & Key Info */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">Contact</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted" />
                  <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted" />
                    <a href={`tel:${profile.phone}`} className="hover:underline">{profile.phone}</a>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">Experience</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted">Years Active:</span> {profile.yearsActive || 'Not specified'}
                </div>
                <div>
                  <span className="text-muted">Total Projects:</span> {profile.filmography?.length || 0}
                </div>
                <div>
                  <span className="text-muted">Availability:</span> <Badge variant="secondary" className="text-xs whitespace-normal text-left h-auto py-1">{profile.availability || 'Not specified'}</Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">Collaboration</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted">Status:</span> {profile.openToCollaborations || 'Not specified'}
                </div>
                {profile.preferredWorkLocation && (
                  <div>
                    <span className="text-muted">Preferred Location:</span> {profile.preferredWorkLocation}
                  </div>
                )}
                {profile.languages && (
                  <div>
                    <span className="text-muted">Languages:</span> {profile.languages}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Career Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Lifecycle */}
          {statusData.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Project Lifecycle</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="var(--chart-1, #18181b)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Format Experience */}
          {formatData.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Format Experience</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={formatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="var(--chart-2, #52525b)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Crew Scale Handling */}
          {scaleData.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Crew Scale Handling</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scaleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="var(--chart-3, #71717a)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Role & Genre Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Role Involvement */}
          {Object.keys(stats.roleCount).length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Role Involvement</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.roleCount).map(([role, count]) => (
                  <Badge key={role} variant="outline" className="text-sm">
                    {role} <span className="ml-1 text-muted">({count})</span>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Genre Exposure */}
          {Object.keys(stats.genreCount).length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Genre Exposure</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.genreCount).map(([genre, count]) => (
                  <Badge key={genre} variant="secondary" className="text-sm">
                    {genre} <span className="ml-1 text-muted">({count})</span>
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Activity Timeline */}
        {profile.filmography && profile.filmography.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Activity Timeline</h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Scale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.filmography
                    .sort((a, b) => (b.year || '').localeCompare(a.year || ''))
                    .map((film) => (
                      <TableRow key={film.id}>
                        <TableCell>{film.year}</TableCell>
                        <TableCell className="font-medium">{film.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{film.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{film.status}</Badge>
                        </TableCell>
                        <TableCell>{film.primaryRole}</TableCell>
                        <TableCell className="text-sm text-muted">{film.crewScale}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Awards & Recognition - Moved below Activity Timeline */}
        {achievementStats.hasAchievements && (
          <Card className="p-6 mt-8">
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              <Trophy className="w-5 h-5 inline-block mr-2" />
              Awards & Recognition
            </h3>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 text-center border border-border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold" style={{ color: '#d4af37' }}>
                  <Trophy className="w-6 h-6" />
                  <span>{achievementStats.totalWins}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">Awards Won</div>
              </div>
              <div className="p-4 text-center border border-border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-zinc-500">
                  <Award className="w-6 h-6" />
                  <span>{achievementStats.totalNominations}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">Nominations</div>
              </div>
              <div className="p-4 text-center border border-border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <Star className="w-6 h-6" />
                  <span>{achievementStats.totalSelections}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">Official Selections</div>
              </div>
              <div className="p-4 text-center border border-border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <Film className="w-6 h-6" />
                  <span>{achievementStats.totalScreenings}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">Screenings</div>
              </div>
            </div>

            {/* Achievements Table with improved spacing */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border">
                    <TableHead className="py-3">Year</TableHead>
                    <TableHead className="py-3">Film</TableHead>
                    <TableHead className="py-3">Event</TableHead>
                    <TableHead className="py-3">Category</TableHead>
                    <TableHead className="py-3">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievementStats.allAchievements.map((ach) => (
                    <TableRow key={ach.id} className="border-b border-border">
                      <TableCell className="py-4">{ach.year}</TableCell>
                      <TableCell className="py-4 font-medium">{ach.filmTitle}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {ach.eventCategory}
                          </Badge>
                          {ach.eventName}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {ach.category === 'Custom' ? ach.customCategory : ach.category || '-'}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={ach.result === 'won' ? 'default' : 'secondary'}
                          className="text-xs flex items-center gap-1 w-fit"
                          style={ach.result === 'won' ? { backgroundColor: '#d4af37', color: '#000' } : {}}
                        >
                          {ach.result === 'won' && <Trophy className="w-3 h-3" />}
                          {ach.result === 'nominated' && <Award className="w-3 h-3" />}
                          {ach.result === 'selected' && <Star className="w-3 h-3" />}
                          {ach.result === 'screened' && <Film className="w-3 h-3" />}
                          {ach.result.charAt(0).toUpperCase() + ach.result.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Individual Film Details - Collapsible Cards */}
        {profile.filmography && profile.filmography.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Individual Film Details
            </h3>
            <p className="text-sm text-muted mb-6">
              Click on any film to view detailed information including synopsis, achievements, and more.
            </p>

            <div className="space-y-3">
              {profile.filmography
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''))
                .map((film) => {
                  const isExpanded = expandedFilmIds.has(film.id);
                  const filmAchievements = film.achievements || [];
                  const duration = formatDuration(film);
                  const watchLink = film.watchLink || film.link;
                  const posterUrl = film.posterUrl || film.poster;

                  return (
                    <div
                      key={film.id}
                      className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-zinc-400"
                    >
                      {/* Collapsed Header - Always visible */}
                      <button
                        onClick={() => toggleFilmExpanded(film.id)}
                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-accent/50 transition-colors"
                      >
                        {/* Poster Thumbnail */}
                        <div className="w-12 h-16 flex-shrink-0 bg-zinc-100 rounded overflow-hidden border border-zinc-200">
                          {posterUrl ? (
                            <ImageWithFallback
                              src={posterUrl}
                              alt={film.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-5 h-5 text-muted" />
                            </div>
                          )}
                        </div>

                        {/* Film Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                            {film.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-muted">{film.year}</span>
                            {film.format && (
                              <>
                                <span className="text-muted">•</span>
                                <Badge variant="outline" className="text-xs">{film.format}</Badge>
                              </>
                            )}
                            {film.status && (
                              <>
                                <span className="text-muted">•</span>
                                <Badge variant="secondary" className="text-xs">{film.status}</Badge>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-muted mt-1">
                            Role: <span className="text-foreground">{film.primaryRole || film.role || 'Not specified'}</span>
                          </p>
                        </div>

                        {/* Achievements count badge */}
                        {filmAchievements.length > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                            <Trophy className="w-3 h-3" />
                            {filmAchievements.length}
                          </div>
                        )}

                        {/* Expand/Collapse Icon */}
                        <div className="flex-shrink-0 text-muted">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-border bg-accent/30 p-4 space-y-4">
                          {/* Logline */}
                          {film.logline && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted mb-1">Logline</p>
                              <p className="text-sm italic text-foreground leading-relaxed">
                                "{film.logline}"
                              </p>
                            </div>
                          )}

                          {/* Synopsis */}
                          {film.synopsis && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted mb-1">Synopsis</p>
                              <p className="text-sm text-foreground leading-relaxed">
                                {film.synopsis}
                              </p>
                            </div>
                          )}

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {film.genre && (
                              <div className="p-3 bg-white rounded-lg border border-border">
                                <p className="text-xs uppercase tracking-wider text-muted mb-1">Genre</p>
                                <p className="text-sm font-medium">{film.genre}</p>
                              </div>
                            )}
                            {duration && (
                              <div className="p-3 bg-white rounded-lg border border-border">
                                <p className="text-xs uppercase tracking-wider text-muted mb-1">Runtime</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {duration}
                                </p>
                              </div>
                            )}
                            {film.crewScale && (
                              <div className="p-3 bg-white rounded-lg border border-border">
                                <p className="text-xs uppercase tracking-wider text-muted mb-1">Crew Scale</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {film.crewScale}
                                </p>
                              </div>
                            )}
                            {film.additionalRoles && film.additionalRoles.length > 0 && (
                              <div className="p-3 bg-white rounded-lg border border-border">
                                <p className="text-xs uppercase tracking-wider text-muted mb-1">Additional Roles</p>
                                <p className="text-sm font-medium">{film.additionalRoles.join(', ')}</p>
                              </div>
                            )}
                          </div>

                          {/* Per-Film Achievements */}
                          {filmAchievements.length > 0 && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted mb-2">Awards & Recognition</p>
                              <div className="space-y-2">
                                {filmAchievements.map((ach) => (
                                  <div
                                    key={ach.id}
                                    className="flex items-center gap-2 p-2 bg-white rounded border border-border"
                                  >
                                    {ach.result === 'won' && <Trophy className="w-4 h-4 text-amber-500" />}
                                    {ach.result === 'nominated' && <Award className="w-4 h-4 text-zinc-400" />}
                                    {ach.result === 'selected' && <Star className="w-4 h-4 text-blue-500" />}
                                    {ach.result === 'screened' && <Film className="w-4 h-4 text-green-500" />}
                                    <span className="text-sm flex-1">
                                      {ach.category && <span className="font-medium">{ach.category} - </span>}
                                      {ach.eventName}
                                      {ach.year && <span className="text-muted ml-1">({ach.year})</span>}
                                    </span>
                                    <Badge
                                      variant={ach.result === 'won' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {ach.result.charAt(0).toUpperCase() + ach.result.slice(1)}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Press */}
                          {film.press && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted mb-1">Press</p>
                              <p className="text-sm italic text-foreground leading-relaxed">
                                {film.press}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {(watchLink || film.trailerUrl) && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {watchLink && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => {
                                    // Track watch click
                                    if (filmmakerId) {
                                      api.trackClick(filmmakerId, 'watch', film.id).catch(() => { });
                                    }
                                    window.open(watchLink, '_blank');
                                  }}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Watch Film
                                </Button>
                              )}
                              {film.trailerUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Track trailer click
                                    if (filmmakerId) {
                                      api.trackClick(filmmakerId, 'trailer', film.id).catch(() => { });
                                    }
                                    window.open(film.trailerUrl, '_blank');
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Trailer
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </Card>
        )}

        {/* Professional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {profile.visualStyle && (
            <Card className="p-6">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Visual/Narrative Style</h3>
              <p className="text-sm leading-relaxed">{profile.visualStyle}</p>
            </Card>
          )}

          {profile.creativeInfluences && (
            <Card className="p-6">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Creative Influences</h3>
              <p className="text-sm leading-relaxed">{profile.creativeInfluences}</p>
            </Card>
          )}

          {profile.creativePhilosophy && (
            <Card className="p-6">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Creative Philosophy</h3>
              <p className="text-sm leading-relaxed">{profile.creativePhilosophy}</p>
            </Card>
          )}

          {profile.beliefAboutCinema && (
            <Card className="p-6">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Belief About Cinema</h3>
              <p className="text-sm leading-relaxed">{profile.beliefAboutCinema}</p>
            </Card>
          )}
        </div>

        {/* Education Details */}
        {(profile.schooling || profile.undergraduate || profile.postgraduate || profile.certifications) && (
          <Card className="p-6 mt-8">
            <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Education Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.schooling && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Schooling (10th)</p>
                  <p className="text-sm">{profile.schooling}</p>
                </div>
              )}
              {profile.higherSecondary && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Higher Secondary (12th)</p>
                  <p className="text-sm">{profile.higherSecondary}</p>
                </div>
              )}
              {profile.undergraduate && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Undergraduate</p>
                  <p className="text-sm">{profile.undergraduate}</p>
                </div>
              )}
              {profile.postgraduate && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Postgraduate</p>
                  <p className="text-sm">{profile.postgraduate}</p>
                </div>
              )}
              {profile.phd && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">PhD</p>
                  <p className="text-sm">{profile.phd}</p>
                </div>
              )}
              {profile.certifications && (
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Certifications/Workshops</p>
                  <p className="text-sm leading-relaxed">{profile.certifications}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
