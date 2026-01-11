'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Globe, Upload, FileText, MessageCircle } from 'lucide-react'
import { getCurrentUser, uploadFile } from '@/lib/api'
import { LANGUAGES, PRONOUNS } from '@/lib/constants'
import { Country, State, ICountry, IState } from 'country-state-city'

interface PersonalInfoFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
}

export default function PersonalInfoForm({ data, updateData, onNext }: PersonalInfoFormProps) {
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    // Helper to get states based on country code
    const getStatesRequest = (countryCode: string) => {
        if (!countryCode) return []
        return State.getStatesOfCountry(countryCode)
    }

    const handleChange = (field: string, value: any) => {
        updateData({ [field]: value })

        // Reset state if country changes
        if (field === 'country') {
            updateData({ country: value, currentState: '' })
        }

        // Reset native state if native country changes (we will store nativeCountry name in data for now if needed, or just handle locally)
        // Since schema might not have nativeCountry, we might need to rely on UI state or assume "Country" field implies residence.

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
            setErrors({ ...errors, profilePhoto: 'Please upload an image file' })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, profilePhoto: 'Image must be less than 5MB' })
            return
        }

        setUploading(true)

        try {
            const { user } = await getCurrentUser()
            if (!user) throw new Error('Not authenticated')

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `profile-photos/${fileName}`

            // Use the API wrapper instead of direct supabase client
            const { publicUrl } = await uploadFile(file, filePath, 'filmmaker-assets');

            handleChange('profilePhoto', publicUrl)
        } catch (error: any) {
            setErrors({ ...errors, profilePhoto: error.message })
        } finally {
            setUploading(false)
        }
    }

    const validate = () => {
        const newErrors: any = {}

        // Profile photo is essential for a professional filmmaker profile
        if (!data.profilePhoto?.trim()) {
            newErrors.profilePhoto = 'Profile photo is required for your public profile'
        }

        if (!data.stageName?.trim()) {
            newErrors.name = 'Stage Name is required'
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
                        {data.profilePhoto ? (
                            <div className="image-preview">
                                <img src={data.profilePhoto} alt="Profile" />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => handleChange('profilePhoto', '')}
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
                                    <span className="upload-icon"><Upload size={32} /></span>
                                    <span>{uploading ? 'Uploading...' : 'Click to upload photo'}</span>
                                    <small>JPG, PNG or GIF (max 5MB)</small>
                                </div>
                            </label>
                        )}
                    </div>
                    {errors.profilePhoto && (
                        <span className="error-message">{errors.profilePhoto}</span>
                    )}
                </div>

                {/* Name */}
                <div className="form-group">
                    <label htmlFor="stageName">
                        <User size={18} /> Stage / Screen Name *
                    </label>
                    <input
                        id="stageName"
                        type="text"
                        placeholder="e.g., Rajinikanth"
                        value={data.stageName || ''}
                        onChange={(e) => handleChange('stageName', e.target.value)}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* Legal Name */}
                <div className="form-group">
                    <label htmlFor="legalName">
                        <FileText size={18} /> Legal Name
                    </label>
                    <input
                        id="legalName"
                        type="text"
                        placeholder="e.g., Shivaji Rao Gaikwad"
                        value={data.legalName || ''}
                        onChange={(e) => handleChange('legalName', e.target.value)}
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">
                        <Mail size={18} /> Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={data.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Pronouns */}
                <div className="form-group">
                    <label htmlFor="pronouns">
                        <User size={18} /> Pronouns
                    </label>
                    <select
                        id="pronouns"
                        value={data.pronouns || ''}
                        onChange={(e) => handleChange('pronouns', e.target.value)}
                    >
                        <option value="">Select...</option>
                        {PRONOUNS.map((pronoun) => (
                            <option key={pronoun} value={pronoun}>
                                {pronoun}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone */}
                <div className="form-group">
                    <label htmlFor="phone">
                        <Phone size={18} /> Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={data.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="dateOfBirth">
                        <Calendar size={18} /> Date of Birth
                    </label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        value={data.dateOfBirth || ''}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                </div>

                {/* Nationality */}
                <div className="form-group">
                    <label htmlFor="nationality">
                        <Globe size={18} /> Nationality
                    </label>
                    <input
                        id="nationality"
                        type="text"
                        placeholder="e.g., Indian"
                        value={data.nationality || ''}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                    />
                </div>

                {/* Country */}
                <div className="form-group">
                    <label htmlFor="country">
                        <MapPin size={18} /> Current Country *
                    </label>
                    <select
                        id="country"
                        value={data.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className={errors.country ? 'error' : ''}
                    >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.country && <span className="error-message">{errors.country}</span>}
                </div>

                {/* Current State */}
                <div className="form-group">
                    <label htmlFor="currentState">
                        <MapPin size={18} /> Current State/Province
                    </label>
                    <select
                        id="currentState"
                        value={data.currentState || ''}
                        onChange={(e) => handleChange('currentState', e.target.value)}
                        disabled={!data.country}
                    >
                        <option value="">Select State</option>
                        {getStatesRequest(data.country).map((state) => (
                            <option key={state.isoCode} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Current Location (City) */}
                <div className="form-group">
                    <label htmlFor="currentCity">
                        <MapPin size={18} /> Current City
                    </label>
                    <input
                        id="currentCity"
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={data.currentCity || ''}
                        onChange={(e) => handleChange('currentCity', e.target.value)}
                    />
                </div>

                {/* Native Country */}
                <div className="form-group">
                    <label htmlFor="nativeCountry">
                        <MapPin size={18} /> Native / Home Country
                    </label>
                    <select
                        id="nativeCountry"
                        value={data.nativeCountry || ''}
                        onChange={(e) => handleChange('nativeCountry', e.target.value)}
                    >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    <small className="form-hint">Required to select Native State</small>
                </div>

                {/* Native State */}
                <div className="form-group">
                    <label htmlFor="nativeState">
                        <MapPin size={18} /> Native State/Province
                    </label>
                    <select
                        id="nativeState"
                        value={data.nativeState || ''}
                        onChange={(e) => handleChange('nativeState', e.target.value)}
                        disabled={!data.nativeCountry}
                    >
                        <option value="">Select State</option>
                        {getStatesRequest(data.nativeCountry).map((state) => (
                            <option key={state.isoCode} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Native Location (City) */}
                <div className="form-group">
                    <label htmlFor="nativeCity">
                        <MapPin size={18} /> Native City / Home Town
                    </label>
                    <input
                        id="nativeCity"
                        type="text"
                        placeholder="e.g., Chennai"
                        value={data.nativeCity || ''}
                        onChange={(e) => handleChange('nativeCity', e.target.value)}
                    />
                </div>

                {/* Languages */}
                <div className="form-group">
                    <label htmlFor="languages">
                        <Globe size={18} /> Languages Spoken
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <select
                            id="languageSelect"
                            style={{ flex: 1 }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (!val) return;
                                const current = data.languages ? data.languages.split(',').map((s: string) => s.trim()) : [];
                                if (!current.includes(val)) {
                                    handleChange('languages', [...current, val].join(', '));
                                }
                                e.target.value = ''; // Reset select
                            }}
                        >
                            <option value="">Select Language to Add...</option>
                            {LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {data.languages && data.languages.split(',').filter((s: string) => s.trim()).map((lang: string, index: number) => (
                            <span key={index} style={{
                                background: '#f4f4f5',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: '1px solid #e4e4e7'
                            }}>
                                {lang.trim()}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = data.languages.split(',').map((s: string) => s.trim());
                                        const newVal = current.filter((l: string) => l !== lang.trim()).join(', ');
                                        handleChange('languages', newVal);
                                    }}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#71717a' }}
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                    {(!data.languages || data.languages.length === 0) && (
                        <small className="form-hint">Select languages from the dropdown</small>
                    )}
                </div>

                {/* Preferred Way of Contact */}
                <div className="form-group">
                    <label htmlFor="preferredContact">
                        <MessageCircle size={18} /> Preferred Way to Contact
                    </label>
                    <select
                        id="preferredContact"
                        value={data.preferredContact || ''}
                        onChange={(e) => handleChange('preferredContact', e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter / X</option>
                        <option value="Facebook">Facebook</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Website">Personal Website</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                    </select>
                    <small className="form-hint">How do you prefer collaborators to reach you?</small>
                </div>



                {/* Education & Training */}
                <div className="form-group full-width">
                    <label htmlFor="eduTraining">
                        <FileText size={18} /> Education & Training
                    </label>
                    <textarea
                        id="eduTraining"
                        rows={3}
                        placeholder="e.g. MFA in Filmmaking from NYU, Acting Workshop at NSD..."
                        value={data.educationTraining || ''}
                        onChange={(e) => handleChange('educationTraining', e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" disabled style={{ visibility: 'hidden' }}>
                    Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next: Professional Details →
                </button>
            </div>
        </div>
    )
}
