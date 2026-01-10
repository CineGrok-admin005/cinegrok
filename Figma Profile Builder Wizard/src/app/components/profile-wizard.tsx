import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { ProfileData, ROLE_OPTIONS, GENRE_OPTIONS, INDIAN_STATES, PROJECT_FORMATS, PROJECT_STATUSES, CREW_SCALES, PRONOUN_OPTIONS, COLLABORATION_OPTIONS, AVAILABILITY_OPTIONS, FilmographyEntry } from '../types/profile';
import { ChevronLeft, ChevronRight, Upload, Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/card';

interface ProfileWizardProps {
  onComplete: (data: ProfileData) => void;
}

export function ProfileWizard({ onComplete }: ProfileWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    filmography: [],
    primaryRoles: [],
    secondaryRoles: [],
    preferredGenres: []
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (formData.stageName && formData.email && formData.country && formData.primaryRoles && formData.primaryRoles.length > 0) {
      onComplete(formData as ProfileData);
    } else {
      alert('Please fill in all required fields: Stage Name, Email, Country, and at least one Primary Role');
    }
  };

  const toggleArrayItem = (field: keyof ProfileData, item: string, max?: number) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : max && currentArray.length >= max
        ? currentArray
        : [...currentArray, item];
    updateField(field, newArray);
  };

  const addFilmographyEntry = () => {
    const newEntry: FilmographyEntry = {
      id: Date.now().toString(),
      title: '',
      year: '',
      format: '',
      status: '',
      primaryRole: '',
      additionalRoles: [],
      crewScale: '',
      genres: [],
      synopsis: '',
      posterUrl: '',
      watchLink: ''
    };
    updateField('filmography', [...(formData.filmography || []), newEntry]);
  };

  const updateFilmographyEntry = (id: string, field: keyof FilmographyEntry, value: any) => {
    const updated = formData.filmography?.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    updateField('filmography', updated);
  };

  const deleteFilmographyEntry = (id: string) => {
    updateField('filmography', formData.filmography?.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Create Your Profile
          </h1>
          <p className="mt-2 text-secondary" style={{ fontFamily: 'var(--font-sans)' }}>
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Progress value={progress} className="h-1" />
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 bg-accent rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted" />
                    </div>
                    <Input type="file" accept="image/*" className="flex-1" />
                  </div>
                  <p className="text-sm text-muted mt-1">Max 5MB. Square format recommended.</p>
                </div>

                <div>
                  <Label>Legal Name</Label>
                  <Input
                    value={formData.legalName || ''}
                    onChange={(e) => updateField('legalName', e.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label>Stage/Screen Name *</Label>
                  <Input
                    value={formData.stageName || ''}
                    onChange={(e) => updateField('stageName', e.target.value)}
                    placeholder="Required"
                    required
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Required"
                    required
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Producer-only visible"
                  />
                </div>

                <div>
                  <Label>Pronouns</Label>
                  <Select value={formData.pronouns} onValueChange={(value) => updateField('pronouns', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRONOUN_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Country *</Label>
                  <Input
                    value={formData.country || ''}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="Required"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current State</Label>
                    <Select value={formData.currentState} onValueChange={(value) => updateField('currentState', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Native State</Label>
                    <Select value={formData.nativeState} onValueChange={(value) => updateField('nativeState', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current City</Label>
                    <Input
                      value={formData.currentCity || ''}
                      onChange={(e) => updateField('currentCity', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Native City/Hometown</Label>
                    <Input
                      value={formData.nativeCity || ''}
                      onChange={(e) => updateField('nativeCity', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Languages Known</Label>
                  <Input
                    value={formData.languages || ''}
                    onChange={(e) => updateField('languages', e.target.value)}
                    placeholder="e.g., Hindi, English, Tamil"
                  />
                </div>

                <div>
                  <Label>Education & Training</Label>
                  <Textarea
                    value={formData.educationTraining || ''}
                    onChange={(e) => updateField('educationTraining', e.target.value)}
                    rows={4}
                    placeholder="Brief overview of your education and training"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Professional Details</h2>

              <div className="space-y-4">
                <div>
                  <Label>Primary Roles * (Select up to 2)</Label>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ROLE_OPTIONS.map(role => (
                      <label key={role} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.primaryRoles?.includes(role)}
                          onCheckedChange={() => toggleArrayItem('primaryRoles', role, 2)}
                          disabled={!formData.primaryRoles?.includes(role) && (formData.primaryRoles?.length || 0) >= 2}
                        />
                        <span className="text-sm">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Secondary Roles (Select up to 2)</Label>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ROLE_OPTIONS.map(role => (
                      <label key={role} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.secondaryRoles?.includes(role)}
                          onCheckedChange={() => toggleArrayItem('secondaryRoles', role, 2)}
                          disabled={!formData.secondaryRoles?.includes(role) && (formData.secondaryRoles?.length || 0) >= 2}
                        />
                        <span className="text-sm">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Years Active</Label>
                  <Input
                    value={formData.yearsActive || ''}
                    onChange={(e) => updateField('yearsActive', e.target.value)}
                    placeholder="e.g., 2015 - Present"
                  />
                </div>

                <div>
                  <Label>Preferred Genres</Label>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {GENRE_OPTIONS.map(genre => (
                      <label key={genre} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.preferredGenres?.includes(genre)}
                          onCheckedChange={() => toggleArrayItem('preferredGenres', genre)}
                        />
                        <span className="text-sm">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Visual/Narrative Style</Label>
                  <Textarea
                    value={formData.visualStyle || ''}
                    onChange={(e) => updateField('visualStyle', e.target.value)}
                    rows={3}
                    placeholder="Describe your unique visual or narrative approach"
                  />
                </div>

                <div>
                  <Label>Creative Influences</Label>
                  <Input
                    value={formData.creativeInfluences || ''}
                    onChange={(e) => updateField('creativeInfluences', e.target.value)}
                    placeholder="Directors, artists, movements that inspire you"
                  />
                </div>

                <div>
                  <Label>Creative Philosophy</Label>
                  <Textarea
                    value={formData.creativePhilosophy || ''}
                    onChange={(e) => updateField('creativePhilosophy', e.target.value)}
                    rows={3}
                    placeholder="Your approach to filmmaking"
                  />
                </div>

                <div>
                  <Label>Belief About Cinema</Label>
                  <Textarea
                    value={formData.beliefAboutCinema || ''}
                    onChange={(e) => updateField('beliefAboutCinema', e.target.value)}
                    rows={3}
                    placeholder="What cinema means to you"
                  />
                </div>

                <div>
                  <Label>Message or Intent</Label>
                  <Textarea
                    value={formData.messageOrIntent || ''}
                    onChange={(e) => updateField('messageOrIntent', e.target.value)}
                    rows={3}
                    placeholder="What you aim to communicate through your work"
                  />
                </div>

                <div>
                  <Label>Creative Signature</Label>
                  <Input
                    value={formData.creativeSignature || ''}
                    onChange={(e) => updateField('creativeSignature', e.target.value)}
                    placeholder="A distinctive element in your work"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Open to Collaborations</Label>
                    <Select value={formData.openToCollaborations} onValueChange={(value) => updateField('openToCollaborations', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLABORATION_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Availability</Label>
                    <Select value={formData.availability} onValueChange={(value) => updateField('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABILITY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Preferred Work Location</Label>
                  <Input
                    value={formData.preferredWorkLocation || ''}
                    onChange={(e) => updateField('preferredWorkLocation', e.target.value)}
                    placeholder="e.g., Mumbai, Remote, Pan-India"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Filmography</h2>
                <Button onClick={addFilmographyEntry} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Film
                </Button>
              </div>

              {formData.filmography && formData.filmography.length > 0 ? (
                <div className="space-y-6">
                  {formData.filmography.map((entry, index) => (
                    <Card key={entry.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
                          Film {index + 1}
                        </h3>
                        <Button
                          onClick={() => deleteFilmographyEntry(entry.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Film Title</Label>
                            <Input
                              value={entry.title}
                              onChange={(e) => updateFilmographyEntry(entry.id, 'title', e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>Year</Label>
                            <Input
                              value={entry.year}
                              onChange={(e) => updateFilmographyEntry(entry.id, 'year', e.target.value)}
                              placeholder="e.g., 2023"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Project Format</Label>
                            <Select
                              value={entry.format}
                              onValueChange={(value) => updateFilmographyEntry(entry.id, 'format', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                {PROJECT_FORMATS.map(format => (
                                  <SelectItem key={format} value={format}>{format}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Production Status</Label>
                            <Select
                              value={entry.status}
                              onValueChange={(value) => updateFilmographyEntry(entry.id, 'status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {PROJECT_STATUSES.map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Primary Role</Label>
                          <Select
                            value={entry.primaryRole}
                            onValueChange={(value) => updateFilmographyEntry(entry.id, 'primaryRole', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Crew Scale</Label>
                          <Select
                            value={entry.crewScale}
                            onValueChange={(value) => updateFilmographyEntry(entry.id, 'crewScale', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select crew scale" />
                            </SelectTrigger>
                            <SelectContent>
                              {CREW_SCALES.map(scale => (
                                <SelectItem key={scale} value={scale}>{scale}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Synopsis</Label>
                          <Textarea
                            value={entry.synopsis}
                            onChange={(e) => updateFilmographyEntry(entry.id, 'synopsis', e.target.value)}
                            rows={3}
                            placeholder="Brief description of the film"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Poster URL</Label>
                            <Input
                              value={entry.posterUrl}
                              onChange={(e) => updateFilmographyEntry(entry.id, 'posterUrl', e.target.value)}
                              placeholder="https://"
                            />
                          </div>

                          <div>
                            <Label>Watch Link</Label>
                            <Input
                              value={entry.watchLink}
                              onChange={(e) => updateFilmographyEntry(entry.id, 'watchLink', e.target.value)}
                              placeholder="https://"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-accent rounded-lg">
                  <p className="text-muted">No films added yet. Click "Add Film" to get started.</p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Social Links</h2>

              <div className="space-y-4">
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={formData.instagram || ''}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <Label>YouTube</Label>
                  <Input
                    value={formData.youtube || ''}
                    onChange={(e) => updateField('youtube', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>

                <div>
                  <Label>IMDb</Label>
                  <Input
                    value={formData.imdb || ''}
                    onChange={(e) => updateField('imdb', e.target.value)}
                    placeholder="https://imdb.com/name/nm..."
                  />
                </div>

                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={formData.linkedin || ''}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <Label>Twitter/X</Label>
                  <Input
                    value={formData.twitter || ''}
                    onChange={(e) => updateField('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={formData.facebook || ''}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label>Personal Website</Label>
                  <Input
                    value={formData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <Label>Letterboxd</Label>
                  <Input
                    value={formData.letterboxd || ''}
                    onChange={(e) => updateField('letterboxd', e.target.value)}
                    placeholder="https://letterboxd.com/yourprofile"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Education (Detailed)</h2>

              <div className="space-y-4">
                <div>
                  <Label>Schooling (10th)</Label>
                  <Input
                    value={formData.schooling || ''}
                    onChange={(e) => updateField('schooling', e.target.value)}
                    placeholder="School name, year"
                  />
                </div>

                <div>
                  <Label>Higher Secondary (12th)</Label>
                  <Input
                    value={formData.higherSecondary || ''}
                    onChange={(e) => updateField('higherSecondary', e.target.value)}
                    placeholder="School/College name, year"
                  />
                </div>

                <div>
                  <Label>Undergraduate</Label>
                  <Input
                    value={formData.undergraduate || ''}
                    onChange={(e) => updateField('undergraduate', e.target.value)}
                    placeholder="Degree, Institution, year"
                  />
                </div>

                <div>
                  <Label>Postgraduate</Label>
                  <Input
                    value={formData.postgraduate || ''}
                    onChange={(e) => updateField('postgraduate', e.target.value)}
                    placeholder="Degree, Institution, year"
                  />
                </div>

                <div>
                  <Label>PhD</Label>
                  <Input
                    value={formData.phd || ''}
                    onChange={(e) => updateField('phd', e.target.value)}
                    placeholder="Field, Institution, year"
                  />
                </div>

                <div>
                  <Label>Certifications/Workshops</Label>
                  <Textarea
                    value={formData.certifications || ''}
                    onChange={(e) => updateField('certifications', e.target.value)}
                    rows={4}
                    placeholder="List any workshops, certifications, or specialized training"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Preview & Publish</h2>

              <Card className="p-6 bg-accent">
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Profile Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted">Name:</span> {formData.stageName || 'Not provided'}
                  </div>
                  <div>
                    <span className="text-muted">Email:</span> {formData.email || 'Not provided'}
                  </div>
                  <div>
                    <span className="text-muted">Primary Roles:</span> {formData.primaryRoles?.join(', ') || 'Not provided'}
                  </div>
                  <div>
                    <span className="text-muted">Location:</span> {formData.currentCity || formData.currentState || formData.country || 'Not provided'}
                  </div>
                  <div>
                    <span className="text-muted">Films Added:</span> {formData.filmography?.length || 0}
                  </div>
                  <div>
                    <span className="text-muted">Availability:</span> {formData.availability || 'Not specified'}
                  </div>
                </div>
              </Card>

              <div className="bg-accent p-6 rounded-lg">
                <h4 className="mb-3">Auto-Generated Bio</h4>
                <p className="text-sm leading-relaxed">
                  {formData.stageName} is {formData.primaryRoles && formData.primaryRoles.length > 0 ? `a ${formData.primaryRoles.join(' and ')}` : 'a filmmaker'} based in {formData.currentCity || formData.currentState || formData.country}.
                  {formData.yearsActive && ` Active since ${formData.yearsActive},`} they have worked on {formData.filmography?.length || 0} project{formData.filmography?.length !== 1 ? 's' : ''}.
                  {formData.preferredGenres && formData.preferredGenres.length > 0 && ` Their work spans ${formData.preferredGenres.join(', ')}.`}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  Once published, your profile will be visible to all users. Producers will have access to additional professional details when logged in.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Publish Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}