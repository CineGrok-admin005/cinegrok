import { Filmmaker } from "../../lib/api";

// Collaboration Interest types
export interface CollaborationInterest {
    id: string;
    filmmakerId: string;
    filmmaker: Filmmaker | null;
    status: 'interested' | 'shortlisted' | 'contacted' | 'archived';
    privateNotes: string | null;
    addedAt: string;
    updatedAt: string;
    isAvailable: boolean; // Based on filmmaker's published status
}

export interface CollaborationFilters {
    status?: string;
    role?: string;
    location?: string;
}

export interface IDBService {
    // Profiles
    getProfile(userId: string): Promise<any | null>;
    updateProfile(userId: string, data: any): Promise<void>;

    // Filmmakers
    getFilmmaker(id: string): Promise<Filmmaker | null>;
    getAllFilmmakers(limit?: number): Promise<Filmmaker[]>;
    createFilmmaker(data: any): Promise<{ id: string }>;
    updateFilmmaker(id: string, data: any): Promise<void>;
    getFilmmakerByUserId(userId: string): Promise<Filmmaker | null>;

    // Search
    searchFilmmakers(query: string, useVector?: boolean): Promise<Filmmaker[]>;

    // Browse with filters
    getFilmmakersWithFilters(options: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        state?: string;
        genre?: string;
        collab?: boolean;
        hasContents?: boolean; // Filter for profiles with generated content
    }): Promise<{ data: Filmmaker[], count: number }>;

    // Interested Profiles (collaboration wishlist)
    expressInterest(userId: string, filmmakerId: string): Promise<void>;
    removeInterest(userId: string, filmmakerId: string): Promise<void>;
    getInterestedProfiles(userId: string): Promise<Filmmaker[]>;
    isInterested(userId: string, filmmakerId: string): Promise<boolean>;

    // Advanced Collaboration Interest methods
    getCollaborationInterests(userId: string, filters?: CollaborationFilters): Promise<CollaborationInterest[]>;
    updateInterestStatus(userId: string, filmmakerId: string, status: string): Promise<void>;
    updateInterestNotes(userId: string, filmmakerId: string, notes: string): Promise<void>;
}

