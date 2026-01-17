/**
 * Filmmakers Service - Re-exports
 * 
 * Barrel file for the filmmakers service module.
 * Import from '@/services/filmmakers' for cleaner imports.
 * 
 * NOTE: For server-side service, import directly:
 * import { filmmakersServerService } from '@/services/filmmakers/filmmakers.server.service'
 */

export {
    FilmmakersService,
    filmmakersService,
    FilmmakerServiceError,
    FilmmakerErrorCodes,
    type FilmmakerErrorCode,
    type LoadProfileResult,
    type PublishProfileResult,
} from './filmmakers.service';

// NOTE: Server service NOT exported here to avoid client/server import conflicts.
// Import directly from './filmmakers.server.service' in Server Components.
