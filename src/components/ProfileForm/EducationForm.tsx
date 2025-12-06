/**
 * Education Form Component
 * 
 * Step 5: Educational background
 */

'use client'

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
                <div className="form-group full-width">
                    <label htmlFor="schooling">Schooling (10th Grade)</label>
                    <input
                        id="schooling"
                        type="text"
                        placeholder="School name and year"
                        value={data.schooling || ''}
                        onChange={(e) => handleChange('schooling', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="higher_secondary">Higher Secondary (12th Grade)</label>
                    <input
                        id="higher_secondary"
                        type="text"
                        placeholder="School/College name and year"
                        value={data.higher_secondary || ''}
                        onChange={(e) => handleChange('higher_secondary', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="undergraduate">Undergraduate (UG)</label>
                    <input
                        id="undergraduate"
                        type="text"
                        placeholder="Degree, Institution, Year"
                        value={data.undergraduate || ''}
                        onChange={(e) => handleChange('undergraduate', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="postgraduate">Postgraduate (PG)</label>
                    <input
                        id="postgraduate"
                        type="text"
                        placeholder="Degree, Institution, Year"
                        value={data.postgraduate || ''}
                        onChange={(e) => handleChange('postgraduate', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="phd">PhD (if applicable)</label>
                    <input
                        id="phd"
                        type="text"
                        placeholder="Research topic, Institution, Year"
                        value={data.phd || ''}
                        onChange={(e) => handleChange('phd', e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="certifications">Certifications or Workshops</label>
                    <textarea
                        id="certifications"
                        rows={4}
                        placeholder="List any film-related certifications, workshops, or training programs..."
                        value={data.certifications || ''}
                        onChange={(e) => handleChange('certifications', e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next: Preview →
                </button>
            </div>
        </div>
    )
}
