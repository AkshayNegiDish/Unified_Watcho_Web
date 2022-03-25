export interface VideoUploadProgress {
    progress: number,
    state: VideoUploadState,
    failureMsg?: any;
    uploadedVideoLocation?: string;
}

export enum VideoUploadState {
    UPLOADING,
    COMPLETED,
    FAILED
}