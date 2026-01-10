'use client';

import { logout } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await logout();
            router.refresh();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <button onClick={handleSignOut} className="btn btn-secondary">
            Sign Out
        </button>
    );
}
