import { IDBService } from "./db.service.interface";
import { Filmmaker } from "../../lib/api";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export class SupabaseDBService implements IDBService {
    async getProfile(userId: string): Promise<any | null> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data;
    }

    async updateProfile(userId: string, data: any): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', userId);

        if (error) throw error;
    }

    async getFilmmaker(id: string): Promise<Filmmaker | null> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('filmmakers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Filmmaker;
    }

    async getAllFilmmakers(limit?: number): Promise<Filmmaker[]> {
        const supabase = await createSupabaseServerClient();
        let query = supabase.from('filmmakers').select('*');
        if (limit) query = query.limit(limit);

        const { data, error } = await query;
        if (error) return [];
        return data as Filmmaker[];
    }

    async createFilmmaker(data: any): Promise<{ id: string }> {
        const supabase = await createSupabaseServerClient() as any;
        const { data: record, error } = await supabase
            .from('filmmakers')
            .insert(data)
            .select('id')
            .single();

        if (error) throw error;
        return { id: record.id };
    }

    async updateFilmmaker(id: string, data: any): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('filmmakers')
            .update(data)
            .eq('id', id);

        if (error) throw error;
    }

    async getFilmmakerByUserId(userId: string): Promise<Filmmaker | null> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('filmmakers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) return null;
        return data as unknown as Filmmaker | null;
    }

    async searchFilmmakers(query: string, useVector: boolean = false): Promise<Filmmaker[]> {
        const supabase = await createSupabaseServerClient();
        // Implementation for search would go here, 
        // utilizing standard Postgres text search or vector extension
        // if available in Supabase.
        // For now, simple text search on the name field for demonstration.
        const { data, error } = await supabase
            .from('filmmakers')
            .select('*')
            .ilike('name', `%${query}%`);

        if (error) return [];
        return data as Filmmaker[];
    }

    /**
     * Gets filmmakers with advanced filtering options.
     * Supports pagination, search, role, state, genre, and collaboration filters.
     * 
     * @param options - Filter options
     * @returns Paginated filmmakers and total count
     * @throws {Error} ERR_DB_002 if query fails
     */
    async getFilmmakersWithFilters(options: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        state?: string;
        genre?: string;
        collab?: boolean;
        hasContents?: boolean;
    }): Promise<{ data: Filmmaker[], count: number }> {
        const supabase = await createSupabaseServerClient();
        const { page = 1, limit = 12, search, role, state, genre, collab, hasContents } = options;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('filmmakers')
            .select('*', { count: 'exact' })
            .eq('status', 'published');

        if (search) {
            const s = search.toLowerCase();
            query = query.or(
                `name.ilike.%${s}%,generated_bio.ilike.%${s}%,raw_form_data->>current_city.ilike.%${s}%`
            );
        }

        if (role) {
            query = query.textSearch('raw_form_data', `'${role}'`);
        }

        if (state) {
            query = query.or(
                `raw_form_data->>current_state.ilike.%${state}%,raw_form_data->>currentState.ilike.%${state}%`
            );
        }

        if (genre) {
            query = query.textSearch('raw_form_data', `'${genre}'`);
        }

        if (collab) {
            query = query.or(
                `raw_form_data->>open_to_collab.eq.Yes,raw_form_data->>openToCollaborations.eq.Yes`
            );
        }

        if (hasContents) {
            query = query.not('generated_bio', 'is', null);
        }

        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('[SupabaseDBService] getFilmmakersWithFilters error:', error);
            return { data: [], count: 0 };
        }

        return { data: (data || []) as Filmmaker[], count: count || 0 };
    }

    // ========================================================================
    // Interested Profiles (Collaboration Interest)
    // ========================================================================

    async expressInterest(userId: string, filmmakerId: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .upsert({
                inquirer_id: userId,
                target_profile_id: filmmakerId,
            }, { onConflict: 'inquirer_id,target_profile_id' });

        if (error) throw error;
    }

    async removeInterest(userId: string, filmmakerId: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .delete()
            .eq('inquirer_id', userId)
            .eq('target_profile_id', filmmakerId);

        if (error) throw error;
    }

    async getInterestedProfiles(userId: string): Promise<Filmmaker[]> {
        const supabase = await createSupabaseServerClient();
        // First get the interested profile IDs
        const { data: interests, error: interestsError } = await supabase
            .from('interested_profiles')
            .select('target_profile_id')
            .eq('inquirer_id', userId)
            .order('created_at', { ascending: false });

        if (interestsError || !interests || interests.length === 0) return [];

        // Then fetch the actual filmmaker data
        const filmmakerIds = interests.map((i: any) => i.target_profile_id);
        const { data: filmmakers, error: filmmakersError } = await supabase
            .from('filmmakers')
            .select('*')
            .in('id', filmmakerIds);

        if (filmmakersError) return [];
        return filmmakers as Filmmaker[];
    }

    async isInterested(userId: string, filmmakerId: string): Promise<boolean> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('interested_profiles')
            .select('id')
            .eq('inquirer_id', userId)
            .eq('target_profile_id', filmmakerId)
            .maybeSingle();

        if (error) return false;
        return data !== null;
    }

    // ========================================================================
    // Advanced Collaboration Interest Methods
    // ========================================================================

    /**
     * Get all collaboration interests with full filmmaker data and filtering.
     * Includes "Currently Unavailable" status for unpublished profiles.
     */
    async getCollaborationInterests(
        userId: string,
        filters?: { status?: string; role?: string; location?: string }
    ): Promise<Array<{
        id: string;
        filmmakerId: string;
        filmmaker: Filmmaker | null;
        status: 'interested' | 'shortlisted' | 'contacted' | 'archived';
        privateNotes: string | null;
        addedAt: string;
        updatedAt: string;
        isAvailable: boolean;
    }>> {
        const supabase = await createSupabaseServerClient();

        // Build query for interests
        let query = supabase
            .from('interested_profiles')
            .select(`
                id,
                target_profile_id,
                status,
                private_notes,
                created_at,
                updated_at,
                filmmakers!inner (
                    id,
                    name,
                    status,
                    generated_bio,
                    raw_form_data,
                    profile_url,
                    is_published
                )
            `)
            .eq('inquirer_id', userId)
            .order('created_at', { ascending: false });

        // Apply status filter
        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        if (error || !data) {
            console.error('[SupabaseDBService] getCollaborationInterests error:', error);
            return [];
        }

        // Transform and filter by role/location if specified
        return (data as any[])
            .map((item) => {
                const filmmaker = item.filmmakers as Filmmaker;
                const formData = filmmaker?.raw_form_data as any;

                return {
                    id: item.id,
                    filmmakerId: item.target_profile_id,
                    filmmaker: filmmaker || null,
                    status: item.status || 'interested',
                    privateNotes: item.private_notes,
                    addedAt: item.created_at,
                    updatedAt: item.updated_at || item.created_at,
                    isAvailable: (filmmaker as any)?.is_published !== false && (filmmaker as any)?.status === 'published',
                    _formData: formData, // For filtering
                };
            })
            .filter((item) => {
                // Apply role filter
                if (filters?.role) {
                    const roles = item._formData?.roles || item._formData?.primaryRole || [];
                    const roleStr = Array.isArray(roles) ? roles.join(',') : roles;
                    if (!roleStr.toLowerCase().includes(filters.role.toLowerCase())) {
                        return false;
                    }
                }
                // Apply location filter
                if (filters?.location) {
                    const location = item._formData?.currentState || item._formData?.current_state || '';
                    if (!location.toLowerCase().includes(filters.location.toLowerCase())) {
                        return false;
                    }
                }
                return true;
            })
            .map(({ _formData, ...rest }) => rest); // Remove _formData from result
    }

    /**
     * Update the status of a collaboration interest.
     */
    async updateInterestStatus(userId: string, filmmakerId: string, status: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('inquirer_id', userId)
            .eq('target_profile_id', filmmakerId);

        if (error) throw error;
    }

    /**
     * Update private notes for a collaboration interest.
     */
    async updateInterestNotes(userId: string, filmmakerId: string, notes: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .update({
                private_notes: notes,
                updated_at: new Date().toISOString()
            })
            .eq('inquirer_id', userId)
            .eq('target_profile_id', filmmakerId);

        if (error) throw error;
    }
}
