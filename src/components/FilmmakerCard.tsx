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
            width={100}
            height={100}
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
      </div>

      <style jsx>{`
        .filmmaker-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
          text-align: center;
        }

        .filmmaker-card:hover {
          border-color: #e0e0e0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .filmmaker-photo {
          display: flex;
          justify-content: center;
        }

        .photo,
        .photo-initials {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .photo-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: white;
        }

        .filmmaker-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
          font-size: 0.875rem;
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

        @media (max-width: 767px) {
          .filmmaker-card {
            padding: 1.25rem;
          }
          
          .photo,
          .photo-initials {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </Link>
  );
}
