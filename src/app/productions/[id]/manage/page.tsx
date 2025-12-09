/**
 * /productions/[id]/manage
 * Producer dashboard for managing applications for production
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Application {
  id: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  portfolio_url: string;
  cover_letter: string;
  applied_at: string;
  filmmaker_id: string;
  role_id: string;
  producer_notes: string;
  filmmakers: {
    id: string;
    name: string;
    profile_url: string;
    raw_form_data: any;
  };
  project_roles: {
    role_title: string;
  };
}

export default function ManageProductionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [production, setProduction] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('submitted');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      await fetchProductionAndApplications();
    };

    init();
  }, [params.id]);

  const fetchProductionAndApplications = async () => {
    try {
      setLoading(true);

      // Fetch production
      const projectRes = await fetch(`/api/v1/projects/${params.id}`);
      if (!projectRes.ok) throw new Error('Production not found');
      const { project: productionData } = await projectRes.json();
      setProduction(productionData);

      // Fetch applications
      const appRes = await fetch(`/api/v1/projects/${params.id}/applications?status=submitted&limit=100`);
      if (!appRes.ok) throw new Error('Failed to load applications');
      const { data } = await appRes.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const response = await fetch(
        `/api/v1/projects/${params.id}/applications/${appId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            producer_notes: notes,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update application');

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: status as any } : app
        )
      );

      setSelectedApp(null);
      setNotes('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: '#c33' }}>Error: {error}</div>;
  if (!production) return <div style={{ padding: '2rem' }}>Production not found</div>;

  const filteredApps = applications.filter((app) => app.status === selectedStatus);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>{production.title} - Applications</h1>
        <button onClick={() => router.back()} className="btn btn-secondary">
          ← Back to Production
        </button>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
        {['submitted', 'under_review', 'accepted', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedStatus === status ? '#333' : '#fff',
              color: selectedStatus === status ? '#fff' : '#333',
              border: 'none',
              cursor: 'pointer',
              borderBottom: selectedStatus === status ? '3px solid #007bff' : 'none',
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({applications.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredApps.length === 0 ? (
          <p>No applications with status "{selectedStatus}"</p>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '1.5rem',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    {app.filmmakers.name} - {app.project_roles.role_title}
                  </h3>

                  {/* Filmmaker Profile Preview */}
                  <div style={{ background: '#fff', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                    <p><strong>Experience Level:</strong> {app.filmmakers.raw_form_data?.experience_level || 'Not specified'}</p>
                    <p><strong>Location:</strong> {app.filmmakers.raw_form_data?.location || 'Not specified'}</p>
                    <p><strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>

                  {/* Portfolio & Cover Letter */}
                  {app.portfolio_url && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                        View Portfolio
                      </a>
                    </div>
                  )}

                  {app.cover_letter && (
                    <div style={{ marginTop: '0.75rem', background: '#fff', padding: '1rem', borderRadius: '4px' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Cover Letter:</p>
                      <p style={{ margin: 0 }}>{app.cover_letter}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {app.status === 'submitted' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedApp(app.id);
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'under_review')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        Review
                      </button>
                    </>
                  )}
                  {app.status === 'accepted' && (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Accepted</span>
                  )}
                  {app.status === 'rejected' && (
                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>✗ Rejected</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Accept Confirmation Modal */}
      {selectedApp && (
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
            maxWidth: '400px',
          }}>
            <h3>Accept Application?</h3>
            <p>Add any notes for your records:</p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp, 'accepted')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
