/**
 * CreateProjectForm.tsx
 * 
 * Form for producers to create a new production
 * Step 1: Basic production info
 * Step 2: Add roles
 * Step 3: Review and publish
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectRole {
  role_title: string;
  role_description: string;
  role_category: 'actor' | 'crew';
  experience_level: 'entry' | 'intermediate' | 'expert';
  quantity_needed: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  shoot_location: string;
  shoot_start_date: string;
  shoot_end_date: string;
  budget_min: number | null;
  budget_max: number | null;
  is_paid: boolean;
}

interface CreateProjectFormProps {
  isProduction?: boolean;
}

export default function CreateProjectForm({ isProduction = true }: CreateProjectFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1, 2, 3
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formLabel = isProduction ? 'Production' : 'Project';
  const pageLabel = isProduction ? 'productions' : 'projects';

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    shoot_location: '',
    shoot_start_date: '',
    shoot_end_date: '',
    budget_min: null,
    budget_max: null,
    is_paid: true,
  });

  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [currentRole, setCurrentRole] = useState<ProjectRole>({
    role_title: '',
    role_description: '',
    role_category: 'crew',
    experience_level: 'intermediate',
    quantity_needed: 1,
  });

  // Step 1: Basic Project Info
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? value === ''
            ? null
            : parseFloat(value)
          : value,
    }));
  };

  // Step 2: Add Roles
  const handleAddRole = () => {
    if (!currentRole.role_title) {
      setError('Role title is required');
      return;
    }
    setRoles((prev) => [...prev, currentRole]);
    setCurrentRole({
      role_title: '',
      role_description: '',
      role_category: 'crew',
      experience_level: 'intermediate',
      quantity_needed: 1,
    });
    setError('');
  };

  const handleRemoveRole = (index: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!formData.title) {
        throw new Error('Project title is required');
      }

      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'open',
          roles,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const { project } = await response.json();
      router.push(`/${pageLabel}/${project.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="create-project-form" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Create {formLabel}</h1>

      {error && (
        <div className="error-banner" style={{ background: '#fee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', color: '#c33' }}>
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="step">
          <h2>{formLabel} Details</h2>

          <div className="form-group">
            <label>{formLabel} Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., The Last Signal"
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label>Synopsis / Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your project..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Shoot Location</label>
              <input
                type="text"
                name="shoot_location"
                value={formData.shoot_location}
                onChange={handleInputChange}
                placeholder="Los Angeles, CA"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="shoot_start_date"
                value={formData.shoot_start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="shoot_end_date"
                value={formData.shoot_end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
              />
              {' '}Paid Positions
            </label>
          </div>

          {formData.is_paid && (
            <div className="form-row">
              <div className="form-group">
                <label>Budget Min ($)</label>
                <input
                  type="number"
                  name="budget_min"
                  value={formData.budget_min ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Budget Max ($)</label>
                <input
                  type="number"
                  name="budget_max"
                  value={formData.budget_max ?? ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="button-group">
            <button onClick={() => router.back()} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={() => setStep(2)} className="btn btn-primary">
              Next: Add Roles
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Add Roles */}
      {step === 2 && (
        <div className="step">
          <h2>{formLabel} Roles Needed</h2>

          {/* List current roles */}
          {roles.length > 0 && (
            <div className="roles-list" style={{ marginBottom: '2rem' }}>
              <h3>Roles Added ({roles.length})</h3>
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{role.role_title}</strong>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      {role.role_category} • {role.experience_level} • {role.quantity_needed} needed
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveRole(idx)}
                    className="btn btn-small"
                    style={{ background: '#fee', color: '#c33' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new role */}
          <div style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '4px', border: '1px solid #eee' }}>
            <h3>Add New Role</h3>

            <div className="form-group">
              <label>Role Title *</label>
              <input
                type="text"
                value={currentRole.role_title}
                onChange={(e) => setCurrentRole({ ...currentRole, role_title: e.target.value })}
                placeholder="e.g., Lead Actress, Cinematographer"
              />
            </div>

            <div className="form-group">
              <label>Role Description</label>
              <textarea
                value={currentRole.role_description}
                onChange={(e) => setCurrentRole({ ...currentRole, role_description: e.target.value })}
                placeholder="What are you looking for? (personality, skills, etc.)"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={currentRole.role_category}
                  onChange={(e) =>
                    setCurrentRole({
                      ...currentRole,
                      role_category: e.target.value as 'actor' | 'crew',
                    })
                  }
                >
                  <option value="crew">Crew</option>
                  <option value="actor">Actor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select
                  value={currentRole.experience_level}
                  onChange={(e) =>
                    setCurrentRole({
                      ...currentRole,
                      experience_level: e.target.value as 'entry' | 'intermediate' | 'expert',
                    })
                  }
                >
                  <option value="entry">Entry</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={currentRole.quantity_needed}
                  onChange={(e) =>
                    setCurrentRole({
                      ...currentRole,
                      quantity_needed: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <button onClick={handleAddRole} className="btn btn-secondary" style={{ width: '100%' }}>
              + Add Role
            </button>
          </div>

          <div className="button-group">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={roles.length === 0}
              className="btn btn-primary"
            >
              Review & Publish
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="step">
          <h2>Review & Publish</h2>

          <div className="review-section">
            <h3>{formData.title}</h3>
            <p>{formData.description}</p>
            <p>
              <strong>Location:</strong> {formData.shoot_location}
            </p>
            <p>
              <strong>Dates:</strong> {formData.shoot_start_date} to {formData.shoot_end_date}
            </p>
            {formData.is_paid && (
              <p>
                <strong>Budget:</strong> ${formData.budget_min} - ${formData.budget_max}
              </p>
            )}

            <hr />

            <h4>Roles ({roles.length})</h4>
            {roles.map((role, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <p>
                  <strong>{role.role_title}</strong> ({role.role_category}, {role.experience_level})
                </p>
                <p>{role.role_description}</p>
              </div>
            ))}
          </div>

          <div className="button-group">
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              Edit Roles
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
              {loading ? 'Publishing...' : `Publish ${formLabel}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
