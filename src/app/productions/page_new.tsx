/**
 * /productions
 * Browse all open productions
 * - Hero section with explanation
 * - Filter section (status, location, budget)
 * - Production cards with status badges
 * - CTA to create production (for logged in users)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import './productions.css';

interface Production {
  id: string;
  title: string;
  description: string;
  project_code: string;
  status: 'casting' | 'preproduction' | 'shooting' | 'postproduction' | 'completed';
  shoot_location: string;
  shoot_start_date: string;
  shoot_end_date: string;
  is_paid: boolean;
  budget_min: number;
  budget_max: number;
  applications_open: boolean;
  announcements: string;
  filmmaker: {
    name: string;
    profile_url: string;
  };
  rolesCount: number;
}

const STATUS_DISPLAY = {
  casting: { label: 'Casting', color: '#FF6B6B', icon: '🎬' },
  preproduction: { label: 'Pre-Production', color: '#4ECDC4', icon: '📋' },
  shooting: { label: 'Shooting', color: '#FFE66D', icon: '🎥' },
  postproduction: { label: 'Post-Production', color: '#95E1D3', icon: '🎞️' },
  completed: { label: 'Completed', color: '#A8E6CF', icon: '✓' },
};

export default function ProductionsBrowsePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const init = async () => {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      // Fetch productions
      await fetchProductions();
    };

    init();
  }, []);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/projects?status=open&limit=100');
      if (!response.ok) throw new Error('Failed to fetch productions');
      
      const { data } = await response.json();
      setProductions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter productions
  const filteredProductions = productions.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (locationFilter && !p.shoot_location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  const locations = [...new Set(productions.map(p => p.shoot_location).filter(Boolean))] as string[];

  return (
    <div className="productions-page">
      {/* HERO SECTION */}
      <div className="productions-hero">
        <div className="hero-content">
          <h1>Discover Active Productions</h1>
          <p className="hero-subtitle">
            Join incredible filmmakers and find your next opportunity. Browse productions across all stages—from casting to post-production.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🎬</span>
              <span>Discover Opportunities</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Connect with Creators</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Real Projects. Real Impact.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="productions-container">
        {/* CTA SECTION FOR LOGGED IN USERS */}
        {isLoggedIn && (
          <div className="cta-section">
            <div className="cta-content">
              <h2>Ready to Share Your Project?</h2>
              <p>Post a production and find the perfect cast and crew for your next film.</p>
            </div>
            <button onClick={() => router.push('/productions/new')} className="btn btn-primary btn-lg">
              + Create Production
            </button>
          </div>
        )}

        {/* LOGIN CTA FOR PUBLIC */}
        {!isLoggedIn && (
          <div className="cta-section cta-login">
            <div className="cta-content">
              <h2>Ready to Share Your Project?</h2>
              <p>Create an account to post a production and find the perfect cast and crew.</p>
            </div>
            <Link href="/auth/login" className="btn btn-primary btn-lg">
              Login to Create
            </Link>
          </div>
        )}

        {/* FILTER SECTION */}
        <div className="filter-section">
          <h3>Filter Productions</h3>
          
          <div className="filter-group">
            <label>Production Status</label>
            <div className="status-filters">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Productions
              </button>
              {Object.entries(STATUS_DISPLAY).map(([key, { label, icon }]) => (
                <button
                  key={key}
                  className={`filter-btn ${statusFilter === key ? 'active' : ''}`}
                  onClick={() => setStatusFilter(key)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-input"
            />
            {locationFilter === '' && locations.length > 0 && (
              <div className="location-suggestions">
                {locations.slice(0, 5).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationFilter(loc)}
                    className="suggestion-btn"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTIONS GRID */}
        {loading ? (
          <div className="loading">Loading productions...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : filteredProductions.length === 0 ? (
          <div className="no-results">
            <p>No productions found. Try adjusting your filters!</p>
            {!isLoggedIn && (
              <Link href="/auth/login" className="btn btn-secondary">
                Login to Create First Production
              </Link>
            )}
          </div>
        ) : (
          <div className="productions-grid">
            {filteredProductions.map((production) => {
              const statusInfo = STATUS_DISPLAY[production.status];
              return (
                <div key={production.id} className="production-card">
                  {/* Status Badge */}
                  <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                    {statusInfo.icon} {statusInfo.label}
                  </div>

                  {/* Card Content */}
                  <div className="card-header">
                    <h3>{production.title}</h3>
                    <p className="project-code">{production.project_code}</p>
                  </div>

                  {/* Description */}
                  <p className="description">
                    {production.description?.substring(0, 120)}
                    {production.description && production.description.length > 120 ? '...' : ''}
                  </p>

                  {/* Details Grid */}
                  <div className="details-grid">
                    {production.shoot_location && (
                      <div className="detail">
                        <span className="label">📍 Location</span>
                        <span className="value">{production.shoot_location}</span>
                      </div>
                    )}
                    {production.shoot_start_date && (
                      <div className="detail">
                        <span className="label">📅 Shoots</span>
                        <span className="value">{production.shoot_start_date}</span>
                      </div>
                    )}
                    {production.is_paid && (
                      <div className="detail">
                        <span className="label">💰 Budget</span>
                        <span className="value">${production.budget_min}k - ${production.budget_max}k</span>
                      </div>
                    )}
                    <div className="detail">
                      <span className="label">👥 Roles</span>
                      <span className="value">{production.rolesCount} open</span>
                    </div>
                  </div>

                  {/* Announcements if any */}
                  {production.announcements && (
                    <div className="announcements">
                      <p><strong>📢 Update:</strong> {production.announcements.substring(0, 80)}...</p>
                    </div>
                  )}

                  {/* Creator Info */}
                  <div className="creator-info">
                    <p>By <strong>{production.filmmaker.name}</strong></p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => router.push(`/productions/${production.id}`)}
                    className="btn btn-secondary btn-block"
                  >
                    View Details & Apply →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
