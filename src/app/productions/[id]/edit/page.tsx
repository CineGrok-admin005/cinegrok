/**
 * /productions/[id]/edit
 * Producer page to edit production details, status, and announcements
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Production {
  id: string;
  title: string;
  description: string;
  status: 'casting' | 'preproduction' | 'shooting' | 'postproduction' | 'completed';
  shoot_location: string;
  shoot_start_date: string;
  shoot_end_date: string;
  announcements: string;
  applications_open: boolean;
  creator_id: string;
}

const STATUS_OPTIONS = [
  { value: 'casting', label: '🎬 Casting' },
  { value: 'preproduction', label: '📋 Pre-Production' },
  { value: 'shooting', label: '🎥 Shooting' },
  { value: 'postproduction', label: '🎞️ Post-Production' },
  { value: 'completed', label: '✓ Completed' },
];

export default function EditProductionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'casting' as const,
    announcements: '',
    applications_open: true,
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      await fetchProduction(user.id);
    };

    init();
  }, [params.id]);

  const fetchProduction = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/projects/${params.id}`);

      if (!response.ok) {
        throw new Error('Production not found');
      }

      const { project: productionData } = await response.json();

      if (productionData.creator_id !== userId) {
        setError('You do not have permission to edit this production');
        return;
      }

      setProduction(productionData);
      setFormData({
        title: productionData.title,
        description: productionData.description,
        status: productionData.status,
        announcements: productionData.announcements || '',
        applications_open: productionData.applications_open,
      });
      setIsCreator(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!production) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/v1/projects/${production.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update production');
      }

      alert('Production updated successfully!');
      router.push(`/productions/${production.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (error && !isCreator) return <div style={{ padding: '2rem', color: '#c33' }}>{error}</div>;
  if (!production || !isCreator) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          ← Back
        </button>
        <h1>Edit Production</h1>
        <p style={{ color: '#666' }}>Update status, announcements, and other details</p>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Title */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Production Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Status */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Production Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Choose the current stage of your production. This helps filmmakers understand where your project stands.
          </p>
        </div>

        {/* Announcements */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Latest Update / Announcement
          </label>
          <textarea
            value={formData.announcements}
            onChange={(e) => setFormData({ ...formData, announcements: e.target.value })}
            placeholder="e.g., 'Casting closes on Dec 15!' or 'Shooting reschedule - new dates coming soon'"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Share important updates with potential applicants. This will be displayed prominently on your production page.
          </p>
        </div>

        {/* Applications Open */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.applications_open}
              onChange={(e) => setFormData({ ...formData, applications_open: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '600' }}>Accept Applications</span>
          </label>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            {formData.applications_open
              ? 'Filmmakers can submit applications for your roles.'
              : 'Filmmakers cannot submit applications. They can still view your production.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
