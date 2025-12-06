/**
 * Profile Preview Component
 * 
 * Step 6: Preview profile before publishing
 */

'use client'

import { useState } from 'react'

interface ProfilePreviewProps {
    data: any
    updateData: (data: any) => void
    onBack: () => void
    onPublish: () => void
    loading: boolean
    error: string | null
}

export default function ProfilePreview({
    data,
    updateData,
    onBack,
    onPublish,
    loading,
    error,
}: ProfilePreviewProps) {
    const [generatingBio, setGeneratingBio] = useState(false)
    const [bioError, setBioError] = useState<string | null>(null)

    const generateAIBio = async () => {
        setGeneratingBio(true)
        setBioError(null)

        try {
            const response = await fetch('/api/generate-bio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData: data }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to generate bio')
            }

            const { bio } = await response.json()

            // Update form data with generated bio
            updateData({ ai_generated_bio: bio })
        } catch (err: any) {
            console.error('Bio generation error:', err)
            setBioError(err.message || 'Failed to generate bio. Please try again.')
        } finally {
            setGeneratingBio(false)
        }
    }

    return (
        <div className="form-step preview-step">
            <div className="form-step-header">
                <h2>Preview Your Profile</h2>
                <p>Review your profile before publishing</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Profile Preview */}
            <div className="profile-preview-card">
                {/* Header Section */}
                <div className="preview-header">
                    {data.profile_photo_url && (
                        <img
                            src={data.profile_photo_url}
                            alt={data.name}
                            className="preview-photo"
                        />
                    )}
                    <div className="preview-header-content">
                        <h1>{data.name || 'Your Name'}</h1>
                        <div className="preview-roles">
                            {(data.roles || []).join(' • ')}
                        </div>
                        <div className="preview-location">
                            📍 {data.current_location || data.country || 'Location'}
                        </div>
                    </div>
                </div>

                {/* AI Bio Section */}
                <div className="preview-section">
                    <h3>Bio</h3>
                    {data.ai_generated_bio ? (
                        <div>
                            <p className="preview-bio">{data.ai_generated_bio}</p>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={generateAIBio}
                                disabled={generatingBio}
                                style={{ marginTop: '1rem' }}
                            >
                                {generatingBio ? '✨ Regenerating...' : '✨ Regenerate Bio'}
                            </button>
                        </div>
                    ) : (
                        <div className="ai-bio-placeholder">
                            <p>No bio generated yet</p>
                            {bioError && (
                                <p className="error-message" style={{ marginBottom: '1rem', color: '#f44336' }}>
                                    {bioError}
                                </p>
                            )}
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={generateAIBio}
                                disabled={generatingBio}
                            >
                                {generatingBio ? '✨ Generating...' : '✨ Generate AI Bio'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Professional Details */}
                {data.style && (
                    <div className="preview-section">
                        <h3>Style</h3>
                        <p>{data.style}</p>
                    </div>
                )}

                {data.philosophy && (
                    <div className="preview-section">
                        <h3>Creative Philosophy</h3>
                        <p>{data.philosophy}</p>
                    </div>
                )}

                {/* Filmography */}
                {data.films && data.films.length > 0 && (
                    <div className="preview-section">
                        <h3>Filmography</h3>
                        <div className="preview-films">
                            {data.films.map((film: any, index: number) => (
                                <div key={index} className="preview-film-card">
                                    {film.poster && (
                                        <img src={film.poster} alt={film.title} className="film-poster" />
                                    )}
                                    <div className="film-info">
                                        <h4>{film.title}</h4>
                                        <p className="film-meta">
                                            {film.year} • {film.genre} • {film.duration}
                                        </p>
                                        <p className="film-role">{film.role}</p>
                                        {film.synopsis && <p className="film-synopsis">{film.synopsis}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                <div className="preview-section">
                    <h3>Connect</h3>
                    <div className="preview-social-links">
                        {data.instagram && (
                            <a href={data.instagram} target="_blank" rel="noopener noreferrer">
                                📸 Instagram
                            </a>
                        )}
                        {data.youtube && (
                            <a href={data.youtube} target="_blank" rel="noopener noreferrer">
                                ▶️ YouTube
                            </a>
                        )}
                        {data.imdb && (
                            <a href={data.imdb} target="_blank" rel="noopener noreferrer">
                                🎬 IMDb
                            </a>
                        )}
                        {data.website && (
                            <a href={data.website} target="_blank" rel="noopener noreferrer">
                                🌍 Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Awards */}
                {data.awards && (
                    <div className="preview-section">
                        <h3>Awards & Recognition</h3>
                        <p>{data.awards}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back to Edit
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-publish"
                    onClick={onPublish}
                    disabled={loading}
                >
                    {loading ? 'Publishing...' : '🚀 Publish Profile'}
                </button>
            </div>

            <div className="preview-note">
                <p>
                    <strong>Note:</strong> Publishing your profile requires an active subscription.
                    You'll be redirected to the pricing page if you don't have one.
                </p>
            </div>
        </div>
    )
}
