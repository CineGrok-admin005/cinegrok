/**
 * ProjectCard.tsx
 * 
 * Card for displaying project in browse/list view
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

export interface ProjectData {
  id: string;
  title: string;
  project_code: string;
  description: string;
  shoot_location: string;
  shoot_start_date: string;
  shoot_end_date: string;
  budget_min: number | null;
  budget_max: number | null;
  is_paid: boolean;
  applications_open: boolean;
  filmmakers?: {
    id: string;
    name: string;
    profile_url: string | null;
  };
}

interface ProjectCardProps {
  project: ProjectData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const creator = project.filmmakers as any;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="project-card" style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'block',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#ccc';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#e5e5e5';
        }}
      >
        {/* Creator Info */}
        {creator && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            {creator.profile_url ? (
              <Image
                src={creator.profile_url}
                alt={creator.name}
                width={32}
                height={32}
                style={{ borderRadius: '50%', marginRight: '0.75rem' }}
              />
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ddd',
                  marginRight: '0.75rem',
                }}
              />
            )}
            <span style={{ fontSize: '0.9rem', color: '#666' }}>by {creator.name}</span>
          </div>
        )}

        {/* Project Title */}
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#222' }}>
          {project.title}
        </h3>

        {/* Code Badge */}
        <div style={{ display: 'inline-block', background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', color: '#666' }}>
          {project.project_code}
        </div>

        {/* Description */}
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>
          {project.description?.substring(0, 120)}
          {project.description?.length > 120 ? '...' : ''}
        </p>

        {/* Location & Dates */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#777', marginBottom: '1rem' }}>
          {project.shoot_location && (
            <div><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{project.shoot_location}</div>
          )}
          {project.shoot_start_date && (
            <div><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />{project.shoot_start_date}</div>
          )}
        </div>

        {/* Budget */}
        {project.is_paid && project.budget_min && (
          <div style={{ fontSize: '0.9rem', color: '#333', marginBottom: '1rem', fontWeight: '500' }}>
            <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} />${project.budget_min}k - ${project.budget_max}k
          </div>
        )}

        {/* Status */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {project.applications_open ? (
            <span style={{ background: '#d4edda', color: '#155724', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
              Open
            </span>
          ) : (
            <span style={{ background: '#f8d7da', color: '#721c24', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
              Closed
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
