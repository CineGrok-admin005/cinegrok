'use client';

/**
 * Sign Out Button with Confirmation Shield
 * 
 * Prevents accidental session termination by requiring user confirmation.
 * Logs sign-out events with structured logging.
 * 
 * @module components/SignOutButton
 */

import { useState } from 'react';
import { logout } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await logout();
            logger.info('INF_AUTH_002', undefined, { action: 'sign_out_confirmed' });
            router.refresh();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className="btn btn-secondary flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of CineGrok?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You'll need to sign in again to access your dashboard and profile settings.
                        Any unsaved changes may be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? 'Signing out...' : 'Sign Out'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
