'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import '../app/filmmakers/[id]/profile.css'


import FilmGallery from './FilmGallery';
import ProducerDashboard from './ProducerDashboard';
import { Lock, MapPin } from 'lucide-react';

interface ProfilePreviewProps {
    data: any
    initialViewMode?: 'audience' | 'producer'
    showToggle?: boolean
    isLoggedIn?: boolean
}

export default function ProfileView({
    data,
    initialViewMode = 'audience',
    showToggle = true,
    isLoggedIn = true
}: ProfilePreviewProps) {
    const [viewMode, setViewMode] = useState<'audience' | 'producer'>(initialViewMode)

    const handleViewChange = (mode: 'audience' | 'producer') => {
        if (mode === 'producer' && !isLoggedIn) {
            const confirmLogin = window.confirm("You must be logged in to view sensitive industry details.\n\nGo to login page?");
            if (confirmLogin) {
                window.location.href = '/login';
            }
            return;
        }
        setViewMode(mode);
    }

    const getInitials = (name: string) => {
        return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'CV'
    }

    const getThemeVariable = (roles: string[]) => {
        if (!roles || roles.length === 0) return 'var(--theme-default)';
        const primary = roles[0].toLowerCase();
        if (primary.includes('director')) return 'var(--theme-director)';
        if (primary.includes('cinematographer') || primary.includes('dop')) return 'var(--theme-cinematographer)';
        if (primary.includes('editor')) return 'var(--theme-editor)';
        if (primary.includes('producer')) return 'var(--theme-producer)';
        if (primary.includes('writer')) return 'var(--theme-writer)';
        return 'var(--theme-default)';
    }

    const primaryRoles = data.primary_roles && data.primary_roles.length > 0
        ? data.primary_roles
        : (data.roles || []).slice(0, 2);

    const generateTemplateBio = (d: any) => {
        const roles = d.primary_roles?.join(' & ') || d.roles?.[0] || 'Filmmaker';
        const location = d.current_location || d.native_location || 'based in India';
        const exp = d.years_active ? `with over ${d.years_active} of experience` : '';
        const style = d.style ? `known for their ${d.style.toLowerCase()} approach` : '';

        let bio = `${d.name} is a professional ${roles} ${location} ${exp}.`;
        if (style) bio += ` They are ${style}.`;
        if (d.philosophy) bio += ` \n\n"${d.philosophy}"`;
        return bio;
    };

    const getSortedSocials = (d: any) => {
        const order = ['website', 'instagram', 'youtube', 'imdb', 'letterboxd', 'twitter', 'facebook', 'linkedin'];
        const links: { type: string, url: string }[] = [];
        order.forEach(type => {
            if (d[type]) links.push({ type, url: d[type] });
        });
        return links;
    };

    const themeGradient = getThemeVariable(primaryRoles);

    const secondaryRoles = data.secondary_roles || (
        data.primary_roles ? [] : (data.roles || []).slice(2)
    );

    const handleShare = async () => {
        const shareData = {
            title: `Check out ${data.name} on CineGrok`,
            text: `View ${data.name}'s filmmaker profile on CineGrok.`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }
    };

    return (
        <div className="profile-page" style={{ '--role-theme': themeGradient } as React.CSSProperties}>
            {showToggle && (
                <div className="view-mode-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{data.name || 'Profile'}</span>
                    <div className="view-toggle" style={{
                        display: 'flex',
                        background: '#f4f4f5',
                        padding: '4px',
                        borderRadius: '100px',
                        border: '1px solid #e4e4e7'
                    }}>
                        <button
                            type="button"
                            onClick={() => handleViewChange('audience')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '100px',
                                border: 'none',
                                background: viewMode === 'audience' ? '#fff' : 'transparent',
                                color: viewMode === 'audience' ? '#18181b' : '#71717a',
                                fontWeight: viewMode === 'audience' ? '600' : '500',
                                boxShadow: viewMode === 'audience' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            Audience
                        </button>
                        <button
                            type="button"
                            onClick={() => handleViewChange('producer')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '100px',
                                border: 'none',
                                background: viewMode === 'producer' ? '#0f172a' : 'transparent',
                                color: viewMode === 'producer' ? '#f8fafc' : '#71717a',
                                fontWeight: viewMode === 'producer' ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.9rem'
                            }}
                        >
                            Producer
                            {!isLoggedIn && <Lock size={14} style={{ opacity: 0.7 }} />}
                        </button>
                    </div>
                </div>
            )}

            {/* If Producer View, render Dashboard ONLY */}
            {viewMode === 'producer' ? (
                <div className="profile-container">
                    <ProducerDashboard films={data.films || []} filmmakerName={data.name} />
                </div>
            ) : (
                <div className="profile-preview-card audience-view">

                    {/* VISION FIRST HERO */}
                    {data.philosophy && (
                        <div className="hero-quote-container">
                            <blockquote className="hero-quote">
                                {data.philosophy}
                            </blockquote>
                        </div>
                    )}

                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="header-content">
                                {data.profile_photo_url ? (
                                    <img src={data.profile_photo_url} alt={data.name} className="profile-photo" />
                                ) : (
                                    <div className="profile-photo-initials">
                                        {getInitials(data.name)}
                                    </div>
                                )}

                                <div className="profile-info-content">
                                    <h1 className="profile-name">
                                        {data.name}
                                    </h1>
                                    <div className="profile-role">
                                        {primaryRoles.join(' / ')}
                                        {secondaryRoles && secondaryRoles.length > 0 && (
                                            <span style={{ fontSize: '0.9em', color: '#71717a', marginLeft: '0.5rem' }}>
                                                + {secondaryRoles.join(', ')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="profile-location">
                                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        {data.current_location || data.country || 'Location'}
                                    </div>

                                    <div className="social-links">
                                        {getSortedSocials(data).map(s => (
                                            <a key={s.type} href={s.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                                                {s.type} ↗
                                            </a>
                                        ))}
                                        <button
                                            onClick={handleShare}
                                            className="social-icon"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                fontSize: 'inherit',
                                                padding: 0
                                            }}
                                        >
                                            Export / Share ↗
                                        </button>
                                    </div>

                                    {/* Preferred Contact display could go here */}
                                </div>
                            </div>
                        </div>

                        <div className="profile-content">
                            {/* LEFT COLUMN: Main (Bio + Films) */}
                            <div className="content-main">
                                <section className="bio-section">
                                    <h2>About</h2>
                                    <div className="bio-text">
                                        {(data.generated_bio || generateTemplateBio(data)).split('\n\n').map((p: string, i: number) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                </section>

                                {data.films && data.films.length > 0 && (
                                    <section className="films-section">
                                        <h2>Filmography</h2>
                                        <FilmGallery films={data.films} />
                                    </section>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Sidebar (DNA) */}
                            <aside className="content-sidebar">
                                {(data.genres || data.style) && (
                                    <div className="info-box">
                                        <h3>Creative DNA</h3>
                                        {data.genres && (
                                            <div className="tags-container">
                                                {(Array.isArray(data.genres) ? data.genres : [data.genres]).map((g: string) => (
                                                    <span key={g} className="creative-tag">{g}</span>
                                                ))}
                                            </div>
                                        )}
                                        {data.style && (
                                            <div>
                                                <span className="meta-tag-label">Visual Style</span>
                                                <p className="meta-description">{data.style}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="info-box">
                                    <h3>Influences</h3>
                                    <p className="meta-description" style={{ fontStyle: 'italic' }}>
                                        Satyajit Ray, Wong Kar-wai, Andrei Tarkovsky, Mani Kaul
                                    </p>
                                </div>

                                <div className="info-box">
                                    <span className="meta-tag-label">Status</span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                        <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Open for Collaboration</span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
