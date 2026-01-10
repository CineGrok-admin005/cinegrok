'use client'

import React from 'react'
import {
    Instagram,
    Youtube,
    Linkedin,
    Twitter,
    Facebook,
    Globe,
    Film,
    Clapperboard
} from 'lucide-react'

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
                        <Instagram size={18} /> Instagram
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
                        <Youtube size={18} /> YouTube / Vimeo
                    </label>
                    <input
                        id="youtube"
                        type="url"
                        placeholder="Channel URL"
                        value={data.youtube || ''}
                        onChange={(e) => handleChange('youtube', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imdb">
                        <Clapperboard size={18} /> IMDb
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
                        <Linkedin size={18} /> LinkedIn
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
                        <Twitter size={18} /> Twitter / X
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
                        <Facebook size={18} /> Facebook
                    </label>
                    <input
                        id="facebook"
                        type="url"
                        placeholder="https://facebook.com/username"
                        value={data.facebook || ''}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                    />
                </div>

                {/* Website logic: removed 'full-width' so it sits next to Letterboxd */}
                <div className="form-group">
                    <label htmlFor="website">
                        <Globe size={18} /> Personal Website
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
                        <Film size={18} /> Letterboxd
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
