/**
 * Social Links Form Component
 * 
 * Step 4: Social media and portfolio links
 */

'use client'

interface SocialLinksFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function SocialLinksForm({
    data,
    updateData,
    onNext,
    onBack,
}: SocialLinksFormProps) {
    const handleChange = (field: string, value: string) => {
        updateData({ [field]: value })
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Social Links</h2>
                <p>Connect your online presence</p>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="instagram">
                        <span className="social-icon">📸</span> Instagram
                    </label>
                    <input
                        id="instagram"
                        type="url"
                        placeholder="https://instagram.com/username"
                        value={data.instagram || ''}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="youtube">
                        <span className="social-icon">▶️</span> YouTube
                    </label>
                    <input
                        id="youtube"
                        type="url"
                        placeholder="https://youtube.com/@username"
                        value={data.youtube || ''}
                        onChange={(e) => handleChange('youtube', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imdb">
                        <span className="social-icon">🎬</span> IMDb
                    </label>
                    <input
                        id="imdb"
                        type="url"
                        placeholder="https://imdb.com/name/..."
                        value={data.imdb || ''}
                        onChange={(e) => handleChange('imdb', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="linkedin">
                        <span className="social-icon">💼</span> LinkedIn
                    </label>
                    <input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={data.linkedin || ''}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="twitter">
                        <span className="social-icon">🐦</span> Twitter / X
                    </label>
                    <input
                        id="twitter"
                        type="url"
                        placeholder="https://twitter.com/username"
                        value={data.twitter || ''}
                        onChange={(e) => handleChange('twitter', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="facebook">
                        <span className="social-icon">📘</span> Facebook
                    </label>
                    <input
                        id="facebook"
                        type="url"
                        placeholder="https://facebook.com/username"
                        value={data.facebook || ''}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="website">
                        <span className="social-icon">🌍</span> Personal Website / Portfolio
                    </label>
                    <input
                        id="website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={data.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="letterboxd">
                        <span className="social-icon">🎞️</span> Letterboxd
                    </label>
                    <input
                        id="letterboxd"
                        type="url"
                        placeholder="https://letterboxd.com/username"
                        value={data.letterboxd || ''}
                        onChange={(e) => handleChange('letterboxd', e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next: Education →
                </button>
            </div>
        </div>
    )
}
