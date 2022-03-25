export interface VideoContentRequest {
    creatorContact?: string,
    creatorEmail?: string,
    creatorId?: string,
    creatorName?: string,
    description?: string,
    festivalId?: string,
    genre?: string,
    link?: string,
    passcode?: string,
    status?: string,
    subGenre?: string,
    themeId?: string,
    title?: string,
    videoId?: string,
    videoThumbnail?: string
    contestID?: number
}

export class Instructions {
    instructionHeader: string;
    instructions: string[];
    passcode: string
}

export enum VideoContentRequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    IN_PROCESS,
    FAILED,
    DELETED
}

export enum RailFilterType {
    CREATE_DATE_DESC,
    LIKES_DESC,
    VIEWS_DESC
}