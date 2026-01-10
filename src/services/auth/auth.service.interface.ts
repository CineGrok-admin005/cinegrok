export interface AuthUser {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
}

export interface IAuthService {
    getCurrentUser(): Promise<AuthUser | null>;
    getSession(): Promise<any | null>;
    signOut(): Promise<void>;
    // Future: Add login, signup, reset password, etc.
}
