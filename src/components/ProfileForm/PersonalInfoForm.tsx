/**
 * Personal Info Form Component
 * 
 * Step 1: Basic personal information
 */

'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

interface PersonalInfoFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
}

export default function PersonalInfoForm({ data, updateData, onNext }: PersonalInfoFormProps) {
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const supabase = createSupabaseBrowserClient()

    const handleChange = (field: string, value: any) => {
        updateData({ [field]: value })
        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: null })
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            setErrors({ ...errors, profile_photo_url: 'Please upload an image file' })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, profile_photo_url: 'Image must be less than 5MB' })
            return
        }

        setUploading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `profile-photos/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('filmmaker-assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('filmmaker-assets')
                .getPublicUrl(filePath)

            handleChange('profile_photo_url', publicUrl)
        } catch (error: any) {
            setErrors({ ...errors, profile_photo_url: error.message })
        } finally {
            setUploading(false)
        }
    }

    const validate = () => {
        const newErrors: any = {}

        if (!data.name?.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!data.email?.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!data.country?.trim()) {
            newErrors.country = 'Country is required'
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
                <h2>Personal Information</h2>
                <p>Tell us about yourself</p>
            </div>

            <div className="form-grid">
                {/* Profile Photo */}
                <div className="form-group full-width">
                    <label>Profile Photo *</label>
                    <div className="image-upload">
                        {data.profile_photo_url ? (
                            <div className="image-preview">
                                <img src={data.profile_photo_url} alt="Profile" />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => handleChange('profile_photo_url', '')}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="upload-placeholder">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                <div className="upload-content">
                                    <span className="upload-icon">📷</span>
                                    <span>{uploading ? 'Uploading...' : 'Click to upload photo'}</span>
                                    <small>JPG, PNG or GIF (max 5MB)</small>
                                </div>
                            </label>
                        )}
                    </div>
                    {errors.profile_photo_url && (
                        <span className="error-message">{errors.profile_photo_url}</span>
                    )}
                </div>

                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name">Stage / Screen Name *</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="e.g., Christopher Nolan"
                        value={data.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={data.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Pronouns */}
                <div className="form-group">
                    <label htmlFor="pronouns">Pronouns</label>
                    <select
                        id="pronouns"
                        value={data.pronouns || ''}
                        onChange={(e) => handleChange('pronouns', e.target.value)}
                    >
                        <option value="">Select pronouns</option>
                        <option value="he/him">He/Him</option>
                        <option value="she/her">She/Her</option>
                        <option value="they/them">They/Them</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                        id="dob"
                        type="date"
                        value={data.dob || ''}
                        onChange={(e) => handleChange('dob', e.target.value)}
                    />
                </div>

                {/* Country */}
                <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                        id="country"
                        type="text"
                        placeholder="e.g., India"
                        value={data.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className={errors.country ? 'error' : ''}
                    />
                    {errors.country && <span className="error-message">{errors.country}</span>}
                </div>

                {/* Current Location */}
                <div className="form-group">
                    <label htmlFor="current_location">Current Location</label>
                    <input
                        id="current_location"
                        type="text"
                        placeholder="e.g., Mumbai, India"
                        value={data.current_location || ''}
                        onChange={(e) => handleChange('current_location', e.target.value)}
                    />
                </div>

                {/* Native Location */}
                <div className="form-group">
                    <label htmlFor="native_location">Native Location</label>
                    <input
                        id="native_location"
                        type="text"
                        placeholder="e.g., Bangalore, India"
                        value={data.native_location || ''}
                        onChange={(e) => handleChange('native_location', e.target.value)}
                    />
                </div>

                {/* Nationality */}
                <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                        id="nationality"
                        type="text"
                        placeholder="e.g., Indian"
                        value={data.nationality || ''}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                    />
                </div>

                {/* Languages */}
                <div className="form-group full-width">
                    <label htmlFor="languages">Languages Known</label>
                    <input
                        id="languages"
                        type="text"
                        placeholder="e.g., English, Hindi, Tamil"
                        value={data.languages || ''}
                        onChange={(e) => handleChange('languages', e.target.value)}
                    />
                    <small className="form-hint">Separate multiple languages with commas</small>
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next: Professional Details →
                </button>
            </div>
        </div>
    )
}
