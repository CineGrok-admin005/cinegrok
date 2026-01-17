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
      data-testid="filmmaker-card"
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


    </Link>
  );
}
