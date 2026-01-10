import React from 'react';
import { ProfileData } from '../types/profile';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Mail, Phone, MapPin, Download, Bookmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProducerViewProps {
  profile: ProfileData;
}

export function ProducerView({ profile }: ProducerViewProps) {
  // Calculate statistics from filmography
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
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden grayscale flex-shrink-0">
                {profile.profilePhoto ? (
                  <ImageWithFallback
                    src={profile.profilePhoto}
                    alt={profile.stageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-muted" style={{ fontFamily: 'var(--font-serif)' }}>
                    {profile.stageName.charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  {profile.stageName}
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
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
              <Button variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
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
                  <span className="text-muted">Availability:</span> <Badge variant="secondary" className="text-xs">{profile.availability || 'Not specified'}</Badge>
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
                  <Tooltip />
                  <Bar dataKey="value" fill="#18181b" />
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
                  <Tooltip />
                  <Bar dataKey="value" fill="#52525b" />
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
                  <Tooltip />
                  <Bar dataKey="value" fill="#71717a" />
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
