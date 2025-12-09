/**
 * Professional Details Form Component
 * 
 * Step 2: Professional information and creative style
 */

'use client'

import { useState } from 'react'

interface ProfessionalDetailsFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

const ROLES = [
    'Director',
    'Cinematographer',
    'Editor',
    'Writer',
    'Producer',
    'Actor',
    'Sound Designer',
    'Production Designer',
    'Music Director',
    'VFX Artist',
]

const GENRES = [
    'Drama',
    'Comedy',
    'Thriller',
    'Horror',
    'Documentary',
    'Experimental',
    'Animation',
    'Sci-Fi',
    'Romance',
    'Action',
]

export default function ProfessionalDetailsForm({
    data,
    updateData,
    onNext,
    onBack,
}: ProfessionalDetailsFormProps) {
    const [errors, setErrors] = useState<any>({})

    const handleChange = (field: string, value: any) => {
        updateData({ [field]: value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: null })
        }
    }

    const toggleRole = (role: string) => {
        const roles = data.roles || []
        if (roles.includes(role)) {
            handleChange('roles', roles.filter((r: string) => r !== role))
        } else {
            handleChange('roles', [...roles, role])
        }
    }

    const toggleGenre = (genre: string) => {
        const genres = data.genres || []
        if (genres.includes(genre)) {
            handleChange('genres', genres.filter((g: string) => g !== genre))
        } else {
            handleChange('genres', [...genres, genre])
        }
    }

    const validate = () => {
        const newErrors: any = {}

        if (!data.roles || data.roles.length === 0) {
            newErrors.roles = 'Please select at least one role'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validate()) {
            onNext()
        }
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Professional Details</h2>
                <p>Share your expertise and creative vision</p>
            </div>

            <div className="form-grid">
                {/* Roles */}
                <div className="form-group full-width">
                    <label>Your Roles in Filmmaking *</label>
                    <div className="checkbox-grid">
                        {ROLES.map((role) => (
                            <label key={role} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={(data.roles || []).includes(role)}
                                    onChange={() => toggleRole(role)}
                                />
                                <span>{role}</span>
                            </label>
                        ))}
                    </div>
                    {errors.roles && <span className="error-message">{errors.roles}</span>}
                </div>

                {/* Years Active */}
                <div className="form-group">
                    <label htmlFor="years_active">Years Active in Film Industry</label>
                    <input
                        id="years_active"
                        type="text"
                        placeholder="e.g., 2015 - Present"
                        value={data.years_active || ''}
                        onChange={(e) => handleChange('years_active', e.target.value)}
                    />
                </div>

                {/* Preferred Genres */}
                <div className="form-group full-width">
                    <label>Preferred Genres or Themes</label>
                    <div className="checkbox-grid">
                        {GENRES.map((genre) => (
                            <label key={genre} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={(data.genres || []).includes(genre)}
                                    onChange={() => toggleGenre(genre)}
                                />
                                <span>{genre}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Visual/Narrative Style */}
                <div className="form-group full-width">
                    <label htmlFor="style">Visual / Narrative Style</label>
                    <textarea
                        id="style"
                        rows={4}
                        placeholder="Describe your unique visual or narrative style..."
                        value={data.style || ''}
                        onChange={(e) => handleChange('style', e.target.value)}
                    />
                    <small className="form-hint">
                        e.g., "Minimalist cinematography with long takes and natural lighting"
                    </small>
                </div>

                {/* Creative Influences */}
                <div className="form-group full-width">
                    <label htmlFor="influences">Creative Influences (People)</label>
                    <input
                        id="influences"
                        type="text"
                        placeholder="e.g., Satyajit Ray, Akira Kurosawa, Wong Kar-wai"
                        value={data.influences || ''}
                        onChange={(e) => handleChange('influences', e.target.value)}
                    />
                </div>

                {/* Creative Philosophy */}
                <div className="form-group full-width">
                    <label htmlFor="philosophy">Creative Philosophy</label>
                    <textarea
                        id="philosophy"
                        rows={4}
                        placeholder="What drives your creative work?"
                        value={data.philosophy || ''}
                        onChange={(e) => handleChange('philosophy', e.target.value)}
                    />
                </div>

                {/* Belief About Cinema */}
                <div className="form-group full-width">
                    <label htmlFor="belief">Belief About Cinema</label>
                    <textarea
                        id="belief"
                        rows={4}
                        placeholder="What do you believe cinema can achieve?"
                        value={data.belief || ''}
                        onChange={(e) => handleChange('belief', e.target.value)}
                    />
                </div>

                {/* Message or Intent */}
                <div className="form-group full-width">
                    <label htmlFor="message">Message or Intent</label>
                    <textarea
                        id="message"
                        rows={4}
                        placeholder="What message do you want to convey through your work?"
                        value={data.message || ''}
                        onChange={(e) => handleChange('message', e.target.value)}
                    />
                </div>

                {/* Creative Signature */}
                <div className="form-group full-width">
                    <label htmlFor="signature">Creative Signature</label>
                    <input
                        id="signature"
                        type="text"
                        placeholder="e.g., Symmetrical framing, Non-linear narratives"
                        value={data.signature || ''}
                        onChange={(e) => handleChange('signature', e.target.value)}
                    />
                    <small className="form-hint">What makes your work instantly recognizable?</small>
                </div>

                {/* Collaboration */}
                <div className="form-group">
                    <label htmlFor="open_to_collab">Open to Collaborations?</label>
                    <select
                        id="open_to_collab"
                        value={data.open_to_collab || ''}
                        onChange={(e) => handleChange('open_to_collab', e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Selective">Selective</option>
                    </select>
                </div>

                {/* Availability */}
                <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                        id="availability"
                        value={data.availability || ''}
                        onChange={(e) => handleChange('availability', e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Selective">Selective Projects Only</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                {/* Work Location */}
                <div className="form-group full-width">
                    <label htmlFor="work_location">Preferred Work Location</label>
                    <input
                        id="work_location"
                        type="text"
                        placeholder="e.g., Mumbai, Remote, Willing to travel"
                        value={data.work_location || ''}
                        onChange={(e) => handleChange('work_location', e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next: Filmography →
                </button>
            </div>
        </div>
    )
}
