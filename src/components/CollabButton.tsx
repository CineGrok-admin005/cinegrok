'use client';

import Link from 'next/link';

interface CollabButtonProps {
    email?: string;
    isLoggedIn: boolean;
}

export default function CollabButton({ email, isLoggedIn }: CollabButtonProps) {
    if (!email || !email.includes('@')) {
        // If no valid email, fall back to simple text or hide button
        return null;
    }

    if (isLoggedIn) {
        return (
            <a
                href={`mailto:${email}?subject=Collaboration Inquiry via CineGrok`}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'block', textAlign: 'center' }}
            >
                Collaborate
            </a>
        );
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <button
                disabled
                className="btn btn-secondary"
                style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
            >
                Collaborate
            </button>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Link href="/auth/login" style={{ textDecoration: 'underline' }}>Log in</Link> to contact this filmmaker.
            </p>
        </div>
    );
}
