'use client'

import { useState } from 'react'
import { FilmographyEntry, FilmAchievement, AWARD_CATEGORIES } from '../profile-features/types'
import { Clapperboard, Calendar, Tag, Clock, Film, Video, Link, Image, Trophy, MonitorPlay, Users, Award, Star, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilmographyFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function FilmographyForm({
    data,
    updateData,
    onNext,
    onBack,
}: FilmographyFormProps) {
    const films: FilmographyEntry[] = data.filmography || []

    const addFilm = () => {
        const newFilm: FilmographyEntry = {
            id: Date.now().toString(),
            title: '',
            year: '',
            durationValue: '',
            durationUnit: 'min',
            format: 'Short Film',
            status: 'Released',
            primaryRole: 'Director',
            logline: '',
            synopsis: '',
            watchLink: '',
            posterUrl: '',
            achievements: [], // NEW: Structured achievements array
        }
        updateData({ filmography: [...films, newFilm] })
    }

    const updateFilm = (index: number, field: keyof FilmographyEntry, value: any) => {
        const updatedFilms = [...films]
        updatedFilms[index] = { ...updatedFilms[index], [field]: value }
        updateData({ filmography: updatedFilms })
    }

    const removeFilm = (index: number) => {
        const updatedFilms = films.filter((_: any, i: number) => i !== index)
        updateData({ filmography: updatedFilms })
    }

    // Achievement management functions
    const addAchievement = (filmIndex: number) => {
        const newAchievement: FilmAchievement = {
            id: Date.now().toString(),
            type: 'award',
            eventCategory: 'festival',
            eventName: '',
            year: new Date().getFullYear().toString(),
            category: '',
            customCategory: '',
            result: 'won', // Default based on type
            notes: '',
        }
        const updatedFilms = [...films]
        const currentAchievements = updatedFilms[filmIndex].achievements || []
        updatedFilms[filmIndex] = {
            ...updatedFilms[filmIndex],
            achievements: [...currentAchievements, newAchievement]
        }
        updateData({ filmography: updatedFilms })
    }

    const updateAchievement = (filmIndex: number, achievementIndex: number, field: keyof FilmAchievement, value: any) => {
        const updatedFilms = [...films]
        const achievements = [...(updatedFilms[filmIndex].achievements || [])]

        // Smart defaults: auto-set result based on type
        if (field === 'type') {
            const resultMap: Record<string, FilmAchievement['result']> = {
                'award': 'won',
                'nomination': 'nominated',
                'official_selection': 'selected',
                'screening': 'screened',
            }
            achievements[achievementIndex] = {
                ...achievements[achievementIndex],
                [field]: value,
                result: resultMap[value] || 'won'
            }
        } else {
            achievements[achievementIndex] = {
                ...achievements[achievementIndex],
                [field]: value
            }
        }

        updatedFilms[filmIndex] = {
            ...updatedFilms[filmIndex],
            achievements
        }
        updateData({ filmography: updatedFilms })
    }

    const removeAchievement = (filmIndex: number, achievementIndex: number) => {
        const updatedFilms = [...films]
        const achievements = (updatedFilms[filmIndex].achievements || []).filter((_, i) => i !== achievementIndex)
        updatedFilms[filmIndex] = {
            ...updatedFilms[filmIndex],
            achievements
        }
        updateData({ filmography: updatedFilms })
    }

    // Expanded state for achievements section
    const [expandedAchievements, setExpandedAchievements] = useState<Record<string, boolean>>({})
    const toggleAchievements = (filmId: string) => {
        setExpandedAchievements(prev => ({
            ...prev,
            [filmId]: !prev[filmId]
        }))
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Filmography</h2>
                <p>Showcase your work and projects</p>
            </div>

            <div className="films-list">
                {films.map((film, index) => (
                    <div key={film.id || index} className="film-card">
                        <div className="film-card-header">
                            <h3><Film size={20} style={{ display: 'inline', marginRight: '8px' }} /> Film {index + 1}</h3>
                            <button
                                type="button"
                                className="btn-remove-small"
                                onClick={() => removeFilm(index)}
                            >
                                Remove
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label><Clapperboard size={18} /> Title *</label>
                                <input
                                    type="text"
                                    placeholder="Film title"
                                    value={film.title || ''}
                                    onChange={(e) => updateFilm(index, 'title', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label><Calendar size={18} /> Year</label>
                                <input
                                    type="text"
                                    placeholder="YYYY"
                                    value={film.year || ''}
                                    onChange={(e) => updateFilm(index, 'year', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label><Tag size={18} /> Genre</label>
                                <input
                                    type="text"
                                    placeholder="Drama"
                                    value={film.genre || ''}
                                    onChange={(e) => updateFilm(index, 'genre', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label><Video size={18} /> Format</label>
                                <select
                                    value={film.format || ''}
                                    onChange={(e) => updateFilm(index, 'format', e.target.value)}
                                >
                                    <option value="Select Format">Select Format</option>
                                    <option value="Feature Film">Feature Film</option>
                                    <option value="Short Film">Short Film</option>
                                    <option value="Documentary">Documentary</option>
                                    <option value="Web Series">Web Series</option>
                                    <option value="Music Video">Music Video</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><Clock size={18} /> Status</label>
                                <select
                                    value={film.status || ''}
                                    onChange={(e) => updateFilm(index, 'status', e.target.value)}
                                >
                                    <option value="Select Status">Select Status</option>
                                    <option value="Released">Released</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Festival Run">Festival Run</option>
                                    <option value="Post-Production">Post-Production</option>
                                    <option value="Filming">Filming</option>
                                    <option value="Pre-Production">Pre-Production</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><Clock size={18} /> Duration</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        placeholder="15"
                                        value={film.durationValue || ''}
                                        onChange={(e) => updateFilm(index, 'durationValue', e.target.value)}
                                        style={{ flex: 2 }}
                                    />
                                    <select
                                        value={film.durationUnit || 'min'}
                                        onChange={(e) => updateFilm(index, 'durationUnit', e.target.value)}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="min">min</option>
                                        <option value="hour">hour</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Users size={18} /> Crew Size / Scale</label>
                                <select
                                    value={film.crewScale || ''}
                                    onChange={(e) => updateFilm(index, 'crewScale', e.target.value)}
                                >
                                    <option value="">Select Scale</option>
                                    <option value="Solo (1)">Solo (1)</option>
                                    <option value="Small (2-5)">Small (2-5)</option>
                                    <option value="Medium (6-20)">Medium (6-20)</option>
                                    <option value="Large (20+)">Large (20+)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Your Role</label>
                                <input
                                    type="text"
                                    placeholder="Director, Writer..."
                                    value={film.primaryRole || ''}
                                    onChange={(e) => updateFilm(index, 'primaryRole', e.target.value)}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Logline</label>
                                <textarea
                                    rows={2}
                                    placeholder="One-line summary of the film..."
                                    value={film.logline || ''}
                                    onChange={(e) => updateFilm(index, 'logline', e.target.value)}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Synopsis</label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief description of the film..."
                                    value={film.synopsis || ''}
                                    onChange={(e) => updateFilm(index, 'synopsis', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label><Link size={18} /> Links (Film URL)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={film.watchLink || ''}
                                    onChange={(e) => updateFilm(index, 'watchLink', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label><Image size={18} /> Poster URL</label>
                                <input
                                    type="url"
                                    placeholder="Poster Image URL"
                                    value={film.posterUrl || ''}
                                    onChange={(e) => updateFilm(index, 'posterUrl', e.target.value)}
                                />
                            </div>

                            {/* Achievements & Recognition Section */}
                            <div className="form-group full-width achievements-section">
                                <div
                                    className="achievements-header"
                                    onClick={() => toggleAchievements(film.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        padding: '0.75rem',
                                        background: '#f8f8f8',
                                        borderRadius: '8px',
                                        marginBottom: expandedAchievements[film.id] ? '1rem' : '0'
                                    }}
                                >
                                    <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Trophy size={18} />
                                        Achievements & Recognition
                                        {(film.achievements?.length || 0) > 0 && (
                                            <span style={{
                                                background: '#18181b',
                                                color: '#fff',
                                                padding: '2px 8px',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {film.achievements?.length}
                                            </span>
                                        )}
                                    </label>
                                    {expandedAchievements[film.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>

                                {expandedAchievements[film.id] && (
                                    <div className="achievements-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {(film.achievements || []).map((achievement, achIndex) => (
                                            <div
                                                key={achievement.id}
                                                className="achievement-card"
                                                style={{
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: '8px',
                                                    padding: '1rem',
                                                    background: '#fafafa'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#71717a' }}>
                                                        Achievement #{achIndex + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAchievement(index, achIndex)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                    {/* Type */}
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem' }}>Type</label>
                                                        <select
                                                            value={achievement.type}
                                                            onChange={(e) => updateAchievement(index, achIndex, 'type', e.target.value)}
                                                            style={{ fontSize: '0.9rem' }}
                                                        >
                                                            <option value="award">Award</option>
                                                            <option value="nomination">Nomination</option>
                                                            <option value="official_selection">Official Selection</option>
                                                            <option value="screening">Screening</option>
                                                        </select>
                                                    </div>

                                                    {/* Event Category */}
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem' }}>Event Type</label>
                                                        <select
                                                            value={achievement.eventCategory}
                                                            onChange={(e) => updateAchievement(index, achIndex, 'eventCategory', e.target.value)}
                                                            style={{ fontSize: '0.9rem' }}
                                                        >
                                                            <option value="festival">Festival</option>
                                                            <option value="competition">Competition</option>
                                                            <option value="ceremony">Ceremony</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>

                                                    {/* Event Name */}
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem' }}>Event Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Cannes Film Festival"
                                                            value={achievement.eventName}
                                                            onChange={(e) => updateAchievement(index, achIndex, 'eventName', e.target.value)}
                                                            style={{ fontSize: '0.9rem' }}
                                                        />
                                                    </div>

                                                    {/* Year */}
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem' }}>Year</label>
                                                        <input
                                                            type="text"
                                                            placeholder="2024"
                                                            value={achievement.year}
                                                            onChange={(e) => updateAchievement(index, achIndex, 'year', e.target.value)}
                                                            style={{ fontSize: '0.9rem' }}
                                                        />
                                                    </div>

                                                    {/* Category - only show for awards/nominations */}
                                                    {(achievement.type === 'award' || achievement.type === 'nomination') && (
                                                        <>
                                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                                <label style={{ fontSize: '0.75rem' }}>Category</label>
                                                                <select
                                                                    value={achievement.category || ''}
                                                                    onChange={(e) => updateAchievement(index, achIndex, 'category', e.target.value)}
                                                                    style={{ fontSize: '0.9rem' }}
                                                                >
                                                                    <option value="">Select Category</option>
                                                                    {AWARD_CATEGORIES.map(cat => (
                                                                        <option key={cat} value={cat}>{cat}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Custom Category input - show when "Custom" is selected */}
                                                            {achievement.category === 'Custom' && (
                                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                                    <label style={{ fontSize: '0.75rem' }}>Custom Category</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter your category"
                                                                        value={achievement.customCategory || ''}
                                                                        onChange={(e) => updateAchievement(index, achIndex, 'customCategory', e.target.value)}
                                                                        style={{ fontSize: '0.9rem' }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Result */}
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem' }}>Result</label>
                                                        <select
                                                            value={achievement.result}
                                                            onChange={(e) => updateAchievement(index, achIndex, 'result', e.target.value)}
                                                            style={{ fontSize: '0.9rem' }}
                                                        >
                                                            <option value="won">Won</option>
                                                            <option value="nominated">Nominated</option>
                                                            <option value="selected">Selected</option>
                                                            <option value="screened">Screened</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div className="form-group" style={{ marginBottom: 0, marginTop: '0.75rem' }}>
                                                    <label style={{ fontSize: '0.75rem' }}>Notes (optional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Additional details..."
                                                        value={achievement.notes || ''}
                                                        onChange={(e) => updateAchievement(index, achIndex, 'notes', e.target.value)}
                                                        style={{ fontSize: '0.9rem' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => addAchievement(index)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                padding: '0.75rem',
                                                border: '2px dashed #d4d4d4',
                                                borderRadius: '8px',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                color: '#71717a',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#18181b'
                                                e.currentTarget.style.color = '#18181b'
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#d4d4d4'
                                                e.currentTarget.style.color = '#71717a'
                                            }}
                                        >
                                            <Plus size={18} /> Add Achievement
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary btn-add" onClick={addFilm}>
                    + Add Film
                </button>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next: Social Links →
                </button>
            </div>
        </div>
    )
}
