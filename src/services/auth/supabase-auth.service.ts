import { IAuthService, AuthUser } from "./auth.service.interface";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export class SupabaseAuthService implements IAuthService {
    async getCurrentUser(): Promise<AuthUser | null> {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name,
            avatarUrl: user.user_metadata?.avatar_url,
        };
    }

    async getSession(): Promise<any | null> {
        const supabase = await createSupabaseServerClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) return null;
        return session;
    }

    async signOut(): Promise<void> {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
    }
}
