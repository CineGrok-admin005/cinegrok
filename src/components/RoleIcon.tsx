
import React from 'react';

// Simple minimalist icons for roles
export const RoleIcons: Record<string, React.ReactNode> = {
    // Director: Clapperboard/Chair
    'director': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.2 6 3 11l-.9-2.4c-.5-1.1-.2-2.4.7-3.2.9-.8 2.3-.8 3.3-.2l14.1 8.8Z" />
            <path d="M3 11c-.9 2.4.2 5.1 2.5 6l1.3.5" />
            <path d="M11 14.1c3.1.5 5.2 3.4 4.7 6.5l-.3 1.9" />
            <path d="M19.5 22.5 11 14.1" />
            <path d="m3 11 14.1 8.8c1 .7 2.4.8 3.3.2.9-.8 1.2-2.1.7-3.2L20.2 6" />
        </svg>
    ),
    // Cinematographer: Camera
    'cinematographer': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    ),
    // Editor: Scissors/Film Strip
    'editor': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    ),
    // Writer: Pen/Quill
    'writer': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    ),
    // Producer: Briefcase/Clipboard
    'producer': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ),
    // Actor: Masks
    'actor': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="M7 12v5a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-5" />
            <path d="M17 12v5a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-5" />
            <path d="M12 7V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2" />
            <path d="M12 7V5a3 3 0 0 0-3-3 3 3 0 0 0-3 3v2" />
        </svg>
    ),
    // Sound: Speaker/Wave
    'sound designer': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
    ),
    // Default
    'default': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    )
};

interface RoleIconProps {
    role: string;
    className?: string;
}

export default function RoleIcon({ role, className = '' }: RoleIconProps) {
    const key = role.toLowerCase();
    const icon = RoleIcons[key] || RoleIcons['default'];

    return (
        <span className={`role-icon-svg ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </span>
    );
}
