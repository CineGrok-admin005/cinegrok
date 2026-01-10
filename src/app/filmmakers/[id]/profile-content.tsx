'use client';

/**
 * Filmmaker Profile Content - Client Component
 * Handles the styled-jsx styling and interactivity
 */

import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import {
  getInitials,
  hasSocialLinks,
  getSocialLinks,
} from '@/lib/utils';
import { Filmmaker } from '@/lib/api';
import { MapPin, Globe, Youtube, Instagram, Twitter, Film, Clapperboard, Linkedin } from 'lucide-react';

interface FilmmakerProfileContentProps {
  filmmaker: Filmmaker;
  tierStyle: {
    icon: string;
    badge: string;
    bgColor: string;
    color: string;
    borderColor: string;
  };
  roleColors: {
    primary: string;
    gradient: string;
  };
  location: string | null;
  socialLinks: any;
  films: any[];
  shouldShowSection: (value: any) => boolean;
}

export default function FilmmakerProfileContent({
  filmmaker,
  tierStyle,
  roleColors,
  location,
  socialLinks,
  films,
  shouldShowSection,
}: FilmmakerProfileContentProps) {
  const { raw_form_data, ai_generated_bio, name } = filmmaker;
  const photoUrl = raw_form_data.profile_photo_url;

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
            {tierStyle.badge}
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
                  <MapPin size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  {location}
                </div>
              )}

              {/* Social Links */}
              {hasSocialLinks(raw_form_data) && (
                <div className="social-links">
                  {socialLinks.website && (
                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-icon" title="Website">
                      <Globe size={24} />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
                      <Youtube size={24} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                      <Instagram size={24} />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                      <Twitter size={24} />
                    </a>
                  )}
                  {socialLinks.imdb && (
                    <a href={socialLinks.imdb} target="_blank" rel="noopener noreferrer" className="social-icon" title="IMDb">
                      <Film size={24} />
                    </a>
                  )}
                  {socialLinks.letterboxd && (
                    <a href={socialLinks.letterboxd} target="_blank" rel="noopener noreferrer" className="social-icon" title="Letterboxd">
                      <Clapperboard size={24} />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                      <Linkedin size={24} />
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
                {ai_generated_bio && ai_generated_bio.split('\n\n').map((paragraph, index) => (
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
                          <Clapperboard size={32} />
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

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: var(--bg-accent);
        }

        .profile-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .back-button:hover {
          color: var(--accent-blue);
        }

        .profile-header {
          position: relative;
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-md);
          border-top: 6px solid;
        }

        .tier-badge-large {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          border: 3px solid;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
        }

        .profile-photo,
        .profile-photo-initials {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--border-light);
        }

        .profile-photo-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          color: white;
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-role {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .role-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .profile-location {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .social-icon {
          font-size: 1.5rem;
          transition: transform 0.2s;
          text-decoration: none;
        }

        .social-icon:hover {
          transform: scale(1.2);
        }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .bio-section {
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .bio-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .bio-text p {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .films-section {
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          margin-top: 2rem;
        }

        .films-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .films-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .film-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--border-radius);
        }

        .film-poster,
        .film-poster-placeholder {
          width: 100px;
          height: 150px;
          border-radius: 4px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .film-poster-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--border-light);
          font-size: 2rem;
        }

        .film-info {
          flex: 1;
        }

        .film-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .film-meta {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .film-link {
          font-size: 0.875rem;
          color: var(--accent-blue);
          text-decoration: none;
        }

        .film-link:hover {
          text-decoration: underline;
        }

        .info-box {
          background: var(--bg-primary);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
        }

        .info-box h3 {
          font-size: 1.125rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .info-item {
          margin-bottom: 1rem;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-item strong {
          display: block;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .info-item p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }

        .quote {
          font-style: italic;
          color: var(--text-secondary);
          border-left: 3px solid var(--accent-gold);
          padding-left: 1rem;
        }

        .collab-box {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 2px solid #86efac;
        }

        .contact-info {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        @media (min-width: 1024px) {
          .header-content {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
          }

          .social-links {
            justify-content: flex-start;
          }

          .profile-photo,
          .profile-photo-initials {
            width: 200px;
            height: 200px;
            font-size: 4rem;
          }

          .profile-role {
            justify-content: flex-start;
          }

          .profile-content {
            grid-template-columns: 2fr 1fr;
          }

          .films-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .tier-badge-large {
            top: 1rem;
            right: 1rem;
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }

          .profile-name {
            font-size: 2rem;
          }

          .profile-role {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
