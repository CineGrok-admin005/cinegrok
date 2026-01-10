'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

interface SmartCTAProps {
    text?: string;
    className?: string;
    variant?: 'primary' | 'secondary';
}

export default function SmartCTA({
    text = "Get Started",
    className = "",
    variant = "primary"
}: SmartCTAProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const { user } = await getCurrentUser();
            if (user) {
                router.push('/dashboard');
            } else {
                router.push('/auth/signup');
            }
        } catch (e) {
            router.push('/auth/signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`btn btn-${variant} ${className}`}
            disabled={loading}
        >
            {loading ? 'Loading...' : text}
        </button>
    );
}
