/**
 * Profile Builder - Main Page
 * 
 * Multi-step form wizard for creating filmmaker profiles
 */

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PersonalInfoForm from '@/components/ProfileForm/PersonalInfoForm'
import ProfessionalDetailsForm from '@/components/ProfileForm/ProfessionalDetailsForm'
import FilmographyForm from '@/components/ProfileForm/FilmographyForm'
import SocialLinksForm from '@/components/ProfileForm/SocialLinksForm'
import EducationForm from '@/components/ProfileForm/EducationForm'
import ProfilePreview from '@/components/ProfilePreview'
import './profile-builder.css'

const STEPS = [
    { id: 1, title: 'Personal Info', component: 'personal' },
    { id: 2, title: 'Professional Details', component: 'professional' },
    { id: 3, title: 'Filmography', component: 'filmography' },
    { id: 4, title: 'Social Links', component: 'social' },
    { id: 5, title: 'Education', component: 'education' },
    { id: 6, title: 'Preview', component: 'preview' },
]

export default function ProfileBuilderPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<any>({
        // Personal Info
        name: '',
        email: '',
        pronouns: '',
        dob: '',
        profile_photo_url: '',

        // Location
        country: '',
        current_location: '',
        current_state: '',
        native_location: '',
        native_state: '',
        nationality: '',
        languages: '',

        // Professional
        roles: [],
        years_active: '',
        genres: [],
        style: '',
        influences: '',
        philosophy: '',
        belief: '',
        message: '',
        signature: '',

        // Collaboration
        open_to_collab: '',
        availability: '',
        work_location: '',

        // Films
        films: [],

        // Social Links
        instagram: '',
        youtube: '',
        imdb: '',
        linkedin: '',
        twitter: '',
        facebook: '',
        website: '',
        letterboxd: '',

        // Education
        schooling: '',
        higher_secondary: '',
        undergraduate: '',
        postgraduate: '',
        phd: '',
        certifications: '',

        // Awards & Press
        awards: '',
        screenings: '',
        press: '',

        // AI Generated
        ai_generated_bio: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [draftId, setDraftId] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()

    // Load draft on mount
    useEffect(() => {
        loadDraft()
    }, [])


    // Auto-save draft every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStep < 6) {
                saveDraft()
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [formData, currentStep])

    const loadDraft = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Try to load draft first
        const { data: draft } = await supabase
            .from('profile_drafts')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()

        if (draft) {
            setFormData(draft.draft_data)
            setCurrentStep(draft.current_step)
            setDraftId(draft.id)
        } else {
            // 2. If no draft, check for existing published profile (Edit Mode)
            const { data: filmmaker } = await supabase
                .from('filmmakers')
                .select('raw_form_data, id')
                .eq('user_id', user.id)
                .single()

            if (filmmaker && filmmaker.raw_form_data) {
                setFormData(filmmaker.raw_form_data)
                // Start at beginning for edit, or maybe preview? Let's start at 1
                setCurrentStep(1)
            }
        }
    }

    const saveDraft = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const draftData = {
            user_id: user.id,
            draft_data: formData,
            current_step: currentStep,
            is_complete: currentStep === 6,
            last_saved_at: new Date().toISOString(),
        }

        if (draftId) {
            await supabase
                .from('profile_drafts')
                .update(draftData)
                .eq('id', draftId)
        } else {
            const { data } = await supabase
                .from('profile_drafts')
                .insert([draftData])
                .select('id')
                .single()

            if (data) setDraftId(data.id)
        }
    }

    const updateFormData = (newData: any) => {
        setFormData({ ...formData, ...newData })
    }

    const nextStep = async () => {
        await saveDraft()
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const goToStep = (step: number) => {
        setCurrentStep(step)
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // BETA LAUNCH: Subscription check disabled - All users can publish for free
            // Uncomment this block when ready to enforce paid subscriptions
            /*
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_status')
                .eq('id', user.id)
                .single()

            const hasActiveSubscription =
                profile?.subscription_status === 'active' ||
                profile?.subscription_status === 'trialing'

            if (!hasActiveSubscription) {
                router.push('/pricing')
                return
            }
            */

            // Check for existing filmmaker profile to decide Insert vs Update
            const { data: existingFilmmaker } = await supabase
                .from('filmmakers')
                .select('id')
                .eq('user_id', user.id)
                .single()

            let filmmakerId = existingFilmmaker?.id;

            if (existingFilmmaker) {
                // UPDATE existing profile
                const { error: updateError } = await supabase
                    .from('filmmakers')
                    .update({
                        name: formData.name,
                        // profile_url: ... // Keeping strict URL based on first creation or allowing update? Let's keep URL stable for SEO usually
                        raw_form_data: formData,
                        ai_generated_bio: formData.ai_generated_bio,
                        // status: 'published', // Already published
                        // published_at: ... // Keep original date
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingFilmmaker.id)

                if (updateError) throw updateError
            } else {
                // INSERT new profile
                const { data: newFilmmaker, error: insertError } = await supabase
                    .from('filmmakers')
                    .insert([{
                        user_id: user.id,
                        name: formData.name,
                        profile_url: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                        raw_form_data: formData,
                        ai_generated_bio: formData.ai_generated_bio,
                        status: 'published',
                        published_at: new Date().toISOString(),
                    }])
                    .select('id')
                    .single()

                if (insertError) throw insertError
                filmmakerId = newFilmmaker.id
            }

            // Update profile with filmmaker_id (idempotent)
            await supabase
                .from('profiles')
                .update({ filmmaker_id: filmmakerId })
                .eq('id', user.id)

            // Delete draft
            if (draftId) {
                await supabase
                    .from('profile_drafts')
                    .delete()
                    .eq('id', draftId)
            }

            // Redirect to profile
            router.push(`/filmmakers/${filmmakerId}`)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoForm
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                    />
                )
            case 2:
                return (
                    <ProfessionalDetailsForm
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )
            case 3:
                return (
                    <FilmographyForm
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )
            case 4:
                return (
                    <SocialLinksForm
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )
            case 5:
                return (
                    <EducationForm
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )
            case 6:
                return (
                    <ProfilePreview
                        data={formData}
                        updateData={updateFormData}
                        onBack={prevStep}
                        onPublish={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="profile-builder-page">
            <div className="profile-builder-container">
                <div className="profile-builder-header">
                    <h1>Create Your Filmmaker Profile</h1>
                    <div className="step-indicator">
                        Step {currentStep} of 6
                    </div>

                </div>

                {/* Form Content */}
                <div className="form-content">
                    {renderStep()}
                </div>

                {/* Auto-save indicator */}
                <div className="auto-save-indicator">
                    <span className="save-icon">💾</span>
                    <span>Auto-saving...</span>
                </div>
            </div>
        </div>
    )
}
