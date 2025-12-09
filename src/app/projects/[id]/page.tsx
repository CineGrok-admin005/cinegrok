/**
 * /projects/[id]
 * Project detail page
 * - For producers: Shows roles and applications dashboard
 * - For other filmmakers: Shows project details and apply button
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [project, setProject] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    portfolio_url: '',
    cover_letter: '',
  });
  const [submittingApp, setSubmittingApp] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch project and roles
      await fetchProject(user?.id);
    };

    init();
  }, [params.id]);

  const fetchProject = async (userId?: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/projects/${params.id}`);

      if (!response.ok) {
        throw new Error('Project not found');
      }

      const { project: projectData, roles: rolesData } = await response.json();
      setProject(projectData);
      setRoles(rolesData || []);

      // Check if current user is creator
      if (userId && projectData.creator_id === userId) {
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
      setError(err.message);
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: '#c33' }}>Error: {error}</div>;
  if (!project) return <div style={{ padding: '2rem' }}>Project not found</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Project Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1>{project.title}</h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Code: {project.project_code}</p>
          </div>
          {isCreator && (
            <button
              onClick={() => router.push(`/projects/${params.id}/manage`)}
              className="btn btn-secondary"
            >
              Manage Applications
            </button>
          )}
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333', marginTop: '1rem' }}>
          {project.description}
        </p>

        {/* Project Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          {project.shoot_location && (
            <div>
              <strong>Location</strong>
              <p>{project.shoot_location}</p>
            </div>
          )}
          {project.shoot_start_date && (
            <div>
              <strong>Shoot Dates</strong>
              <p>{project.shoot_start_date} to {project.shoot_end_date}</p>
            </div>
          )}
          {project.is_paid && (
            <div>
              <strong>Budget</strong>
              <p>${project.budget_min}k - ${project.budget_max}k</p>
            </div>
          )}
          <div>
            <strong>Status</strong>
            <p>{project.applications_open ? '🟢 Open' : '🔴 Closed'}</p>
          </div>
        </div>

        {/* Creator Info */}
        {project.filmmakers && (
          <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', marginTop: '2rem' }}>
            <strong>Created by</strong>
            <p>{project.filmmakers.name}</p>
          </div>
        )}
      </div>

      <hr />

      {/* Roles Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Roles Needed ({roles.length})</h2>

        {roles.length === 0 ? (
          <p>No roles posted yet</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {roles.map((role) => (
              <div
                key={role.id}
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{role.role_title}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      {role.role_category} • {role.experience_level} • {role.quantity_needed} needed
                    </p>
                    {role.role_description && (
                      <p style={{ marginTop: '0.75rem', color: '#555' }}>{role.role_description}</p>
                    )}
                  </div>
                  {!isCreator && project.applications_open && (
                    <button
                      onClick={() => {
                        setSelectedRole(role.id);
                        setShowApplicationForm(true);
                      }}
                      className="btn btn-primary"
                    >
                      Apply
                    </button>
                  )}
                  {isCreator && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {role.application_count} application{role.application_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedRole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h3>Apply for This Role</h3>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Portfolio/Reel Link</label>
              <input
                type="url"
                value={applicationData.portfolio_url}
                onChange={(e) => setApplicationData({ ...applicationData, portfolio_url: e.target.value })}
                placeholder="https://vimeo.com/..."
              />
            </div>

            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <textarea
                value={applicationData.cover_letter}
                onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                placeholder="Tell the producer why you're perfect for this role..."
                rows={4}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitApplication(selectedRole)}
                disabled={submittingApp}
                className="btn btn-primary"
                style={{ flex: 1 }}
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
