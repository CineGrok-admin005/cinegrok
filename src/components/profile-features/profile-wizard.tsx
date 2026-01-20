'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileData } from './types';
import '../ProfileForm/styles.css';

// Modular Components
import PersonalInfoForm from '@/components/ProfileForm/PersonalInfoForm';
import ProfessionalDetailsForm from '@/components/ProfileForm/ProfessionalDetailsForm';
import FilmographyForm from '@/components/ProfileForm/FilmographyForm';
import SocialLinksForm from '@/components/ProfileForm/SocialLinksForm';
import EducationForm from '@/components/ProfileForm/EducationForm';
import ReviewProfile from '@/components/ProfileForm/ReviewProfile';

interface ProfileWizardProps {
  initialData?: Partial<ProfileData>;
  onComplete: (data: ProfileData) => void;
}

const TOTAL_STEPS = 6;
const STEP_LABELS = ['Personal', 'Professional', 'Films', 'Social', 'Education', 'Preview'];

/**
 * Profile Wizard Component
 * 
 * Uses URL query params (?step=x) for step management.
 * This allows browser back/forward buttons to work naturally.
 */
export function ProfileWizard({ initialData, onComplete }: ProfileWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get step from URL, default to 1
  const urlStep = parseInt(searchParams.get('step') || '1', 10);
  const [step, setStepState] = useState(
    Math.min(Math.max(1, urlStep), TOTAL_STEPS)
  );

  const [formData, setFormData] = useState<Partial<ProfileData>>({
    filmography: [],
    primaryRoles: [],
    secondaryRoles: [],
    preferredGenres: [],
    ...initialData
  });

  // Sync step with URL on mount and URL changes
  useEffect(() => {
    const newStep = parseInt(searchParams.get('step') || '1', 10);
    const clampedStep = Math.min(Math.max(1, newStep), TOTAL_STEPS);
    if (clampedStep !== step) {
      setStepState(clampedStep);
    }
  }, [searchParams]);

  // Update URL when step changes
  const setStep = useCallback((newStep: number) => {
    const clampedStep = Math.min(Math.max(1, newStep), TOTAL_STEPS);
    setStepState(clampedStep);

    // Update URL without full navigation
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', clampedStep.toString());
    router.push(`/profile-builder?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handle popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newStep = parseInt(params.get('step') || '1', 10);
      setStepState(Math.min(Math.max(1, newStep), TOTAL_STEPS));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(formData).length > 5) { // Has significant data
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  const updateFormData = (newData: Partial<ProfileData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('[ProfileWizard] handleSubmit called');
    console.log('[ProfileWizard] formData:', formData);
    
    if (formData.stageName && formData.email && formData.country && formData.primaryRoles && formData.primaryRoles.length > 0) {
      // Save form data to localStorage - SIMPLE AND RELIABLE
      const dataToSave = JSON.stringify(formData);
      localStorage.setItem('cinegrok_profile_draft', dataToSave);
      console.log('[ProfileWizard] Saved to localStorage, keys:', Object.keys(formData));
      
      // Redirect to plans page
      router.push('/plans?from=profile-builder');
    } else {
      console.log('[ProfileWizard] Missing required fields:', { 
        stageName: formData.stageName, 
        email: formData.email, 
        country: formData.country, 
        primaryRoles: formData.primaryRoles 
      });
      alert('Please fill in all required fields: Stage Name, Email, Country, and at least one Primary Role');
    }
  };

  const handleStepClick = (targetStep: number) => {
    // Only allow going back to completed steps
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  return (
    <div className="profile-builder-page">
      <div className="profile-builder-container">
        {/* Header with Step Indicator */}
        <div className="steps-header">
          <h1>Create Your Profile</h1>
          <div className="steps-indicator">
            {STEP_LABELS.map((label, index) => {
              const stepNum = index + 1;
              return (
                <div
                  key={stepNum}
                  className={`step ${step === stepNum ? 'active' : ''} ${step > stepNum ? 'completed' : ''}`}
                  onClick={() => handleStepClick(stepNum)}
                  style={{ cursor: step > stepNum ? 'pointer' : 'default' }}
                >
                  <div className="step-number">
                    {step > stepNum ? '✓' : stepNum}
                  </div>
                  <div className="step-title">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          {step === 1 && (
            <PersonalInfoForm
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <ProfessionalDetailsForm
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <FilmographyForm
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 4 && (
            <SocialLinksForm
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 5 && (
            <EducationForm
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 6 && (
            <ReviewProfile
              data={formData as ProfileData}
              onBack={handleBack}
              onPublish={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}