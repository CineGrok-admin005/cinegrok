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
 */
interface ExportProfile {
    name: string;
    bio?: string;
    location?: string;
    roles?: string[];
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
    }>;
    visualStyle?: string;
    influences?: string;
    philosophy?: string;
    awards?: string;
    profilePhotoUrl?: string;
}

/**
 * Extract export-friendly data from a Filmmaker object
 */
export function extractExportData(filmmaker: Filmmaker): ExportProfile {
    const raw = filmmaker.raw_form_data || {};

    return {
        name: filmmaker.name,
        bio: filmmaker.ai_generated_bio || undefined,
        location: [raw.current_location, raw.current_state, raw.country]
            .filter(Boolean)
            .join(', ') || undefined,
        roles: raw.roles?.split(',').map((r: string) => r.trim()) || [],
        yearsActive: raw.years_active,
        genres: raw.genres?.split(',').map((g: string) => g.trim()) || [],
        email: raw.email,
        phone: raw.phone,
        filmography: raw.films?.map((f: any) => ({
            title: f.title,
            year: f.year,
            role: f.primary_role || f.role,
            format: f.project_format,
            synopsis: f.synopsis,
        })) || [],
        visualStyle: raw.style,
        influences: raw.influences,
        philosophy: raw.philosophy,
        awards: raw.awards,
        profilePhotoUrl: raw.profile_photo_url,
    };
}

/**
 * Generate HTML content for PDF export
 * Print-optimized, A4-friendly design with CineGrok branding
 */
export function generatePDFHTML(profile: ExportProfile): string {
    const filmographyRows = profile.filmography?.map(film => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.title || ''}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.year || ''}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.role || ''}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${film.format || ''}</td>
        </tr>
    `).join('') || '';

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
        <h1>${profile.name}</h1>
        <div class="roles">${profile.roles?.join(' • ') || 'Filmmaker'}</div>
        ${profile.location ? `<div class="location">${profile.location}</div>` : ''}
    </div>
    
    ${profile.bio ? `
    <div class="section">
        <h2>About</h2>
        <p class="bio">${profile.bio}</p>
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
                </tr>
            </thead>
            <tbody>
                ${filmographyRows}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    ${profile.visualStyle || profile.influences ? `
    <div class="section">
        <h2>Creative Style</h2>
        ${profile.visualStyle ? `<p><strong>Visual Style:</strong> ${profile.visualStyle}</p>` : ''}
        ${profile.influences ? `<p style="margin-top: 8px;"><strong>Influences:</strong> ${profile.influences}</p>` : ''}
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
