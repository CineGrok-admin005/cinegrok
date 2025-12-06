/**
 * Filmography Form Component
 * 
 * Step 3: Add films and projects
 */

'use client'

import { useState } from 'react'

interface Film {
    title: string
    year: string
    genre: string
    duration: string
    role: string
    synopsis: string
    link: string
    poster: string
}

interface FilmographyFormProps {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function FilmographyForm({
    data,
    updateData,
    onNext,
    onBack,
}: FilmographyFormProps) {
    const films = data.films || []

    const addFilm = () => {
        const newFilm: Film = {
            title: '',
            year: '',
            genre: '',
            duration: '',
            role: '',
            synopsis: '',
            link: '',
            poster: '',
        }
        updateData({ films: [...films, newFilm] })
    }

    const updateFilm = (index: number, field: keyof Film, value: string) => {
        const updatedFilms = [...films]
        updatedFilms[index] = { ...updatedFilms[index], [field]: value }
        updateData({ films: updatedFilms })
    }

    const removeFilm = (index: number) => {
        const updatedFilms = films.filter((_: any, i: number) => i !== index)
        updateData({ films: updatedFilms })
    }

    return (
        <div className="form-step">
            <div className="form-step-header">
                <h2>Filmography</h2>
                <p>Showcase your work and projects</p>
            </div>

            <div className="films-list">
                {films.map((film: Film, index: number) => (
                    <div key={index} className="film-card">
                        <div className="film-card-header">
                            <h3>Film {index + 1}</h3>
                            <button
                                type="button"
                                className="btn-remove-small"
                                onClick={() => removeFilm(index)}
                            >
                                Remove
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    placeholder="Film title"
                                    value={film.title}
                                    onChange={(e) => updateFilm(index, 'title', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="text"
                                    placeholder="2023"
                                    value={film.year}
                                    onChange={(e) => updateFilm(index, 'year', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Genre</label>
                                <input
                                    type="text"
                                    placeholder="Drama"
                                    value={film.genre}
                                    onChange={(e) => updateFilm(index, 'genre', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    placeholder="15 min"
                                    value={film.duration}
                                    onChange={(e) => updateFilm(index, 'duration', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Role</label>
                                <input
                                    type="text"
                                    placeholder="Director"
                                    value={film.role}
                                    onChange={(e) => updateFilm(index, 'role', e.target.value)}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Synopsis</label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief description of the film..."
                                    value={film.synopsis}
                                    onChange={(e) => updateFilm(index, 'synopsis', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Film Link (YouTube, Vimeo, etc.)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={film.link}
                                    onChange={(e) => updateFilm(index, 'link', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Poster URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={film.poster}
                                    onChange={(e) => updateFilm(index, 'poster', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary btn-add" onClick={addFilm}>
                    + Add Film
                </button>
            </div>

            {/* Awards & Achievements */}
            <div className="form-grid" style={{ marginTop: '2rem' }}>
                <div className="form-group full-width">
                    <label htmlFor="awards">Awards & Nominations</label>
                    <textarea
                        id="awards"
                        rows={3}
                        placeholder="List your awards and nominations..."
                        value={data.awards || ''}
                        onChange={(e) => updateData({ awards: e.target.value })}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="screenings">Festival Screenings</label>
                    <textarea
                        id="screenings"
                        rows={3}
                        placeholder="Film festivals where your work has been screened..."
                        value={data.screenings || ''}
                        onChange={(e) => updateData({ screenings: e.target.value })}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="press">Press / Media Coverage</label>
                    <textarea
                        id="press"
                        rows={3}
                        placeholder="Media coverage, interviews, articles..."
                        value={data.press || ''}
                        onChange={(e) => updateData({ press: e.target.value })}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next: Social Links →
                </button>
            </div>
        </div>
    )
}
