import { IAuthService } from "./auth/auth.service.interface";
import { SupabaseAuthService } from "./auth/supabase-auth.service";
import { IDBService } from "./db/db.service.interface";
import { SupabaseDBService } from "./db/supabase-db.service";
import { IStorageService } from "./storage/storage.service.interface";
import { SupabaseStorageService } from "./storage/supabase-storage.service";

// In a real dependency injection setup, these would be injected.
// For this refactor, we are centralizing them here.
export const authService: IAuthService = new SupabaseAuthService();
export const dbService: IDBService = new SupabaseDBService();
export const storageService: IStorageService = new SupabaseStorageService();
