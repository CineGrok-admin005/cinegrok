import React, { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SAMPLE_PROFILE } from '@/data/sample-profile'
import { PublicProfileWrapper } from '@/components/profile-features/PublicProfileWrapper'
import { ProfileData } from '@/components/profile-features/types'

interface ReviewProfileProps {
    data: ProfileData
    onBack: () => void
    onPublish: () => void
}

/**
 * Maps the potentially messy Wizard data to the clean schema expected by PublicProfileWrapper
 */
function mapWizardToPublic(data: any): ProfileData {
    return {
        ...data,
        stageName: data.stageName || data.name || "Unnamed Filmmaker",
        profilePhoto: data.profilePhoto || data.profile_photo_url,
        country: data.country || "India",
        currentState: data.currentState || data.current_state,
        currentCity: data.currentCity || data.current_location,
        primaryRoles: Array.isArray(data.primaryRoles) ? data.primaryRoles : (data.roles ? [data.roles] : []),
        secondaryRoles: Array.isArray(data.secondaryRoles) ? data.secondaryRoles : [],
        creativePhilosophy: data.creativePhilosophy || data.philosophy,
        visualStyle: data.visualStyle || data.style,
        preferredGenres: data.preferredGenres || data.genres,
        yearsActive: data.yearsActive || data.years_active,
        openToCollaborations: data.openToCollaborations || data.open_to_collab,
        instagram: data.instagram || data.social_links?.instagram,
        website: data.website || data.social_links?.website,
        imdb: data.imdb || data.social_links?.imdb,
        filmography: (data.filmography || data.films || []).map((f: any, idx: number) => ({
            ...f,
            id: f.id?.toString() || idx.toString(),
            title: f.title || f.project_name,
            year: f.year || f.release_year,
            primaryRole: f.primaryRole || f.role,
            format: f.format || f.project_format,
            status: f.status || f.production_status,
            genres: Array.isArray(f.genres) ? f.genres : (f.genre ? [f.genre] : []),
            crewScale: f.crewScale || f.crew_scale,
            posterUrl: f.posterUrl || f.poster
        }))
    } as ProfileData;
}

export default function ReviewProfile({ data, onBack, onPublish }: ReviewProfileProps) {
    const [isPublishing, setIsPublishing] = useState(false)
    const [showSample, setShowSample] = useState(false)
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()

    const displayData = showSample ? SAMPLE_PROFILE : mapWizardToPublic(data)
    const isDataEmpty = !data.name && !data.stageName && (!data.films || data.films?.length === 0) && (!data.filmography || data.filmography?.length === 0);

    const handlePublishClick = async () => {
        setIsPublishing(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error("You must be logged in to publish.")
            }
            await onPublish()
            toast.success("Profile published successfully!")
        } catch (error) {
            console.error("Publish error:", error)
            toast.error("Failed to publish profile. Please try again.")
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="review-profile-step">
            <div className="review-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif, Georgia, serif)', fontWeight: 400 }}>Review & Publish</h2>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>This is exactly how your profile will look to the community.</p>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: showSample ? '#999' : '#c17f24' }}></div>
                        <span style={{ fontSize: '0.9rem', color: showSample ? '#999' : '#1a1a1a', fontWeight: showSample ? 400 : 600 }}>Your Data</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowSample(!showSample)}
                        className="demo-toggle-btn"
                        style={{
                            padding: '8px 24px',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            borderRadius: '100px',
                            background: showSample ? '#1a1a1a' : 'transparent',
                            color: showSample ? 'white' : '#1a1a1a',
                            border: '1px solid #1a1a1a',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {showSample ? "← Back to My Data" : "✨ See Example Profile"}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: showSample ? '#1a1a1a' : '#999', fontWeight: showSample ? 600 : 400 }}>Arun Mehta (Sample)</span>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: showSample ? '#c17f24' : '#999' }}></div>
                    </div>
                </div>
                {isDataEmpty && !showSample && (
                    <p style={{ color: '#e11d48', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic' }}>
                        Your profile currently has limited information. Click "See Example Profile" to see the full cinematic potential.
                    </p>
                )}
            </div>

            <div className="preview-outer-container" style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
                marginBottom: '5rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }}>
                <PublicProfileWrapper
                    profile={displayData}
                    isLoggedIn={true}
                    isOwner={true} // Allow export in preview
                    filmmaker={{
                        name: displayData.stageName,
                        raw_form_data: {
                            ...displayData,
                            roles: displayData.primaryRoles?.join(', '),
                            years_active: displayData.yearsActive,
                            genres: displayData.preferredGenres?.join(', '),
                            films: displayData.filmography?.map(f => ({
                                title: f.title,
                                year: f.year,
                                primary_role: f.primaryRole,
                                project_format: f.format,
                                synopsis: f.synopsis,
                                crew_scale: f.crewScale,
                                poster: f.posterUrl
                            }))
                        }
                    }} // Mock filmmaker for export logic
            </div>

            <div className="form-actions" style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '2rem',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e5e5e5'
            }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    disabled={isPublishing}
                    style={{ padding: '12px 24px', fontSize: '1.1rem' }}
                >
                    Back to Edit
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePublishClick}
                    disabled={isPublishing}
                    style={{
                        padding: '12px 36px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isPublishing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isPublishing ? 'Publishing...' : 'Publish Profile'}
                </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                By publishing, you agree to our Terms of Service.
            </p>
        </div>
    )
}
