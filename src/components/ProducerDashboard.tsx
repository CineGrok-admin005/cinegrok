/**
 * ProducerDashboard Component
 * 
 * Evaluation lens for producers.
 * Visualizes career data: Scale, Roles, Formats, Activity.
 */

'use client'

import { Film } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './ProducerDashboard.css'

interface ProducerDashboardProps {
    films: Film[]
    filmmakerName: string
}

export default function ProducerDashboard({ films, filmmakerName }: ProducerDashboardProps) {
    // 1. Lifecycle Stats
    const statusCounts = films.reduce((acc, film) => {
        const s = film.production_status || 'Archived'
        acc[s] = (acc[s] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const lifecycleData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // 2. Role Spread
    const roleCounts = films.reduce((acc, film) => {
        const primary = film.primary_role || film.role || 'Unknown'
        acc[primary] = (acc[primary] || 0) + 1

        if (film.additional_roles) {
            film.additional_roles.forEach(r => {
                acc[r] = (acc[r] || 0) + 1
            })
        }
        return acc
    }, {} as Record<string, number>)

    // 3. Scale Exposure
    const scaleCounts = films.reduce((acc, film) => {
        const s = film.crew_scale || 'Unknown'
        acc[s] = (acc[s] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const scaleData = Object.entries(scaleCounts).map(([name, value]) => ({ name, value }));

    // 4. Format Experience
    const formatCounts = films.reduce((acc, film) => {
        const f = film.project_format || 'Other'
        acc[f] = (acc[f] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const formatData = Object.entries(formatCounts).map(([name, value]) => ({ name, value }));

    // 5. Genres
    const allGenres = Array.from(new Set(
        films.flatMap(f => Array.isArray(f.genre) ? f.genre : [f.genre].filter(Boolean))
    ))

    // Sorted Years for Activity
    const sortedFilms = [...films].sort((a, b) => parseInt(b.year || '0') - parseInt(a.year || '0'))

    // Derived Experience Snapshot
    const years = films.map(f => parseInt(f.year || '0')).filter(y => y > 0);
    const firstYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();
    const activeSince = firstYear;
    const totalProjects = films.length;

    // Top Roles
    const topRoles = Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(r => r[0])
        .join(', ');

    // PREMIUM EMPTY STATE
    if (!films || films.length === 0) {
        return (
            <div className="producer-dashboard">
                <header className="dashboard-header" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <div className="dashboard-title">
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Producer Evaluation View</h1>
                        <p style={{ color: '#666' }}>Objective Data: {filmmakerName}</p>
                    </div>
                </header>

                <div className="empty-state-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 1rem',
                    background: '#fcfcfa',
                    borderRadius: '12px',
                    border: '1px dashed #e2e2e2',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#f1f3f5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        color: '#adb5bd'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <line x1="7" y1="2" x2="7" y2="22"></line>
                            <line x1="17" y1="2" x2="17" y2="22"></line>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <line x1="2" y1="7" x2="7" y2="7"></line>
                            <line x1="2" y1="17" x2="7" y2="17"></line>
                            <line x1="17" y1="17" x2="22" y2="17"></line>
                            <line x1="17" y1="7" x2="22" y2="7"></line>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Film Data Available</h3>
                    <p style={{ color: '#666', maxWidth: '400px', marginBottom: '2rem' }}>
                        This profile hasn't added any projects yet. Share this profile to encourage them to update their filmography.
                    </p>
                    {/* Placeholder Charts to maintain structure feel */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', maxWidth: '600px', opacity: 0.3, filter: 'grayscale(1)' }}>
                        <div style={{ height: '80px', background: '#e9ecef', borderRadius: '4px' }}></div>
                        <div style={{ height: '80px', background: '#e9ecef', borderRadius: '4px' }}></div>
                        <div style={{ height: '80px', background: '#e9ecef', borderRadius: '4px' }}></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="producer-dashboard">
            <header className="dashboard-header" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <div className="dashboard-title">
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Producer Evaluation View</h1>
                    <p style={{ color: '#666' }}>Objective Data: {filmmakerName}</p>
                </div>
                <div className="evaluation-badge" style={{
                    background: '#f8f9fa',
                    color: '#666',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                }}>
                    INTERNAL VIEW
                </div>
            </header>

            {/* SUMMARY ROW: Objective Snapshots */}
            <div className="dashboard-grid dashboard-stats-grid" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
                <div className="summary-card" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Experience</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Active Since {activeSince}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{totalProjects} Total Projects</div>
                </div>
                <div className="summary-card" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Primary Focus</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{topRoles || 'N/A'}</div>
                </div>
                <div className="summary-card" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Collaboration</div>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: '#e6fcf5',
                        color: '#0ca678',
                        borderRadius: '100px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        Available
                    </div>
                </div>
            </div>

            {/* ANALYTICS GRID */}
            <div className="dashboard-analytics-grid" style={{ gap: '2rem', marginBottom: '3rem' }}>

                {/* 1. Project Lifecycle */}
                <div className="chart-card" style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Project Lifecycle</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lifecycleData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                <Bar dataKey="value" fill="#339af0" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Scale Handling */}
                <div className="chart-card" style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Crew Scale Handling</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scaleData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                <Bar dataKey="value" fill="#51cf66" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Format Experience */}
                <div className="chart-card" style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Format Experience</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formatData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                <Bar dataKey="value" fill="#fcc419" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Role Spread */}
                <div className="chart-card" style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Role Involvement</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.entries(roleCounts)
                            .sort((a, b) => b[1] - a[1])
                            .map(([role, count]) => (
                                <div key={role} style={{
                                    padding: '6px 12px',
                                    background: count > 1 ? '#e9ecef' : '#f8f9fa',
                                    borderRadius: '100px',
                                    fontSize: '0.9rem',
                                    fontWeight: count > 1 ? 600 : 400
                                }}>
                                    {role} <span style={{ opacity: 0.6 }}>({count})</span>
                                </div>
                            ))}
                    </div>
                </div>

            </div>

            {/* 5. Comprehensive Project List */}
            <div className="dashboard-card col-span-12">
                <div className="card-title" style={{ marginBottom: '1rem', fontWeight: 600 }}>Project Activity Timeline</div>
                <table className="activity-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', fontSize: '0.9rem', textAlign: 'left' }}>
                            <th style={{ padding: '0.8rem' }}>Year</th>
                            <th style={{ padding: '0.8rem' }}>Project</th>
                            <th style={{ padding: '0.8rem' }}>Format</th>
                            <th style={{ padding: '0.8rem' }}>Status</th>
                            <th style={{ padding: '0.8rem' }}>Role</th>
                            <th style={{ padding: '0.8rem' }}>Scale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFilms.map((film) => (
                            <tr key={film.id || `film-${film.year}-${film.title}`} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.8rem' }}>{film.year}</td>
                                <td style={{ padding: '0.8rem' }}><strong>{film.title}</strong></td>
                                <td style={{ padding: '0.8rem' }}>{film.project_format}</td>
                                <td style={{ padding: '0.8rem' }}>
                                    <span className={`status-dot status-${(film.production_status || '').toLowerCase().split(' ')[0]}`} style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ccc', marginRight: '6px' }}></span>
                                    {film.production_status}
                                </td>
                                <td style={{ padding: '0.8rem' }}>{film.primary_role || film.role}</td>
                                <td style={{ padding: '0.8rem' }}>
                                    {film.crew_scale && (
                                        <span className="scale-badge" style={{ fontSize: '0.8rem', padding: '2px 6px', background: '#eee', borderRadius: '4px' }}>{film.crew_scale}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
