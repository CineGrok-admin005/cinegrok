import { IStorageService } from "./storage.service.interface";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export class SupabaseStorageService implements IStorageService {
    async uploadFile(bucket: string, path: string, file: any): Promise<string> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    }

    async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    }

    async deleteFile(bucket: string, path: string): Promise<void> {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    }
}
