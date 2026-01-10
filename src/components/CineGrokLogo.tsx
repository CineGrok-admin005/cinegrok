
import React from 'react';

interface CineGrokLogoProps {
    color?: string;
    className?: string;
}

export default function CineGrokLogo({ color = '#1d1d1f', className = '' }: CineGrokLogoProps) {
    return (
        <div className={`cinegrok-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="4" fill="black" />
                <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z" stroke="white" strokeWidth="3" />
                <circle cx="20" cy="20" r="4" fill="white" />
            </svg>
            <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '24px',
                fontWeight: 700,
                color: color,
                letterSpacing: '-0.5px'
            }}>
                CineGrok
            </span>
        </div>
    );
}
