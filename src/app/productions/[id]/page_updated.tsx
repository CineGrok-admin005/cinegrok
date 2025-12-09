/**
 * /productions/[id]
 * Production detail page - View production details, apply for roles
 * Shows status badges, announcements, and role listings
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import './production-detail.css';

interface Role {
  id: string;
  role_title: string;
  role_category: string;
  experience_level: string;
  quantity_needed: number;
  role_description: string;
  application_count: number;
}

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
  creator_id: string;
  filmmaker: {
    name: string;
    profile_url: string;
  };
}

const STATUS_DISPLAY = {
  casting: { label: 'Casting', color: '#FF6B6B', icon: '🎬' },
  preproduction: { label: 'Pre-Production', color: '#4ECDC4', icon: '📋' },
  shooting: { label: 'Shooting', color: '#FFE66D', icon: '🎥' },
  postproduction: { label: 'Post-Production', color: '#95E1D3', icon: '🎞️' },
  completed: { label: 'Completed', color: '#A8E6CF', icon: '✓' },
};

export default function ProductionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [production, setProduction] = useState<Production | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Application form
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    portfolio_url: '',
    cover_letter: '',
  });
  const [submittingApp, setSubmittingApp] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      await fetchProduction(user?.id);
    };

    init();
  }, [params.id]);

  const fetchProduction = async (userId?: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/projects/${params.id}`);

      if (!response.ok) {
        throw new Error('Production not found');
      }

      const { project: productionData, roles: rolesData } = await response.json();
      setProduction(productionData);
      setRoles(rolesData || []);

      if (userId && productionData.creator_id === userId) {
        setIsCreator(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (roleId: string) => {
    try {
      setSubmittingApp(true);
      const response = await fetch(`/api/v1/projects/${params.id}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: roleId,
          ...applicationData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({ portfolio_url: '', cover_letter: '' });
      setSelectedRole(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) return <div className="loading-container">Loading production...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!production) return <div className="error-container">Production not found</div>;

  const statusInfo = STATUS_DISPLAY[production.status];

  return (
    <div className="production-detail-page">
      {/* Header with Status Badge */}
      <div className="detail-header">
        <div className="header-content">
          <div className="title-section">
            <div className="status-badge-large" style={{ backgroundColor: statusInfo.color }}>
              {statusInfo.icon} {statusInfo.label}
            </div>
            <h1>{production.title}</h1>
            <p className="project-code">{production.project_code}</p>
          </div>

          {isCreator && (
            <div className="creator-actions">
              <button
                onClick={() => router.push(`/productions/${params.id}/manage`)}
                className="btn btn-primary"
              >
                📊 Manage Applications
              </button>
              <button
                onClick={() => router.push(`/productions/${params.id}/edit`)}
                className="btn btn-secondary"
              >
                ✏️ Edit Production
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="production-container">
        <div className="main-content">
          {/* Description & Announcements */}
          <section className="section">
            <h2>About This Production</h2>
            <p className="description">{production.description}</p>

            {production.announcements && (
              <div className="announcements-box">
                <h3>📢 Latest Updates</h3>
                <p>{production.announcements}</p>
              </div>
            )}
          </section>

          {/* Production Details */}
          <section className="section">
            <h2>Production Details</h2>
            <div className="details-grid-large">
              {production.shoot_location && (
                <div className="detail-item">
                  <span className="label">📍 Location</span>
                  <span className="value">{production.shoot_location}</span>
                </div>
              )}
              {production.shoot_start_date && (
                <div className="detail-item">
                  <span className="label">📅 Shoot Dates</span>
                  <span className="value">
                    {production.shoot_start_date}
                    {production.shoot_end_date && ` to ${production.shoot_end_date}`}
                  </span>
                </div>
              )}
              {production.is_paid && (
                <div className="detail-item">
                  <span className="label">💰 Budget</span>
                  <span className="value">${production.budget_min}k - ${production.budget_max}k</span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">👥 Hiring Status</span>
                <span className="value">
                  {production.applications_open ? '🟢 Open for Applications' : '🔴 Closed'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">📝 Production Status</span>
                <span className="value">{statusInfo.label}</span>
              </div>
            </div>
          </section>

          {/* Creator Info */}
          <section className="section">
            <h2>Created By</h2>
            <div className="creator-card">
              <div className="creator-info-content">
                <h3>{production.filmmaker.name}</h3>
                <p>Director/Producer</p>
              </div>
              <button
                onClick={() => router.push(`/filmmakers/${production.filmmaker.profile_url}`)}
                className="btn btn-secondary btn-sm"
              >
                View Profile
              </button>
            </div>
          </section>

          {/* Roles Section */}
          <section className="section">
            <h2>Open Roles ({roles.length})</h2>

            {production.applications_open ? (
              <p className="status-text">🎬 This production is actively casting. Browse available roles below!</p>
            ) : (
              <p className="status-text">🔴 This production is no longer accepting applications.</p>
            )}

            {roles.length === 0 ? (
              <div className="empty-state">
                <p>No roles posted yet. Check back soon!</p>
              </div>
            ) : (
              <div className="roles-list">
                {roles.map((role) => (
                  <div key={role.id} className="role-card">
                    <div className="role-header">
                      <div>
                        <h3>{role.role_title}</h3>
                        <p className="role-meta">
                          {role.role_category} • {role.experience_level} • {role.quantity_needed} needed
                        </p>
                      </div>
                      <div className="role-badge">
                        {role.application_count} application{role.application_count !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {role.role_description && (
                      <p className="role-description">{role.role_description}</p>
                    )}

                    {production.applications_open && !isCreator && (
                      <button
                        onClick={() => {
                          setSelectedRole(role.id);
                          setShowApplicationForm(true);
                        }}
                        className="btn btn-primary btn-apply"
                      >
                        Apply for This Role
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Quick Info</h3>
            <div className="quick-info">
              <div className="info-item">
                <span className="info-label">Production Code</span>
                <span className="info-value">{production.project_code}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{statusInfo.label}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Hiring</span>
                <span className="info-value">
                  {production.applications_open ? '✅ Open' : '❌ Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedRole && production.applications_open && (
        <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for This Role</h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>

            <div className="form-section">
              <label>Portfolio / Reel Link *</label>
              <input
                type="url"
                placeholder="https://vimeo.com/... or https://www.youtube.com/..."
                value={applicationData.portfolio_url}
                onChange={(e) => setApplicationData({ ...applicationData, portfolio_url: e.target.value })}
                required
              />
            </div>

            <div className="form-section">
              <label>Cover Letter (Optional)</label>
              <textarea
                placeholder="Tell the producer why you're perfect for this role. Share your experience and vision..."
                value={applicationData.cover_letter}
                onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                rows={4}
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitApplication(selectedRole)}
                disabled={submittingApp || !applicationData.portfolio_url}
                className="btn btn-primary"
              >
                {submittingApp ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
