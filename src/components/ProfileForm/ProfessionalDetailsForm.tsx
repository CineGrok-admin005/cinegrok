'use client'

import React, { useState } from 'react'
import {
    Briefcase, Clock, Palette, Lightbulb, PenTool, MapPin, Star,
    Film, BookOpen, MessageSquare, Feather, Users, Calendar, AlertCircle
} from 'lucide-react'

// Constants
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

interface ProfessionalDetailsFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function ProfessionalDetailsForm({
    data,
    updateData,
    onNext,
    onBack,
}: ProfessionalDetailsFormProps) {
    const [errors, setErrors] = useState<any>({})
    const [showCustomRole, setShowCustomRole] = useState(false)
    const [customRole, setCustomRole] = useState('')
    const [customRoleType, setCustomRoleType] = useState<'primary' | 'secondary'>('secondary')
    // Maintain a local list of added custom roles to ensure they appear in the UI
    const [customRolesList, setCustomRolesList] = useState<string[]>([])

    const prim = data.primaryRoles || []
    const sec = data.secondaryRoles || []
    const totalRolesCount = prim.length + sec.length

    // Helper to get all relevant custom roles (from data or local session)
    const allCustomRoles = Array.from(new Set([
        ...customRolesList,
        ...prim.filter((r: string) => !ROLES.includes(r)),
        ...sec.filter((r: string) => !ROLES.includes(r))
    ]))

    const ALL_DISPLAY_ROLES = [...ROLES, ...allCustomRoles]

    const handleChange = (field: string, value: any) => {
        updateData({ [field]: value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: null })
        }
    }

    const validate = () => {
        const newErrors: any = {}
        if (!data.primaryRoles || data.primaryRoles.length === 0) {
            newErrors.roles = 'Please select at least one primary role'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validate()) {
            onNext()
        }
    }

    const toggleArrayItem = (field: string, item: string) => {
        const list = data[field] || []
        if (list.includes(item)) {
            handleChange(field, list.filter((i: string) => i !== item))
        } else {
            handleChange(field, [...list, item])
        }
    }

    const handleRoleSelection = (role: string, type: 'primary' | 'secondary') => {
        const isSelected = type === 'primary' ? prim.includes(role) : sec.includes(role)

        if (!isSelected) {
            if (totalRolesCount >= 4) {
                alert("Total roles limit reached (max 4).")
                return
            }
            if (type === 'primary' && prim.length >= 2) {
                alert("You can select a maximum of 2 Primary Roles.")
                return
            }
            if (type === 'secondary' && sec.length >= 2) {
                alert("You can select a maximum of 2 Secondary Roles.")
                return
            }
        }

        if (type === 'primary') {
            const newPrim = isSelected ? prim.filter((r: string) => r !== role) : [...prim, role]
            handleChange('primaryRoles', newPrim)
            // If moved to primary, remove from secondary if present
            if (!isSelected && sec.includes(role)) {
                handleChange('secondaryRoles', sec.filter((r: string) => r !== role))
            }
        } else {
            const newSec = isSelected ? sec.filter((r: string) => r !== role) : [...sec, role]
            handleChange('secondaryRoles', newSec)
            // If moved to secondary, remove from primary if present
            if (!isSelected && prim.includes(role)) {
                handleChange('primaryRoles', prim.filter((r: string) => r !== role))
            }
        }
    }

    const checkAndAddCustomRole = () => {
        const roleToAdd = customRole.trim()
        if (!roleToAdd) return

        // Check if already exists in standard roles
        if (ROLES.includes(roleToAdd) || allCustomRoles.includes(roleToAdd)) {
            handleRoleSelection(roleToAdd, customRoleType)
            setCustomRole('')
            setShowCustomRole(false)
            return
        }

        // Validate limits before adding
        if (customRoleType === 'primary' && prim.length >= 2) {
            alert("You can select a maximum of 2 Primary Roles. Unselect one to add a new custom role.")
            return
        }
        if (customRoleType === 'secondary' && sec.length >= 2) {
            alert("You can select a maximum of 2 Secondary Roles. Unselect one to add a new custom role.")
            return
        }
        if (totalRolesCount >= 4) {
            alert("Total roles limit reached (max 4). Unselect one to add a new custom role.")
            return
        }

        // Add to local custom roles list so it appears in the grid
        setCustomRolesList(prev => [...prev, roleToAdd])

        // Select it
        handleRoleSelection(roleToAdd, customRoleType)

        setCustomRole('')
        setShowCustomRole(false)
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Professional Details</h2>
                <p>Highlight your career and creative identity</p>
            </div>

            {errors.roles && <div className="error-message" style={{ marginBottom: '1rem' }}>{errors.roles}</div>}

            <div className="form-grid">
                {/* Primary Roles */}
                <div className="form-group full-width">
                    <label>
                        <Briefcase size={20} /> Primary Roles *
                        <small style={{ fontWeight: 'normal', marginLeft: '0.5rem' }}>(Select up to 2 - Defines your Profile Theme)</small>
                    </label>
                    <div className="checkbox-grid">
                        {ALL_DISPLAY_ROLES.map((role) => {
                            const isSelected = prim.includes(role);
                            const isDisabled = !isSelected && (prim.length >= 2 || totalRolesCount >= 4);
                            return (
                                <label key={`prim-${role}`} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleRoleSelection(role, 'primary')}
                                        disabled={isDisabled}
                                    />
                                    <span>{role}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* Secondary Roles */}
                <div className="form-group full-width">
                    <label>
                        <Star size={20} /> Secondary Roles
                        <small style={{ fontWeight: 'normal', marginLeft: '0.5rem' }}>(Select up to 2)</small>
                    </label>
                    <div className="checkbox-grid">
                        {ALL_DISPLAY_ROLES.map((role) => {
                            const isSelected = sec.includes(role);
                            const isPrimary = prim.includes(role);
                            const isDisabled = isPrimary || (!isSelected && (sec.length >= 2 || totalRolesCount >= 4));
                            return (
                                <label key={`sec-${role}`} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleRoleSelection(role, 'secondary')}
                                        disabled={isDisabled}
                                    />
                                    <span>{role}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* Custom Role */}
                <div className="form-group full-width">
                    {!showCustomRole ? (
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowCustomRole(true)}>
                            + Add Custom Role
                        </button>
                    ) : (
                        <div style={{
                            padding: '1rem',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'white'
                        }}>
                            <label style={{ marginBottom: '0.5rem' }}>Custom Role Name</label>
                            <input
                                type="text"
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                placeholder="e.g. Stunt Coordinator"
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="customType"
                                        checked={customRoleType === 'primary'}
                                        onChange={() => setCustomRoleType('primary')}
                                    /> Primary
                                </label>
                                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="customType"
                                        checked={customRoleType === 'secondary'}
                                        onChange={() => setCustomRoleType('secondary')}
                                    /> Secondary
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" className="btn btn-sm btn-primary" onClick={checkAndAddCustomRole}>Add</button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowCustomRole(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Years Active */}
                <div className="form-group">
                    <label htmlFor="yearsActive">
                        <Clock size={18} /> Years Active
                    </label>
                    <input
                        id="yearsActive"
                        type="text"
                        placeholder="e.g., 2015 - Present"
                        value={data.yearsActive || ''}
                        onChange={(e) => handleChange('yearsActive', e.target.value)}
                    />
                </div>

                {/* Preferred Genres */}
                <div className="form-group full-width">
                    <label>
                        <Film size={18} /> Preferred Genres
                    </label>
                    <div className="checkbox-grid">
                        {GENRES.map((genre) => (
                            <label key={genre} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={(data.preferredGenres || []).includes(genre)}
                                    onChange={() => toggleArrayItem('preferredGenres', genre)}
                                />
                                <span>{genre}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Visual Style */}
                <div className="form-group full-width">
                    <label htmlFor="visualStyle">
                        <Palette size={18} /> Visual / Narrative Style
                    </label>
                    <textarea
                        id="visualStyle"
                        rows={4}
                        placeholder="Describe your unique visual or narrative style..."
                        value={data.visualStyle || ''}
                        onChange={(e) => handleChange('visualStyle', e.target.value)}
                    />
                </div>

                {/* Creative Influences */}
                <div className="form-group full-width">
                    <label htmlFor="creativeInfluences">
                        <Lightbulb size={18} /> Creative Influences (People)
                    </label>
                    <input
                        id="creativeInfluences"
                        type="text"
                        placeholder="e.g., Satyajit Ray, Akira Kurosawa"
                        value={data.creativeInfluences || ''}
                        onChange={(e) => handleChange('creativeInfluences', e.target.value)}
                    />
                </div>

                {/* Creative Philosophy */}
                <div className="form-group full-width">
                    <label htmlFor="creativePhilosophy">
                        <BookOpen size={18} /> Creative Philosophy
                    </label>
                    <textarea
                        id="creativePhilosophy"
                        rows={3}
                        placeholder="What drives your creative work?"
                        value={data.creativePhilosophy || ''}
                        onChange={(e) => handleChange('creativePhilosophy', e.target.value)}
                    />
                </div>

                {/* Belief About Cinema */}
                <div className="form-group full-width">
                    <label htmlFor="belief">
                        <PenTool size={18} /> Belief About Cinema
                    </label>
                    <textarea
                        id="belief"
                        rows={4}
                        placeholder="What do you believe cinema can achieve?"
                        value={data.belief || ''}
                        onChange={(e) => handleChange('belief', e.target.value)}
                    />
                </div>

                {/* Message */}
                <div className="form-group full-width">
                    <label htmlFor="message">
                        <MessageSquare size={18} /> Message or Intent
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        placeholder="What message do you want to convey through your work?"
                        value={data.message || ''}
                        onChange={(e) => handleChange('message', e.target.value)}
                    />
                </div>

                {/* Signature */}
                <div className="form-group full-width">
                    <label htmlFor="signature">
                        <Feather size={18} /> Creative Signature
                    </label>
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
                    <label htmlFor="openToCollaborations">
                        <Users size={18} /> Open to Collaborations?
                    </label>
                    <select
                        id="openToCollaborations"
                        value={data.openToCollaborations || ''}
                        onChange={(e) => handleChange('openToCollaborations', e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Selective">Selective</option>
                    </select>
                </div>

                {/* Availability */}
                <div className="form-group">
                    <label htmlFor="availability">
                        <Calendar size={18} /> Availability
                    </label>
                    <select
                        id="availability"
                        value={data.availability || ''}
                        onChange={(e) => handleChange('availability', e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Selective">Selective Projects Only</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                {/* Location */}
                <div className="form-group full-width">
                    <label htmlFor="preferredWorkLocation">
                        <MapPin size={18} /> Preferred Work Location
                    </label>
                    <input
                        id="preferredWorkLocation"
                        type="text"
                        placeholder="e.g., Mumbai, Remote, Willing to travel"
                        value={data.preferredWorkLocation || ''}
                        onChange={(e) => handleChange('preferredWorkLocation', e.target.value)}
                    />
                </div>
            </div>

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
