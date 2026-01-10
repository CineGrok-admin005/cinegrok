/**
 * FilmGallery Component
 * 
 * Displays the list of films for the Audience View.
 * Clean, aspirational design with Modal for details.
 */

'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Film } from '@/lib/api';
import './FilmGallery.css';

interface FilmGalleryProps {
    films: Film[];
}

export default function FilmGallery({ films }: FilmGalleryProps) {
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

    if (!films || films.length === 0) return null;

    // Filter released work for audience view
    const displayFilms = films.filter(f =>
        !f.production_status || ['Released', 'Released (Public)', 'Festival Run', 'Completed'].includes(f.production_status)
        || !f.production_status // Include if legacy
    );

    const openModal = (film: Film) => {
        setSelectedFilm(film);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedFilm(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <div className="film-gallery-grid">
                {displayFilms.map((film, index) => (
                    <div key={index} className="film-gallery-card">
                        <div className="card-poster-area">
                            {film.poster ? (
                                <Image
                                    src={film.poster}
                                    alt={film.title}
                                    fill
                                    className="poster-image"
                                />
                            ) : (
                                <div className="poster-placeholder">
                                    🎬
                                </div>
                            )}
                        </div>

                        <div className="card-content">
                            <div className="film-title-row">
                                <h3 className="film-title">{film.title}</h3>
                            </div>

                            <div className="film-meta-row">
                                <span>{film.year}</span>
                                {film.project_format && <span>• {film.project_format}</span>}
                                {(film.primary_role || film.role) && (
                                    <span className="film-role-badge">{film.primary_role || film.role}</span>
                                )}
                            </div>

                            <div className="card-actions">
                                {film.link ? (
                                    <a
                                        href={film.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-watch"
                                    >
                                        <span>▶ Watch</span>
                                    </a>
                                ) : (
                                    <button className="btn-watch" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                        Coming Soon
                                    </button>
                                )}

                                <button
                                    className="btn-info"
                                    onClick={() => openModal(film)}
                                    title="More Info"
                                >
                                    ℹ️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedFilm && (
                <div className="film-modal-overlay" onClick={closeModal}>
                    <div className="film-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>×</button>

                        <div className="modal-poster-side">
                            {selectedFilm.poster ? (
                                <Image
                                    src={selectedFilm.poster}
                                    alt={selectedFilm.title}
                                    fill
                                    className="modal-poster-img"
                                />
                            ) : (
                                <div className="poster-placeholder" style={{ fontSize: '5rem' }}>
                                    🎬
                                </div>
                            )}
                        </div>

                        <div className="modal-info-side">
                            <div className="modal-header">
                                <h2 className="modal-title">{selectedFilm.title}</h2>
                                <div className="modal-subtitle">
                                    <span>{selectedFilm.year}</span>
                                    <span>•</span>
                                    <span>{selectedFilm.duration || 'Duration N/A'}</span>
                                    <span>•</span>
                                    <span>{selectedFilm.project_format}</span>
                                </div>
                            </div>

                            <div className="modal-body">
                                {selectedFilm.synopsis && (
                                    <div className="modal-section">
                                        <p className="modal-synopsis">{selectedFilm.synopsis}</p>
                                    </div>
                                )}

                                <div className="modal-grid">
                                    <div className="info-item">
                                        <h4>MY ROLES</h4>
                                        <p>
                                            {selectedFilm.primary_role || selectedFilm.role}
                                            {selectedFilm.additional_roles && selectedFilm.additional_roles.length > 0 && (
                                                <span style={{ color: '#666' }}>
                                                    , {selectedFilm.additional_roles.join(', ')}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <h4>GENRE</h4>
                                        <p>
                                            {Array.isArray(selectedFilm.genre)
                                                ? selectedFilm.genre.join(', ')
                                                : selectedFilm.genre}
                                        </p>
                                    </div>

                                    {(selectedFilm.awards || selectedFilm.screenings) && (
                                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                                            <h4>RECOGNITION</h4>
                                            <p>{selectedFilm.awards} {selectedFilm.screenings && `• ${selectedFilm.screenings}`}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedFilm.link && (
                                <div className="modal-footer-actions">
                                    <a
                                        href={selectedFilm.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-watch-large"
                                    >
                                        ▶ Watch Film
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
