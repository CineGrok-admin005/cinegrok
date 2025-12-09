'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.replace('/auth/login');
    };

    return (
        <button onClick={handleSignOut} className="btn btn-secondary">
            Sign Out
        </button>
    );
}
