import { dbService } from "../services";
import { Filmmaker } from "../lib/api";

export class FilmmakerDomain {
    /**
     * Business logic for ingesting a filmmaker.
     * This decoupled logic can be tested without a database.
     */
    async ingestFilmmaker(data: any): Promise<{ id: string }> {
        // Validation logic would go here
        if (!data.name) throw new Error("Name is required");

        // In a scalable app, we might check for duplicates, 
        // process images, etc. before saving.
        const result = await dbService.createFilmmaker({
            ...data,
            status: 'published', // Business rule: Auto-publish for now
            created_at: new Date().toISOString(),
        });

        return result;
    }

    async getFilmmakerProfile(id: string): Promise<Filmmaker | null> {
        const filmmaker = await dbService.getFilmmaker(id);
        if (!filmmaker) return null;

        // Add any domain-specific transformations or enrichment
        return filmmaker;
    }

    async listFilmmakers(limit?: number): Promise<Filmmaker[]> {
        // Use DB-level filtering for performance
        const { data } = await dbService.getFilmmakersWithFilters({
            limit: limit || 50,
            hasContents: true,
            page: 1
        });
        return data;
    }

    async search(query: string, useVector: boolean = false): Promise<Filmmaker[]> {
        if (query.length < 2) return [];
        return dbService.searchFilmmakers(query, useVector);
    }
}

export const filmmakerDomain = new FilmmakerDomain();
