export interface ImageFileUploadState {
    showUploadLoader: boolean;
    uploadedFile?: File;
    selectedFile?: File;
    showUploadControls?: boolean;
    disableFormControls: boolean;
    filePath?: string;
    fileName?: string;
}