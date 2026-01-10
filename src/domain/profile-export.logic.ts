/**
 * Profile Export Logic
 * 
 * Pure functions for generating exportable profile content.
 * No provider dependencies - only data transformation.
 * Follows /scalable-saas domain isolation rules.
 */

import { Filmmaker, RawFormData } from '../lib/api';

/**
 * Profile data structure for export functions
 * Comprehensive data for candidate shortlisting
 */
interface ExportProfile {
    name: string;
    stageName?: string;
    legalName?: string;
    bio?: string;
    location?: string;
    currentCity?: string;
    country?: string;
    roles?: string[];
    secondaryRoles?: string[];
    yearsActive?: string;
    genres?: string[];
    email?: string;
    phone?: string;
    filmography?: Array<{
        title: string;
        year?: string;
        role?: string;
        format?: string;
        synopsis?: string;
        status?: string;
        crewScale?: string;
        achievements?: Array<{
            type: string;
            eventName?: string;
            result?: string;
            year?: string;
        }>;
    }>;
    visualStyle?: string;
    influences?: string;
    philosophy?: string;
    awards?: string;
    profilePhotoUrl?: string;
    // Producer-specific data
    availability?: string;
    openToCollaborations?: string;
    preferredWorkLocation?: string;
    languages?: string;
    education?: string;
    // Computed stats
    totalProjects?: number;
    totalAwards?: number;
}

/**
 * Extract export-friendly data from a Filmmaker object
 * Includes both Audience and Producer view information for comprehensive shortlisting
 */
export function extractExportData(filmmaker: Filmmaker): ExportProfile {
    const raw = filmmaker.raw_form_data || {};

    // Count achievements
    let totalAwards = 0;
    const filmography = raw.films?.map((f: any) => {
        const achievements = f.achievements || [];
        achievements.forEach((a: any) => {
            if (a.result === 'won' || a.type === 'award') totalAwards++;
        });
        return {
            title: f.title,
            year: f.year,
            role: f.primary_role || f.role,
            format: f.project_format,
            synopsis: f.synopsis,
            status: f.status,
            crewScale: f.crew_scale,
            achievements: achievements.map((a: any) => ({
                type: a.type,
                eventName: a.event_name,
                result: a.result,
                year: a.year
            }))
        };
    }) || [];

    return {
        name: filmmaker.name,
        stageName: raw.stageName || raw.stage_name || filmmaker.name,
        legalName: raw.legalName || raw.legal_name,
        bio: filmmaker.ai_generated_bio || undefined,
        location: [raw.current_location || raw.currentCity, raw.current_state || raw.currentState, raw.country]
            .filter(Boolean)
            .join(', ') || undefined,
        currentCity: raw.currentCity || raw.current_location,
        country: raw.country,
        roles: raw.roles?.split(',').map((r: string) => r.trim()) || raw.primaryRoles || [],
        secondaryRoles: raw.secondaryRoles || [],
        yearsActive: raw.years_active || raw.yearsActive,
        genres: raw.genres?.split(',').map((g: string) => g.trim()) || raw.preferredGenres || [],
        email: raw.email,
        phone: raw.phone,
        filmography,
        visualStyle: raw.style || raw.visualStyle,
        influences: raw.influences || raw.creativeInfluences,
        philosophy: raw.philosophy || raw.creativePhilosophy,
        awards: raw.awards,
        profilePhotoUrl: raw.profile_photo_url || raw.profilePhoto,
        // Producer-specific data for shortlisting
        availability: raw.availability,
        openToCollaborations: raw.openToCollaborations || raw.open_to_collaborations,
        preferredWorkLocation: raw.preferredWorkLocation || raw.preferred_work_location,
        languages: raw.languages,
        education: raw.educationTraining || raw.education,
        // Computed stats
        totalProjects: filmography.length,
        totalAwards
    };
}

/**
 * Generate HTML content for PDF export
 * Print-optimized, A4-friendly design with CineGrok branding
 */
export function generatePDFHTML(profile: ExportProfile): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - Filmmaker Profile</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            color: #18181b;
            line-height: 1.6;
            background: #fff;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
        }
        
        .header {
            border-bottom: 2px solid #18181b;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        
        .header h1 {
            font-size: 36px;
            margin-bottom: 8px;
        }
        
        .header .roles {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #71717a;
        }
        
        .header .location {
            font-size: 14px;
            color: #52525b;
            margin-top: 8px;
        }
        
        .section {
            margin-bottom: 32px;
        }
        
        .section h2 {
            font-size: 18px;
            margin-bottom: 12px;
            color: #18181b;
        }
        
        .section p {
            font-size: 14px;
            color: #3f3f46;
        }
        
        .bio {
            font-size: 15px;
            line-height: 1.8;
            color: #27272a;
            border-left: 3px solid #18181b;
            padding-left: 16px;
        }
        
        .filmography-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        
        .filmography-table th {
            text-align: left;
            padding: 12px 8px;
            border-bottom: 2px solid #18181b;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            display: flex;
            gap: 24px;
            font-size: 13px;
        }
        
        .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 11px;
            color: #a1a1aa;
        }
        
        .footer img {
            height: 20px;
            margin-bottom: 8px;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${profile.stageName || profile.name}</h1>
        ${profile.legalName && profile.legalName !== profile.stageName ? `<div style="font-size: 14px; color: #71717a; margin-bottom: 4px;">(${profile.legalName})</div>` : ''}
        <div class="roles">${profile.roles?.join(' • ') || 'Filmmaker'}</div>
        ${profile.secondaryRoles && profile.secondaryRoles.length > 0 ? `<div style="font-size: 11px; color: #a1a1aa; margin-top: 4px;">Also: ${profile.secondaryRoles.join(', ')}</div>` : ''}
        ${profile.location ? `<div class="location">${profile.location}</div>` : ''}
    </div>
    
    <!-- Quick Stats for Shortlisting -->
    <div class="section" style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
        <div style="display: flex; gap: 32px; flex-wrap: wrap;">
            <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #71717a;">Projects</strong>
                <div style="font-size: 24px; font-weight: 600;">${profile.totalProjects || 0}</div>
            </div>
            <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #71717a;">Awards</strong>
                <div style="font-size: 24px; font-weight: 600;">${profile.totalAwards || 0}</div>
            </div>
            <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #71717a;">Experience</strong>
                <div style="font-size: 24px; font-weight: 600;">${profile.yearsActive || 'N/A'}</div>
            </div>
            <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #71717a;">Availability</strong>
                <div style="font-size: 16px; font-weight: 600;">${profile.availability || 'Not specified'}</div>
            </div>
            <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #71717a;">Collaboration</strong>
                <div style="font-size: 16px; font-weight: 600;">${profile.openToCollaborations || 'Not specified'}</div>
            </div>
        </div>
    </div>
    
    ${profile.bio ? `
    <div class="section">
        <h2>About</h2>
        <p class="bio">${profile.bio}</p>
    </div>
    ` : ''}
    
    ${profile.genres && profile.genres.length > 0 ? `
    <div class="section">
        <h2>Preferred Genres</h2>
        <p>${profile.genres.join(', ')}</p>
    </div>
    ` : ''}
    
    ${profile.filmography && profile.filmography.length > 0 ? `
    <div class="section">
        <h2>Filmography</h2>
        <table class="filmography-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Role</th>
                    <th>Format</th>
                    <th>Awards</th>
                </tr>
            </thead>
            <tbody>
                ${profile.filmography.map(film => {
        const awardCount = film.achievements?.filter(a => a.result === 'won').length || 0;
        return `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.title || ''}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.year || ''}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.role || ''}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.format || ''}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${awardCount > 0 ? awardCount + ' won' : '-'}</td>
                    </tr>`;
    }).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    ${profile.visualStyle || profile.influences || profile.philosophy ? `
    <div class="section">
        <h2>Creative Style</h2>
        ${profile.visualStyle ? `<p><strong>Visual Style:</strong> ${profile.visualStyle}</p>` : ''}
        ${profile.influences ? `<p style="margin-top: 8px;"><strong>Influences:</strong> ${profile.influences}</p>` : ''}
        ${profile.philosophy ? `<p style="margin-top: 8px;"><strong>Philosophy:</strong> ${profile.philosophy}</p>` : ''}
    </div>
    ` : ''}
    
    ${profile.education ? `
    <div class="section">
        <h2>Education & Training</h2>
        <p>${profile.education}</p>
    </div>
    ` : ''}
    
    ${profile.languages ? `
    <div class="section">
        <h2>Languages</h2>
        <p>${profile.languages}</p>
    </div>
    ` : ''}
    
    ${profile.awards ? `
    <div class="section">
        <h2>Awards & Recognition</h2>
        <p>${profile.awards}</p>
    </div>
    ` : ''}
    
    ${profile.email || profile.phone ? `
    <div class="section">
        <h2>Contact</h2>
        <div class="contact-info">
            ${profile.email ? `<span>✉ ${profile.email}</span>` : ''}
            ${profile.phone ? `<span>☎ ${profile.phone}</span>` : ''}
        </div>
        ${profile.preferredWorkLocation ? `<p style="margin-top: 8px;"><strong>Preferred Location:</strong> ${profile.preferredWorkLocation}</p>` : ''}
    </div>
    ` : ''}
    
    <div class="footer">
        <p>Profile generated via CineGrok</p>
        <p>cinegrok.com</p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generate a self-contained HTML file for standalone viewing
 * Includes both audience and producer-style information
 */
export function generateStandaloneHTML(profile: ExportProfile): string {
    // Uses the same base as PDF but adds more interactive elements
    return generatePDFHTML(profile);
}

/**
 * Trigger browser download of a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download profile as HTML file
 */
export function downloadAsHTML(filmmaker: Filmmaker): void {
    const profile = extractExportData(filmmaker);
    const html = generateStandaloneHTML(profile);
    const filename = `${profile.name.replace(/\s+/g, '_').toLowerCase()}_profile.html`;
    downloadFile(html, filename, 'text/html');
}

/**
 * Open print dialog for PDF export
 * Uses browser's native print-to-PDF functionality
 */
export function printAsPDF(filmmaker: Filmmaker): void {
    const profile = extractExportData(filmmaker);
    const html = generatePDFHTML(profile);

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        // Small delay to ensure styles load
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}
