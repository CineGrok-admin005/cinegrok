/**
 * FilmmakerCard Component
 * 
 * Clean card design matching reference UI
 * Circular photos, minimal design, subtle accents
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Filmmaker } from '@/lib/api';
import {
  calculateTier,
  getRoleColors,
  getTierStyle,
  getInitials,
  formatLocation,
  truncate,
} from '@/lib/utils';

interface FilmmakerCardProps {
  filmmaker: Filmmaker;
  variant?: 'grid' | 'list';
}

export default function FilmmakerCard({ filmmaker, variant = 'grid' }: FilmmakerCardProps) {
  const { raw_form_data, ai_generated_bio, name, id } = filmmaker;
  const tier = calculateTier(raw_form_data);
  const tierStyle = getTierStyle(tier);
  const roleColors = getRoleColors(raw_form_data.roles);
  const location = formatLocation(raw_form_data);
  const photoUrl = raw_form_data.profile_photo_url;

  const bioSnippet = ai_generated_bio
    ? truncate(ai_generated_bio, 120)
    : 'Building their portfolio...';

  return (
    <Link
      href={`/filmmakers/${id}`}
      className="filmmaker-card"
    >
      {/* Profile Photo */}
      <div className="filmmaker-photo">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={120}
            height={120}
            className="photo"
          />
        ) : (
          <div
            className="photo-initials"
            style={{ background: 'var(--text-secondary)' }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Filmmaker Info */}
      <div className="filmmaker-info">
        <h3 className="filmmaker-name">{name}</h3>

        <div className="filmmaker-meta">
          {raw_form_data.roles && (
            <div className="role">
              {Array.isArray(raw_form_data.roles)
                ? raw_form_data.roles.join(', ')
                : raw_form_data.roles}
            </div>
          )}

          {location && (
            <div className="location">{location}</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .filmmaker-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--border-radius-md);
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
          text-align: center;
          height: 100%;
          min-height: auto;
        }

        .filmmaker-card:hover {
          border-color: var(--text-primary);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          background: #fafafa;
        }

        .filmmaker-photo {
          display: flex;
          justify-content: center;
        }

        .photo,
        .photo-initials {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border);
        }

        .photo-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 400;
          color: white;
          font-family: var(--font-heading);
        }

        .filmmaker-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .filmmaker-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          text-align: center;
        }

        .filmmaker-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-body);
          text-align: center;
        }

        .role {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .location {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-style: italic;
        }

        @media (max-width: 767px) {
          .filmmaker-card {
            padding: 1.5rem;
          }
          
          .photo,
          .photo-initials {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </Link>
  );
}
