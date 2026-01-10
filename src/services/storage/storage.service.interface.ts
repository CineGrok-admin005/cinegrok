export interface IStorageService {
    uploadFile(bucket: string, path: string, file: any): Promise<string>;
    getSignedUrl(bucket: string, path: string, expiresIn?: number): Promise<string>;
    deleteFile(bucket: string, path: string): Promise<void>;
}
