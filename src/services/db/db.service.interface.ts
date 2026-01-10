import { Filmmaker } from "../../lib/api";

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

    // Interested Profiles (collaboration wishlist)
    expressInterest(userId: string, filmmakerId: string): Promise<void>;
    removeInterest(userId: string, filmmakerId: string): Promise<void>;
    getInterestedProfiles(userId: string): Promise<Filmmaker[]>;
    isInterested(userId: string, filmmakerId: string): Promise<boolean>;
}

