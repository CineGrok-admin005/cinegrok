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

    // ========================================================================
    // Interested Profiles (Collaboration Interest)
    // ========================================================================

    async expressInterest(userId: string, filmmakerId: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .upsert({
                user_id: userId,
                filmmaker_id: filmmakerId,
            }, { onConflict: 'user_id,filmmaker_id' });

        if (error) throw error;
    }

    async removeInterest(userId: string, filmmakerId: string): Promise<void> {
        const supabase = await createSupabaseServerClient() as any;
        const { error } = await supabase
            .from('interested_profiles')
            .delete()
            .eq('user_id', userId)
            .eq('filmmaker_id', filmmakerId);

        if (error) throw error;
    }

    async getInterestedProfiles(userId: string): Promise<Filmmaker[]> {
        const supabase = await createSupabaseServerClient();
        // First get the interested profile IDs
        const { data: interests, error: interestsError } = await supabase
            .from('interested_profiles')
            .select('filmmaker_id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (interestsError || !interests || interests.length === 0) return [];

        // Then fetch the actual filmmaker data
        const filmmakerIds = interests.map(i => i.filmmaker_id);
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
            .eq('user_id', userId)
            .eq('filmmaker_id', filmmakerId)
            .maybeSingle();

        if (error) return false;
        return data !== null;
    }
}

