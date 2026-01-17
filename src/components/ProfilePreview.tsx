/**
 * Profile Preview Component
 * 
 * Step 6: Preview profile before publishing
 */

'use client'

import { useState } from 'react'
import ProfileView from './ProfileView'

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
    const [viewMode, setViewMode] = useState<'audience' | 'producer'>('audience')

    const generateTemplateBio = () => {
        setGeneratingBio(true)
        setBioError(null)

        // Simulate a brief delay for better UX
        setTimeout(() => {
            try {
                // Formatting logic (matches ProfileView.tsx)
                const roles = data.primary_roles?.join(' & ') || data.roles?.[0] || 'Filmmaker';
                const location = data.current_location || data.native_location || 'based in India';
                const exp = data.years_active ? `with over ${data.years_active} of experience` : '';
                const style = data.style ? `known for their ${data.style.toLowerCase()} approach` : '';

                let bio = `${data.name} is a professional ${roles} ${location} ${exp}.`;
                if (style) bio += ` They are ${style}.`;

                if (data.philosophy) bio += ` \n\n"${data.philosophy}"`;

                updateData({ generated_bio: bio })
            } catch (err: any) {
                console.error('Bio Generation Error:', err)
                setBioError('Failed to generate template bio.')
            } finally {
                setGeneratingBio(false)
            }
        }, 600);
    }

    return (
        <div className="form-step preview-step">
            <div className="form-step-header">
                <h2>Preview Your Profile</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ margin: 0 }}>Review how different users see your profile</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Profile Preview Component */}
            <ProfileView data={data} showToggle={true} />

            {/* Bio Generation Actions (Outside the View) */}
            <div className="bio-actions" style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #ccc' }}>
                <div>
                    <strong>Professional Bio</strong>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {data.generated_bio ? 'Regenerate if you made changes.' : 'Generate a professional bio based on your details.'}
                    </p>
                </div>
                <div className="bio-actions" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {bioError && (
                        <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #fee2e2', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                            {bioError}
                        </div>
                    )}

                    <button
                        type="button"
                        className={`btn ${data.generated_bio ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={generateTemplateBio}
                        disabled={generatingBio}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease',
                            opacity: generatingBio ? 0.7 : 1
                        }}
                    >
                        {generatingBio ? (
                            <>
                                <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'currentColor', borderRadius: '50%', display: 'inline-block' }}></span>
                                Generating bio...
                            </>
                        ) : (
                            <>
                                {data.generated_bio ? 'Regenerate from Template' : 'Generate Bio from Profile'}
                            </>
                        )}
                    </button>

                    {data.generated_bio && !generatingBio && (
                        <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                            Bio generated from your profile details.
                        </p>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back to Edit
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-publish"
                    onClick={onPublish}
                    disabled={loading}
                >
                    {loading ? 'Publishing...' : 'Publish Profile'}
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
