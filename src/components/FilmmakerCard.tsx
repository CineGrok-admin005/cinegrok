/**
 * FilmmakerCard Component
 * 
 * Clean, minimalist card design with subtle theme colors
 * Role-based accent colors used sparingly for visual hierarchy
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
    ? truncate(ai_generated_bio, 100)
    : 'Building their portfolio...';

  return (
    <Link
      href={`/filmmakers/${id}`}
      className="filmmaker-card"
    >
      {/* Profile Photo or Initials */}
      <div className="filmmaker-photo">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={80}
            height={80}
            className="photo"
          />
        ) : (
          <div
            className="photo-initials"
            style={{ background: roleColors.gradient }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Filmmaker Info */}
      <div className="filmmaker-info">
        <h3 className="filmmaker-name">{name}</h3>

        {/* Role and Location */}
        <div className="filmmaker-meta">
          {raw_form_data.roles && (
            <span className="role">{raw_form_data.roles}</span>
          )}
          {location && raw_form_data.roles && <span className="separator">•</span>}
          {location && (
            <span className="location">{location}</span>
          )}
        </div>

        {/* Bio Snippet */}
        <p className="filmmaker-bio">{bioSnippet}</p>

        {/* Footer: Tier Badge and Film Count */}
        <div className="filmmaker-footer">
          <span
            className="tier-badge"
            style={{
              backgroundColor: tierStyle.bgColor,
              color: tierStyle.color,
            }}
          >
            {tierStyle.icon} {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </span>

          {raw_form_data.films && raw_form_data.films.length > 0 && (
            <span className="film-count">
              {raw_form_data.films.length} {raw_form_data.films.length === 1 ? 'film' : 'films'}
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        .filmmaker-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
          position: relative;
        }

        .filmmaker-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${roleColors.gradient};
          border-radius: 12px 12px 0 0;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .filmmaker-card:hover {
          border-color: #e0e0e0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .filmmaker-card:hover::before {
          opacity: 1;
        }

        .filmmaker-photo {
          display: flex;
          justify-content: center;
        }

        .photo,
        .photo-initials {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .photo-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 600;
          color: white;
        }

        .filmmaker-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        .filmmaker-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          color: #1a1a1a;
        }

        .filmmaker-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #666;
        }

        .role {
          font-weight: 500;
        }

        .separator {
          color: #ccc;
        }

        .location {
          color: #999;
        }

        .filmmaker-bio {
          font-size: 0.875rem;
          line-height: 1.5;
          color: #666;
          margin: 0;
        }

        .filmmaker-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f5f5f5;
        }

        .tier-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .film-count {
          font-size: 0.75rem;
          color: #999;
          font-weight: 500;
        }

        @media (max-width: 767px) {
          .filmmaker-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </Link>
  );
}
