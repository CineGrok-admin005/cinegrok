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

  if (!filmmaker || !filmmaker.ai_generated_bio) {
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
          {/* Tier Badge */}
          <div
            className="tier-badge-large"
            style={{
              backgroundColor: tierStyle.bgColor,
              color: tierStyle.color,
              borderColor: tierStyle.borderColor,
            }}
          >
            {tierStyle.icon} {tierStyle.badge}
          </div>

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
                  {raw_form_data.roles}
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
                      🌐
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
                      ▶️
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                      📸
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                      🐦
                    </a>
                  )}
                  {socialLinks.imdb && (
                    <a href={socialLinks.imdb} target="_blank" rel="noopener noreferrer" className="social-icon" title="IMDb">
                      🎬
                    </a>
                  )}
                  {socialLinks.letterboxd && (
                    <a href={socialLinks.letterboxd} target="_blank" rel="noopener noreferrer" className="social-icon" title="Letterboxd">
                      🎞️
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                      💼
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
            <section className="bio-section">
              <h2>About</h2>
              <div className="bio-text">
                {ai_generated_bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

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
                    <p>{raw_form_data.genres}</p>
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
            {raw_form_data.open_to_collab === 'Yes' && (
              <div className="info-box collab-box">
                <h3>Open to Collaborations</h3>
                <p>This filmmaker is currently open to new projects and collaborations.</p>
                {raw_form_data.contact_method && (
                  <p className="contact-info">
                    <strong>Contact:</strong> {raw_form_data.contact_method}
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
