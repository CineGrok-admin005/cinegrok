'use client'

import { GraduationCap, Award, BookOpen } from 'lucide-react'

interface EducationFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function EducationForm({
    data,
    updateData,
    onNext,
    onBack,
}: EducationFormProps) {
    const handleChange = (field: string, value: string) => {
        updateData({ [field]: value })
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Education</h2>
                <p>Your academic and professional training</p>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="schooling"><BookOpen size={18} /> Schooling (10th Grade)</label>
                    <input
                        id="schooling"
                        type="text"
                        placeholder="School name and year"
                        value={data.schooling || ''}
                        onChange={(e) => handleChange('schooling', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="higherSecondary"><BookOpen size={18} /> Higher Secondary (12th Grade)</label>
                    <input
                        id="higherSecondary"
                        type="text"
                        placeholder="School/College name and year"
                        value={data.higherSecondary || ''}
                        onChange={(e) => handleChange('higherSecondary', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="undergraduate"><GraduationCap size={18} /> Undergraduate (UG)</label>
                    <input
                        id="undergraduate"
                        type="text"
                        placeholder="Degree, Institution, Year"
                        value={data.undergraduate || ''}
                        onChange={(e) => handleChange('undergraduate', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="postgraduate"><GraduationCap size={18} /> Postgraduate (PG)</label>
                    <input
                        id="postgraduate"
                        type="text"
                        placeholder="Degree, Institution, Year"
                        value={data.postgraduate || ''}
                        onChange={(e) => handleChange('postgraduate', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phd"><GraduationCap size={18} /> PhD (if applicable)</label>
                    <input
                        id="phd"
                        type="text"
                        placeholder="Research topic, Institution, Year"
                        value={data.phd || ''}
                        onChange={(e) => handleChange('phd', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="certifications"><Award size={18} /> Certifications or Workshops</label>
                    <textarea
                        id="certifications"
                        rows={4}
                        placeholder="List any film-related certifications, workshops, or training programs..."
                        value={data.certifications || ''}
                        onChange={(e) => handleChange('certifications', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next: Preview & Publish →
                </button>
            </div>
        </div>
    )
}
