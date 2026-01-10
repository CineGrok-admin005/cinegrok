'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ProfileWizard } from '@/components/profile-features/profile-wizard';
import { mapDatabaseToProfileData } from '@/lib/mappers';
import { toast } from 'sonner';

export default function ProfileBuilderPage() {
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<Partial<ProfileData>>({});
    const [draftId, setDraftId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        console.log('DEBUG: loadData started');
        try {
            console.log('DEBUG: fetching user');
            const { data: { user } } = await supabase.auth.getUser();
            console.log('DEBUG: user found:', user?.id);
            if (!user) {
                console.log('No user found');
                return;
            }

            // 1. Check for existing filmmaker profile
            console.log('DEBUG: checking filmmakers table');
            const { data: filmmaker, error: fError } = await supabase
                .from('filmmakers')
                .select('*')
                .eq('user_id', user.id)
                .single();

            console.log('DEBUG: filmmaker found:', !!filmmaker, fError?.message);

            if (filmmaker && filmmaker.raw_form_data) {
                console.log('DEBUG: mapping filmmaker data');
                setInitialData(mapDatabaseToProfileData(filmmaker.raw_form_data));
                setLoading(false);
                return;
            }

            // 2. Check for draft
            console.log('DEBUG: checking profile_drafts table');
            const { data: draft, error: dError } = await supabase
                .from('profile_drafts')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            console.log('DEBUG: draft found:', !!draft, dError?.message);

            if (draft) {
                console.log('DEBUG: setting draft data');
                setInitialData(draft.draft_data as Partial<ProfileData>);
                setDraftId(draft.id);
            }
        } catch (error) {
            console.error('DEBUG: error in loadData:', error);
        } finally {
            console.log('DEBUG: loadData finished, setting loading to false');
            setLoading(false);
        }
    };

    const handleComplete = async (data: ProfileData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in to publish.');
                return;
            }

            toast.loading('Publishing profile...');

            // Check if profile exists
            const { data: existingFilmmaker } = await supabase
                .from('filmmakers')
                .select('id')
                .eq('user_id', user.id)
                .single();

            let filmmakerId = existingFilmmaker?.id;

            const payload = {
                user_id: user.id,
                name: data.stageName,
                // Create a basic slug if not exists, or keep existing
                profile_url: `${data.stageName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                raw_form_data: data, // Save the new data structure directly
                ai_generated_bio: '', // Generate this later or use a helper
                status: 'published',
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            if (filmmakerId) {
                // Update
                const { error } = await supabase
                    .from('filmmakers')
                    .update({
                        ...payload,
                        profile_url: undefined, // Don't change URL on update
                    })
                    .eq('id', filmmakerId);

                if (error) throw error;
            } else {
                // Insert
                const { data: newProfile, error } = await supabase
                    .from('filmmakers')
                    .insert([payload])
                    .select('id')
                    .single();

                if (error) throw error;
                filmmakerId = newProfile.id;
            }

            // Link to main profile
            await supabase
                .from('profiles')
                .update({ filmmaker_id: filmmakerId })
                .eq('id', user.id);

            // Delete draft
            if (draftId) {
                await supabase.from('profile_drafts').delete().eq('id', draftId);
            }

            toast.dismiss();
            toast.success('Profile published successfully!');
            router.push(`/filmmakers/${filmmakerId}`);

        } catch (error: any) {
            console.error('Error publishing:', error);
            toast.error(error.message || 'Failed to publish profile');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileWizard
                initialData={initialData}
                onComplete={handleComplete}
            />
        </div>
    );
}

// Helper removed in favor of centralized lib/mappers.ts
