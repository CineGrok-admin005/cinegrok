'use client';

import React, { useState } from 'react';
import { ProfileData } from './types';
import '../ProfileForm/styles.css'; // Import legacy styles

// Modular Components (Legacy Style)
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

export function ProfileWizard({ initialData, onComplete }: ProfileWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    filmography: [],
    primaryRoles: [],
    secondaryRoles: [],
    preferredGenres: [],
    ...initialData
  });

  const totalSteps = 6;
  // const progress = (step / totalSteps) * 100; // Not used in legacy design

  const updateFormData = (newData: Partial<ProfileData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (formData.stageName && formData.email && formData.country && formData.primaryRoles && formData.primaryRoles.length > 0) {
      onComplete(formData as ProfileData);
    } else {
      alert('Please fill in all required fields: Stage Name, Email, Country, and at least one Primary Role');
    }
  };

  return (
    <div className="profile-builder-page">
      <div className="profile-builder-container">

        {/* Legacy Header */}
        <div className="steps-header">
          <h1>Create Your Profile</h1>
          <div className="steps-indicator">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div key={s} className={`step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`} onClick={() => { if (step > s) setStep(s) }}>
                <div className="step-number">{step > s ? '✓' : s}</div>
                <div className="step-title">
                  {s === 1 && 'Personal'}
                  {s === 2 && 'Professional'}
                  {s === 3 && 'Films'}
                  {s === 4 && 'Social'}
                  {s === 5 && 'Education'}
                  {s === 6 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content Wrapper */}
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