/**
 * Filmmaker Profile Page
 * 
 * Server component with dynamic metadata
 * Fixes for Next.js 15: async params, no styled-jsx
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabase';
import { Filmmaker } from '@/lib/api';
import {
  calculateTier,
  getRoleColors,
  getTierStyle,
  getInitials,
  formatLocation,
  hasSocialLinks,
  getSocialLinks,
  formatFilms,
  shouldShowSection,
} from '@/lib/utils';
import { getUser } from '@/lib/supabase-server';
import CollabButton from '@/components/CollabButton';
import './profile.css';

// Revalidate every hour
export const revalidate = 3600;

async function getFilmmaker(id: string): Promise<Filmmaker | null> {
  const { data, error } = await supabase
    .from('filmmakers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching filmmaker:', error);
    return null;
  }

  return data;
}

// Next.js 15: params is now a Promise
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filmmaker = await getFilmmaker(id);

  if (!filmmaker) {
    return {
      title: 'Filmmaker Not Found',
    };
  }

  return {
    title: `${filmmaker.name} - ${filmmaker.raw_form_data.roles || 'Filmmaker'} | CineGrok`,
    description: filmmaker.ai_generated_bio?.slice(0, 160) || `Profile of ${filmmaker.name}`,
  };
}

export default async function FilmmakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filmmaker = await getFilmmaker(id);
  const user = await getUser();

  if (!filmmaker) {
    notFound();
  }

  const { raw_form_data, ai_generated_bio, name } = filmmaker;
  const tier = calculateTier(raw_form_data);
  const tierStyle = getTierStyle(tier);
  const roleColors = getRoleColors(raw_form_data.roles);
  const location = formatLocation(raw_form_data);
  const photoUrl = raw_form_data.profile_photo_url;
  const socialLinks = getSocialLinks(raw_form_data);
  const films = formatFilms(raw_form_data.films);

  return (
    <div className="profile-page">
      <Navigation />

      <div className="container profile-container">
        {/* Back Button */}
        <Link href="/" className="back-button">
          ← Back to Home
        </Link>

        {/* Header Section */}
        <header
          className="profile-header"
          style={{ borderTopColor: roleColors.primary }}
        >
          {/* Tier Badge Removed as per user request */}

          <div className="header-content">
            {/* Profile Photo */}
            <div className="profile-photo-section">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  width={200}
                  height={200}
                  className="profile-photo"
                  priority
                />
              ) : (
                <div
                  className="profile-photo-initials"
                  style={{ background: roleColors.gradient }}
                >
                  {getInitials(name)}
                </div>
              )}
            </div>

            {/* Name and Role */}
            <div className="profile-info">
              <h1 className="profile-name">{name}</h1>

              {raw_form_data.roles && (
                <div className="profile-role">
                  <span
                    className="role-indicator"
                    style={{ backgroundColor: roleColors.primary }}
                  />
                  {Array.isArray(raw_form_data.roles) ? raw_form_data.roles.join(', ') : raw_form_data.roles}
                </div>
              )}

              {location && (
                <div className="profile-location">
                  📍 {location}
                </div>
              )}

              {/* Social Links */}
              {hasSocialLinks(raw_form_data) && (
                <div className="social-links">
                  {socialLinks.website && (
                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-icon" title="Website">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                  )}
                  {socialLinks.imdb && (
                    <a href={socialLinks.imdb} target="_blank" rel="noopener noreferrer" className="social-icon" title="IMDb">
                      <span style={{ fontWeight: 900, fontSize: '18px' }}>IMDb</span>
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="profile-content">
          {/* Left Column - Bio and Films */}
          <div className="content-main">
            {/* AI-Generated Bio */}
            {ai_generated_bio && (
              <section className="bio-section">
                <h2>About</h2>
                <div className="bio-text">
                  {ai_generated_bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Selected Work */}
            {films.length > 0 && (
              <section className="films-section">
                <h2>Selected Work</h2>
                <div className="films-grid">
                  {films.map((film, index) => (
                    <div key={index} className="film-card">
                      {film.poster ? (
                        <Image
                          src={film.poster}
                          alt={film.title}
                          width={300}
                          height={450}
                          className="film-poster"
                        />
                      ) : (
                        <div className="film-poster-placeholder">
                          🎬
                        </div>
                      )}
                      <div className="film-info">
                        <h3 className="film-title">{film.title}</h3>
                        <p className="film-meta">
                          {film.role && <span>{film.role}</span>}
                          {film.year && <span> • {film.year}</span>}
                        </p>
                        {film.link && (
                          <a href={film.link} target="_blank" rel="noopener noreferrer" className="film-link">
                            Watch →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Quick Facts */}
          <aside className="content-sidebar">
            {/* Creative Style */}
            {(shouldShowSection(raw_form_data.genres) || shouldShowSection(raw_form_data.style)) && (
              <div className="info-box">
                <h3>Creative Style</h3>
                {raw_form_data.genres && (
                  <div className="info-item">
                    <strong>Genres:</strong>
                    <p>{Array.isArray(raw_form_data.genres) ? raw_form_data.genres.join(', ') : raw_form_data.genres}</p>
                  </div>
                )}
                {raw_form_data.style && (
                  <div className="info-item">
                    <strong>Style:</strong>
                    <p>{raw_form_data.style}</p>
                  </div>
                )}
                {raw_form_data.influences && (
                  <div className="info-item">
                    <strong>Influences:</strong>
                    <p>{raw_form_data.influences}</p>
                  </div>
                )}
              </div>
            )}

            {/* Awards & Recognition */}
            {(shouldShowSection(raw_form_data.awards) || shouldShowSection(raw_form_data.screenings)) && (
              <div className="info-box">
                <h3>Festivals & Awards</h3>
                {raw_form_data.screenings && (
                  <div className="info-item">
                    <strong>Screenings:</strong>
                    <p>{raw_form_data.screenings}</p>
                  </div>
                )}
                {raw_form_data.awards && (
                  <div className="info-item">
                    <strong>Awards:</strong>
                    <p>{raw_form_data.awards}</p>
                  </div>
                )}
              </div>
            )}

            {/* Philosophy */}
            {shouldShowSection(raw_form_data.philosophy) && (
              <div className="info-box">
                <h3>Creative Philosophy</h3>
                <p className="quote">{raw_form_data.philosophy}</p>
              </div>
            )}

            {/* Collaboration */}
            {/* Collaboration */}
            {raw_form_data.open_to_collab === 'Yes' && (
              <div className="info-box collab-box">
                <h3>Open to Collaborations</h3>
                <p>This filmmaker is currently open to new projects and collaborations.</p>

                {/* Collab Button Logic */}
                <CollabButton
                  email={raw_form_data.email || raw_form_data.contact_method}
                  isLoggedIn={!!user}
                />

                {raw_form_data.contact_method && (
                  <p className="contact-info">
                    <strong>Contact:</strong> {raw_form_data.contact_method}
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </div >
    </div >
  );
}
